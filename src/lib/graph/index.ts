import { graph } from "./compile.ts";
import { getNode, neighborhood, parents, children, route, resolveQuery, rankedRails, nodeForArtifact, cluster } from "./api.ts";
import { todayBoard, todayClusterIds } from "./today.ts";
import { parseRef, parseRefs, scriptureIdFromRef } from "./parse-ref.ts";
import { parseNodeId, dayId, cccId } from "./ids.ts";
import type { DoctrineNode, GraphEdge, NeighborHit } from "./types.ts";
import { CHURCH_SPINE_ENTRY_IDS, CHURCH_ARCHIVE_ENTRY_IDS, REQUIRED_PATHS } from "./seeds.ts";
import { isChurchDefaultEntry } from "./church-spine.ts";
import { canonicalIdForArtifact } from "./canon.ts";

export {
  graph,
  getNode,
  neighborhood,
  parents,
  children,
  route,
  resolveQuery,
  rankedRails,
  nodeForArtifact,
  cluster,
  todayBoard,
  todayClusterIds,
  parseRef,
  parseRefs,
  scriptureIdFromRef,
  parseNodeId,
  dayId,
  cccId,
  CHURCH_SPINE_ENTRY_IDS,
  CHURCH_ARCHIVE_ENTRY_IDS,
  REQUIRED_PATHS,
  canonicalIdForArtifact,
  isChurchDefaultEntry,
};

export type { DoctrineNode, GraphEdge, NeighborHit };

export function serializeGraph(): { nodes: unknown[]; edges: unknown[] } {
  const g = graph();
  return {
    nodes: [...g.nodes.values()].map((node) => ({
      id: node.id,
      kind: node.kind,
      title: node.title,
      sourceUrl: node.sourceUrl,
      aliases: node.aliases,
    })),
    edges: g.edges.map((edge) => ({
      from: edge.from,
      to: edge.to,
      kind: edge.kind,
    })),
  };
}
