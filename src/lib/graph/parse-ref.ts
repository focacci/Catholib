import { BIBLE_BOOKS } from "../timeline/bible.ts";

export interface ParsedRef {
  bookName: string;
  token: string;
  chapter: number;
  verse?: number;
  endChapter?: number;
  endVerse?: number;
  raw: string;
}

const EXTRA_ALIASES: Record<string, string> = {
  gen: "Genesis",
  genesis: "Genesis",
  exod: "Exodus",
  exodus: "Exodus",
  lev: "Leviticus",
  num: "Numbers",
  deut: "Deuteronomy",
  josh: "Joshua",
  judg: "Judges",
  jud: "Judges",
  sam: "1 Samuel",
  kgs: "1 Kings",
  king: "1 Kings",
  chr: "1 Chronicles",
  paralipomenon: "1 Chronicles",
  esd: "Ezra",
  esdras: "Ezra",
  tobias: "Tobit",
  psalm: "Psalms",
  psalms: "Psalms",
  ps: "Psalms",
  prov: "Proverbs",
  ecc: "Ecclesiastes",
  qoh: "Ecclesiastes",
  cant: "Song of Songs",
  canticles: "Song of Songs",
  song: "Song of Songs",
  wis: "Wisdom",
  sap: "Wisdom",
  eccus: "Sirach",
  sir: "Sirach",
  ecclesiasticus: "Sirach",
  isa: "Isaiah",
  isaias: "Isaiah",
  jer: "Jeremiah",
  jeremias: "Jeremiah",
  lam: "Lamentations",
  eze: "Ezekiel",
  ezechiel: "Ezekiel",
  dan: "Daniel",
  hos: "Hosea",
  osee: "Hosea",
  jl: "Joel",
  amos: "Amos",
  obad: "Obadiah",
  abdias: "Obadiah",
  jon: "Jonah",
  jonas: "Jonah",
  mic: "Micah",
  micheas: "Micah",
  nah: "Nahum",
  hab: "Habakkuk",
  habacuc: "Habakkuk",
  zep: "Zephaniah",
  sophonias: "Zephaniah",
  hag: "Haggai",
  aggeus: "Haggai",
  zech: "Zechariah",
  zacharias: "Zechariah",
  mal: "Malachi",
  malachias: "Malachi",
  matt: "Matthew",
  matthew: "Matthew",
  mar: "Mark",
  mark: "Mark",
  luk: "Luke",
  luke: "Luke",
  joh: "John",
  john: "John",
  jo: "John",
  act: "Acts of the Apostles",
  acts: "Acts of the Apostles",
  rom: "Romans",
  cor: "1 Corinthians",
  gal: "Galatians",
  eph: "Ephesians",
  phil: "Philippians",
  col: "Colossians",
  thes: "1 Thessalonians",
  thess: "1 Thessalonians",
  tim: "1 Timothy",
  tit: "Titus",
  phlm: "Philemon",
  heb: "Hebrews",
  jas: "James",
  jam: "James",
  pet: "1 Peter",
  jude: "Jude",
  rev: "Revelation",
  apoc: "Revelation",
  apocalypse: "Revelation",
  mac: "1 Maccabees",
  macc: "1 Maccabees",
  machabees: "1 Maccabees",
};

function normalizeKey(s: string): string {
  return s.toLowerCase().replace(/[\s.]+/g, "").replace(/^[123]rd|^[123]nd|^[123]st/, (m) => m[0]);
}

function romanToArabic(raw: string): string {
  return raw.replace(/^(iii|ii|i)\s+/i, (_, r: string) => {
    const n = r.toLowerCase() === "iii" ? "3" : r.toLowerCase() === "ii" ? "2" : "1";
    return `${n} `;
  });
}

const NAME_BY_KEY = new Map<string, string>();
const TOKEN_BY_NAME = new Map<string, string>();
const NAME_BY_TOKEN = new Map<string, string>();

function register(name: string, abbreviation: string) {
  const token = abbreviation.toLowerCase().replace(/[\s.]+/g, "");
  TOKEN_BY_NAME.set(name, token);
  NAME_BY_TOKEN.set(token, name);
  NAME_BY_KEY.set(normalizeKey(name), name);
  NAME_BY_KEY.set(normalizeKey(abbreviation), name);
}

