#!/usr/bin/env node
/* ---------- mtd content build ----------
 *
 * Walks content/**\/*.md, parses frontmatter (gray-matter), renders MD to
 * HTML (unified + remark + rehype), collects headings, and writes a
 * manifest + per-note JSON into public/data/.
 *
 * Required frontmatter (skip + warn otherwise):
 *   subject: SWI | DAT | CJL | <any>
 *   number:  1..99
 *   title:   "..."
 *
 * Optional:
 *   tags: [..]
 *   share: public | unlisted | private   (default: private)
 *   status: draft | review | done        (default: draft)
 *   speakingTime: <number>
 *   updated: YYYY-MM-DD
 *
 * Output:
 *   public/data/manifest.json
 *   public/data/notes/{slug}.json
 */

import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const CONTENT_DIR = join(ROOT, "content");
const OUT_DIR = join(ROOT, "public", "data");
const OUT_NOTES = join(OUT_DIR, "notes");
const CONFIG_PATH = join(ROOT, "mtd.config.mjs");

const SHARE_MODES = new Set(["public", "unlisted", "private"]);
const STATUS_MODES = new Set(["draft", "review", "done"]);

const log = {
  info: (...a) => console.log("[mtd]", ...a),
  warn: (...a) => console.warn("[mtd] warn:", ...a),
  err: (...a) => console.error("[mtd] error:", ...a),
};

async function loadConfig() {
  const url = pathToFileURL(CONFIG_PATH).href;
  const mod = await import(url);
  return mod.default;
}

async function walkMd(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walkMd(p)));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(p);
  }
  return out;
}

function validateFrontmatter(fm, file) {
  const errs = [];
  if (!fm.subject || typeof fm.subject !== "string") errs.push("missing subject");
  if (typeof fm.number !== "number") errs.push("missing/invalid number");
  if (!fm.title || typeof fm.title !== "string") errs.push("missing title");
  if (fm.share && !SHARE_MODES.has(fm.share))
    errs.push(`invalid share: ${fm.share}`);
  if (fm.status && !STATUS_MODES.has(fm.status))
    errs.push(`invalid status: ${fm.status}`);
  if (errs.length) {
    log.warn(`${relative(ROOT, file)} — ${errs.join(", ")}; skipping`);
    return null;
  }
  return {
    subject: fm.subject,
    number: fm.number,
    title: fm.title,
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
    share: fm.share ?? "private",
    status: fm.status ?? "draft",
    speakingTime: typeof fm.speakingTime === "number" ? fm.speakingTime : undefined,
    updated: typeof fm.updated === "string" ? fm.updated : undefined,
  };
}

function makeSlug(subject, number) {
  return `${subject.toLowerCase()}-${String(number).padStart(2, "0")}`;
}

/** Walk hast tree, collect h2/h3/h4 headings with their text + id. */
function collectHeadingsPlugin(out) {
  return () => (tree) => {
    visit(tree, "element", (node) => {
      const m = /^h([2-4])$/.exec(node.tagName);
      if (!m) return;
      const text = nodeText(node);
      const id = node.properties?.id;
      if (id && text) {
        out.push({ depth: Number(m[1]), text, id: String(id) });
      }
    });
  };
}

function nodeText(node) {
  if (node.type === "text") return node.value;
  if (!node.children) return "";
  return node.children.map(nodeText).join("");
}

async function renderMarkdown(body) {
  const headings = [];
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: { className: ["heading-anchor"], ariaHidden: "true", tabIndex: -1 },
      content: { type: "text", value: "#" },
    })
    .use(collectHeadingsPlugin(headings))
    .use(rehypeStringify);
  const file = await processor.process(body);
  return { html: String(file), headings };
}

function buildSubjectList(config, subjectsFound) {
  const result = [];
  const seen = new Set();
  // configured first, in their declared order
  const configured = Object.entries(config.subjects ?? {})
    .sort((a, b) => a[1].order - b[1].order);
  for (const [key, cfg] of configured) {
    if (!subjectsFound.has(key)) continue;
    result.push({
      key,
      label: cfg.label,
      description: cfg.description,
      order: cfg.order,
      color: cfg.color,
      noteCount: subjectsFound.get(key),
    });
    seen.add(key);
  }
  // unconfigured subjects appended alphabetically
  const extras = [...subjectsFound.keys()].filter((k) => !seen.has(k)).sort();
  for (const key of extras) {
    result.push({
      key,
      label: key,
      order: 999,
      noteCount: subjectsFound.get(key),
    });
  }
  return result;
}

/* ---------- Graph data — bipartite tag-hub model ----------
 * Two node kinds: 'note' (the zápiskts) and 'tag' (concepts that connect them).
 * Each note connects to its tags. Notes don't link to each other directly —
 * shared concepts ARE visible as middle nodes, so "what connects X to Y" is
 * literally visible in the graph.
 *
 * Tag node size scales with how many notes carry it (popular tags = bigger hub).
 */
