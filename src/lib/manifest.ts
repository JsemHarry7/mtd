import type { GraphData, Manifest, Note } from "@/types";

const MANIFEST_URL = "/data/manifest.json";
const GRAPH_URL = "/data/graph.json";
const NOTE_URL = (slug: string) => `/data/notes/${slug}.json`;

let manifestPromise: Promise<Manifest> | null = null;

export function loadManifest(): Promise<Manifest> {
  if (!manifestPromise) {
    manifestPromise = fetch(MANIFEST_URL).then((r) => {
      if (!r.ok) throw new Error(`manifest fetch failed: ${r.status}`);
      return r.json() as Promise<Manifest>;
    });
  }
  return manifestPromise;
}

let graphPromise: Promise<GraphData> | null = null;

export function loadGraph(): Promise<GraphData> {
  if (!graphPromise) {
    graphPromise = fetch(GRAPH_URL).then((r) => {
      if (!r.ok) throw new Error(`graph fetch failed: ${r.status}`);
      return r.json() as Promise<GraphData>;
    });
  }
  return graphPromise;
}

const noteCache = new Map<string, Promise<Note>>();

export function loadNote(slug: string): Promise<Note> {
  let p = noteCache.get(slug);
  if (!p) {
    p = fetch(NOTE_URL(slug)).then((r) => {
      if (!r.ok) throw new Error(`note fetch failed: ${slug} (${r.status})`);
      return r.json() as Promise<Note>;
    });
    noteCache.set(slug, p);
  }
  return p;
}
