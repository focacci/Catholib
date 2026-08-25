export type ArtifactType =
  | "catechism"
  | "papal"
  | "haydock"
  | "artwork"
  | "event"
  | "pope"
  | "saint";

export type ViewMode = "bible" | "church";

export type FilterId = "all" | ArtifactType;

export interface TimelineArtifact {
  id: string;
  type: ArtifactType;
  title: string;
  subtitle?: string;
  shortQuote?: string;
  sourceUrl: string;
  bibleRefs?: string[];
  year?: number | string;
  imageUrl?: string;
  imageCredit?: string;
}

export interface PopulatedChapter {
  chapter: number;
  heading?: string;
  artifacts: TimelineArtifact[];
}

export interface BibleBook {
  name: string;
  abbreviation: string;
  testament: "OT" | "NT";
  chapters: number;
  populatedChapters: PopulatedChapter[];
}

export interface ChurchEntry {
  id: string;
  year: number | string;
  era?: string;
  title: string;
  artifacts: TimelineArtifact[];
}

export const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "catechism", label: "Catechism" },
  { id: "papal", label: "Papal" },
  { id: "haydock", label: "Haydock" },
  { id: "artwork", label: "Artwork" },
  { id: "event", label: "Event" },
  { id: "pope", label: "Pope" },
  { id: "saint", label: "Saint" },
];

export const ARTIFACT_LABEL: Record<ArtifactType, string> = {
  catechism: "Catechism",
  papal: "Papal",
  haydock: "Haydock",
  artwork: "Artwork",
  event: "Event",
  pope: "Pope",
  saint: "Saint",
};
