import { cccParagraphNumber } from "../timeline/ccc.ts";
import type { TimelineArtifact } from "../timeline/types.ts";
import { graph, isCitation } from "./compile.ts";
import { parseNodeId } from "./ids.ts";
import { parseRef, refCoversVerse, scriptureIdFromRef } from "./parse-ref.ts";
import { REQUIRED_PATHS } from "./seeds.ts";
import { todayBoard } from "./today.ts";
import type { DoctrineNode, GraphEdge, NeighborHit } from "./types.ts";
import { NODE_RANK, RAIL_CAP } from "./types.ts";

function index() {
  return graph();
}

export function getNode(id: string): DoctrineNode | undefined {
  return index().nodes.get(id);
}

export function getArtifact(id: string): TimelineArtifact | undefined {
  return getNode(id)?.artifact;
}

export function parents(id: string): DoctrineNode[] {
  const g = index();
  return (g.incoming.get(id) ?? [])
    .filter((edge) => edge.kind === "contains")
    .map((edge) => g.nodes.get(edge.from))
    .filter((node): node is DoctrineNode => Boolean(node));
}

export function children(id: string): DoctrineNode[] {
  const g = index();
  return (g.outgoing.get(id) ?? [])
    .filter((edge) => edge.kind === "contains")
    .map((edge) => g.nodes.get(edge.to))
    .filter((node): node is DoctrineNode => Boolean(node));
}

function rankNeighbor(hit: NeighborHit): number {
  return NODE_RANK[hit.node.kind] ?? 99;
}

export function neighborhood(id: string, depth = 1): NeighborHit[] {
  const g = index();
  const seen = new Set<string>([id]);
  const hits: NeighborHit[] = [];
  const queue: { id: string; remaining: number }[] = [{ id, remaining: depth }];

  while (queue.length) {
    const cur = queue.shift();
    if (!cur) break;
    const out = g.outgoing.get(cur.id) ?? [];
    const inn = g.incoming.get(cur.id) ?? [];
    for (const edge of [...out, ...inn]) {
      if (!isCitation(edge.kind) && edge.kind !== "contains") continue;
      if (edge.kind === "contains" && cur.remaining === depth && cur.id === id) continue;
      const other = edge.from === cur.id ? edge.to : edge.from;
      if (seen.has(other)) continue;
      seen.add(other);
      const node = g.nodes.get(other);
      if (!node) continue;
      const outgoingFromFocus = edge.from === id;
      const rail: NeighborHit["rail"] = outgoingFromFocus ? "draws-on" : "cited-by";
      if (isCitation(edge.kind) && (edge.from === id || edge.to === id)) {
        hits.push({
          id: other,
          node,
          artifact: node.artifact,
          edge,
          rail,
        });
      }
      if (cur.remaining > 1) queue.push({ id: other, remaining: cur.remaining - 1 });
    }
  }

  hits.sort((a, b) => rankNeighbor(a) - rankNeighbor(b) || a.node.title.localeCompare(b.node.title));
  return hits;
}

export function rankedRails(id: string): {
  citedBy: NeighborHit[];
  drawsOn: NeighborHit[];
  citedByMore: number;
  drawsOnMore: number;
} {
  const hits = neighborhood(id, 1);
  const citedByAll = hits.filter((hit) => hit.rail === "cited-by");
  const drawsOnAll = hits.filter((hit) => hit.rail === "draws-on");
  return {
    citedBy: citedByAll.slice(0, RAIL_CAP),
    drawsOn: drawsOnAll.slice(0, RAIL_CAP),
    citedByMore: Math.max(0, citedByAll.length - RAIL_CAP),
    drawsOnMore: Math.max(0, drawsOnAll.length - RAIL_CAP),
  };
}

function undirectedNeighbors(id: string): { id: string; edge: GraphEdge }[] {
  const g = index();
  const out: { id: string; edge: GraphEdge }[] = [];
  for (const edge of g.outgoing.get(id) ?? []) {
    if (isCitation(edge.kind)) out.push({ id: edge.to, edge });
  }
  for (const edge of g.incoming.get(id) ?? []) {
    if (isCitation(edge.kind)) out.push({ id: edge.from, edge });
  }
  return out;
}

