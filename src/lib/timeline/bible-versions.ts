import { nabreChapterUrl } from "./bible.ts";

/** Confirmed ewtn.com/bible slugs for the RSV-CE reader. */
export const RSVCE_SLUG: Record<string, string> = {
  Genesis: "33-genesis",
  Exodus: "29-exodus",
  Leviticus: "50-leviticus",
  Numbers: "58-numbers",
  Deuteronomy: "25-deuteronomy",
  Joshua: "45-joshua",
  Judges: "48-judges",
  Ruth: "66-ruth",
  "1 Samuel": "7-1-samuel",
  "2 Samuel": "16-2-samuel",
  "1 Kings": "4-1-kings",
  "2 Kings": "13-2-kings",
  "1 Chronicles": "1-1-chronicles",
  "2 Chronicles": "10-2-chronicles",
  Ezra: "31-ezra",
  Nehemiah: "57-nehemiah",
  Tobit: "70-tobit",
  Judith: "46-judith",
  Esther: "28-esther",
  "1 Maccabees": "5-1-maccabees",
  "2 Maccabees": "14-2-maccabees",
  Job: "41-job",
  Psalms: "63-psalms",
  Proverbs: "62-proverbs",
  Ecclesiastes: "26-ecclesiastes",
  "Song of Songs": "68-song-of-solomon",
  Wisdom: "71-wisdom",
  Sirach: "67-sirach",
  Isaiah: "38-isaiah",
  Jeremiah: "40-jeremiah",
  Lamentations: "49-lamentations",
  Baruch: "22-baruch",
  Ezekiel: "30-ezekiel",
  Daniel: "24-daniel",
  Hosea: "37-hosea",
  Joel: "42-joel",
  Amos: "21-amos",
  Obadiah: "59-obadiah",
  Jonah: "44-jonah",
  Micah: "55-micah",
  Nahum: "56-nahum",
  Habakkuk: "34-habakkuk",
  Zephaniah: "73-zephaniah",
  Haggai: "35-haggai",
  Zechariah: "72-zechariah",
  Malachi: "52-malachi",
  Matthew: "54-matthew",
  Mark: "53-mark",
  Luke: "51-luke",
  John: "43-john",
  "Acts of the Apostles": "20-acts",
  Romans: "65-romans",
  "1 Corinthians": "2-1-corinthians",
  "2 Corinthians": "11-2-corinthians",
  Galatians: "32-galatians",
  Ephesians: "27-ephesians",
  Philippians: "60-philippians",
  Colossians: "23-colossians",
  "1 Thessalonians": "8-1-thessalonians",
  "2 Thessalonians": "17-2-thessalonians",
  "1 Timothy": "9-1-timothy",
  "2 Timothy": "18-2-timothy",
  Titus: "69-titus",
  Philemon: "61-philemon",
  Hebrews: "36-hebrews",
  James: "39-james",
  "1 Peter": "6-1-peter",
  "2 Peter": "15-2-peter",
  "1 John": "3-1-john",
  "2 John": "12-2-john",
  "3 John": "19-3-john",
  Jude: "47-jude",
  Revelation: "64-revelation",
};

/**
 * Confirmed thedouayrheims.com slugs. Names follow Douay-Rheims
 * (Kings / Paralipomenon / Esdras numbering, Vulgate book titles).
 */
export const DOUAY_RHEIMS_SLUG: Record<string, string> = {
  Genesis: "genesis",
  Exodus: "exodus",
  Leviticus: "leviticus",
  Numbers: "numbers",
  Deuteronomy: "deuteronomy",
  Joshua: "josue",
  Judges: "judges",
  Ruth: "ruth",
  "1 Samuel": "1-kings",
  "2 Samuel": "2-kings",
  "1 Kings": "3-kings",
  "2 Kings": "4-kings",
  "1 Chronicles": "1-paralipomenon",
  "2 Chronicles": "2-paralipomenon",
  Ezra: "1-esdras",
  Nehemiah: "2-esdras",
  Tobit: "tobias",
  Judith: "judith",
  Esther: "esther",
  "1 Maccabees": "1-machabees",
  "2 Maccabees": "2-machabees",
  Job: "job",
  Psalms: "psalms",
  Proverbs: "proverbs",
  Ecclesiastes: "ecclesiastes",
  "Song of Songs": "canticle-of-canticles",
  Wisdom: "wisdom",
  Sirach: "ecclesiasticus",
  Isaiah: "isaie",
  Jeremiah: "jeremie",
  Lamentations: "lamentations",
  Baruch: "baruch",
  Ezekiel: "ezechiel",
  Daniel: "daniel",
  Hosea: "osee",
  Joel: "joel",
  Amos: "amos",
  Obadiah: "abdias",
  Jonah: "jonas",
  Micah: "micheas",
  Nahum: "nahum",
  Habakkuk: "habacuc",
  Zephaniah: "sophonias",
  Haggai: "aggeus",
  Zechariah: "zacharias",
  Malachi: "malachie",
  Matthew: "matthew",
  Mark: "mark",
  Luke: "luke",
  John: "john",
  "Acts of the Apostles": "acts",
  Romans: "romans",
  "1 Corinthians": "1-corinthians",
  "2 Corinthians": "2-corinthians",
  Galatians: "galatians",
  Ephesians: "ephesians",
  Philippians: "philippians",
  Colossians: "colossians",
  "1 Thessalonians": "1-thessalonians",
  "2 Thessalonians": "2-thessalonians",
  "1 Timothy": "1-timothy",
  "2 Timothy": "2-timothy",
  Titus: "titus",
  Philemon: "philemon",
  Hebrews: "hebrews",
  James: "james",
  "1 Peter": "1-peter",
  "2 Peter": "2-peter",
  "1 John": "1-john",
  "2 John": "2-john",
  "3 John": "3-john",
  Jude: "jude",
  Revelation: "apocalypse",
};

export type BibleVersionId = "nabre" | "rsvce" | "douay-rheims";

export type BibleVersionLink = {
  id: BibleVersionId;
  label: string;
  href: string;
};

function requireSlug(map: Record<string, string>, bookName: string, source: string): string {
  const slug = map[bookName];
  if (!slug) throw new Error(`No ${source} slug for ${bookName}`);
  return slug;
}

export function rsvceChapterUrl(bookName: string, chapter: number): string {
  const slug = requireSlug(RSVCE_SLUG, bookName, "RSV-CE");
  return `https://www.ewtn.com/bible/${slug}/${chapter}`;
}

export function douayRheimsChapterUrl(bookName: string, chapter: number): string {
  const slug = requireSlug(DOUAY_RHEIMS_SLUG, bookName, "Douay-Rheims");
  return `https://thedouayrheims.com/odr/${slug}/${chapter}`;
}

/** Chapter text versions, left to right: NABRE, RSV-CE, Douay Rheims. */
export function bibleVersionLinks(bookName: string, chapter: number): BibleVersionLink[] {
  return [
    { id: "nabre", label: "NABRE", href: nabreChapterUrl(bookName, chapter) },
    { id: "rsvce", label: "RSV-CE", href: rsvceChapterUrl(bookName, chapter) },
    {
      id: "douay-rheims",
      label: "Douay Rheims",
      href: douayRheimsChapterUrl(bookName, chapter),
    },
  ];
}
