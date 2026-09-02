import { BIBLE_BOOKS, nabreChapterUrl } from "../timeline/bible.ts";
import { bibleVersionLinks } from "../timeline/bible-versions.ts";
import { CCC_PARAGRAPH, cccUrl } from "../timeline/ccc.ts";
import { CHURCH_ENTRIES } from "../timeline/church.ts";
import { missalSections } from "../timeline/missal.ts";
import type { ArtifactType, TimelineArtifact } from "../timeline/types.ts";
import { canonicalIdForArtifact, commentarySource, kindFromId } from "./canon.ts";
import { bookToken, parseRef, parseRefs, scriptureIdFromRef, chapterIdFromRef, bookIdFromRef, type ParsedRef } from "./parse-ref.ts";
import { rosaryDecadeArtifact, ROSARY_DECADES } from "./rosary-mysteries.ts";
import { CORE_EDGES, CORE_LOCATOR_REFS, CORE_NODES } from "./seeds-cores.ts";
import { BAPTISM_DV4_EDGES, BAPTISM_DV4_LOCATOR_REFS, BAPTISM_DV4_NODES } from "./seeds-baptism-dv4.ts";
import { GS_EDGES, GS_NODES } from "./seeds-gs.ts";
import {
  CONSTITUTION_NODES,
  COUNCIL_NODES,
  HIGH_VALUE_EDGES,
  LOCATOR_REFS,
  ONBOARDING_CORES,
  type SeedNode,
} from "./seeds.ts";
import { CCC_SCRIPTURE_EDGES } from "./seeds-ccc-scripture.ts";
import type { DoctrineNode, EdgeKind, GraphEdge, GraphIndex, NodeKind } from "./types.ts";
import { CITATION_KINDS } from "./types.ts";

function artifactFromSeed(seed: SeedNode): TimelineArtifact {
  return {
    id: seed.id.replace(/:/g, "-"),
    type: seed.type,
    title: seed.title,
    subtitle: seed.subtitle,
    sourceUrl: seed.sourceUrl,
    year: seed.year,
    bibleRefs: seed.bibleRefs,
  };
}

function cccArtifact(n: number): TimelineArtifact {
  const text = CCC_PARAGRAPH[n];
  return {
    id: `ccc-${n}`,
    type: "catechism",
    title: `CCC ${n}`,
    subtitle: text ? text.slice(0, 88).replace(/\s+/g, " ").trim() : undefined,
    sourceUrl: cccUrl(n),
    year: 1992,
  };
}

function scriptureChapterArtifact(bookName: string, token: string, chapter: number): TimelineArtifact {
  const versions = bibleVersionLinks(bookName, chapter)
    .map((v) => v.label)
    .join(" · ");
  return {
    id: `scripture-${token}-${chapter}`,
    type: "event",
    title: `${bookName} ${chapter}`,
    subtitle: versions,
    sourceUrl: nabreChapterUrl(bookName, chapter),
  };
}

function scriptureBookArtifact(bookName: string, token: string): TimelineArtifact {
  return {
    id: `scripture-${token}`,
    type: "event",
    title: bookName,
    subtitle: "Catholic canon",
    sourceUrl: nabreChapterUrl(bookName, 1),
  };
}

function scriptureVerseArtifact(id: string, parsed: ParsedRef): TimelineArtifact {
  return {
    id: id.replace(/:/g, "-"),
    type: "event",
    title: parsed.raw,
    subtitle: parsed.bookName,
    sourceUrl: nabreChapterUrl(parsed.bookName, parsed.chapter),
    bibleRefs: [parsed.raw],
  };
}

class Builder {
  nodes = new Map<string, DoctrineNode>();
  edges: GraphEdge[] = [];
  seenEdges = new Set<string>();
  byAlias = new Map<string, string>();

  rememberAlias(alias: string, id: string) {
    this.byAlias.set(alias, id);
  }

  addNode(partial: Omit<DoctrineNode, "aliases"> & { aliases?: string[] }): DoctrineNode {
    const existing = this.nodes.get(partial.id);
    if (existing) {
      if (partial.artifact && !existing.aliases.includes(partial.artifact.id)) {
        existing.aliases.push(partial.artifact.id);
        this.rememberAlias(partial.artifact.id, existing.id);
      }
      if (!existing.bibleRefs?.length && partial.bibleRefs?.length) {
        existing.bibleRefs = partial.bibleRefs;
      }
      return existing;
    }
    const node: DoctrineNode = {
      ...partial,
      aliases: partial.aliases ?? (partial.artifact ? [partial.artifact.id] : []),
    };
    this.nodes.set(node.id, node);
    this.rememberAlias(node.id, node.id);
    for (const alias of node.aliases) this.rememberAlias(alias, node.id);
    if (node.artifact) this.rememberAlias(node.artifact.id, node.id);
    return node;
  }

  addArtifact(artifact: TimelineArtifact, id: string, kind: NodeKind, lens?: DoctrineNode["lens"]) {
    return this.addNode({
      id,
      kind,
      title: artifact.title,
      subtitle: artifact.subtitle,
      sourceUrl: artifact.sourceUrl,
      year: artifact.year,
      bibleRefs: artifact.bibleRefs,
      artifact,
      lens,
    });
  }

