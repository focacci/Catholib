/** Keep in sync with `--sticky-l1` in `src/styles.css`. */
export const STICKY_L1_REM = 2.5;

/** Keep in sync with `--sticky-l2` in `src/styles.css`. */
export const STICKY_L2_REM = 3;

/** Keep in sync with `--sticky-fade` in `src/styles.css`. */
export const STICKY_FADE_REM = 2.25;

/** Group consecutive items that share a key, keeping separate runs apart. */
export function groupConsecutiveBy<T, K extends string>(
  items: readonly T[],
  keyOf: (item: T) => K,
): { key: K; items: T[] }[] {
  const groups: { key: K; items: T[] }[] = [];
  for (const item of items) {
    const key = keyOf(item);
    const last = groups.at(-1);
    if (last && last.key === key) {
      last.items.push(item);
      continue;
    }
    groups.push({ key, items: [item] });
  }
  return groups;
}

/** Resolve `2.5rem` / `40px` custom-property values to CSS pixels. */
export function cssLengthToPx(value: string, rootFontSizePx: number): number {
  const raw = value.trim();
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  if (raw.endsWith("rem")) return n * rootFontSizePx;
  return n;
}

export function stickyGroupHeaderPx(cssValue: string, rootFontSizePx: number): number {
  return cssLengthToPx(cssValue, rootFontSizePx);
}
