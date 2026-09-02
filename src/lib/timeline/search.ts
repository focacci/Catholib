import { BIBLE_BOOKS } from "./bible.ts";
import { getNode } from "../graph/api.ts";
import { parseRef, scriptureIdFromRef } from "../graph/parse-ref.ts";
import { cccParagraphFor } from "./ccc.ts";
import { CHURCH_ENTRIES } from "./church.ts";
import { missalSections } from "./missal.ts";
import { eventPlaceHaystack } from "./place.ts";
import { MISSAL_KIND_LABEL, VIEW_LABEL } from "./types.ts";
import type { FilterId, TimelineArtifact, ViewMode } from "./types.ts";

export const SEARCH_HIT_VIEW_ORDER: ViewMode[] = ["bible", "church", "missal"];

/** Hit counts in Bible → Church → Missal order, matching the view switcher. */
export function searchHitStripItems(counts: Record<ViewMode, number>): {
  id: ViewMode;
  label: string;
  count: number;
}[] {
  return SEARCH_HIT_VIEW_ORDER.map((id) => ({
    id,
    label: VIEW_LABEL[id],
    count: counts[id],
  }));
}

export interface SearchHit {
  id: string;
  view: ViewMode;
  artifact: TimelineArtifact;
  context: string;
  bookName?: string;
  chapter?: number;
  entryId?: string;
}

const haystackCache = new WeakMap<TimelineArtifact, string>();

function matchesQuery(text: string, q: string): boolean {
  return text.toLowerCase().includes(q);
}

function artifactHaystack(artifact: TimelineArtifact): string {
  const cached = haystackCache.get(artifact);
  if (cached) return cached;
  const hay = [
    artifact.title,
    artifact.subtitle ?? "",
    artifact.shortQuote ?? "",
    artifact.type === "catechism" ? (cccParagraphFor(artifact.title) ?? "") : "",
    artifact.imageCredit ?? "",
    eventPlaceHaystack(artifact.location),
    ...(artifact.bibleRefs ?? []),
    String(artifact.year ?? ""),
    artifact.type,
  ]
    .join(" ")
    .toLowerCase();
  haystackCache.set(artifact, hay);
  return hay;
}

function artifactMatches(a: TimelineArtifact, q: string, filter: FilterId): boolean {
  if (filter !== "all" && a.type !== filter) return false;
  if (!q) return true;
  return artifactHaystack(a).includes(q);
}

function includeArtifact(
  artifact: TimelineArtifact,
  q: string,
  filter: FilterId,
  sectionHit: boolean,
): boolean {
  if (filter !== "all" && artifact.type !== filter) return false;
  if (!q) return true;
  if (sectionHit) return true;
  return artifactMatches(artifact, q, "all");
}

export function collectHits(query: string, filter: FilterId): SearchHit[] {
  const q = query.trim().toLowerCase();
  const hits: SearchHit[] = [];
  if (!q && filter === "all") return hits;

  const ref = parseRef(query.trim());
  if (ref && (filter === "all" || filter === "event")) {
    const id = scriptureIdFromRef(ref);
    const node = getNode(id) ?? getNode(`scripture:${ref.token}.${ref.chapter}`);
    if (node) {
      hits.push({
        id: node.id,
        view: "bible",
        artifact: node.artifact,
        context: node.title,
        bookName: ref.bookName,
        chapter: ref.chapter,
      });
    }
  }

  for (const book of BIBLE_BOOKS) {
    const bookHit = Boolean(q) && matchesQuery(`${book.name} ${book.abbreviation}`, q);
    for (const ch of book.populatedChapters) {
      for (const a of ch.artifacts) {
        if (!includeArtifact(a, q, filter, bookHit)) continue;
        hits.push({
          id: a.id,
          view: "bible",
          artifact: a,
          context: `${book.name} ${ch.chapter}`,
          bookName: book.name,
          chapter: ch.chapter,
        });
      }
    }
  }

  for (const entry of CHURCH_ENTRIES) {
    const entryHit =
      Boolean(q) && matchesQuery(`${entry.title} ${entry.era ?? ""} ${entry.year}`, q);
    for (const a of entry.artifacts) {
      if (!includeArtifact(a, q, filter, entryHit)) continue;
      hits.push({
        id: a.id,
        view: "church",
        artifact: a,
        context: `${entry.year} · ${entry.title}`,
        entryId: entry.id,
      });
    }
  }

  for (const section of missalSections()) {
    const sectionHit =
      Boolean(q) &&
      matchesQuery(
        `${section.title} ${section.subtitle ?? ""} ${section.kind} ${MISSAL_KIND_LABEL[section.kind]}`,
        q,
      );
    for (const a of section.artifacts) {
      if (!includeArtifact(a, q, filter, sectionHit)) continue;
      hits.push({
        id: a.id,
        view: "missal",
        artifact: a,
        context: section.title,
        entryId: section.id,
      });
    }
  }

  return hits;
}