for (const book of BIBLE_BOOKS) {
  register(book.name, book.abbreviation);
}

for (const [alias, name] of Object.entries(EXTRA_ALIASES)) {
  if (TOKEN_BY_NAME.has(name)) NAME_BY_KEY.set(alias, name);
}

export function bookToken(bookName: string): string | undefined {
  return TOKEN_BY_NAME.get(bookName);
}

export function bookNameForToken(token: string): string | undefined {
  return NAME_BY_TOKEN.get(token);
}

export function resolveBook(raw: string): { name: string; token: string } | undefined {
  const cleaned = romanToArabic(raw.trim());
  const name = NAME_BY_KEY.get(normalizeKey(cleaned));
  if (!name) return undefined;
  const token = TOKEN_BY_NAME.get(name);
  if (!token) return undefined;
  return { name, token };
}

/**
 * Parse a compact Catholic bible reference: "Jn 1:1–18", "Gn 1:1–2:4", "Mt 16:18", "Gn 1".
 */
export function parseRef(raw: string): ParsedRef | undefined {
  const text = raw.trim().replace(/\u2013|\u2014/g, "-");
  const match = text.match(
    /^(.+?)\s+(\d+)(?::(\d+))?(?:\s*-\s*(?:(\d+):)?(\d+))?\s*$/,
  );
  if (!match) return undefined;
  const book = resolveBook(match[1]);
  if (!book) return undefined;
  const chapter = Number(match[2]);
  if (!Number.isFinite(chapter) || chapter < 1) return undefined;
  const verse = match[3] ? Number(match[3]) : undefined;
  const endChapter = match[4] ? Number(match[4]) : undefined;
  const endVerse = match[5] ? Number(match[5]) : undefined;
  return {
    bookName: book.name,
    token: book.token,
    chapter,
    verse,
    endChapter: endChapter && endChapter !== chapter ? endChapter : undefined,
    endVerse,
    raw: raw.trim(),
  };
}

export function parseRefs(refs: readonly string[] | undefined): ParsedRef[] {
  if (!refs) return [];
  const out: ParsedRef[] = [];
  for (const raw of refs) {
    const parsed = parseRef(raw);
    if (parsed) out.push(parsed);
  }
  return out;
}

export function scriptureIdFromRef(ref: ParsedRef): string {
  if (ref.verse == null) return `scripture:${ref.token}.${ref.chapter}`;
  if (ref.endVerse == null && ref.endChapter == null) {
    return `scripture:${ref.token}.${ref.chapter}.${ref.verse}`;
  }
  if (ref.endChapter != null) {
    return `scripture:${ref.token}.${ref.chapter}.${ref.verse}-${ref.endChapter}.${ref.endVerse ?? 1}`;
  }
  return `scripture:${ref.token}.${ref.chapter}.${ref.verse}-${ref.endVerse}`;
}

export function chapterIdFromRef(ref: ParsedRef): string {
  return `scripture:${ref.token}.${ref.chapter}`;
}

export function bookIdFromRef(ref: ParsedRef): string {
  return `scripture:${ref.token}`;
}

/** True when `cover` is the same chapter range that includes `needle`. */
export function refCoversVerse(cover: ParsedRef, needle: ParsedRef): boolean {
  if (cover.token !== needle.token) return false;
  if (needle.verse == null) {
    return cover.chapter === needle.chapter && cover.endChapter == null;
  }
  const startCh = cover.chapter;
  const startV = cover.verse ?? 1;
  const endCh = cover.endChapter ?? cover.chapter;
  const endV = cover.endVerse ?? cover.verse ?? Number.MAX_SAFE_INTEGER;
  const nCh = needle.chapter;
  const nV = needle.verse;
  const nEndCh = needle.endChapter ?? needle.chapter;
  const nEndV = needle.endVerse ?? needle.verse;
  const start = startCh * 1000 + startV;
  const end = endCh * 1000 + endV;
  const nStart = nCh * 1000 + nV;
  const nEnd = nEndCh * 1000 + nEndV;
  return nStart >= start && nEnd <= end;
}
