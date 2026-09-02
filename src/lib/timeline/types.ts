export type ArtifactType =
  | "catechism"
  | "papal"
  | "commentary"
  | "artwork"
  | "event"
  | "pope"
  | "saint"
  | "ordo"
  | "proper"
  | "votive"
  | "rosary";

export type ViewMode = "bible" | "church" | "missal";

export type FilterId = "all" | ArtifactType;

export type MissalSectionKind =
  | "today"
  | "ordo"
  | "temporale"
  | "sanctorale"
  | "common"
  | "votive";

/** Historic and present-day names for where an event took place. */
export interface EventPlace {
  /** Name and region as they were known at the time. */
  then: string;
  /** Present-day name and country. */
  now: string;
}

export interface TimelineArtifact {
  id: string;
  type: ArtifactType;
  title: string;
  subtitle?: string;
  shortQuote?: string;
  sourceUrl: string;
  bibleRefs?: string[];
  year?: number | string;
  /** Place where an event occurred, with historic and modern names. */
  location?: EventPlace;
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
    { id: "commentary", label: "Commentary" },
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
    { id: "rosary", label: "Rosary" },
  ],
};

export const FILTERS: FilterChip[] = [
  { id: "all", label: "All" },
  { id: "catechism", label: "Catechism" },
  { id: "papal", label: "Papal" },
  { id: "commentary", label: "Commentary" },
  { id: "artwork", label: "Artwork" },
  { id: "event", label: "Event" },
  { id: "pope", label: "Pope" },
  { id: "saint", label: "Saint" },
  { id: "ordo", label: "Ordo" },
  { id: "proper", label: "Proper" },
  { id: "votive", label: "Votive" },
  { id: "rosary", label: "Rosary" },
];

export const ARTIFACT_LABEL: Record<ArtifactType, string> = {
  catechism: "Catechism",
  papal: "Papal",
  commentary: "Commentary",
  artwork: "Artwork",
  event: "Event",
  pope: "Pope",
  saint: "Saint",
  ordo: "Ordo",
  proper: "Proper",
  votive: "Votive",
  rosary: "Rosary",
};

export const VIEW_LABEL: Record<ViewMode, string> = {
  bible: "Bible",
  church: "Church",
  missal: "Today",
};

export const MISSAL_KIND_LABEL: Record<MissalSectionKind, string> = {
  today: "Today",
  ordo: "Ordo",
  temporale: "Temporale",
  sanctorale: "Sanctorale",
  common: "Commons",
  votive: "Votives",
};