function bfs(start: string, goal: string, maxHops: number): string[] | undefined {
  const queue: { id: string; path: string[] }[] = [{ id: start, path: [start] }];
  const seen = new Set<string>([start]);
  while (queue.length) {
    const cur = queue.shift();
    if (!cur) break;
    if (cur.path.length - 1 > maxHops) continue;
    if (cur.id === goal) return cur.path;
    for (const next of undirectedNeighbors(cur.id)) {
      if (seen.has(next.id)) continue;
      seen.add(next.id);
      queue.push({ id: next.id, path: [...cur.path, next.id] });
    }
  }
  return undefined;
}

export function route(a: string, b: string, opts?: { maxHops?: number }): DoctrineNode[] {
  const maxHops = opts?.maxHops ?? 4;
  for (const path of REQUIRED_PATHS) {
    const i = path.indexOf(a);
    const j = path.indexOf(b);
    if (i >= 0 && j >= 0) {
      const slice = i <= j ? path.slice(i, j + 1) : path.slice(j, i + 1).reverse();
      if (slice.length - 1 <= maxHops) {
        return slice.map((id) => getNode(id)).filter((node): node is DoctrineNode => Boolean(node));
      }
    }
  }
  const ids = bfs(a, b, maxHops);
  if (!ids) return [];
  return ids.map((id) => getNode(id)).filter((node): node is DoctrineNode => Boolean(node));
}

export function resolveQuery(query: string): DoctrineNode[] {
  const q = query.trim();
  if (!q) return [];
  const g = index();
  const asId = parseNodeId(q) ? g.nodes.get(q) : undefined;
  if (asId) return [asId];
  const compact = q.replace(/\s+/g, " ").toLowerCase();
  if (compact === "nicaea" || compact === "nicaea i" || compact === "first council of nicaea") {
    const nicaea = g.nodes.get("council:nicaea-i");
    if (nicaea) return [nicaea];
  }
  if (compact === "pastor aeternus") {
    const pastor = g.nodes.get("constitution:pastor-aeternus");
    if (pastor) return [pastor];
  }
  const ref = parseRef(q);
  if (ref) {
    const exact = g.nodes.get(scriptureIdFromRef(ref));
    const matches = [...g.nodes.values()].filter((node) => {
      if (node.kind !== "scripture") return false;
      const nodeRef = parseRef(node.title) ?? parseRef(node.artifact.bibleRefs?.[0] ?? "");
      if (nodeRef && refCoversVerse(nodeRef, ref)) return true;
      if (node.id === `scripture:${ref.token}.${ref.chapter}`) return true;
      return node.id === scriptureIdFromRef(ref);
    });
    const ranked = exact ? [exact, ...matches.filter((n) => n.id !== exact.id)] : matches;
    if (ranked.length) return ranked;
  }
  const lower = q.toLowerCase();
  const hits: DoctrineNode[] = [];
  for (const node of g.nodes.values()) {
    const hay = `${node.title} ${node.subtitle ?? ""} ${node.id}`.toLowerCase();
    if (hay.includes(lower)) hits.push(node);
    if (hits.length >= 12) break;
  }
  return hits;
}

export function nodeForArtifact(artifact: TimelineArtifact): DoctrineNode | undefined {
  const g = index();
  const aliasId = g.byAlias.get(artifact.id);
  if (aliasId) return g.nodes.get(aliasId);
  const ccc = cccParagraphNumber(artifact.title);
  if (ccc != null) return g.nodes.get(`ccc:${ccc}`);
  if (artifact.id.startsWith("day:")) return g.nodes.get(artifact.id);
  return undefined;
}

export function cluster(name: "today", date: Date): TimelineArtifact[] {
  if (name !== "today") return [];
  return todayBoard(date);
}

export { RAIL_CAP };
