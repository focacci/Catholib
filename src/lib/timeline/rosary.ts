import type { TimelineArtifact } from "./types";

/** Confirmed rosarycenter.org scripturally-based mystery pages. */
export const ROSARY_ORIGIN = "https://www.rosarycenter.org";

export type RosaryMystery = "joyful" | "luminous" | "sorrowful" | "glorious";

export const ROSARY_MYSTERY_LABEL: Record<RosaryMystery, string> = {
  joyful: "Joyful Mysteries",
  luminous: "Luminous Mysteries",
  sorrowful: "Sorrowful Mysteries",
  glorious: "Glorious Mysteries",
};

const ROSARY_MYSTERY_PATH: Record<RosaryMystery, string> = {
  joyful: "the-joyful-mysteries-scripturally-based",
  luminous: "the-luminous-mysteries-scripturally-based",
  sorrowful: "the-sorrowful-mysteries-scripturally-based",
  glorious: "the-glorious-mysteries-scripturally-based",
};

/**
 * Civil weekday assignment from the Rosary Center, including the Luminous
 * Mysteries on Thursday. Sunday uses Glorious; this app does not calculate
 * Advent, Christmas, or Lent exceptions.
 */
const WEEKDAY_MYSTERY: RosaryMystery[] = [
  "glorious",
  "joyful",
  "sorrowful",
  "glorious",
  "luminous",
  "sorrowful",
  "joyful",
];

export function rosaryMysteryForDate(date: Date): RosaryMystery | null {
  if (Number.isNaN(date.getTime())) return null;
  return WEEKDAY_MYSTERY[date.getDay()] ?? null;
}

export function rosaryUrl(mystery: RosaryMystery): string {
  return `${ROSARY_ORIGIN}/${ROSARY_MYSTERY_PATH[mystery]}`;
}

export function todayRosaryArtifact(now = new Date()): TimelineArtifact {
  const mystery = rosaryMysteryForDate(now);
  if (!mystery) {
    throw new Error("No confirmed Rosary Center URL for this date");
  }
  return {
    id: "missal-today-rosary",
    type: "rosary",
    title: "Today's rosary",
    subtitle: `${ROSARY_MYSTERY_LABEL[mystery]} · Scripturally based`,
    sourceUrl: rosaryUrl(mystery),
    year: now.getFullYear(),
  };
}
