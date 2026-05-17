import { Link } from "wouter";
import type { Manifest, NoteStatus } from "@/types";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function SubjectPage({
  manifest,
  subject,
}: {
  manifest: Manifest;
  subject: string;
}) {
  const meta = manifest.subjects.find((s) => s.key === subject);
  const slugs = manifest.notesBySubject[subject] ?? [];
  const visible = slugs
    .map((s) => manifest.notes[s])
    .filter((n) => n && n.share !== "private");

  useDocumentTitle(meta ? `${meta.label} — mtd` : `${subject} — mtd`);

  if (!meta) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <div className="data text-ink-dim text-sm">
          neznámý předmět: <span className="text-bad">{subject}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-10 sm:px-10 sm:pt-16">
      <Link
        href="/"
        className="data text-ink-muted hover:text-ink mb-10 inline-block text-[11px] uppercase tracking-[0.2em] no-underline"
      >
        ← rozcestník
      </Link>

      <header className="border-line mb-10 border-b pb-10">
        <div className="data text-accent text-[11px] uppercase tracking-[0.22em]">
          {meta.key}
        </div>
        <h1 className="display text-ink mt-4 text-5xl sm:text-6xl">
          <span className="italic">{meta.label}</span>
        </h1>
        {meta.description && (
          <p className="text-ink-dim mt-4 max-w-prose text-base">
            {meta.description}
          </p>
        )}
        <div className="data text-ink-muted mt-5 text-[11px] uppercase tracking-[0.18em]">
          {visible.length} publikováno
          {meta.noteCount > visible.length && (
            <span className="text-ink-muted/70">
              {" "}· {meta.noteCount - visible.length} private
            </span>
          )}
        </div>
      </header>

      <ol className="space-y-0">
        {visible.map((n, i) => (
          <li
            key={n.slug}
            className={`border-line ${i === 0 ? "border-t" : ""} border-b`}
          >
            <Link
              href={`/${n.subject}/${n.slug}`}
              className="group flex items-baseline gap-5 py-5 no-underline transition-colors"
            >
              <span className="data text-ink-muted group-hover:text-accent w-10 shrink-0 text-right text-[12px] tabular-nums transition-colors">
                {String(n.number).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="display text-ink group-hover:text-accent text-xl transition-colors sm:text-2xl">
                  {n.title}
                </div>
                {n.tags.length > 0 && (
                  <div className="data text-ink-muted mt-1.5 flex flex-wrap gap-x-3 text-[10px] uppercase tracking-[0.15em]">
                    {n.tags.slice(0, 4).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="data text-ink-muted flex shrink-0 items-baseline gap-3 text-[10px] uppercase tracking-[0.18em]">
                {n.speakingTime && (
                  <span className="tabular-nums">~{n.speakingTime}m</span>
                )}
                <StatusPill status={n.status} />
                {n.share === "unlisted" && (
                  <span className="text-accent">unlisted</span>
                )}
              </div>
            </Link>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="text-ink-muted py-8 text-sm italic">
            žádné publikované zápisky
          </li>
        )}
      </ol>
    </div>
  );
}

function StatusPill({ status }: { status: NoteStatus }) {
  const color =
    status === "done"
      ? "text-ok"
      : status === "review"
        ? "text-accent"
        : "text-ink-muted";
  return <span className={color}>{status}</span>;
}
