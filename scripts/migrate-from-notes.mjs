#!/usr/bin/env node
/* ---------- migrate _notes → mtd/content ----------
 *
 * Bere zápisky z C:/_dev/_svatak/_notes/{swi,dat}/ a _cjl/rozbory/,
 * stripne původní `# N — Title` heading + úvodní `>` blockquote +
 * první `---` separator, doplní frontmatter s pre-definovanou tag mapou
 * a uloží do mtd/content/{subject}/.
 *
 * Tagy jsou ručně přiřazené (nikoli auto-extrahované) — viz TAG_MAPS.
 *
 * Usage:
 *   node scripts/migrate-from-notes.mjs        # vše
 *   node scripts/migrate-from-notes.mjs swi    # jen jeden subject
 */

import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// NB: NOT using gray-matter for output — its stringify pre-parses the body
// to merge frontmatter, and CJL bodies start with `**Author**` which YAML's
// parser misreads as a `*` alias reference. We just emit YAML manually.

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const SVATAK = resolve(ROOT, "..");
const NOTES_DIR = join(SVATAK, "_notes");
const CJL_DIR = join(SVATAK, "_cjl", "rozbory");
const TARGET_DIR = join(ROOT, "content");
const TODAY = "2026-05-17";

const log = {
  info: (...a) => console.log("[migrate]", ...a),
  warn: (...a) => console.warn("[migrate] warn:", ...a),
  err: (...a) => console.error("[migrate] error:", ...a),
};

/* ---------- TAG MAPS ----------
 * Klíč: souborové jméno v _notes/{subject}/. Hodnota: { title, tags, time }.
 * Tagy navrženy aby tvořily smysluplné graf hrany napříč subjekty —
 * cross-cutting (`oop`, `web`, `c-sharp`, `frontend`, `http`) propojí příbuzná témata,
 * topic-specific (`uml`, `singleton`) drží sémantickou granularitu.
 */
