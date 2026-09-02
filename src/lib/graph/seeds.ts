import { cccUrl } from "../timeline/ccc.ts";
import type { CitationKind } from "./types.ts";

export const PASTOR_AETERNUS_URL =
  "https://www.vatican.va/content/pius-ix/en/documents/constitutio-dogmatica-pastor-aeternus-18-iulii-1870.html";

export const DEI_VERBUM_URL =
  "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651118_dei-verbum_en.html";
export const LUMEN_GENTIUM_URL =
  "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19641121_lumen-gentium_en.html";
export const GAUDIUM_ET_SPES_URL =
  "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651207_gaudium-et-spes_en.html";
export const SACROSANCTUM_URL =
  "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19631204_sacrosanctum-concilium_en.html";
export const VATICAN_II_URL =
  "https://www.vatican.va/archive/hist_councils/ii_vatican_council/index.htm";

const CATHEN = (id: string) => `https://www.newadvent.org/cathen/${id}.htm`;
const COUNCILS_INDEX = CATHEN("04423f");

export interface SeedNode {
  id: string;
  title: string;
  subtitle: string;
  sourceUrl: string;
  year: number | string;
  type: "event" | "papal" | "catechism" | "ordo" | "rosary";
  bibleRefs?: string[];
}

export interface SeedEdge {
  from: string;
  to: string;
  kind: CitationKind;
}

/** 21 ecumenical councils. Surface list is the Church spine. */
export const COUNCIL_NODES: SeedNode[] = [
  { id: "council:nicaea-i", title: "First Council of Nicaea", subtitle: "325", sourceUrl: CATHEN("11044a"), year: 325, type: "event" },
  { id: "council:constantinople-i", title: "First Council of Constantinople", subtitle: "381", sourceUrl: CATHEN("04308a"), year: 381, type: "event" },
  { id: "council:ephesus", title: "Council of Ephesus", subtitle: "431", sourceUrl: CATHEN("05491a"), year: 431, type: "event" },
  { id: "council:chalcedon", title: "Council of Chalcedon", subtitle: "451", sourceUrl: CATHEN("03555a"), year: 451, type: "event" },
  { id: "council:constantinople-ii", title: "Second Council of Constantinople", subtitle: "553", sourceUrl: CATHEN("04308b"), year: 553, type: "event" },
  { id: "council:constantinople-iii", title: "Third Council of Constantinople", subtitle: "680–681", sourceUrl: CATHEN("04310a"), year: 680, type: "event" },
  { id: "council:nicaea-ii", title: "Second Council of Nicaea", subtitle: "787", sourceUrl: CATHEN("11045a"), year: 787, type: "event" },
  { id: "council:constantinople-iv", title: "Fourth Council of Constantinople", subtitle: "869–870", sourceUrl: COUNCILS_INDEX, year: 869, type: "event" },
  { id: "council:lateran-i", title: "First Lateran Council", subtitle: "1123", sourceUrl: COUNCILS_INDEX, year: 1123, type: "event" },
  { id: "council:lateran-ii", title: "Second Lateran Council", subtitle: "1139", sourceUrl: COUNCILS_INDEX, year: 1139, type: "event" },
  { id: "council:lateran-iii", title: "Third Lateran Council", subtitle: "1179", sourceUrl: COUNCILS_INDEX, year: 1179, type: "event" },
  { id: "council:lateran-iv", title: "Fourth Lateran Council", subtitle: "1215", sourceUrl: CATHEN("09018a"), year: 1215, type: "event" },
  { id: "council:lyons-i", title: "First Council of Lyons", subtitle: "1245", sourceUrl: COUNCILS_INDEX, year: 1245, type: "event" },
  { id: "council:lyons-ii", title: "Second Council of Lyons", subtitle: "1274", sourceUrl: COUNCILS_INDEX, year: 1274, type: "event" },
  { id: "council:vienne", title: "Council of Vienne", subtitle: "1311–1312", sourceUrl: COUNCILS_INDEX, year: 1311, type: "event" },
  { id: "council:constance", title: "Council of Constance", subtitle: "1414–1418", sourceUrl: COUNCILS_INDEX, year: 1414, type: "event" },
  { id: "council:florence", title: "Council of Florence", subtitle: "1431–1445", sourceUrl: CATHEN("06111a"), year: 1431, type: "event" },
  { id: "council:lateran-v", title: "Fifth Lateran Council", subtitle: "1512–1517", sourceUrl: COUNCILS_INDEX, year: 1512, type: "event" },
  { id: "council:trent", title: "Council of Trent", subtitle: "1545–1563", sourceUrl: CATHEN("15030c"), year: 1545, type: "event" },
  { id: "council:vatican-i", title: "First Vatican Council", subtitle: "1869–1870", sourceUrl: CATHEN("15303a"), year: 1870, type: "event" },
  { id: "council:vatican-ii", title: "Second Vatican Council", subtitle: "1962–1965", sourceUrl: VATICAN_II_URL, year: 1962, type: "event" },
];