export function countHitsByView(query: string, filter: FilterId): Record<ViewMode, number> {
  const counts: Record<ViewMode, number> = { bible: 0, church: 0, missal: 0 };
  const q = query.trim().toLowerCase();
  if (!q && filter === "all") return counts;

  const ref = parseRef(query.trim());
  if (ref && (filter === "all" || filter === "event")) {
    const id = scriptureIdFromRef(ref);
    const node = getNode(id) ?? getNode(`scripture:${ref.token}.${ref.chapter}`);
    if (node) counts.bible += 1;
  }

  for (const book of BIBLE_BOOKS) {
    const bookHit = Boolean(q) && matchesQuery(`${book.name} ${book.abbreviation}`, q);
    for (const ch of book.populatedChapters) {
      for (const a of ch.artifacts) {
        if (includeArtifact(a, q, filter, bookHit)) counts.bible += 1;
      }
    }
  }

  for (const entry of CHURCH_ENTRIES) {
    const entryHit =
      Boolean(q) && matchesQuery(`${entry.title} ${entry.era ?? ""} ${entry.year}`, q);
    for (const a of entry.artifacts) {
      if (includeArtifact(a, q, filter, entryHit)) counts.church += 1;
    }
  }

  for (const section of missalSections()) {
    const sectionHit =
      Boolean(q) &&
      matchesQuery(
        `${section.title} ${section.subtitle ?? ""} ${section.kind} ${MISSAL_KIND_LABEL[section.kind]}`,
        q,
      );
    for (const a of section.artifacts) {
      if (includeArtifact(a, q, filter, sectionHit)) counts.missal += 1;
    }
  }

  return counts;
}

export function filterArtifacts(
  artifacts: TimelineArtifact[],
  query: string,
  filter: FilterId,
): TimelineArtifact[] {
  const q = query.trim().toLowerCase();
  return artifacts.filter((a) => artifactMatches(a, q, filter));
}

export function countMatchingArtifacts(
  artifacts: TimelineArtifact[],
  query: string,
  filter: FilterId,
): number {
  const q = query.trim().toLowerCase();
  let count = 0;
  for (const artifact of artifacts) {
    if (artifactMatches(artifact, q, filter)) count += 1;
  }
  return count;
}

/** Filter by type, then by query; if the section itself matches, keep the type-filtered list. */
export function sectionArtifactsForQuery(
  artifacts: TimelineArtifact[],
  query: string,
  filter: FilterId,
  sectionHaystack: string,
): TimelineArtifact[] {
  const q = query.trim().toLowerCase();
  const typed = artifacts.filter((a) => filter === "all" || a.type === filter);
  if (!q) return typed;
  const hits = typed.filter((a) => artifactMatches(a, q, "all"));
  if (hits.length > 0) return hits;
  if (matchesQuery(sectionHaystack, q)) return typed;
  return [];
}

export function bookMatchesSearch(name: string, abbreviation: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return matchesQuery(`${name} ${abbreviation}`, q);
}
