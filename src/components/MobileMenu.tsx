import { Link } from "wouter";
import type { Manifest } from "@/types";
import { useTheme } from "@/lib/theme";

export function MobileMenu({
  manifest,
  open,
  onClose,
}: {
  manifest: Manifest | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const [theme, , toggle] = useTheme();
  const subjects = manifest?.subjects ?? [];

  return (
    <div className="bg-surface fixed inset-0 z-40 flex flex-col overflow-y-auto pt-[calc(64px+env(safe-area-inset-top))] md:hidden">
      <nav className="flex-1 px-6 py-8" aria-label="navigace">
        <Link
          href="/"
          onClick={onClose}
          className="data text-ink-muted hover:text-ink mb-8 block text-[11px] uppercase tracking-[0.18em] no-underline"
        >
          ← home
        </Link>

        <Link
          href="/graf"
          onClick={onClose}
          className="bg-surface-inset hairline mb-8 flex items-center justify-between px-4 py-3 no-underline"
        >
          <span className="data text-ink text-[12px] uppercase tracking-[0.2em]">
            graf
          </span>
          <span className="data text-ink-muted text-[10px]">
            spojnicová mapa zápisků →
          </span>
        </Link>

        <ul className="space-y-7">
          {subjects.map((s) => {
            const slugs = manifest?.notesBySubject[s.key] ?? [];
            const notes = slugs
              .map((sl) => manifest!.notes[sl])
              .filter((n) => n && n.share !== "private");
            return (
              <li key={s.key}>
                <Link
                  href={`/${s.key}`}
                  onClick={onClose}
                  className="block no-underline"
                >
                  <div className="data text-accent text-[11px] uppercase tracking-[0.18em]">
                    {s.key}
                  </div>
                  <div className="display text-ink mt-1 text-3xl">
                    {s.label}
                  </div>
                </Link>
                {notes.length > 0 && (
                  <ul className="border-line mt-3 space-y-1.5 border-l pl-4">
                    {notes.map((n) => (
                      <li key={n.slug}>
                        <Link
                          href={`/${n.subject}/${n.slug}`}
                          onClick={onClose}
                          className="text-ink-dim hover:text-ink flex items-baseline gap-3 no-underline"
                        >
                          <span className="data text-ink-muted w-6 shrink-0 text-[11px] tabular-nums">
                            {String(n.number).padStart(2, "0")}
                          </span>
                          <span className="text-[15px]">{n.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-line flex items-center justify-between border-t px-6 py-4">
        <div className="data text-ink-muted flex items-baseline gap-2 text-[10px] uppercase tracking-[0.18em]">
          <span>v{__APP_VERSION__}</span>
          <span>·</span>
          <Link href="/about" onClick={onClose} className="hover:text-ink no-underline">
            about
          </Link>
        </div>
        <button
          type="button"
          onClick={toggle}
          className="data text-ink-muted hover:text-ink text-[11px] uppercase tracking-[0.18em] transition-colors"
        >
          {theme === "dark" ? "light" : "dark"}
        </button>
      </div>
    </div>
  );
}
