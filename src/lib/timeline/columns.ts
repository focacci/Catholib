import type { ArtifactType } from "./types.ts";

/** Tailwind `gap-4` between dual content columns. Keep in sync with `dual:gap-4`. */
export const DUAL_COLUMN_GAP_PX = 16;

/** `px-2` on the chapter/section that wraps the dual grid. */
const DUAL_GRID_X_PAD_PX = 16;

/** `--rail-pad` inset on the main (left) card stack. */
const MAIN_COLUMN_RAIL_PAD_PX = 20;

/**
 * Tailwind classes for stacked cards on portrait phones, two columns on
 * desktop and landscape. Gap must stay aligned with `DUAL_COLUMN_GAP_PX`.
 */
export const DUAL_COLUMN_GRID_CLASS =
  "flex flex-col gap-2 dual:grid dual:grid-cols-2 dual:items-start dual:gap-4";

export interface ColumnItem {
  type?: ArtifactType | string;
  imageUrl?: string;
}

/** Artwork cards belong on the right; everything else stays on the left. */
export function belongsInArtworkColumn(item: ColumnItem): boolean {
  if (item.type === "artwork") return true;
  if (item.type != null) return false;
  return Boolean(item.imageUrl);
}

export function partitionTimelineColumns<T extends ColumnItem>(
  items: readonly T[],
): { main: T[]; artwork: T[] } {
  const main: T[] = [];
  const artwork: T[] = [];
  for (const item of items) {
    if (belongsInArtworkColumn(item)) artwork.push(item);
    else main.push(item);
  }
  return { main, artwork };
}

export function dualColumnCardWidths(wrapperWidth: number): {
  main: number;
  artwork: number;
} {
  const column = Math.max(0, (wrapperWidth - DUAL_GRID_X_PAD_PX - DUAL_COLUMN_GAP_PX) / 2);
  return {
    main: Math.max(200, column - MAIN_COLUMN_RAIL_PAD_PX),
    artwork: Math.max(200, column),
  };
}

export function singleColumnCardWidth(wrapperWidth: number, insetPx: number): number {
  return Math.max(200, wrapperWidth - insetPx);
}
