import { type SeedEdge, type SeedNode } from "./seeds.ts";

/**
 * Apostolic constitutions defining the Immaculate Conception and the Assumption.
 * Titles and dates only; no doctrinal paraphrase.
 *
 * Ineffabilis Deus English vatican.va twin returns 200 but is a chrome stub
 * (no constitution text). Italian GET 200 includes the document, including Gn 3:15.
 * Munificentissimus Deus English GET 200 includes the document, including 1 Cor 15:54.
 */
export const INEFFABILIS_DEUS_URL =
  "https://www.vatican.va/content/pius-ix/it/documents/18541208-costituzione-apostolica-ineffabilis-deus.html";

export const MUNIFICENTISSIMUS_DEUS_URL =
  "https://www.vatican.va/content/pius-xii/en/apost_constitutions/documents/hf_p-xii_apc_19501101_munificentissimus-deus.html";

export const PIUS_XII_URL = "https://www.vatican.va/content/pius-xii/en.html";

export const MARIAN_CONSTITUTION_NODES: SeedNode[] = [
  {
    id: "constitution:ineffabilis-deus",
    title: "Ineffabilis Deus",
    subtitle: "Pius IX — 8 December 1854",
    sourceUrl: INEFFABILIS_DEUS_URL,
    year: 1854,
    type: "papal",
    bibleRefs: ["Gn 3:15"],
  },
  {
    id: "constitution:munificentissimus-deus",
    title: "Munificentissimus Deus",
    subtitle: "Pius XII — 1 November 1950",
    sourceUrl: MUNIFICENTISSIMUS_DEUS_URL,
    year: 1950,
    type: "papal",
    bibleRefs: ["1 Cor 15:54"],
  },
  {
    id: "person:pius-xii",
    title: "Pope Pius XII",
    subtitle: "Pope — 1939–1958",
    sourceUrl: PIUS_XII_URL,
    year: 1958,
    type: "papal",
  },
  {
    id: "event:immaculate",
    title: "Definition of the Immaculate Conception",
    subtitle: "Pius IX, 8 December 1854",
    sourceUrl: INEFFABILIS_DEUS_URL,
    year: 1854,
    type: "event",
  },
  {
    id: "event:assumption",
    title: "Definition of the Assumption",
    subtitle: "Pius XII, 1 November 1950",
    sourceUrl: MUNIFICENTISSIMUS_DEUS_URL,
    year: 1950,
    type: "event",
  },
];

export const MARIAN_CONSTITUTION_EDGES: SeedEdge[] = [
  { from: "event:immaculate", to: "ccc:491", kind: "cites" },
  { from: "ccc:491", to: "constitution:ineffabilis-deus", kind: "cites" },
  { from: "constitution:ineffabilis-deus", to: "ccc:491", kind: "defines" },
  { from: "constitution:ineffabilis-deus", to: "scripture:gn.3.15", kind: "cites" },
  { from: "person:pius-ix", to: "constitution:ineffabilis-deus", kind: "defines" },

  { from: "event:assumption", to: "ccc:966", kind: "cites" },
  { from: "ccc:966", to: "constitution:munificentissimus-deus", kind: "cites" },
  { from: "constitution:munificentissimus-deus", to: "ccc:966", kind: "defines" },
  { from: "constitution:munificentissimus-deus", to: "scripture:1cor.15.54", kind: "cites" },
  { from: "person:pius-xii", to: "constitution:munificentissimus-deus", kind: "defines" },
];

export interface MarianConstitutionWalk {
  from: string;
  to: string;
  via: string[];
  constitution: string;
  issuer: string;
}

export const MARIAN_CONSTITUTION_WALKS: MarianConstitutionWalk[] = [
  {
    from: "event:immaculate",
    to: "scripture:gn.3.15",
    via: ["ccc:491", "constitution:ineffabilis-deus"],
    constitution: "constitution:ineffabilis-deus",
    issuer: "person:pius-ix",
  },
  {
    from: "event:assumption",
    to: "scripture:1cor.15.54",
    via: ["ccc:966", "constitution:munificentissimus-deus"],
    constitution: "constitution:munificentissimus-deus",
    issuer: "person:pius-xii",
  },
];
