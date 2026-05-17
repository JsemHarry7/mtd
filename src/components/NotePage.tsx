import { useEffect, useState } from "react";
import { Link } from "wouter";
import { loadNote } from "@/lib/manifest";
import type { Manifest, Note, NoteStatus } from "@/types";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function NotePage({
  manifest,
  subject,
  slug,
}: {
  manifest: Manifest;
  subject: string;
  slug: string;
}) {
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);
  const meta = manifest.notes[slug];

  useDocumentTitle(meta ? `${meta.title} — ${meta.subject} — mtd` : `mtd`);

  useEffect(() => {
    setNote(null);
    setError(null);
    if (!meta) return;
    loadNote(slug)
      .then(setNote)
      .catch((e) => setError(String(e)));
  }, [slug, meta]);

  if (!meta) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <div className="data text-ink-dim text-sm">
          zápisek nenalezen: <span className="text-bad">{slug}</span>
        </div>
      </div>
    );
  }

  const slugs = manifest.notesBySubject[meta.subject] ?? [];
  const idx = slugs.indexOf(slug);
  const prev = idx > 0 ? manifest.notes[slugs[idx - 1]] : null;
  const next =
    idx >= 0 && idx < slugs.length - 1 ? manifest.notes[slugs[idx + 1]] : null;

  return (
    <article className="mx-auto max-w-3xl px-6 pb-16 pt-10 sm:px-10 sm:pt-16">
      <Link
        href={`/${subject}`}
        className="data text-ink-muted hover:text-ink mb-10 inline-block text-[11px] uppercase tracking-[0.2em] no-underline"
      >
        ← {meta.subject}
      </Link>

      <header className="mb-12">
        <div className="data text-accent text-[11px] uppercase tracking-[0.22em]">
          {meta.subject} · č. {String(meta.number).padStart(2, "0")}
        </div>
        <h1 className="display text-ink mt-4 text-5xl sm:text-6xl">
          <span className="italic">{meta.title}</span>
        </h1>
        {meta.speakingTime && (
          <p className="data text-ink-muted mt-5 text-[11px] uppercase tracking-[0.18em]">
            <span className="text-ink-dim tabular-nums">~{meta.speakingTime}</span>{" "}
            min mluvení
          </p>
        )}
      </header>

      {error && <p className="data text-bad text-sm">load failed: {error}</p>}
      {!note && !error && (
        <p className="data text-ink-muted animate-pulse text-xs">
          načítám obsah …
        </p>
      )}
      {note && (
        <div className="prose" dangerouslySetInnerHTML={{ __html: note.html }} />
      )}

      {/* Colophon — end-of-article metadata, magazine style */}
      {note && (
        <aside className="border-line mt-16 border-t pt-8">
          <div className="data text-ink-muted mb-5 text-[11px] uppercase tracking-[0.22em]">
            kolofon
          </div>
          <dl className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-3 text-[13px]">
            <ColField label="status">
              <span className={`data uppercase tracking-[0.18em] ${statusColor(meta.status)}`}>
                {meta.status}
              </span>
            </ColField>
            <ColField label="share">
              <span className="data text-ink uppercase tracking-[0.18em]">
                {meta.share}
              </span>
            </ColField>
            {meta.updated && (
              <ColField label="updated">
                <span className="data text-ink tabular-nums">{meta.updated}</span>
              </ColField>
            )}
            {meta.tags.length > 0 && (
              <ColField label="tagy">
                <span className="data text-ink-dim text-[12px]">
                  {meta.tags.join(", ")}
                </span>
              </ColField>
            )}
          </dl>
        </aside>
      )}

      {(prev || next) && (
        <nav
          className="border-line mt-12 grid grid-cols-2 gap-6 border-t pt-8"
          aria-label="prev / next"
        >
          <div>
            {prev && (
              <Link
                href={`/${prev.subject}/${prev.slug}`}
                className="group block no-underline"
              >
                <div className="data text-ink-muted text-[10px] uppercase tracking-[0.2em]">
                  ← předchozí
                </div>
                <div className="display text-ink group-hover:text-accent mt-2 text-lg transition-colors">
                  {prev.title}
                </div>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link
                href={`/${next.subject}/${next.slug}`}
                className="group block no-underline"
              >
                <div className="data text-ink-muted text-[10px] uppercase tracking-[0.2em]">
                  další →
                </div>
                <div className="display text-ink group-hover:text-accent mt-2 text-lg transition-colors">
                  {next.title}
                </div>
              </Link>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}

function ColField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <dt className="data text-ink-muted text-[10px] uppercase tracking-[0.18em]">
        {label}
      </dt>
      <dd className="m-0">{children}</dd>
    </>
  );
}

function statusColor(status: NoteStatus) {
  if (status === "done") return "text-ok";
  if (status === "review") return "text-accent";
  return "text-ink-muted";
}