  addEdge(from: string, to: string, kind: EdgeKind) {
    if (!from || !to || from === to) return;
    const key = `${kind}:${from}->${to}`;
    if (this.seenEdges.has(key)) return;
    this.seenEdges.add(key);
    this.edges.push({ id: key, from, to, kind });
  }

  cite(from: string, to: string, kind: EdgeKind) {
    this.addEdge(from, to, kind);
    const chapter = to.match(/^(scripture:[a-z0-9]+\.\d+)/);
    if (chapter && chapter[1] !== to) this.addEdge(from, chapter[1], kind);
  }

  ensureScriptureRef(raw: string): string | undefined {
    const parsed = parseRef(raw);
    if (!parsed) return undefined;
    const bookId = bookIdFromRef(parsed);
    const chapterId = chapterIdFromRef(parsed);
    const verseId = scriptureIdFromRef(parsed);
    if (!this.nodes.has(bookId)) {
      this.addArtifact(
        scriptureBookArtifact(parsed.bookName, parsed.token),
        bookId,
        "scripture",
        "bible",
      );
    }
    if (!this.nodes.has(chapterId)) {
      this.addArtifact(
        scriptureChapterArtifact(parsed.bookName, parsed.token, parsed.chapter),
        chapterId,
        "scripture",
        "bible",
      );
    }
    this.addEdge(bookId, chapterId, "contains");
    if (verseId !== chapterId) {
      if (!this.nodes.has(verseId)) {
        this.addArtifact(scriptureVerseArtifact(verseId, parsed), verseId, "scripture", "bible");
      }
      this.addEdge(chapterId, verseId, "contains");
      if (parsed.endChapter && parsed.endChapter !== parsed.chapter) {
        const endChapter = `scripture:${parsed.token}.${parsed.endChapter}`;
        if (!this.nodes.has(endChapter)) {
          this.addArtifact(
            scriptureChapterArtifact(parsed.bookName, parsed.token, parsed.endChapter),
            endChapter,
            "scripture",
            "bible",
          );
        }
        this.addEdge(bookId, endChapter, "contains");
      }
    }
    return verseId;
  }
}

function collectArtifacts(): { artifact: TimelineArtifact; entryId?: string; lens: DoctrineNode["lens"] }[] {
  const rows: { artifact: TimelineArtifact; entryId?: string; lens: DoctrineNode["lens"] }[] = [];
  for (const book of BIBLE_BOOKS) {
    for (const ch of book.populatedChapters) {
      for (const artifact of ch.artifacts) {
        rows.push({ artifact, lens: "bible" });
      }
    }
  }
  for (const entry of CHURCH_ENTRIES) {
    for (const artifact of entry.artifacts) {
      rows.push({ artifact, entryId: entry.id, lens: "church" });
    }
  }
  for (const section of missalSections(new Date("2026-01-01T12:00:00"))) {
    for (const artifact of section.artifacts) {
      rows.push({ artifact, lens: "missal" });
    }
  }
  return rows;
}