export const CONSTITUTION_NODES: SeedNode[] = [
  {
    id: "constitution:dei-verbum",
    title: "Dei Verbum",
    subtitle: "Dogmatic Constitution on Divine Revelation",
    sourceUrl: DEI_VERBUM_URL,
    year: 1965,
    type: "papal",
    bibleRefs: ["Jn 1:1–18"],
  },
  {
    id: "constitution:lumen-gentium",
    title: "Lumen Gentium",
    subtitle: "Dogmatic Constitution on the Church",
    sourceUrl: LUMEN_GENTIUM_URL,
    year: 1964,
    type: "papal",
  },
  {
    id: "constitution:sacrosanctum-concilium",
    title: "Sacrosanctum Concilium",
    subtitle: "Constitution on the Sacred Liturgy",
    sourceUrl: SACROSANCTUM_URL,
    year: 1963,
    type: "papal",
  },
  {
    id: "constitution:gaudium-et-spes",
    title: "Gaudium et Spes",
    subtitle: "Pastoral Constitution on the Church in the Modern World",
    sourceUrl: GAUDIUM_ET_SPES_URL,
    year: 1965,
    type: "papal",
  },
  {
    id: "constitution:pastor-aeternus",
    title: "Pastor Aeternus",
    subtitle: "First Vatican Council — 18 July 1870",
    sourceUrl: PASTOR_AETERNUS_URL,
    year: 1870,
    type: "papal",
    bibleRefs: ["Mt 16:18–19"],
  },
  {
    id: "constitution:trent.4",
    title: "Council of Trent, Session IV",
    subtitle: "Sacred Scripture and the canon — 8 April 1546",
    sourceUrl: CATHEN("15030c"),
    year: 1546,
    type: "papal",
  },
  {
    id: "constitution:trent.6",
    title: "Council of Trent, Session VI",
    subtitle: "Decree on Justification — 13 January 1547",
    sourceUrl: CATHEN("15030c"),
    year: 1547,
    type: "papal",
  },
  {
    id: "constitution:trent.13",
    title: "Council of Trent, Session XIII",
    subtitle: "The Holy Eucharist — 11 October 1551",
    sourceUrl: CATHEN("15030c"),
    year: 1551,
    type: "papal",
    bibleRefs: ["Jn 6:53–56", "Mt 26:26–29"],
  },
  {
    id: "constitution:trent.14",
    title: "Council of Trent, Session XIV",
    subtitle: "Penance — 25 November 1551",
    sourceUrl: CATHEN("15030c"),
    year: 1551,
    type: "papal",
  },
];

export const CHURCH_SPINE_ENTRY_IDS = [
  "pentecost",
  "peter",
  "paul",
  "nicaea",
  "athanasius",
  "constantinople-i",
  "augustine",
  "ephesus",
  "chalcedon",
  "leo-great",
  "constantinople-ii",
  "gregory-great",
  "constantinople-iii",
  "nicaea-ii",
  "lateran-iv",
  "aquinas",
  "florence",
  "trent",
  "immaculate",
  "vatican-i",
  "pius-ix",
  "leo-xiii",
  "quas-primas",
  "mystici",
  "divino",
  "assumption",
  "vatican-ii",
  "humanae-vitae",
  "jp2",
  "bxvi",
  "francis",
] as const;

export const CHURCH_ARCHIVE_ENTRY_IDS = [
  "lateran",
  "st-peters",
  "holy-sepulchre",
  "st-paul-walls",
  "mary-major",
  "hagia-sophia",
  "compostela",
  "notre-dame-paris",
  "chartres",
  "cologne",
  "guadalupe",
  "st-patricks-nyc",
] as const;

