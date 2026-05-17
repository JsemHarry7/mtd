import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import ForceGraph2D from "react-force-graph-2d";
import type {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";
import { forceCollide, forceX, forceY } from "d3-force";
import { loadGraph } from "@/lib/manifest";
import { useTheme } from "@/lib/theme";
import type {
  GraphData,
  GraphLink,
  GraphNode,
  GraphNoteNode,
  Manifest,
  SubjectMeta,
} from "@/types";

const FALLBACK_NODE_COLOR = "#74747a";

function withAlpha(hex: string, alpha: number): string {
  if (!hex || !hex.startsWith("#") || hex.length !== 7) return hex;
  const a = Math.max(0, Math.min(255, Math.round(alpha))).toString(16).padStart(2, "0");
  return `${hex}${a}`;
}

function linkKey(l: { source: string | { id: string }; target: string | { id: string } }) {
  const s = typeof l.source === "string" ? l.source : l.source.id;
  const t = typeof l.target === "string" ? l.target : l.target.id;
  return `${s}|${t}`;
}

function nodeId(n: string | { id: string }) {
  return typeof n === "string" ? n : n.id;
}

/** Simple media-query hook. Re-renders on match change. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

interface HoverInfo {
  node: GraphNode;
  x: number;
  y: number;
}

export default function Graph({ manifest }: { manifest: Manifest }) {
  const [data, setData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const [theme] = useTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTouch = useMediaQuery("(pointer: coarse)");

  useEffect(() => {
    loadGraph()
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () =>
      setSize({
        w: Math.floor(el.clientWidth),
        h: Math.floor(el.clientHeight),
      });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data]);

  const [palette, setPalette] = useState(() => readPalette());
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setPalette(readPalette()));
    return () => window.cancelAnimationFrame(id);
  }, [theme]);

  const subjectMap = useMemo(() => {
    const m = new Map<string, SubjectMeta>();
    for (const s of manifest.subjects) m.set(s.key, s);
    return m;
  }, [manifest]);

  /* Filter visible. Hiding a subject also hides tag nodes that are now
     orphaned (no remaining note connects to them). */
  const visible = useMemo<GraphData | null>(() => {
    if (!data) return null;
    const visibleNoteIds = new Set<string>();
    for (const n of data.nodes) {
      if (n.kind === "note" && !hidden.has(n.subject)) visibleNoteIds.add(n.id);
    }
    const links = data.links.filter(
      (l) => visibleNoteIds.has(nodeId(l.source)),
    );
    const stillUsedTags = new Set<string>();
    for (const l of links) stillUsedTags.add(nodeId(l.target));
    const nodes = data.nodes.filter((n) => {
      if (n.kind === "note") return visibleNoteIds.has(n.id);
      return stillUsedTags.has(n.id);
    });
    return { nodes, links };
  }, [data, hidden]);

  /* Highlight on hover. Bipartite traversal:
     - hover note → highlight note + its tags + sibling notes through those tags
     - hover tag  → highlight tag + all notes that carry it */
  const { highlightNodes, highlightLinks } = useMemo(() => {
    const hNodes = new Set<string>();
    const hLinks = new Set<string>();
    if (!hoverId || !visible) return { highlightNodes: hNodes, highlightLinks: hLinks };
    hNodes.add(hoverId);
    const tagNeighbours = new Set<string>();
    for (const link of visible.links) {
      const s = nodeId(link.source);
      const t = nodeId(link.target);
      if (s === hoverId || t === hoverId) {
        hNodes.add(s);
        hNodes.add(t);
        hLinks.add(`${s}|${t}`);
        if (s === hoverId) tagNeighbours.add(t);
        else tagNeighbours.add(s);
      }
    }
    // Second hop: if hovered a NOTE, light up sibling notes through its tags too.
    const hovered = visible.nodes.find((n) => n.id === hoverId);
    if (hovered?.kind === "note") {
      for (const link of visible.links) {
        const s = nodeId(link.source);
        const t = nodeId(link.target);
        if (tagNeighbours.has(t) && s !== hoverId) {
          hNodes.add(s);
          hLinks.add(`${s}|${t}`);
        }
      }
    }
    return { highlightNodes: hNodes, highlightLinks: hLinks };
  }, [hoverId, visible]);
  const anyHover = hoverId !== null;

  type FGNode = NodeObject<GraphNode>;
  type FGLink = LinkObject<GraphNode, GraphLink>;
  const fgRef = useRef<ForceGraphMethods<FGNode, FGLink> | undefined>(undefined);

  /* Force tuning. Mobile gets a smaller graph-coord space so auto-fit
     doesn't shrink nodes into invisible dots. Same structure, different
     scale.
   *  1) charge: repulsion
   *  2) link distance: edge length
   *  3) per-subject spatial anchor → orphans stay with their cluster
   *  4) collision per node radius → no overlap
   */
  useEffect(() => {
    const g = fgRef.current;
    if (!g || !visible) return;

    const charge = g.d3Force("charge") as unknown as
      | { strength: (n: number) => unknown }
      | undefined;
    if (charge) charge.strength(isMobile ? -180 : -360);

    const link = g.d3Force("link") as unknown as
      | { distance: (fn: (l: FGLink) => number) => unknown }
      | undefined;
    if (link) link.distance(() => (isMobile ? 45 : 80));

    const SUBJECT_ANCHORS: Record<string, { x: number; y: number }> = isMobile
      ? {
          SWI: { x: -130, y: -70 },
          DAT: { x: 130, y: -70 },
          CJL: { x: 0, y: 130 },
        }
      : {
          SWI: { x: -380, y: -160 },
          DAT: { x: 380, y: -160 },
          CJL: { x: 0, y: 320 },
        };

    const anchorStrength = isMobile ? 0.08 : 0.06;
    const fx = forceX<NodeObject<GraphNode>>()
      .x((n) => {
        const node = n as unknown as GraphNode;
        if (node.kind === "note") return SUBJECT_ANCHORS[node.subject]?.x ?? 0;
        return 0;
      })
      .strength(anchorStrength);
    const fy = forceY<NodeObject<GraphNode>>()
      .y((n) => {
        const node = n as unknown as GraphNode;
        if (node.kind === "note") return SUBJECT_ANCHORS[node.subject]?.y ?? 0;
        return 0;
      })
      .strength(anchorStrength);

    const collide = forceCollide<NodeObject<GraphNode>>()
      .radius((n) => {
        const node = n as unknown as GraphNode;
        if (node.kind === "note") return Math.sqrt(node.val) * 4 + 6;
        return Math.sqrt(node.val) * 2.2 + (isMobile ? 18 : 26);
      })
      .strength(0.85);

    type ForceArg = Parameters<typeof g.d3Force>[1];
    g.d3Force("subjectX", fx as unknown as ForceArg);
    g.d3Force("subjectY", fy as unknown as ForceArg);
    g.d3Force("collide", collide as unknown as ForceArg);
    g.d3ReheatSimulation();
  }, [visible, isMobile]);

  const zoom = (factor: number) => {
    const g = fgRef.current;
    if (!g) return;
    g.zoom(g.zoom() * factor, 250);
  };
  const fit = () => fgRef.current?.zoomToFit(400, 60);

  if (error) {
    return (
      <div className="p-8">
        <p className="data text-bad text-sm">graph load failed: {error}</p>
      </div>
    );
  }
  if (!data || !visible) {
    return (
      <div className="flex h-[calc(100dvh-64px-env(safe-area-inset-top))] items-center justify-center">
        <span className="data text-ink-muted animate-pulse text-[10px] uppercase tracking-[0.2em]">
          načítám graf …
        </span>
      </div>
    );
  }

  const noteColor = (node: GraphNoteNode) =>
    subjectMap.get(node.subject)?.color ?? FALLBACK_NODE_COLOR;

  return (
    <div className="relative h-[calc(100dvh-64px-env(safe-area-inset-top))] w-full overflow-hidden">
      {/* Legend — top-left desktop, top horizontal strip on mobile */}
      <div className="bg-surface/85 absolute left-3 right-3 top-3 z-10 flex items-start gap-4 px-2 py-2 backdrop-blur sm:left-6 sm:right-auto sm:top-6 sm:block sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div className="data text-ink-muted hidden text-[10px] uppercase tracking-[0.22em] sm:mb-2 sm:block">
          předměty
        </div>
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:block sm:space-y-1.5">
          {manifest.subjects.map((s) => {
            const isHidden = hidden.has(s.key);
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() =>
                    setHidden((prev) => {
                      const next = new Set(prev);
                      if (next.has(s.key)) next.delete(s.key);
                      else next.add(s.key);
                      return next;
                    })
                  }
                  className={`group flex items-center gap-1.5 transition-opacity sm:gap-2 ${isHidden ? "opacity-40" : ""}`}
                  aria-pressed={!isHidden}
                >
                  <span
                    aria-hidden
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      background: isHidden ? "transparent" : (s.color ?? FALLBACK_NODE_COLOR),
                      outline: isHidden ? `1px solid ${s.color ?? FALLBACK_NODE_COLOR}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                  <span className="data text-ink text-[11px] uppercase tracking-[0.18em]">
                    {s.key}
                  </span>
                  <span className="data text-ink-muted text-[10px] tabular-nums">
                    {s.noteCount}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="data text-ink-muted ml-auto hidden max-w-[200px] text-[10px] leading-snug sm:mt-5 sm:block">
          <span className="text-ink-dim">tečky</span> = zápisky · <span className="text-ink-dim">křížky</span> = sdílené tagy.
          Hover odhalí spojení.
        </div>
      </div>

      {/* Zoom controls — pushed up on mobile when a tooltip sheet is visible */}
      <div
        className={`absolute right-3 z-10 flex gap-1 sm:right-6 ${
          isMobile && hover ? "bottom-[88px]" : "bottom-3 sm:bottom-6"
        }`}
      >
        <ZoomBtn label="−" onClick={() => zoom(1 / 1.25)} aria="zoom out" />
        <ZoomBtn label="◯" onClick={fit} aria="fit" />
        <ZoomBtn label="+" onClick={() => zoom(1.25)} aria="zoom in" />
      </div>

      {/* Tooltip — desktop: floats near node. Mobile: sticky bottom sheet. */}
      {hover && (
        <div
          className={
            isMobile
              ? "bg-surface-elev hairline pointer-events-auto fixed inset-x-3 bottom-3 z-30 flex items-center justify-between gap-3 px-4 py-3 shadow-md"
              : "bg-surface-elev hairline pointer-events-none absolute z-20 max-w-xs px-3 py-2 shadow-sm"
          }
          style={
            isMobile
              ? undefined
              : {
                  left: Math.min(hover.x + 14, (size.w || 0) - 280),
                  top: Math.min(hover.y + 14, (size.h || 0) - 90),
                }
          }
        >
          <div className="min-w-0 flex-1">
            {hover.node.kind === "note" ? (
              <>
                <div className="data text-ink-muted text-[10px] uppercase tracking-[0.18em]">
                  {hover.node.subject}
                </div>
                <div className="text-ink mt-0.5 truncate text-sm leading-tight">
                  {hover.node.title}
                </div>
                {hover.node.tags.length > 0 && (
                  <div className="data text-ink-muted mt-1 truncate text-[10px]">
                    {hover.node.tags.join(" · ")}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="data text-ink-muted text-[10px] uppercase tracking-[0.18em]">
                  tag
                </div>
                <div className="text-ink mt-0.5 text-sm leading-tight">
                  #{hover.node.tag}
                </div>
                <div className="data text-ink-muted mt-1 text-[10px]">
                  v {hover.node.noteCount} zápiscích
                </div>
              </>
            )}
          </div>
          {/* "otevřít" link only for note nodes — the actual navigation
             handle on touch devices (where tap-on-node doesn't navigate). */}
          {hover.node.kind === "note" && (
            <Link
              href={`/${hover.node.subject}/${hover.node.slug}`}
              className="data text-accent hover:text-ink shrink-0 text-[11px] uppercase tracking-[0.18em] no-underline"
            >
              otevřít →
            </Link>
          )}
        </div>
      )}

      <div ref={containerRef} className="h-full w-full">
        {size.w > 0 && size.h > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={size.w}
            height={size.h}
            graphData={visible}
            backgroundColor={palette.surface}
            nodeRelSize={5}
            nodeVal={(n) => (n as GraphNode).val}
            nodeColor={() => "transparent"}
            nodeLabel={() => ""}
            nodeCanvasObjectMode={() => "replace"}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const n = node as GraphNode & { x: number; y: number };
              const dimmed = anyHover && !highlightNodes.has(n.id);
              const isHovered = hoverId === n.id;

              if (n.kind === "note") {
                const r = Math.sqrt(n.val) * 4;
                const color = noteColor(n);

                if (isHovered) {
                  ctx.beginPath();
                  ctx.arc(n.x, n.y, r + 4 / globalScale, 0, 2 * Math.PI);
                  ctx.strokeStyle = palette.ink;
                  ctx.lineWidth = 1.5 / globalScale;
                  ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
                ctx.fillStyle = dimmed ? withAlpha(color, 40) : color;
                ctx.fill();
              } else {
                // tag node: small square hub
                const half = Math.sqrt(n.val) * 2.2;
                const tagColor = palette.lineStrong;

                ctx.fillStyle = dimmed ? withAlpha(tagColor, 50) : tagColor;
                ctx.fillRect(n.x - half, n.y - half, half * 2, half * 2);

                if (isHovered) {
                  ctx.strokeStyle = palette.ink;
                  ctx.lineWidth = 1.4 / globalScale;
                  ctx.strokeRect(n.x - half - 2 / globalScale, n.y - half - 2 / globalScale, (half + 2 / globalScale) * 2, (half + 2 / globalScale) * 2);
                }

                // Tag label always visible — mono caps, small. This is the
                // whole point of bipartite: the connecting concept is named.
                const fontSize = Math.max(8.5, 10 / globalScale);
                ctx.font = `500 ${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillStyle = dimmed
                  ? withAlpha(palette.inkMuted, 90)
                  : isHovered
                    ? palette.ink
                    : palette.inkDim;
                ctx.fillText(n.tag, n.x, n.y + half + 3 / globalScale);
              }
            }}
            linkColor={(l) => {
              const base = palette.line;
              if (anyHover && !highlightLinks.has(linkKey(l as FGLink))) {
                return withAlpha(base, 25);
              }
              return withAlpha(base, 180);
            }}
            linkWidth={(l) => {
              const isHigh = highlightLinks.has(linkKey(l as FGLink));
              return isHigh ? 1.6 : 0.6;
            }}
            onNodeClick={(node) => {
              const n = node as GraphNode & { x: number; y: number };
              if (isTouch) {
                // Touch: tap = select for exploration, don't auto-navigate.
                // User reaches the note via the "otevřít →" link in the tooltip.
                setHoverId(n.id);
                const g = fgRef.current;
                if (!g) return;
                const screen = g.graph2ScreenCoords(n.x, n.y);
                setHover({ node: n, x: screen.x, y: screen.y });
              } else if (n.kind === "note") {
                navigate(`/${n.subject}/${n.slug}`);
              }
            }}
            onNodeHover={(node) => {
              if (isTouch) return; // touch devices don't get hover signals reliably
              document.body.style.cursor = node
                ? (node as GraphNode).kind === "note"
                  ? "pointer"
                  : "default"
                : "";
              if (!node) {
                setHover(null);
                setHoverId(null);
                return;
              }
              const n = node as GraphNode & { x: number; y: number };
              setHoverId(n.id);
              const g = fgRef.current;
              if (!g) return;
              const screen = g.graph2ScreenCoords(n.x, n.y);
              setHover({ node: n, x: screen.x, y: screen.y });
            }}
            onBackgroundClick={() => {
              if (isTouch) {
                setHover(null);
                setHoverId(null);
              }
            }}
            enableNodeDrag={false}
            onEngineStop={() => fgRef.current?.zoomToFit(500, 60)}
            cooldownTime={6000}
            warmupTicks={100}
            d3AlphaDecay={0.012}
            d3VelocityDecay={0.5}
          />
        )}
      </div>
    </div>
  );
}

function ZoomBtn({
  label,
  onClick,
  aria,
}: {
  label: string;
  onClick: () => void;
  aria: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={aria}
      className="bg-surface-elev hairline text-ink-dim hover:text-ink hover:border-line-strong flex h-9 w-9 items-center justify-center text-base transition-colors"
    >
      {label}
    </button>
  );
}

function readPalette() {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const get = (v: string) => cs.getPropertyValue(v).trim();
  return {
    surface: get("--color-surface"),
    ink: get("--color-ink"),
    inkDim: get("--color-ink-dim"),
    inkMuted: get("--color-ink-muted"),
    accent: get("--color-accent"),
    line: get("--color-line"),
    lineStrong: get("--color-line-strong"),
  };
}
