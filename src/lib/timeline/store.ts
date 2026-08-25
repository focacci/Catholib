import { create } from "zustand";
import type { FilterId, TimelineArtifact, ViewMode } from "./types";

interface TimelineState {
  view: ViewMode;
  filter: FilterId;
  query: string;
  selected: TimelineArtifact | null;
  aboutOpen: boolean;
  expandedBooks: Record<string, boolean>;
  setView: (view: ViewMode) => void;
  setFilter: (filter: FilterId) => void;
  setQuery: (query: string) => void;
  openArtifact: (artifact: TimelineArtifact) => void;
  closeArtifact: () => void;
  setAboutOpen: (open: boolean) => void;
  toggleBook: (name: string) => void;
  expandBook: (name: string, open?: boolean) => void;
}

const DEFAULT_EXPANDED: Record<string, boolean> = {
  Genesis: true,
};

export const useTimeline = create<TimelineState>((set) => ({
  view: "bible",
  filter: "all",
  query: "",
  selected: null,
  aboutOpen: false,
  expandedBooks: DEFAULT_EXPANDED,
  setView: (view) => set({ view, filter: "all" }),
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
      expandedBooks: { ...s.expandedBooks, [name]: open },
    })),
}));
