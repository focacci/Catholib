import {
  DEI_VERBUM_URL,
  LUMEN_GENTIUM_URL,
  SACROSANCTUM_URL,
  type SeedEdge,
  type SeedNode,
} from "./seeds.ts";

/**
 * Sentence-level constitution locators for the remaining onboarding cores.
 * Same confirmed vatican.va URLs as the parent constitutions; titles only, no doctrinal paraphrase.
 */
export const CORE_NODES: SeedNode[] = [
  {
    id: "constitution:dei-verbum.8",
    title: "Dei Verbum 8",
    subtitle: "Second Vatican Council — Sacred Tradition",
    sourceUrl: DEI_VERBUM_URL,
    year: 1965,
    type: "papal",
    bibleRefs: ["2 Thes 2:15"],
  },
  {
    id: "constitution:lumen-gentium.14",
    title: "Lumen Gentium 14",
    subtitle: "Second Vatican Council — the necessity of the Church",
    sourceUrl: LUMEN_GENTIUM_URL,
    year: 1964,
    type: "papal",
    bibleRefs: ["Mk 16:16"],
  },
  {
    id: "constitution:lumen-gentium.16",
    title: "Lumen Gentium 16",
    subtitle: "Second Vatican Council — those who have not yet received the Gospel",
    sourceUrl: LUMEN_GENTIUM_URL,
    year: 1964,
    type: "papal",
  },
  {
    id: "constitution:lumen-gentium.50",
    title: "Lumen Gentium 50",
    subtitle: "Second Vatican Council — communion of the whole Mystical Body",
    sourceUrl: LUMEN_GENTIUM_URL,
    year: 1964,
    type: "papal",
    bibleRefs: ["Rev 7:9–14"],
  },
  {
    id: "constitution:sacrosanctum-concilium.106",
    title: "Sacrosanctum Concilium 106",
    subtitle: "Second Vatican Council — the Lord’s Day",
    sourceUrl: SACROSANCTUM_URL,
    year: 1963,
    type: "papal",
    bibleRefs: ["1 Pt 1:3"],
  },
];

export const CORE_LOCATOR_REFS = [
  "Mt 28:19",
  "Mt 28:19–20",
  "Lk 1:43",
  "Rom 3:21–26",
  "2 Thes 2:15",
  "Lk 15:11–32",
  "Jn 20:21–23",
  "Jn 20:1",
  "1 Pt 1:3",
  "Mk 16:16",
  "Heb 11:6",
  "Rev 7:9–14",
  "1 Cor 15:20–22",
  "Lk 24:5–6",
  "1 Jn 4:2",
  "Gn 1:1",
];