const TAG_MAPS = {
  swi: {
    "01-uml.md": { title: "Diagramy UML", tags: ["uml", "oop", "analýza", "programování", "architektura"], time: 12 },
    "02-algoritmus.md": { title: "Algoritmus", tags: ["algoritmy", "složitost", "programování"], time: 8 },
    "03-reprezentace-dat.md": { title: "Reprezentace dat", tags: ["kódování", "datové-typy", "programování", "c-sharp"], time: 8 },
    "04-datove-typy-promenne.md": { title: "Datové typy a proměnné", tags: ["datové-typy", "c-sharp", "oop", "programování"], time: 8 },
    "05-navrhove-vzory.md": { title: "Návrhové vzory (Design Patterns)", tags: ["oop", "design-patterns", "architektura", "c-sharp", "programování"], time: 12 },
    "06-chyby-testovani-ladeni.md": { title: "Chyby, testování a ladění", tags: ["testování", "výjimky", "debugging", "c-sharp", "programování"], time: 12 },
    "09-oop.md": { title: "Objektové programování", tags: ["oop", "c-sharp", "dědičnost", "polymorfismus", "abstrakce", "programování"], time: 12 },
    "13-internet.md": { title: "Internet", tags: ["web", "http", "sítě"], time: 8 },
    "14-navrh-obsahoveho-webu.md": { title: "Návrh a tvorba obsahového webu", tags: ["web", "frontend", "ux", "responzivita"], time: 8 },
    "15-webova-stranka.md": { title: "Webová stránka (HTML)", tags: ["web", "html", "frontend", "sémantika"], time: 8 },
    "16-css-kaskada.md": { title: "CSS kaskáda", tags: ["web", "css", "frontend"], time: 8 },
    "17-vlastnosti-css.md": { title: "Vlastnosti CSS", tags: ["web", "css", "frontend"], time: 8 },
    "19-webove-aplikace.md": { title: "Webové aplikace", tags: ["web", "http", "frontend", "architektura"], time: 12 },
    "20-overovani-identity.md": { title: "Ověřování identity v prostředí internetu", tags: ["web", "http", "bezpečnost", "autentizace"], time: 12 },
    "21-restful.md": { title: "RESTful", tags: ["web", "rest", "api", "http", "architektura"], time: 8 },
    "22-aspnet.md": { title: "ASP.NET", tags: ["web", "aspnet", "c-sharp", "razor", "http", "architektura"], time: 12 },
  },
  dat: {
    "01-html5-a-semantika.md": { title: "HTML5 a sémantika", tags: ["web", "html", "frontend", "sémantika"], time: 12 },
    "02-bootstrap.md": { title: "Bootstrap a návrh designu", tags: ["web", "css", "frontend", "responzivita"], time: 12 },
    "03-flexbox.md": { title: "Flexbox a rozmístění prvků", tags: ["web", "css", "frontend", "layout"], time: 12 },
    "04-css-grid.md": { title: "CSS Grid a tvorba layoutu", tags: ["web", "css", "frontend", "layout"], time: 12 },
    "05-pozicovani-z-index.md": { title: "Pozicování prvků a z-index", tags: ["web", "css", "frontend", "layout"], time: 12 },
    "06-css-animace.md": { title: "CSS animace a transformace", tags: ["web", "css", "frontend"], time: 12 },
    "07-tabulky.md": { title: "Tabulky v HTML a jejich stylování", tags: ["web", "html", "frontend", "sémantika"], time: 12 },
    "08-datove-typy-a-pole.md": { title: "Datové typy a pole", tags: ["datové-typy", "datové-struktury", "c-sharp", "oop", "programování"], time: 12 },
    "09-spojove-struktury-stromy.md": { title: "Spojové struktury a stromy", tags: ["datové-struktury", "algoritmy", "c-sharp", "programování"], time: 12 },
    "10-podprogramy-a-lambda.md": { title: "Podprogramy a lambda funkce", tags: ["programování", "c-sharp"], time: 8 },
    "11-kolekce.md": { title: "Kolekce: pole, zásobník, fronta, slovník", tags: ["datové-struktury", "c-sharp", "oop", "programování"], time: 12 },
    "14-git-github.md": { title: "Verzovací systémy: Git a GitHub", tags: ["programování", "verzování", "workflow"], time: 12 },
    "17-rest-api.md": { title: "REST API v ASP.NET Core", tags: ["web", "rest", "api", "aspnet", "c-sharp", "http", "architektura"], time: 12 },
    "18-razor-pages.md": { title: "Razor Pages — zpracování požadavku", tags: ["web", "aspnet", "razor", "c-sharp", "http", "frontend"], time: 12 },
    "19-tag-helpers.md": { title: "ASP.NET Tag Helpers a formuláře", tags: ["web", "aspnet", "razor", "c-sharp", "http", "frontend"], time: 12 },
  },
  cjl: {
    "01_romeo_a_julie.md": { title: "Romeo a Julie — William Shakespeare", tags: ["renesance", "anglická", "drama", "tragédie", "láska"], time: 10 },
    "02_lakomec.md": { title: "Lakomec — Molière", tags: ["klasicismus", "francouzská", "drama", "komedie", "společnost"], time: 10 },
    "03_revizor.md": { title: "Revizor — Nikolaj V. Gogol", tags: ["realismus", "ruská", "drama", "komedie", "satira", "společnost"], time: 10 },
    "04_obraz_doriana_graye.md": { title: "Obraz Doriana Graye — Oscar Wilde", tags: ["dekadence", "anglická", "román", "smrt", "společnost"], time: 10 },
    "05_kytice.md": { title: "Kytice — Karel Jaromír Erben", tags: ["romantismus", "česká", "poezie", "folklor", "smrt"], time: 10 },
    "06_po_nas_at_prijde_potopa.md": { title: "Po nás ať přijde potopa! — František Gellner", tags: ["dekadence", "česká", "poezie", "moderna"], time: 10 },
    "07_deset_malych_cernousku.md": { title: "Deset malých černoušků — Agatha Christie", tags: ["meziválečná", "anglická", "román", "detektivka", "smrt"], time: 10 },
    "08_na_zapadni_fronte_klid.md": { title: "Na západní frontě klid — Erich Maria Remarque", tags: ["meziválečná", "německá", "román", "válka", "smrt"], time: 10 },
    "09_o_mysich_a_lidech.md": { title: "O myších a lidech — John Steinbeck", tags: ["meziválečná", "americká", "román", "společnost", "přátelství"], time: 10 },
    "10_farma_zvirat.md": { title: "Farma zvířat — George Orwell", tags: ["meziválečná", "anglická", "román", "alegorie", "totalita", "satira"], time: 10 },
    "11_1984.md": { title: "1984 — George Orwell", tags: ["poválečná", "anglická", "román", "dystopie", "totalita"], time: 10 },
    "12_snehulak.md": { title: "Sněhulák — Jo Nesbø", tags: ["současná", "norská", "román", "detektivka", "smrt"], time: 10 },
    "13_krysar.md": { title: "Krysař — Viktor Dyk", tags: ["moderna", "česká", "novela", "společnost"], time: 10 },
    "14_osudy_dobreho_vojaka_svejka.md": { title: "Osudy dobrého vojáka Švejka — Jaroslav Hašek", tags: ["meziválečná", "česká", "román", "satira", "válka", "humor"], time: 10 },
    "15_rur.md": { title: "R.U.R. — Karel Čapek", tags: ["meziválečná", "česká", "drama", "dystopie", "společnost"], time: 10 },
    "16_bylo_nas_pet.md": { title: "Bylo nás pět — Karel Poláček", tags: ["meziválečná", "česká", "román", "humor"], time: 10 },
    "17_ostre_sledovane_vlaky.md": { title: "Ostře sledované vlaky — Bohumil Hrabal", tags: ["poválečná", "česká", "novela", "válka"], time: 10 },
    "18_spalovac_mrtvol.md": { title: "Spalovač mrtvol — Ladislav Fuks", tags: ["poválečná", "česká", "novela", "psychologie", "smrt"], time: 10 },
    "19_smrt_krasnych_srncu.md": { title: "Smrt krásných srnců — Ota Pavel", tags: ["poválečná", "česká", "povídky", "vzpomínky", "válka"], time: 10 },
    "20_vysetrovani_ztraty_tridni_knihy.md": { title: "Vyšetřování ztráty třídní knihy — Svěrák & Smoljak", tags: ["poválečná", "česká", "drama", "humor", "parodie"], time: 10 },
  },
};

