import { Link, useLocation } from "wouter";
import type { Manifest } from "@/types";
import { useTheme } from "@/lib/theme";

export function TopBar({
  manifest,
  onMenuToggle,
  menuOpen,
}: {
  manifest: Manifest | null;
  onMenuToggle: () => void;
  menuOpen: boolean;
}) {
  const [location] = useLocation();
  const seg = location.split("/").filter(Boolean);
  const activeSubject = seg[0] ?? null;
  const onGraph = location === "/graf";
  const subjects = manifest?.subjects ?? [];

  return (
    <header className="bg-surface/95 border-line fixed inset-x-0 top-0 z-50 flex h-[calc(64px+env(safe-area-inset-top))] items-center border-b pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        {/* Wordmark — just the mark. "mark that down" already lives in the
           Landing hero and the Footer; three mentions felt like marketing
           shouting at the reader. */}
        <Link
          href="/"
          className="flex shrink-0 items-baseline no-underline"
          aria-label="mtd — home"
        >
          <span className="wordmark text-ink text-[28px] leading-none">mtd</span>
        </Link>

        {/* Desktop subject nav + graph link */}
        <nav
          className="hidden flex-1 items-center justify-center gap-7 md:flex"
          aria-label="navigace"
        >
          {subjects.map((s) => {
            const active = activeSubject === s.key;
            return (
              <Link
                key={s.key}
                href={`/${s.key}`}
                className={`data relative text-[12px] uppercase tracking-[0.18em] no-underline transition-colors ${
                  active ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {s.key}
                {active && (
                  <span
                    aria-hidden
                    className="bg-accent absolute inset-x-0 -bottom-2 h-px"
                  />
                )}
              </Link>
            );
          })}
          <span aria-hidden className="bg-line h-3 w-px" />
          <Link
            href="/graf"
            className={`data relative text-[12px] uppercase tracking-[0.18em] no-underline transition-colors ${
              onGraph ? "text-ink" : "text-ink-muted hover:text-ink"
            }`}
          >
            graf
            {onGraph && (
              <span
                aria-hidden
                className="bg-accent absolute inset-x-0 -bottom-2 h-px"
              />
            )}
          </Link>
          <Link
            href="/about"
            className={`data relative text-[12px] uppercase tracking-[0.18em] no-underline transition-colors ${
              location === "/about" ? "text-ink" : "text-ink-muted hover:text-ink"
            }`}
          >
            about
            {location === "/about" && (
              <span
                aria-hidden
                className="bg-accent absolute inset-x-0 -bottom-2 h-px"
              />
            )}
          </Link>
        </nav>

        {/* Right side: theme toggle (desktop), hamburger (mobile) */}
        <div className="flex shrink-0 items-center justify-end gap-1">
          <ThemeToggle className="hidden md:inline-flex" />
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label={menuOpen ? "zavřít menu" : "otevřít menu"}
            aria-expanded={menuOpen}
            className="text-ink-dim hover:text-ink -mr-2 flex h-12 w-12 items-center justify-center transition-colors md:hidden"
          >
            <Hamburger open={menuOpen} />
          </button>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, , toggle] = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      className={`data text-ink-muted hover:text-ink text-[11px] uppercase tracking-[0.18em] transition-colors ${className}`}
      aria-label="toggle theme"
      title={`switch to ${theme === "dark" ? "light" : "dark"}`}
    >
      {theme === "dark" ? "light" : "dark"}
    </button>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <line x1="6" y1="6" x2="22" y2="22" />
          <line x1="22" y1="6" x2="6" y2="22" />
        </>
      ) : (
        <>
          <line x1="4" y1="8" x2="24" y2="8" />
          <line x1="4" y1="14" x2="24" y2="14" />
          <line x1="4" y1="20" x2="24" y2="20" />
        </>
      )}
    </svg>
  );
}
