import { BIBLE_BOOKS } from "./bible";
import { CHURCH_ENTRIES } from "./church";
import { missalSections } from "./missal";
import { MISSAL_KIND_LABEL } from "./types";
import type { FilterId, TimelineArtifact, ViewMode } from "./types";

export interface SearchHit {
  id: string;
  view: ViewMode;
  artifact: TimelineArtifact;
  context: string;
  bookName?: string;
  chapter?: number;
  entryId?: string;
}

function matchesQuery(text: string, q: string): boolean {
  return text.toLowerCase().includes(q);
}

function artifactMatches(a: TimelineArtifact, q: string, filter: FilterId): boolean {
  if (filter !== "all" && a.type !== filter) return false;
  if (!q) return true;
  const hay = [
    a.title,
    a.subtitle ?? "",
    a.shortQuote ?? "",
    a.imageCredit ?? "",
    ...(a.bibleRefs ?? []),
    String(a.year ?? ""),
    a.type,
  ]
    .join(" ")
    .toLowerCase();
  return matchesQuery(hay, q);
}

export function collectHits(query: string, filter: FilterId): SearchHit[] {
  const q = query.trim().toLowerCase();
  const hits: SearchHit[] = [];

  for (const book of BIBLE_BOOKS) {
    const bookHit = Boolean(q) && matchesQuery(`${book.name} ${book.abbreviation}`, q);
    for (const ch of book.populatedChapters) {
      for (const a of ch.artifacts) {
        if (filter !== "all" && a.type !== filter) continue;
        if (q && !bookHit && !artifactMatches(a, q, filter)) continue;
        if (!q && filter === "all") continue;
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
      Boolean(q) &&
      matchesQuery(`${entry.title} ${entry.era ?? ""} ${entry.year}`, q);
    for (const a of entry.artifacts) {
      if (filter !== "all" && a.type !== filter) continue;
      if (q && !entryHit && !artifactMatches(a, q, filter)) continue;
      if (!q && filter === "all") continue;
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
      if (filter !== "all" && a.type !== filter) continue;
      if (q && !sectionHit && !artifactMatches(a, q, filter)) continue;
      if (!q && filter === "all") continue;
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

export function filterArtifacts(
  artifacts: TimelineArtifact[],
  query: string,
  filter: FilterId,
): TimelineArtifact[] {
  const q = query.trim().toLowerCase();
  return artifacts.filter((a) => artifactMatches(a, q, filter));
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

export function bookMatchesSearch(
  name: string,
  abbreviation: string,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return matchesQuery(`${name} ${abbreviation}`, q);
}
