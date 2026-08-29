import { CHURCH_ENTRIES } from "./church.ts";
import type { ChurchEntry } from "./types.ts";

export interface ChurchJumpItem {
  id: string;
  label: string;
  range?: string;
}

export function numericYear(year: number | string): number | undefined {
  if (typeof year === "number") return Number.isFinite(year) ? year : undefined;
  const parsed = Number.parseInt(year, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function formatYearRange(start: number, end: number): string {
  return start === end ? String(start) : `${start}–${end}`;
}

export function yearRangeForEntries(
  entries: readonly { year: number | string }[],
): string | undefined {
  let min = Infinity;
  let max = -Infinity;
  for (const entry of entries) {
    const year = numericYear(entry.year);
    if (year === undefined) continue;
    if (year < min) min = year;
    if (year > max) max = year;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return undefined;
  return formatYearRange(min, max);
}

export function uniqueChurchEraNames(
  entries: readonly ChurchEntry[] = CHURCH_ENTRIES,
): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  for (const entry of entries) {
    const name = entry.era ?? entry.title;
    if (seen.has(name)) continue;
    seen.add(name);
    names.push(name);
  }
  return names;
}

export const CHURCH_ERA_NAMES = uniqueChurchEraNames();

export function churchJumpItems(
  entries: readonly ChurchEntry[] = CHURCH_ENTRIES,
): ChurchJumpItem[] {
  const firstId = new Map<string, string>();
  const years = new Map<string, { min: number; max: number }>();
  const order: string[] = [];

  for (const entry of entries) {
    const label = entry.era ?? entry.title;
    if (!firstId.has(label)) {
      firstId.set(label, entry.id);
      order.push(label);
    }
    const year = numericYear(entry.year);
    if (year === undefined) continue;
    const range = years.get(label);
    if (!range) {
      years.set(label, { min: year, max: year });
    } else {
      if (year < range.min) range.min = year;
      if (year > range.max) range.max = year;
    }
  }

  const items: ChurchJumpItem[] = order.map((label) => {
    const range = years.get(label);
    return {
      id: firstId.get(label) ?? label,
      label,
      range: range ? formatYearRange(range.min, range.max) : undefined,
    };
  });
  items.push({ id: "francis", label: "Today" });
  return items;
}

export const CHURCH_JUMPS = churchJumpItems();

export function eraNameForEntryId(
  id: string,
  entries: readonly ChurchEntry[] = CHURCH_ENTRIES,
): string | undefined {
  const entry = entries.find((item) => item.id === id);
  return entry ? (entry.era ?? entry.title) : undefined;
}

export function isEraExpanded(
  expandedEras: Record<string, boolean>,
  eraKey: string,
  queryActive: boolean,
): boolean {
  if (queryActive) return true;
  return Boolean(expandedEras[eraKey]);
}
