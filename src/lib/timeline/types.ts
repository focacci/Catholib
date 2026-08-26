export type ArtifactType =
  | "catechism"
  | "papal"
  | "haydock"
  | "artwork"
  | "event"
  | "pope"
  | "saint"
  | "ordo"
  | "proper"
  | "votive";

export type ViewMode = "bible" | "church" | "missal";

export type FilterId = "all" | ArtifactType;

export type MissalSectionKind =
  | "today"
  | "ordo"
  | "temporale"
  | "sanctorale"
  | "common"
  | "votive";

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

export interface MissalSection {
  id: string;
  kind: MissalSectionKind;
  title: string;
  subtitle?: string;
  artifacts: TimelineArtifact[];
}

export type FilterChip = { id: FilterId; label: string };

export const VIEW_FILTERS: Record<ViewMode, FilterChip[]> = {
  bible: [
    { id: "all", label: "All" },
    { id: "catechism", label: "Catechism" },
    { id: "papal", label: "Papal" },
    { id: "haydock", label: "Haydock" },
    { id: "artwork", label: "Artwork" },
  ],
  church: [
    { id: "all", label: "All" },
    { id: "event", label: "Event" },
    { id: "pope", label: "Pope" },
    { id: "saint", label: "Saint" },
    { id: "catechism", label: "Catechism" },
    { id: "papal", label: "Papal" },
    { id: "artwork", label: "Artwork" },
  ],
  missal: [
    { id: "all", label: "All" },
    { id: "ordo", label: "Ordo" },
    { id: "proper", label: "Proper" },
    { id: "votive", label: "Votive" },
  ],
};

export const FILTERS: FilterChip[] = [
  { id: "all", label: "All" },
  { id: "catechism", label: "Catechism" },
  { id: "papal", label: "Papal" },
  { id: "haydock", label: "Haydock" },
  { id: "artwork", label: "Artwork" },
  { id: "event", label: "Event" },
  { id: "pope", label: "Pope" },
  { id: "saint", label: "Saint" },
  { id: "ordo", label: "Ordo" },
  { id: "proper", label: "Proper" },
  { id: "votive", label: "Votive" },
];

export const ARTIFACT_LABEL: Record<ArtifactType, string> = {
  catechism: "Catechism",
  papal: "Papal",
  haydock: "Haydock",
  artwork: "Artwork",
  event: "Event",
  pope: "Pope",
  saint: "Saint",
  ordo: "Ordo",
  proper: "Proper",
  votive: "Votive",
};

export const VIEW_LABEL: Record<ViewMode, string> = {
  bible: "Bible",
  church: "Church",
  missal: "Missal",
};

export const MISSAL_KIND_LABEL: Record<MissalSectionKind, string> = {
  today: "Today",
  ordo: "Ordo",
  temporale: "Temporale",
  sanctorale: "Sanctorale",
  common: "Commons",
  votive: "Votives",
};