export const ENTRY_CANONICAL: Record<string, string> = {
  nicaea: "council:nicaea-i",
  "constantinople-i": "council:constantinople-i",
  ephesus: "council:ephesus",
  chalcedon: "council:chalcedon",
  "constantinople-ii": "council:constantinople-ii",
  "constantinople-iii": "council:constantinople-iii",
  "nicaea-ii": "council:nicaea-ii",
  "lateran-iv": "council:lateran-iv",
  florence: "council:florence",
  trent: "council:trent",
  "vatican-i": "council:vatican-i",
  "vatican-ii": "council:vatican-ii",
  peter: "person:peter",
  paul: "person:paul",
  athanasius: "person:athanasius",
  augustine: "person:augustine",
  "leo-great": "person:leo-great",
  "gregory-great": "person:gregory-great",
  aquinas: "person:aquinas",
  "pius-ix": "person:pius-ix",
  "leo-xiii": "person:leo-xiii",
  jp2: "person:jp2",
  bxvi: "person:bxvi",
  francis: "person:francis",
  pentecost: "event:pentecost",
  immaculate: "event:immaculate",
  assumption: "event:assumption",
  "quas-primas": "encyclical:quas-primas",
  mystici: "encyclical:mystici-corporis",
  divino: "encyclical:divino-afflante-spiritu",
  "humanae-vitae": "encyclical:humanae-vitae",
};

/** Church office title → existing person entry. Reuse, do not clone. */
export const OFFICE_PERSON: { pattern: RegExp; entryId: string }[] = [
  { pattern: /\bAugustine\b/i, entryId: "augustine" },
  { pattern: /\bThomas Aquinas\b/i, entryId: "aquinas" },
  { pattern: /\bGregory the Great\b/i, entryId: "gregory-great" },
  { pattern: /\bLeo the Great\b/i, entryId: "leo-great" },
  { pattern: /\bAthanasius\b/i, entryId: "athanasius" },
  { pattern: /\bPeter and Paul\b/i, entryId: "peter" },
  { pattern: /\bChair of St\. Peter\b/i, entryId: "peter" },
  { pattern: /\bConversion of St\. Paul\b/i, entryId: "paul" },
  { pattern: /\bCommemoration of St\. Paul\b/i, entryId: "paul" },
];

export const DOCUMENT_TITLE_ID: { pattern: RegExp; id: string }[] = [
  { pattern: /^Dei Verbum 4\b/i, id: "constitution:dei-verbum.4" },
  { pattern: /^Dei Verbum/i, id: "constitution:dei-verbum" },
  { pattern: /^Lumen Gentium/i, id: "constitution:lumen-gentium" },
  { pattern: /^Sacrosanctum Concilium/i, id: "constitution:sacrosanctum-concilium" },
  { pattern: /^Gaudium et Spes/i, id: "constitution:gaudium-et-spes" },
  { pattern: /^Pastor Aeternus/i, id: "constitution:pastor-aeternus" },
  { pattern: /^Humanae Vitae/i, id: "encyclical:humanae-vitae" },
  { pattern: /^Quas Primas/i, id: "encyclical:quas-primas" },
  { pattern: /^Mystici Corporis/i, id: "encyclical:mystici-corporis" },
  { pattern: /^Divino Afflante Spiritu/i, id: "encyclical:divino-afflante-spiritu" },
  { pattern: /^Munificentissimus Deus/i, id: "constitution:munificentissimus-deus" },
  { pattern: /^Ineffabilis Deus/i, id: "constitution:ineffabilis-deus" },
];

