import { BIBLE_BOOKS } from "./bible.ts";
import { CHURCH_ENTRIES } from "./church.ts";
import { missalSections } from "./missal.ts";
import type { ViewMode } from "./types.ts";

export interface ArtworkCatalog {
  bibleByBook: Record<string, string[]>;
  bible: string[];
  church: string[];
  missal: string[];
}

function uniqueUrls(artifacts: { imageUrl?: string }[]): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const artifact of artifacts) {
    const url = artifact.imageUrl;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }
  return urls;
}

function pushUnique(out: string[], seen: Set<string>, urls: string[]) {
  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
}

export function collectArtworkCatalog(): ArtworkCatalog {
  const bibleByBook: Record<string, string[]> = {};
  const bible: string[] = [];
  const bibleSeen = new Set<string>();
  for (const book of BIBLE_BOOKS) {
    const urls = uniqueUrls(book.populatedChapters.flatMap((ch) => ch.artifacts));
    bibleByBook[book.name] = urls;
    pushUnique(bible, bibleSeen, urls);
  }
  return {
    bibleByBook,
    bible,
    church: uniqueUrls(CHURCH_ENTRIES.flatMap((entry) => entry.artifacts)),
    missal: uniqueUrls(missalSections().flatMap((section) => section.artifacts)),
  };
}

/** Current view and open books first so those files are in cache before a fast scroll. */
export function orderArtworkForView(
  catalog: ArtworkCatalog,
  view: ViewMode,
  expandedBooks: Record<string, boolean>,
): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  if (view === "bible") {
    for (const [name, open] of Object.entries(expandedBooks)) {
      if (open) pushUnique(ordered, seen, catalog.bibleByBook[name] ?? []);
    }
    pushUnique(ordered, seen, catalog.bible);
  } else if (view === "church") {
    pushUnique(ordered, seen, catalog.church);
  } else {
    pushUnique(ordered, seen, catalog.missal);
  }
  pushUnique(ordered, seen, catalog.bible);
  pushUnique(ordered, seen, catalog.church);
  pushUnique(ordered, seen, catalog.missal);
  return ordered;
}