/** Citation edges that thicken onboarding cores beyond Petrine / Eucharist / DV–Nicaea. */
export const CORE_EDGES: SeedEdge[] = [
  { from: "core:trinity", to: "ccc:232", kind: "cites" },
  { from: "ccc:232", to: "scripture:mt.28.19", kind: "cites" },
  { from: "ccc:232", to: "ccc:245", kind: "cites" },
  { from: "ccc:245", to: "council:constantinople-i", kind: "cites" },

  { from: "ccc:465", to: "scripture:1jn.4.2", kind: "cites" },

  { from: "ccc:495", to: "scripture:lk.1.43", kind: "cites" },
  { from: "ccc:495", to: "ccc:466", kind: "cites" },
  { from: "ccc:466", to: "council:ephesus", kind: "cites" },

  { from: "ccc:1992", to: "scripture:rom.3.21-26", kind: "cites" },

  { from: "constitution:dei-verbum", to: "constitution:dei-verbum.8", kind: "defines" },
  { from: "ccc:82", to: "constitution:dei-verbum.8", kind: "cites" },
  { from: "constitution:dei-verbum.8", to: "scripture:2thes.2.15", kind: "cites" },
  { from: "constitution:dei-verbum.8", to: "constitution:trent.4", kind: "cites" },

  { from: "ccc:1439", to: "scripture:lk.15.11-32", kind: "cites" },
  { from: "ccc:1439", to: "constitution:trent.14", kind: "cites" },
  { from: "constitution:trent.14", to: "scripture:jn.20.21-23", kind: "cites" },

  { from: "ccc:2177", to: "ccc:2174", kind: "cites" },
  { from: "ccc:2042", to: "ccc:2177", kind: "cites" },
  { from: "ccc:2174", to: "scripture:jn.20.1", kind: "cites" },
  { from: "constitution:sacrosanctum-concilium", to: "constitution:sacrosanctum-concilium.106", kind: "defines" },
  { from: "ccc:2177", to: "constitution:sacrosanctum-concilium.106", kind: "cites" },
  { from: "constitution:sacrosanctum-concilium.106", to: "scripture:1pt.1.3", kind: "cites" },

  { from: "core:eens", to: "ccc:848", kind: "cites" },
  { from: "constitution:lumen-gentium", to: "constitution:lumen-gentium.14", kind: "defines" },
  { from: "constitution:lumen-gentium", to: "constitution:lumen-gentium.16", kind: "defines" },
  { from: "ccc:846", to: "constitution:lumen-gentium.14", kind: "cites" },
  { from: "ccc:847", to: "constitution:lumen-gentium.16", kind: "cites" },
  { from: "ccc:848", to: "constitution:lumen-gentium.16", kind: "cites" },
  { from: "constitution:lumen-gentium.14", to: "scripture:mk.16.16", kind: "cites" },
  { from: "ccc:848", to: "scripture:heb.11.6", kind: "cites" },

  { from: "constitution:lumen-gentium", to: "constitution:lumen-gentium.50", kind: "defines" },
  { from: "ccc:2642", to: "scripture:rev.7.9-14", kind: "cites" },
  { from: "ccc:2642", to: "constitution:lumen-gentium.50", kind: "cites" },
  { from: "ccc:966", to: "constitution:lumen-gentium.50", kind: "cites" },
  { from: "constitution:lumen-gentium.50", to: "scripture:rev.7.9-14", kind: "cites" },

  { from: "ccc:849", to: "scripture:mt.28.19-20", kind: "cites" },
  { from: "ccc:849", to: "constitution:lumen-gentium", kind: "cites" },
  { from: "ccc:849", to: "ccc:846", kind: "cites" },

  { from: "ccc:655", to: "scripture:1cor.15.20-22", kind: "cites" },
  { from: "ccc:640", to: "scripture:lk.24.5-6", kind: "cites" },
  { from: "ccc:655", to: "council:nicaea-i", kind: "cites" },
  { from: "ccc:640", to: "ccc:655", kind: "cites" },

  { from: "ccc:290", to: "scripture:gn.1.1", kind: "cites" },
  { from: "ccc:289", to: "ccc:296", kind: "cites" },
  { from: "ccc:296", to: "council:lateran-iv", kind: "cites" },
  { from: "ccc:289", to: "ccc:290", kind: "cites" },
];

export interface CoreWalk {
  core: string;
  to: string;
  via: string[];
  magisterium: string;
}

/** Remaining cores (not Petrine / Eucharist / the already-required DV–Nicaea stack). */
export const CORE_WALKS: CoreWalk[] = [
  {
    core: "core:trinity",
    to: "scripture:mt.28.19",
    via: ["ccc:232"],
    magisterium: "council:constantinople-i",
  },
  {
    core: "core:incarnation",
    to: "scripture:1jn.4.2",
    via: ["ccc:465"],
    magisterium: "council:nicaea-i",
  },
  {
    core: "core:theotokos",
    to: "scripture:lk.1.43",
    via: ["ccc:495"],
    magisterium: "council:ephesus",
  },
  {
    core: "core:justification",
    to: "scripture:rom.3.21-26",
    via: ["ccc:1992"],
    magisterium: "constitution:trent.6",
  },
  {
    core: "core:scripture-tradition",
    to: "scripture:2thes.2.15",
    via: ["ccc:82", "constitution:dei-verbum.8"],
    magisterium: "constitution:dei-verbum",
  },
  {
    core: "core:penance",
    to: "scripture:lk.15.11-32",
    via: ["ccc:1439"],
    magisterium: "constitution:trent.14",
  },
  {
    core: "core:sunday",
    to: "scripture:jn.20.1",
    via: ["ccc:2177", "ccc:2174"],
    magisterium: "constitution:sacrosanctum-concilium.106",
  },
  {
    core: "core:eens",
    to: "scripture:mk.16.16",
    via: ["ccc:846", "constitution:lumen-gentium.14"],
    magisterium: "constitution:lumen-gentium.16",
  },
  {
    core: "core:communion-saints",
    to: "scripture:rev.7.9-14",
    via: ["ccc:2642"],
    magisterium: "constitution:lumen-gentium.50",
  },
  {
    core: "core:baptism",
    to: "scripture:rom.6.3-4",
    via: ["ccc:1213"],
    magisterium: "constitution:lumen-gentium.11",
  },
  {
    core: "core:resurrection",
    to: "scripture:1cor.15.20-22",
    via: ["ccc:655"],
    magisterium: "council:nicaea-i",
  },
  {
    core: "core:creation",
    to: "scripture:gn.1.1",
    via: ["ccc:290"],
    magisterium: "council:lateran-iv",
  },
];
