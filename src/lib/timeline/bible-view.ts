import { bookMatchesSearch, countMatchingArtifacts, filterArtifacts } from "./search.ts";
import type { BibleBook, FilterId, PopulatedChapter } from "./types.ts";

/** Auto-expand matching books only when the result set is small enough to stay usable. */
export const AUTO_EXPAND_MATCH_LIMIT = 12;

export interface BibleBookMatch {
  book: BibleBook;
  hitCount: number;
  nameMatch: boolean;
}

export interface BibleBookRow extends BibleBookMatch {
  expanded: boolean;
}

export function countBookArtifactMatches(
  book: BibleBook,
  query: string,
  filter: FilterId,
): number {
  let count = 0;
  for (const chapter of book.populatedChapters) {
    count += countMatchingArtifacts(chapter.artifacts, query, filter);
  }
  return count;
}

export function matchingChaptersForBook(
  book: BibleBook,
  query: string,
  filter: FilterId,
): PopulatedChapter[] {
  const q = query.trim();
  if (!q && filter === "all") return book.populatedChapters;
  return book.populatedChapters
    .map((chapter) => ({
      ...chapter,
      artifacts: filterArtifacts(chapter.artifacts, query, filter),
    }))
    .filter((chapter) => chapter.artifacts.length > 0);
}

export function shouldAutoExpandBook(args: {
  userExpanded: boolean;
  nameMatch: boolean;
  queryActive: boolean;
  hitCount: number;
  autoExpandMatches: boolean;
}): boolean {
  if (args.userExpanded || args.nameMatch) return true;
  return args.queryActive && args.autoExpandMatches && args.hitCount > 0;
}

export function matchBibleBooks(
  books: readonly BibleBook[],
  query: string,
  filter: FilterId,
): BibleBookMatch[] {
  const q = query.trim();
  const queryActive = q.length > 0;
  const needsMatch = queryActive || filter !== "all";

  const matches: BibleBookMatch[] = [];
  for (const book of books) {
    const nameMatch = queryActive && bookMatchesSearch(book.name, book.abbreviation, query);
    const hitCount = needsMatch ? countBookArtifactMatches(book, query, filter) : 0;
    const hidden =
      (!queryActive && filter !== "all" && hitCount === 0) ||
      (queryActive && !nameMatch && hitCount === 0);
    if (hidden) continue;
    matches.push({ book, nameMatch, hitCount });
  }
  return matches;
}

export function applyBibleBookExpansion(
  matches: readonly BibleBookMatch[],
  query: string,
  expandedBooks: Record<string, boolean>,
): BibleBookRow[] {
  const queryActive = query.trim().length > 0;
  const matchCount = matches.filter(
    (row) => row.nameMatch || (queryActive && row.hitCount > 0),
  ).length;
  const autoExpandMatches =
    queryActive && matchCount > 0 && matchCount <= AUTO_EXPAND_MATCH_LIMIT;

  return matches.map((row) => ({
    ...row,
    expanded: shouldAutoExpandBook({
      userExpanded: Boolean(expandedBooks[row.book.name]),
      nameMatch: row.nameMatch,
      queryActive,
      hitCount: row.hitCount,
      autoExpandMatches,
    }),
  }));
}

export function planBibleBookRows(
  books: readonly BibleBook[],
  query: string,
  filter: FilterId,
  expandedBooks: Record<string, boolean>,
): BibleBookRow[] {
  return applyBibleBookExpansion(
    matchBibleBooks(books, query, filter),
    query,
    expandedBooks,
  );
}
