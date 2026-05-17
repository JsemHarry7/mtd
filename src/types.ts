/* ---------- Domain types ---------- */

export type Subject = string;

export type ShareMode = "public" | "unlisted" | "private";
export type NoteStatus = "draft" | "review" | "done";

export interface Frontmatter {
  subject: Subject;
  number: number;
  title: string;
  tags?: string[];
  /** Default 'private' if omitted. */
  share?: ShareMode;
  status?: NoteStatus;
  /** Estimated speaking time in minutes. */
  speakingTime?: number;
  /** ISO date string. */
  updated?: string;
}

export interface Heading {
  depth: number;
  text: string;
  id: string;
}

export interface Backlink {
  fromSlug: string;
  fromTitle: string;
  snippet: string;
}

/** Lightweight note record carried in the manifest (no HTML body). */
export interface NoteMeta {
  slug: string;
  subject: Subject;
  number: number;
  title: string;
  tags: string[];
  share: ShareMode;
  status: NoteStatus;
  speakingTime?: number;
  updated?: string;
  headings: Heading[];
  backlinks: Backlink[];
}

/** Full note record loaded on-demand for a single note view. */
export interface Note extends NoteMeta {
  html: string;
}

export interface SubjectMeta {
  key: Subject;
  label: string;
  description?: string;
  order: number;
  /** Hex color, used in graph nodes and subject-specific accents. */
  color?: string;
  noteCount: number;
}

/* ---------- Graph types ----------
 *
 * Bipartite model: note nodes and tag nodes. Notes don't connect to other
 * notes directly — they connect via shared tag nodes. This makes "what
 * connects X to Y" visually traceable (the shared concept sits between them)
 * and avoids the hairball you get from O(N²) note-pair edges.
 */
export interface GraphNoteNode {
  id: string;
  kind: "note";
  slug: string;
  subject: Subject;
  title: string;
  tags: string[];
  speakingTime?: number;
  val: number;
}

export interface GraphTagNode {
  id: string;
  kind: "tag";
  tag: string;
  /** Number of notes carrying this tag. Drives visual size. */
  noteCount: number;
  val: number;
}

export type GraphNode = GraphNoteNode | GraphTagNode;

export interface GraphLink {
  source: string;
  target: string;
  kind: "note-tag";
  value: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface Manifest {
  siteName: string;
  siteDescription: string;
  subjects: SubjectMeta[];
  notes: Record<string, NoteMeta>;
  /** Slugs grouped by subject, ordered by `number`. */
  notesBySubject: Record<Subject, string[]>;
  /** All unique tags sorted alphabetically. */
  tags: string[];
  lastBuild: string;
  counts: { public: number; unlisted: number; private: number };
}
