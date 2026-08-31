import { create } from "zustand";
import { BIBLE_BOOKS } from "./bible.ts";
import { CHURCH_ERA_NAMES } from "./church-view.ts";
import type { FilterId, TimelineArtifact, ViewMode } from "./types.ts";

interface TimelineState {
  view: ViewMode;
  filter: FilterId;
  query: string;
  selected: TimelineArtifact | null;
  aboutOpen: boolean;
  expandedBooks: Record<string, boolean>;
  expandedEras: Record<string, boolean>;
  setView: (view: ViewMode) => void;
  setFilter: (filter: FilterId) => void;
  setQuery: (query: string) => void;
  openArtifact: (artifact: TimelineArtifact) => void;
  closeArtifact: () => void;
  setAboutOpen: (open: boolean) => void;
  toggleBook: (name: string) => void;
  expandBook: (name: string, open?: boolean) => void;
  expandAllBooks: () => void;
  collapseAllBooks: () => void;
  toggleEra: (name: string) => void;
  expandEra: (name: string, open?: boolean) => void;
  expandAllEras: () => void;
  collapseAllEras: () => void;
}

const BOOK_NAMES = BIBLE_BOOKS.map((book) => book.name);

const DEFAULT_EXPANDED: Record<string, boolean> = {
  Genesis: true,
};

/** Opening a book from Jump to… replaces the map so two large books are not mounted at once. */
export function nextExpandedBooks(
  current: Record<string, boolean>,
  name: string,
  open: boolean,
): Record<string, boolean> {
  if (open) return { [name]: true };
  return { ...current, [name]: false };
}

export function mapAllBooks(
  names: readonly string[],
  open: boolean,
): Record<string, boolean> {
  const next: Record<string, boolean> = {};
  for (const name of names) next[name] = open;
  return next;
}

export function areAllBooksExpanded(
  expanded: Record<string, boolean>,
  names: readonly string[] = BOOK_NAMES,
): boolean {
  return names.length > 0 && names.every((name) => expanded[name]);
}

const DEFAULT_EXPANDED_ERAS = mapAllBooks(CHURCH_ERA_NAMES, true);

export const useTimeline = create<TimelineState>((set) => ({
  view: "bible",
  filter: "all",
  query: "",
  selected: null,
  aboutOpen: false,
  expandedBooks: DEFAULT_EXPANDED,
  expandedEras: DEFAULT_EXPANDED_ERAS,
  setView: (view) => set({ view, filter: "all", aboutOpen: false }),
  setFilter: (filter) => set({ filter }),
  setQuery: (query) => set({ query }),
  openArtifact: (artifact) => set({ selected: artifact }),
  closeArtifact: () => set({ selected: null }),
  setAboutOpen: (aboutOpen) => set({ aboutOpen }),
  toggleBook: (name) =>
    set((s) => ({
      expandedBooks: { ...s.expandedBooks, [name]: !s.expandedBooks[name] },
    })),
  expandBook: (name, open = true) =>
    set((s) => ({
      expandedBooks: nextExpandedBooks(s.expandedBooks, name, open),
    })),
  expandAllBooks: () => set({ expandedBooks: mapAllBooks(BOOK_NAMES, true) }),
  collapseAllBooks: () => set({ expandedBooks: mapAllBooks(BOOK_NAMES, false) }),
  toggleEra: (name) =>
    set((s) => ({
      expandedEras: { ...s.expandedEras, [name]: !s.expandedEras[name] },
    })),
  expandEra: (name, open = true) =>
    set((s) => ({
      expandedEras: { ...s.expandedEras, [name]: open },
    })),
  expandAllEras: () => set({ expandedEras: mapAllBooks(CHURCH_ERA_NAMES, true) }),
  collapseAllEras: () => set({ expandedEras: mapAllBooks(CHURCH_ERA_NAMES, false) }),
}));
