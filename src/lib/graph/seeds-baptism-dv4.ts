import {
  DEI_VERBUM_URL,
  LUMEN_GENTIUM_URL,
  type SeedEdge,
  type SeedNode,
} from "./seeds.ts";

/**
 * Baptism as the sacrament (CCC 1213) plus Dei Verbum 4 as a sentence-level locator.
 * Confirmed vatican.va URLs only; titles, no doctrinal paraphrase.
 * Do not reuse constitution:dei-verbum.8 (Tradition).
 */
export const BAPTISM_DV4_NODES: SeedNode[] = [
  {
    id: "constitution:dei-verbum.4",
    title: "Dei Verbum 4",
    subtitle: "Second Vatican Council — the eternal Word",
    sourceUrl: DEI_VERBUM_URL,
    year: 1965,
    type: "papal",
    bibleRefs: ["Jn 1:1–18"],
  },
  {
    id: "constitution:lumen-gentium.11",
    title: "Lumen Gentium 11",
    subtitle: "Second Vatican Council — Baptism",
    sourceUrl: LUMEN_GENTIUM_URL,
    year: 1964,
    type: "papal",
  },
];

export const BAPTISM_DV4_LOCATOR_REFS = ["Rom 6:3–4"];

export const BAPTISM_DV4_EDGES: SeedEdge[] = [
  { from: "constitution:dei-verbum", to: "constitution:dei-verbum.4", kind: "defines" },
  { from: "ccc:241", to: "constitution:dei-verbum.4", kind: "cites" },
  { from: "constitution:dei-verbum.4", to: "scripture:jn.1.1-18", kind: "cites" },

  { from: "constitution:lumen-gentium", to: "constitution:lumen-gentium.11", kind: "defines" },
  { from: "ccc:1213", to: "scripture:rom.6.3-4", kind: "cites" },
  { from: "ccc:1213", to: "scripture:mt.28.19-20", kind: "cites" },
  { from: "ccc:1213", to: "constitution:lumen-gentium.11", kind: "cites" },
];
