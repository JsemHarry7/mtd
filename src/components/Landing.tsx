import { Link } from "wouter";
import type { Manifest } from "@/types";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function Landing({ manifest }: { manifest: Manifest }) {
  useDocumentTitle("mtd — zápisky maturita 2026");

  const recent = Object.values(manifest.notes)
    .filter((n) => n.share !== "private")
    .filter((n) => n.updated)
    .sort((a, b) => (b.updated! > a.updated! ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-12 sm:px-10 sm:pt-20">
      {/* Hero — magazine masthead. Single, deliberate "mark that down" reveal. */}
      <section className="border-line border-b pb-12">
        <div className="data text-accent text-[11px] uppercase tracking-[0.22em]">
          zápisky · maturita 2026
        </div>
        <h1 className="wordmark text-ink mt-6 text-[6rem] leading-[0.85] sm:text-[8rem]">
          mtd
        </h1>
        <p className="display text-ink-dim mt-5 text-2xl italic sm:text-3xl">
          mark&nbsp;that&nbsp;down.
        </p>
        <p className="text-ink-dim mt-5 max-w-prose text-base leading-relaxed">
          Veřejný rozcestník studijních zápisků k maturitě.
          <span className="text-ink-muted"> SWI · DAT · ČJL na jednom místě, propojené přes&nbsp;</span>
          <Link
            href="/graf"
            className="text-ink-dim decoration-accent underline-offset-2 hover:text-ink"
          >
            graf konceptů
          </Link>
          <span className="text-ink-muted">.</span>
        </p>
      </section>

      {/* Subjects — stacked feature stripes */}
      <section className="mt-12">
        <SectionLabel>předměty</SectionLabel>
        <ul className="mt-4">
          {manifest.subjects.map((s, i) => (
            <li
              key={s.key}
              className={`border-line ${i === 0 ? "border-t" : ""} border-b`}
            >
              <Link
                href={`/${s.key}`}
                className="group flex items-baseline gap-6 py-7 no-underline transition-colors"
              >
                <span className="data text-ink-muted group-hover:text-accent w-16 shrink-0 text-[12px] uppercase tracking-[0.2em] transition-colors">
                  {s.key}
                </span>
                <div className="flex-1">
                  <div className="display text-ink group-hover:text-accent text-3xl transition-colors sm:text-4xl">
                    {s.label}
                  </div>
                  {s.description && (
                    <div className="text-ink-dim mt-1.5 text-sm">
                      {s.description}
                    </div>
                  )}
                </div>
                <span className="data text-ink-muted shrink-0 text-[12px] tabular-nums">
                  {s.noteCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Recently updated */}
      {recent.length > 0 && (
        <section className="mt-16">
          <SectionLabel>nedávno aktualizováno</SectionLabel>
          <ul className="mt-4 space-y-0">
            {recent.map((n, i) => (
              <li
                key={n.slug}
                className={`border-line ${i === 0 ? "border-t" : ""} border-b`}
              >
                <Link
                  href={`/${n.subject}/${n.slug}`}
                  className="group flex items-baseline gap-4 py-3.5 no-underline transition-colors"
                >
                  <span className="data text-ink-muted w-12 shrink-0 text-[11px] uppercase tracking-[0.18em]">
                    {n.subject}
                  </span>
                  <span className="text-ink group-hover:text-accent flex-1 text-[16px] transition-colors">
                    {n.title}
                  </span>
                  <span className="data text-ink-muted shrink-0 text-[11px] tabular-nums">
                    {n.updated}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="data text-ink-muted flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]">
      <span>{children}</span>
      <span className="bg-line h-px flex-1" />
    </div>
  );
}