export function compileGraph(): GraphIndex {
  const b = new Builder();

  for (const book of BIBLE_BOOKS) {
    const token = bookToken(book.name);
    if (!token) continue;
    const bookId = `scripture:${token}`;
    b.addArtifact(scriptureBookArtifact(book.name, token), bookId, "scripture", "bible");
    for (let n = 1; n <= book.chapters; n++) {
      const chapterId = `scripture:${token}.${n}`;
      b.addArtifact(scriptureChapterArtifact(book.name, token, n), chapterId, "scripture", "bible");
      b.addEdge(bookId, chapterId, "contains");
    }
  }

  for (const n of Object.keys(CCC_PARAGRAPH).map(Number)) {
    b.addArtifact(cccArtifact(n), `ccc:${n}`, "ccc");
  }

  for (const seed of [...COUNCIL_NODES, ...CONSTITUTION_NODES, ...CORE_NODES, ...BAPTISM_DV4_NODES]) {
    b.addArtifact(artifactFromSeed(seed), seed.id, kindFromId(seed.id), "church");
    for (const raw of seed.bibleRefs ?? []) b.ensureScriptureRef(raw);
  }

  for (const seed of GS_NODES) {
    b.addArtifact(artifactFromSeed(seed), seed.id, kindFromId(seed.id), "church");
    for (const raw of seed.bibleRefs ?? []) b.ensureScriptureRef(raw);
  }

  for (const spec of ROSARY_DECADES) {
    const artifact = rosaryDecadeArtifact(spec);
    b.addArtifact(artifact, spec.id, "rosary", "missal");
    const setId = `rosary:${spec.mystery}`;
    if (!b.nodes.has(setId)) {
      b.addArtifact(
        {
          id: `rosary-${spec.mystery}`,
          type: "rosary",
          title: `${spec.mystery[0].toUpperCase()}${spec.mystery.slice(1)} Mysteries`,
          subtitle: "Scripturally based",
          sourceUrl: artifact.sourceUrl,
        },
        setId,
        "rosary",
        "missal",
      );
    }
    b.addEdge(setId, spec.id, "contains");
    b.addEdge(setId, spec.id, "observes");
    for (const raw of spec.bibleRefs) {
      const sid = b.ensureScriptureRef(raw);
      if (sid) b.cite(spec.id, sid, "cites");
    }
  }

  for (const core of ONBOARDING_CORES) {
    const artifact: TimelineArtifact = {
      id: core.id.replace(":", "-"),
      type: "catechism",
      title: core.title,
      subtitle: core.subtitle,
      sourceUrl: cccUrl(core.ccc),
      year: 1992,
    };
    b.addArtifact(artifact, core.id, "core");
    b.addEdge(core.id, `ccc:${core.ccc}`, "defines");
    for (const target of core.cites) b.addEdge(core.id, target, "cites");
  }

  for (const raw of [...LOCATOR_REFS, ...CORE_LOCATOR_REFS, ...BAPTISM_DV4_LOCATOR_REFS]) b.ensureScriptureRef(raw);

  for (const { artifact, entryId, lens } of collectArtifacts()) {
    const id = canonicalIdForArtifact(artifact, entryId);
    const kind = kindFromId(id);
    b.addArtifact(artifact, id, kind, lens);
    const refs = parseRefs(artifact.bibleRefs);
    for (const ref of refs) {
      const sid = b.ensureScriptureRef(ref.raw);
      if (!sid) continue;
      const source = commentarySource(artifact);
      if (source) b.cite(id, sid, "comments");
      else if (artifact.type === "artwork") b.cite(id, sid, "depicts");
      else b.cite(id, sid, "cites");
    }
  }

  for (const edge of [...HIGH_VALUE_EDGES, ...CORE_EDGES]) {
    b.cite(edge.from, edge.to, edge.kind);
  }

  for (const edge of GS_EDGES) {
    b.cite(edge.from, edge.to, edge.kind);
  }

  for (const edge of CCC_SCRIPTURE_EDGES) {
    const sid = b.ensureScriptureRef(edge.ref);
    if (sid) b.cite(edge.from, sid, "cites");
  }

  for (const edge of BAPTISM_DV4_EDGES) {
    b.cite(edge.from, edge.to, edge.kind);
  }

  const outgoing = new Map<string, GraphEdge[]>();
  const incoming = new Map<string, GraphEdge[]>();
  for (const edge of b.edges) {
    if (!b.nodes.has(edge.from) || !b.nodes.has(edge.to)) continue;
    const o = outgoing.get(edge.from) ?? [];
    o.push(edge);
    outgoing.set(edge.from, o);
    const i = incoming.get(edge.to) ?? [];
    i.push(edge);
    incoming.set(edge.to, i);
  }

  return {
    nodes: b.nodes,
    edges: b.edges.filter((e) => b.nodes.has(e.from) && b.nodes.has(e.to)),
    outgoing,
    incoming,
    byAlias: b.byAlias,
  };
}

export function upsertNode(node: DoctrineNode): DoctrineNode {
  const g = graph();
  const existing = g.nodes.get(node.id);
  if (existing) {
    if (node.artifact && !existing.aliases.includes(node.artifact.id)) {
      existing.aliases.push(node.artifact.id);
      g.byAlias.set(node.artifact.id, existing.id);
    }
    return existing;
  }
  g.nodes.set(node.id, node);
  g.byAlias.set(node.id, node.id);
  if (node.artifact) g.byAlias.set(node.artifact.id, node.id);
  for (const alias of node.aliases) g.byAlias.set(alias, node.id);
  return node;
}

export function upsertEdge(from: string, to: string, kind: EdgeKind): void {
  const g = graph();
  if (!from || !to || from === to) return;
  if (!g.nodes.has(from) || !g.nodes.has(to)) return;
  const id = `${kind}:${from}->${to}`;
  if (g.edges.some((edge) => edge.id === id)) return;
  const edge: GraphEdge = { id, from, to, kind };
  g.edges.push(edge);
  const outgoing = g.outgoing.get(from) ?? [];
  outgoing.push(edge);
  g.outgoing.set(from, outgoing);
  const incoming = g.incoming.get(to) ?? [];
  incoming.push(edge);
  g.incoming.set(to, incoming);
}

let cached: GraphIndex | undefined;

export function graph(): GraphIndex {
  if (!cached) cached = compileGraph();
  return cached;
}

export function resetGraph(): void {
  cached = undefined;
}

export function isCitation(kind: EdgeKind): boolean {
  return (CITATION_KINDS as readonly string[]).includes(kind);
}

export function nodeTypeForKind(kind: NodeKind): ArtifactType {
  if (kind === "ccc" || kind === "core") return "catechism";
  if (kind === "constitution" || kind === "encyclical") return "papal";
  if (kind === "commentary") return "commentary";
  if (kind === "artwork") return "artwork";
  if (kind === "person") return "saint";
  if (kind === "rosary") return "rosary";
  if (kind === "ordo") return "ordo";
  if (kind === "proper" || kind === "day") return "proper";
  return "event";
}