export const HIGH_VALUE_EDGES: SeedEdge[] = [
  { from: "ccc:424", to: "scripture:mt.16.18-19", kind: "cites" },
  { from: "ccc:881", to: "scripture:mt.16.18-19", kind: "cites" },
  { from: "constitution:pastor-aeternus", to: "scripture:mt.16.18-19", kind: "cites" },
  { from: "constitution:pastor-aeternus", to: "ccc:424", kind: "defines" },
  { from: "council:vatican-i", to: "constitution:pastor-aeternus", kind: "defines" },
  { from: "ccc:1374", to: "scripture:jn.6.53-56", kind: "cites" },
  { from: "ccc:1376", to: "scripture:jn.6.53-56", kind: "cites" },
  { from: "constitution:trent.13", to: "scripture:jn.6.53-56", kind: "cites" },
  { from: "constitution:trent.13", to: "ccc:1374", kind: "defines" },
  { from: "haydock:jn.6", to: "scripture:jn.6.53-56", kind: "comments" },
  { from: "haydock:jn.6", to: "constitution:trent.13", kind: "cites" },
  { from: "ccc:1323", to: "scripture:mt.26.26-29", kind: "cites" },
  { from: "rosary:luminous.5", to: "scripture:mt.26.26-29", kind: "cites" },
  { from: "ccc:241", to: "scripture:jn.1.1-18", kind: "cites" },
  { from: "constitution:dei-verbum", to: "scripture:jn.1.1-18", kind: "cites" },
  { from: "constitution:dei-verbum", to: "ccc:241", kind: "defines" },
  { from: "council:nicaea-i", to: "ccc:465", kind: "defines" },
  { from: "constitution:dei-verbum", to: "council:nicaea-i", kind: "cites" },
  { from: "ccc:465", to: "council:nicaea-i", kind: "cites" },
  { from: "ccc:82", to: "constitution:dei-verbum", kind: "cites" },
  { from: "ccc:82", to: "constitution:trent.4", kind: "cites" },
  { from: "council:trent", to: "constitution:trent.4", kind: "defines" },
  { from: "council:trent", to: "constitution:trent.6", kind: "defines" },
  { from: "council:trent", to: "constitution:trent.13", kind: "defines" },
  { from: "council:trent", to: "constitution:trent.14", kind: "defines" },
  { from: "council:vatican-ii", to: "constitution:dei-verbum", kind: "defines" },
  { from: "council:vatican-ii", to: "constitution:lumen-gentium", kind: "defines" },
  { from: "council:vatican-ii", to: "constitution:sacrosanctum-concilium", kind: "defines" },
  { from: "council:vatican-ii", to: "constitution:gaudium-et-spes", kind: "defines" },
  { from: "ccc:1992", to: "constitution:trent.6", kind: "cites" },
  { from: "ccc:846", to: "constitution:lumen-gentium", kind: "cites" },
  { from: "ccc:847", to: "constitution:lumen-gentium", kind: "cites" },
  { from: "person:leo-great", to: "council:chalcedon", kind: "cites" },
  { from: "person:athanasius", to: "council:nicaea-i", kind: "cites" },
  { from: "person:augustine", to: "ccc:32", kind: "cites" },
  { from: "person:peter", to: "scripture:mt.16.18-19", kind: "cites" },
  { from: "person:paul", to: "constitution:dei-verbum", kind: "cites" },
  { from: "event:pentecost", to: "ccc:731", kind: "cites" },
  { from: "person:jp2", to: "ccc:424", kind: "cites" },
  { from: "person:bxvi", to: "constitution:dei-verbum", kind: "cites" },
  { from: "person:francis", to: "scripture:gn.1", kind: "cites" },
  { from: "person:pius-ix", to: "constitution:pastor-aeternus", kind: "cites" },
  { from: "person:leo-xiii", to: "ccc:32", kind: "cites" },
  { from: "person:aquinas", to: "ccc:1374", kind: "cites" },
  { from: "person:gregory-great", to: "ccc:881", kind: "cites" },
  { from: "encyclical:humanae-vitae", to: "ccc:2041", kind: "cites" },
  { from: "encyclical:quas-primas", to: "ccc:447", kind: "cites" },
  { from: "encyclical:mystici-corporis", to: "ccc:779", kind: "cites" },
  { from: "encyclical:divino-afflante-spiritu", to: "constitution:dei-verbum", kind: "cites" },
  { from: "event:immaculate", to: "ccc:491", kind: "cites" },
  { from: "event:assumption", to: "ccc:966", kind: "cites" },
  { from: "council:constantinople-i", to: "ccc:245", kind: "defines" },
  { from: "council:ephesus", to: "ccc:466", kind: "defines" },
  { from: "council:chalcedon", to: "ccc:467", kind: "defines" },
  { from: "council:constantinople-ii", to: "ccc:468", kind: "defines" },
  { from: "council:constantinople-iii", to: "ccc:475", kind: "defines" },
  { from: "council:nicaea-ii", to: "ccc:2131", kind: "defines" },
  { from: "council:lateran-iv", to: "ccc:1376", kind: "defines" },
  { from: "council:florence", to: "ccc:248", kind: "defines" },
  { from: "council:vatican-i", to: "ccc:891", kind: "defines" },
  { from: "person:athanasius", to: "ccc:465", kind: "cites" },
  { from: "person:leo-great", to: "ccc:467", kind: "cites" },
];

