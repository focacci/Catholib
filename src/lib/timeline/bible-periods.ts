/** Great Adventure Bible Timeline bookmark colors and book assignments. */

export type TimelinePeriodId =
  | "earlyWorld"
  | "patriarchs"
  | "egyptExodus"
  | "desert"
  | "conquest"
  | "royal"
  | "divided"
  | "exile"
  | "return"
  | "maccabean"
  | "messianic"
  | "church";

export interface PeriodColor {
  id: TimelinePeriodId;
  label: string;
  bg: string;
  fg: string;
  ring?: boolean;
}

export const TIMELINE_PERIODS: Record<TimelinePeriodId, PeriodColor> = {
  earlyWorld: { id: "earlyWorld", label: "Early World", bg: "#2BB8B3", fg: "#0A0E14" },
  patriarchs: { id: "patriarchs", label: "Patriarchs", bg: "#7A2D3A", fg: "#EFE6D4" },
  egyptExodus: { id: "egyptExodus", label: "Egypt and Exodus", bg: "#C0392B", fg: "#EFE6D4" },
  desert: { id: "desert", label: "Desert Wanderings", bg: "#C4A574", fg: "#0A0E14" },
  conquest: { id: "conquest", label: "Conquest and Judges", bg: "#3D8B4F", fg: "#EFE6D4" },
  royal: { id: "royal", label: "Royal Kingdom", bg: "#6B3A91", fg: "#EFE6D4" },
  divided: {
    id: "divided",
    label: "Divided Kingdom",
    bg: "#2A2A2A",
    fg: "#EFE6D4",
    ring: true,
  },
  exile: { id: "exile", label: "Exile", bg: "#8EC9E8", fg: "#0A0E14" },
  return: { id: "return", label: "Return", bg: "#E8C547", fg: "#0A0E14" },
  maccabean: { id: "maccabean", label: "Maccabean Revolt", bg: "#E67E22", fg: "#0A0E14" },
  messianic: { id: "messianic", label: "Messianic Fulfillment", bg: "#C9A44A", fg: "#0A0E14" },
  church: { id: "church", label: "The Church", bg: "#F2EDE3", fg: "#0A0E14" },
};

const BOOK_PERIOD: Record<string, TimelinePeriodId> = {
  Genesis: "earlyWorld",
  Exodus: "egyptExodus",
  Leviticus: "egyptExodus",
  Numbers: "desert",
  Deuteronomy: "desert",
  Joshua: "conquest",
  Judges: "conquest",
  Ruth: "conquest",
  "1 Samuel": "royal",
  "2 Samuel": "royal",
  "1 Kings": "divided",
  "2 Kings": "divided",
  "1 Chronicles": "royal",
  "2 Chronicles": "divided",
  Ezra: "return",
  Nehemiah: "return",
  Tobit: "exile",
  Judith: "maccabean",
  Esther: "return",
  "1 Maccabees": "maccabean",
  "2 Maccabees": "maccabean",
  Job: "patriarchs",
  Psalms: "royal",
  Proverbs: "royal",
  Ecclesiastes: "royal",
  "Song of Songs": "royal",
  Wisdom: "maccabean",
  Sirach: "maccabean",
  Isaiah: "divided",
  Jeremiah: "exile",
  Lamentations: "exile",
  Baruch: "exile",
  Ezekiel: "exile",
  Daniel: "exile",
  Hosea: "divided",
  Joel: "divided",
  Amos: "divided",
  Obadiah: "exile",
  Jonah: "divided",
  Micah: "divided",
  Nahum: "exile",
  Habakkuk: "exile",
  Zephaniah: "divided",
  Haggai: "return",
  Zechariah: "return",
  Malachi: "return",
  Matthew: "messianic",
  Mark: "messianic",
  Luke: "messianic",
  John: "messianic",
  "Acts of the Apostles": "church",
  Romans: "church",
  "1 Corinthians": "church",
  "2 Corinthians": "church",
  Galatians: "church",
  Ephesians: "church",
  Philippians: "church",
  Colossians: "church",
  "1 Thessalonians": "church",
  "2 Thessalonians": "church",
  "1 Timothy": "church",
  "2 Timothy": "church",
  Titus: "church",
  Philemon: "church",
  Hebrews: "church",
  James: "church",
  "1 Peter": "church",
  "2 Peter": "church",
  "1 John": "church",
  "2 John": "church",
  "3 John": "church",
  Jude: "church",
  Revelation: "church",
};

export const TIMELINE_PERIOD_LIST: PeriodColor[] = Object.values(TIMELINE_PERIODS);

export function periodSwatchStyle(period: PeriodColor): {
  backgroundColor: string;
  boxShadow?: string;
} {
  return {
    backgroundColor: period.bg,
    boxShadow: period.ring ? "inset 0 0 0 1px #8a817388" : undefined,
  };
}

export function periodForBook(name: string): PeriodColor {
  return TIMELINE_PERIODS[BOOK_PERIOD[name] ?? "earlyWorld"];
}

export function periodBadgeStyle(name: string): {
  backgroundColor: string;
  color: string;
  boxShadow?: string;
} {
  const period = periodForBook(name);
  return {
    backgroundColor: period.bg,
    color: period.fg,
    boxShadow: period.ring ? "inset 0 0 0 1px #8a817388" : undefined,
  };
}