/* ---------- transformations ---------- */

/** Strip leading `# ...` heading, optional CJL-style "Originální název" line,
 *  optional `>` blockquote, first `---`. */
function stripPreamble(raw) {
  let s = raw;
  // 1) leading `# ...` first heading (whatever its shape)
  s = s.replace(/^#\s+[^\n]*\n+/, "");
  // 2) optional CJL "Originální název" line
  s = s.replace(/^\*\*Originální název:\*\*[^\n]*\n+/, "");
  // 3) optional `>` blockquote (multi-line until blank line)
  s = s.replace(/^(?:>[^\n]*\n)+\s*\n/, "");
  // 4) first `---\n` separator
  s = s.replace(/^---\s*\n+/, "");
  return s.trimStart();
}

function parseNumber(filename) {
  // CJL files use underscore: `01_romeo_a_julie.md`
  const m = /^(\d+)[_\-]/.exec(filename);
  if (!m) throw new Error(`cannot parse number from ${filename}`);
  return parseInt(m[1], 10);
}

function yamlQuote(s) {
  return `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function makeFrontmatter(fm) {
  const lines = ["---"];
  lines.push(`subject: ${fm.subject}`);
  lines.push(`number: ${fm.number}`);
  lines.push(`title: ${yamlQuote(fm.title)}`);
  lines.push(`tags: [${fm.tags.map(yamlQuote).join(", ")}]`);
  lines.push(`share: ${fm.share}`);
  lines.push(`status: ${fm.status}`);
  lines.push(`speakingTime: ${fm.speakingTime}`);
  lines.push(`updated: ${yamlQuote(fm.updated)}`);
  lines.push("---");
  lines.push("");
  return lines.join("\n");
}

async function migrateOne(subject, sourcePath, sourceFile, mapEntry) {
  const raw = await readFile(sourcePath, "utf8");
  const body = stripPreamble(raw);
  const number = parseNumber(sourceFile);

  const fm = {
    subject: subject.toUpperCase(),
    number,
    title: mapEntry.title,
    tags: mapEntry.tags,
    share: "public",
    status: "review",
    speakingTime: mapEntry.time,
    updated: TODAY,
  };

  const out = makeFrontmatter(fm) + "\n" + body;
  const targetPath = join(TARGET_DIR, subject, sourceFile);
  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, out, "utf8");
  return targetPath;
}

async function migrateSubject(subject, sourceDir, tagMap) {
  if (!existsSync(sourceDir)) {
    log.warn(`source dir not found: ${sourceDir}`);
    return 0;
  }
  let count = 0;
  let skipped = 0;
  for (const [sourceFile, entry] of Object.entries(tagMap)) {
    const sourcePath = join(sourceDir, sourceFile);
    if (!existsSync(sourcePath)) {
      log.warn(`source not found, skipping: ${sourcePath}`);
      skipped++;
      continue;
    }
    try {
      await migrateOne(subject, sourcePath, sourceFile, entry);
      count++;
    } catch (e) {
      log.err(`failed ${sourceFile}: ${e.message}`);
      skipped++;
    }
  }
  log.info(`${subject.toUpperCase()}: migrated ${count}, skipped ${skipped}`);
  return count;
}

async function main() {
  const onlySubject = process.argv[2];

  if (!onlySubject || onlySubject === "swi") {
    await rm(join(TARGET_DIR, "swi"), { recursive: true, force: true });
    await migrateSubject("swi", join(NOTES_DIR, "swi"), TAG_MAPS.swi);
  }
  if (!onlySubject || onlySubject === "dat") {
    await rm(join(TARGET_DIR, "dat"), { recursive: true, force: true });
    await migrateSubject("dat", join(NOTES_DIR, "dat"), TAG_MAPS.dat);
  }
  if (!onlySubject || onlySubject === "cjl") {
    await rm(join(TARGET_DIR, "cjl"), { recursive: true, force: true });
    await migrateSubject("cjl", CJL_DIR, TAG_MAPS.cjl);
  }
}

main().catch((e) => {
  log.err(e);
  process.exit(1);
});
