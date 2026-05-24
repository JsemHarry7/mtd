import { useMemo } from "react";
import { useScrollSpy } from "@/lib/useScrollSpy";
import type { Heading } from "@/types";

/** Sticky left-column table of contents with scrollspy active-state.
 *  Rendered only on lg+ viewports (the NotePage hides the wrapper below).
 *
 *  Layout intent: the whole nav stays within one viewport (when header
 *  and footer are scrolled off). If the heading count overflows that, the
 *  inner <ul> scrolls — the "obsah" label stays fixed at the top of the
 *  rail so it always reads as a label.
 *
 *  Long titles never wrap to multiple lines — they truncate with `…` and
 *  the full text is in the `title` tooltip on hover. */
export function Toc({ headings }: { headings: Heading[] }) {
  const items = useMemo(
    () => headings.filter((h) => h.depth >= 2 && h.depth <= 3),
    [headings],
  );
  const activeId = useScrollSpy(items.map((h) => h.id));

  if (items.length === 0) return null;

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="obsah zápisku" className="flex max-h-[calc(100dvh-7rem)] flex-col">
      <div className="data text-ink-muted mb-3 shrink-0 text-[10px] uppercase tracking-[0.22em]">
        obsah
      </div>
      {/* Inner scroll only when items overflow the available height; the
          gray rail draws on the <ul>, individual <a>s draw the active
          cobalt overlay. */}
      <ul className="border-line min-h-0 overflow-y-auto border-l [scrollbar-gutter:stable] [scrollbar-width:thin]">
        {items.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id} className="-ml-px">
              <a
                href={`#${h.id}`}
                onClick={(e) => onClick(e, h.id)}
                title={h.text}
                className={`block truncate border-l-2 py-1 text-[12px] leading-snug no-underline transition-colors ${
                  h.depth === 3 ? "pl-7" : "pl-4"
                } ${
                  isActive
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-dim hover:text-ink"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
