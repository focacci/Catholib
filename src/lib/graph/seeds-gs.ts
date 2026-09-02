import { GAUDIUM_ET_SPES_URL, type SeedEdge, type SeedNode } from "./seeds.ts";

/**
 * Sentence-level Gaudium et Spes locators on the onboarding spine.
 * Reuse the confirmed vatican.va constitution URL. Titles only, no doctrinal paraphrase.
 * Dropped GS 49 / 51 / 52: no parseable named verse in the official body.
 */
export const GS_NODES: SeedNode[] = [
  {
    id: "constitution:gaudium-et-spes.12",
    title: "Gaudium et Spes 12",
    subtitle: "Second Vatican Council — the image of God",
    sourceUrl: GAUDIUM_ET_SPES_URL,
    year: 1965,
    type: "papal",
    bibleRefs: ["Gn 1:27"],
  },
  {
    id: "constitution:gaudium-et-spes.22",
    title: "Gaudium et Spes 22",
    subtitle: "Second Vatican Council — Christ the new man",
    sourceUrl: GAUDIUM_ET_SPES_URL,
    year: 1965,
    type: "papal",
    bibleRefs: ["Col 1:15"],
  },
  {
    id: "constitution:gaudium-et-spes.24",
    title: "Gaudium et Spes 24",
    subtitle: "Second Vatican Council — the person in society",
    sourceUrl: GAUDIUM_ET_SPES_URL,
    year: 1965,
    type: "papal",
    bibleRefs: ["Acts 17:26"],
  },
  {
    id: "constitution:gaudium-et-spes.47",
    title: "Gaudium et Spes 47",
    subtitle: "Second Vatican Council — marriage and family",
    sourceUrl: GAUDIUM_ET_SPES_URL,
    year: 1965,
    type: "papal",
  },
  {
    id: "constitution:gaudium-et-spes.48",
    title: "Gaudium et Spes 48",
    subtitle: "Second Vatican Council — the author of marriage",
    sourceUrl: GAUDIUM_ET_SPES_URL,
    year: 1965,
    type: "papal",
  },
  {
    id: "constitution:gaudium-et-spes.50",
    title: "Gaudium et Spes 50",
    subtitle: "Second Vatican Council — the gift of children",
    sourceUrl: GAUDIUM_ET_SPES_URL,
    year: 1965,
    type: "papal",
    bibleRefs: ["Gn 2:18"],
  },
];

/** Citation edges: GS locators, CCC 356 / 1701 / 1603, Humanae Vitae, named verses. */
export const GS_EDGES: SeedEdge[] = [
  { from: "constitution:gaudium-et-spes", to: "constitution:gaudium-et-spes.12", kind: "defines" },
  { from: "constitution:gaudium-et-spes", to: "constitution:gaudium-et-spes.22", kind: "defines" },
  { from: "constitution:gaudium-et-spes", to: "constitution:gaudium-et-spes.24", kind: "defines" },
  { from: "constitution:gaudium-et-spes", to: "constitution:gaudium-et-spes.47", kind: "defines" },
  { from: "constitution:gaudium-et-spes", to: "constitution:gaudium-et-spes.48", kind: "defines" },
  { from: "constitution:gaudium-et-spes", to: "constitution:gaudium-et-spes.50", kind: "defines" },

  { from: "ccc:356", to: "constitution:gaudium-et-spes.12", kind: "cites" },
  { from: "constitution:gaudium-et-spes.12", to: "scripture:gn.1.27", kind: "cites" },

  { from: "ccc:1701", to: "constitution:gaudium-et-spes.22", kind: "cites" },
  { from: "ccc:1701", to: "scripture:col.1.15", kind: "cites" },
  { from: "constitution:gaudium-et-spes.22", to: "scripture:col.1.15", kind: "cites" },

  { from: "ccc:356", to: "constitution:gaudium-et-spes.24", kind: "cites" },
  { from: "constitution:gaudium-et-spes.24", to: "scripture:acts.17.26", kind: "cites" },

  { from: "ccc:1603", to: "constitution:gaudium-et-spes.47", kind: "cites" },
  { from: "ccc:1603", to: "constitution:gaudium-et-spes.48", kind: "cites" },
  { from: "constitution:gaudium-et-spes.50", to: "scripture:gn.2.18", kind: "cites" },

  { from: "encyclical:humanae-vitae", to: "constitution:gaudium-et-spes.50", kind: "cites" },
  { from: "encyclical:humanae-vitae", to: "constitution:gaudium-et-spes.48", kind: "cites" },
  { from: "encyclical:humanae-vitae", to: "ccc:1603", kind: "cites" },
];

export interface GsWalk {
  from: string;
  to: string;
}

/** GS locator → CCC or a named verse in ≤4 hops. */
export const GS_WALKS: GsWalk[] = [
  { from: "constitution:gaudium-et-spes.12", to: "ccc:356" },
  { from: "constitution:gaudium-et-spes.12", to: "scripture:gn.1.27" },
  { from: "constitution:gaudium-et-spes.22", to: "ccc:1701" },
  { from: "constitution:gaudium-et-spes.22", to: "scripture:col.1.15" },
  { from: "constitution:gaudium-et-spes.24", to: "ccc:356" },
  { from: "constitution:gaudium-et-spes.24", to: "scripture:acts.17.26" },
  { from: "constitution:gaudium-et-spes.47", to: "ccc:1603" },
  { from: "constitution:gaudium-et-spes.48", to: "ccc:1603" },
  { from: "constitution:gaudium-et-spes.50", to: "scripture:gn.2.18" },
  { from: "encyclical:humanae-vitae", to: "ccc:1603" },
  { from: "encyclical:humanae-vitae", to: "constitution:gaudium-et-spes.50" },
];
