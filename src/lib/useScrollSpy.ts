import { useEffect, useState } from "react";

/** Track which heading is currently "in view" (top of viewport).
 *
 * rootMargin = "-80px 0px -60% 0px" creates an active band from 80px below
 * viewport top down to 40% from top. As you scroll, the active heading is
 * whichever is currently sitting in that upper band.
 *
 * Returns the id of the active element, or null if nothing observed is in
 * the active band yet (e.g. scrolled above the first heading). */
export function useScrollSpy(
  ids: string[],
  rootMargin = "-80px 0px -60% 0px",
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    if (ids.length === 0) return;
    if (typeof IntersectionObserver === "undefined") return;

    const inBand = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.set(entry.target.id, entry);
          else inBand.delete(entry.target.id);
        }
        if (inBand.size === 0) return;
        // Pick the entry closest to the top of the band.
        let bestId: string | null = null;
        let bestTop = Number.POSITIVE_INFINITY;
        for (const entry of inBand.values()) {
          const top = entry.boundingClientRect.top;
          if (top < bestTop) {
            bestTop = top;
            bestId = entry.target.id;
          }
        }
        setActiveId(bestId);
      },
      { rootMargin, threshold: 0 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, rootMargin]);

  return activeId;
}
