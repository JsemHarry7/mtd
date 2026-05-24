import { useMemo } from "react";
import { useScrollSpy } from "@/lib/useScrollSpy";
import type { Heading } from "@/types";

/** Sticky left-column table of contents with scrollspy active-state.
 *  Rendered only on lg+ viewports (the NotePage hides the wrapper below). */
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
    <nav aria-label="obsah zápisku">
      <div className="data text-ink-muted mb-3 text-[10px] uppercase tracking-[0.22em]">
        obsah
      </div>
      {/* The <ul> draws the gray rail; each <a> draws its own (transparent
          or accent-cobalt) 2px border that overlaps the rail. Negative
          left margin on items aligns the two so the cobalt sits ON the rail. */}
      <ul className="border-line border-l">
        {items.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id} className="-ml-px">
              <a
                href={`#${h.id}`}
                onClick={(e) => onClick(e, h.id)}
                className={`block border-l-2 py-1.5 text-[12px] leading-snug no-underline transition-colors ${
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