function buildGraph(notes) {
  const publicNotes = Object.values(notes).filter((n) => n.share !== "private");

  const tagCounts = new Map();
  for (const n of publicNotes) {
    for (const t of n.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
  }

  const nodes = [];

  for (const n of publicNotes) {
    nodes.push({
      id: n.slug,
      kind: "note",
      slug: n.slug,
      subject: n.subject,
      title: n.title,
      tags: n.tags,
      speakingTime: n.speakingTime,
      val: 4,
    });
  }

  // Skip singleton tags — a tag used by only one note creates a dead-end edge
  // and adds clutter without conveying any "connection". This is the key
  // filter that keeps the graph readable: only tags that ACTUALLY connect
  // multiple notes get rendered.
  const linkedTags = new Set(
    [...tagCounts.entries()].filter(([, c]) => c >= 2).map(([t]) => t),
  );

  for (const tag of linkedTags) {
    const count = tagCounts.get(tag);
    nodes.push({
      id: `tag:${tag}`,
      kind: "tag",
      tag,
      noteCount: count,
      val: 0.6 + Math.sqrt(count) * 0.7,
    });
  }

  const links = [];
  for (const n of publicNotes) {
    for (const t of n.tags) {
      if (!linkedTags.has(t)) continue;
      links.push({
        source: n.slug,
        target: `tag:${t}`,
        kind: "note-tag",
        value: 1,
      });
    }
  }

  return { nodes, links };
}

async function main() {
  log.info("building content from", relative(ROOT, CONTENT_DIR));

  const config = await loadConfig();
  const files = await walkMd(CONTENT_DIR);
  log.info(`found ${files.length} .md file(s)`);

  // reset output
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_NOTES, { recursive: true });

  /** @type {Record<string, any>} */
  const notes = {};
  /** @type {Map<string, number>} */
  const subjectCounts = new Map();
  const tagSet = new Set();
  const counts = { public: 0, unlisted: 0, private: 0 };
  const slugSeen = new Map(); // slug -> source file (collision detection)

  for (const file of files) {
    const raw = await readFile(file, "utf8");
    const parsed = matter(raw);
    const fm = validateFrontmatter(parsed.data, file);
    if (!fm) continue;

    const slug = makeSlug(fm.subject, fm.number);
    if (slugSeen.has(slug)) {
      log.warn(
        `slug collision '${slug}' — ${relative(ROOT, file)} vs ${relative(
          ROOT,
          slugSeen.get(slug),
        )}; skipping later`,
      );
      continue;
    }
    slugSeen.set(slug, file);

    const { html, headings } = await renderMarkdown(parsed.content);

    const meta = {
      slug,
      subject: fm.subject,
      number: fm.number,
      title: fm.title,
      tags: fm.tags,
      share: fm.share,
      status: fm.status,
      speakingTime: fm.speakingTime,
      updated: fm.updated,
      headings,
      backlinks: [], // M3
    };

    notes[slug] = meta;
    subjectCounts.set(fm.subject, (subjectCounts.get(fm.subject) ?? 0) + 1);
    for (const t of fm.tags) tagSet.add(t);
    counts[fm.share]++;

    await writeFile(
      join(OUT_NOTES, `${slug}.json`),
      JSON.stringify({ ...meta, html }, null, 2),
      "utf8",
    );
  }

  const subjects = buildSubjectList(config, subjectCounts);
  const notesBySubject = {};
  for (const s of subjects) {
    notesBySubject[s.key] = Object.values(notes)
      .filter((n) => n.subject === s.key)
      .sort((a, b) => a.number - b.number)
      .map((n) => n.slug);
  }

  const manifest = {
    siteName: config.siteName,
    siteDescription: config.siteDescription,
    subjects,
    notes,
    notesBySubject,
    tags: [...tagSet].sort(),
    lastBuild: new Date().toISOString(),
    counts,
  };

  await writeFile(
    join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );

  const graph = buildGraph(notes);
  await writeFile(
    join(OUT_DIR, "graph.json"),
    JSON.stringify(graph, null, 2),
    "utf8",
  );

  const noteNodes = graph.nodes.filter((n) => n.kind === "note").length;
  const tagNodes = graph.nodes.filter((n) => n.kind === "tag").length;

  log.info(
    `wrote ${Object.keys(notes).length} note(s) — ${counts.public} public, ${counts.unlisted} unlisted, ${counts.private} private`,
  );
  log.info(`subjects: ${subjects.map((s) => `${s.key}(${s.noteCount})`).join(", ") || "(none)"}`);
  log.info(`graph: ${noteNodes} notes + ${tagNodes} tags = ${graph.nodes.length} nodes, ${graph.links.length} edges`);
}

main().catch((e) => {
  log.err(e);
  process.exit(1);
});