export const REQUIRED_PATHS: string[][] = [
  ["scripture:mt.16.18-19", "ccc:424", "constitution:pastor-aeternus", "council:vatican-i"],
  ["scripture:jn.6.53-56", "haydock:jn.6", "constitution:trent.13", "ccc:1374"],
  ["rosary:luminous.5", "scripture:mt.26.26-29", "ccc:1323"],
  ["constitution:dei-verbum", "ccc:465", "council:nicaea-i"],
];

export interface OnboardingCore {
  id: string;
  title: string;
  subtitle: string;
  ccc: number;
  sourceUrl?: string;
  cites: string[];
}

export const ONBOARDING_CORES: OnboardingCore[] = [
  { id: "core:trinity", title: "The Trinity", subtitle: "Father, Son, and Holy Spirit", ccc: 245, cites: ["ccc:245", "council:constantinople-i", "scripture:jn.1.1-18"] },
  { id: "core:incarnation", title: "The Incarnation", subtitle: "The Word became flesh", ccc: 465, cites: ["ccc:465", "council:nicaea-i", "scripture:jn.1.1-18"] },
  { id: "core:eucharist", title: "The Eucharist", subtitle: "The Real Presence", ccc: 1374, cites: ["ccc:1374", "ccc:1323", "constitution:trent.13", "scripture:jn.6.53-56"] },
  { id: "core:petrine", title: "The Petrine office", subtitle: "Primacy of Peter and his successors", ccc: 881, cites: ["ccc:881", "ccc:424", "constitution:pastor-aeternus", "scripture:mt.16.18-19"] },
  { id: "core:theotokos", title: "Theotokos", subtitle: "Mary, Mother of God", ccc: 495, cites: ["ccc:495", "ccc:466", "council:ephesus"] },
  { id: "core:justification", title: "Justification and grace", subtitle: "As Trent teaches it", ccc: 1992, cites: ["ccc:1992", "constitution:trent.6"] },
  { id: "core:scripture-tradition", title: "Scripture and Tradition", subtitle: "One sacred deposit", ccc: 82, cites: ["ccc:82", "constitution:dei-verbum", "constitution:trent.4"] },
  { id: "core:penance", title: "Confession / Penance", subtitle: "The sacrament of conversion", ccc: 1439, cites: ["ccc:1439", "constitution:trent.14"] },
  { id: "core:sunday", title: "Sunday and holy-day obligation", subtitle: "The precepts of the Church", ccc: 2177, cites: ["ccc:2177", "ccc:2041", "ccc:2042"] },
  { id: "core:eens", title: "Outside the Church there is no salvation", subtitle: "As the Church actually teaches it", ccc: 846, cites: ["ccc:846", "ccc:847", "ccc:848", "constitution:lumen-gentium"] },
  { id: "core:communion-saints", title: "Communion of saints", subtitle: "Intercession of the saints", ccc: 2642, cites: ["ccc:2642", "ccc:966"] },
  { id: "core:baptism", title: "Baptism", subtitle: "The door of the Church", ccc: 1213, cites: ["ccc:1213"] },
  { id: "core:resurrection", title: "The Resurrection", subtitle: "Christ, the first fruits", ccc: 655, cites: ["ccc:655", "ccc:640"] },
  { id: "core:creation", title: "Creation and the image of God", subtitle: "Genesis in the living Tradition", ccc: 289, cites: ["ccc:289", "ccc:290", "scripture:gn.1"] },
];

export function cccArtifactUrl(n: number): string {
  return cccUrl(n);
}

export const LOCATOR_REFS = [
  "Mt 16:18–19",
  "Jn 6:53–56",
  "Mt 26:26–29",
  "Jn 1:1–18",
  "Gn 1",
];
