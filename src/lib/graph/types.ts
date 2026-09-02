import type { TimelineArtifact, ViewMode } from "../timeline/types.ts";

export type NodeKind =
  | "scripture"
  | "ccc"
  | "council"
  | "constitution"
  | "encyclical"
  | "commentary"
  | "person"
  | "event"
  | "artwork"
  | "rosary"
  | "day"
  | "ordo"
  | "proper"
  | "core";

export type CitationKind =
  | "cites"
  | "comments"
  | "defines"
  | "depicts"
  | "observes"
  | "commemorates";

export type EdgeKind = CitationKind | "contains";

export interface DoctrineNode {
  id: string;
  kind: NodeKind;
  title: string;
  subtitle?: string;
  sourceUrl: string;
  year?: number | string;
  bibleRefs?: string[];
  /** v1 display record. Aliases collapse onto this node. */
  artifact: TimelineArtifact;
  aliases: string[];
  lens?: ViewMode;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  kind: EdgeKind;
}

export interface GraphIndex {
  nodes: Map<string, DoctrineNode>;
  edges: GraphEdge[];
  outgoing: Map<string, GraphEdge[]>;
  incoming: Map<string, GraphEdge[]>;
  /** Artifact id (and aliases) → canonical node id. */
  byAlias: Map<string, string>;
}

export interface NeighborHit {
  id: string;
  node: DoctrineNode;
  artifact: TimelineArtifact;
  edge: GraphEdge;
  /** Incoming citation → Cited by. Outgoing citation → This draws on. */
  rail: "cited-by" | "draws-on";
}

export const CITATION_KINDS: readonly CitationKind[] = [
  "cites",
  "comments",
  "defines",
  "depicts",
  "observes",
  "commemorates",
];

export const NODE_RANK: Record<NodeKind, number> = {
  ccc: 0,
  council: 1,
  constitution: 2,
  encyclical: 3,
  commentary: 4,
  scripture: 5,
  core: 6,
  person: 7,
  event: 8,
  artwork: 9,
  rosary: 10,
  day: 11,
  ordo: 12,
  proper: 13,
};

export const RAIL_CAP = 6;
