/**
 * Hide-on-scroll overlay chrome: 0 = fully shown, maxOffset = fully hidden.
 * Tracks finger movement 1:1 so the timeline does not jump when chrome recedes.
 * On release, a partial hide finishes off-screen (or a pull-back finishes on-screen).
 *
 * Overlay bars move with compositor transforms. Sticky `top` stays at the full
 * reserved `--chrome-h` so hide-on-scroll does not restyle the timeline.
 * Stickies follow the header with `--chrome-shift` (same Y as the overlay
 * header transform), which is used only in `transform`.
 */

export const CHROME_SETTLE_MS = 240;
export const CHROME_SETTLE_IDLE_MS = 120;

export function nextChromeHideOffset(args: {
  prev: number;
  delta: number;
  scrollTop: number;
  maxOffset: number;
}): number {
  const { prev, delta, scrollTop, maxOffset } = args;
  if (maxOffset <= 0 || scrollTop < 1) return 0;
  return Math.min(Math.max(prev + delta, 0), Math.min(maxOffset, scrollTop));
}

export function chromeHideProgress(offset: number, maxOffset: number): number {
  if (maxOffset <= 0) return 0;
  return Math.min(1, Math.max(0, offset / maxOffset));
}

export function visibleChromeSize(progress: number, size: number): number {
  return Math.max(0, size * (1 - progress));
}

/** Treat sub-pixel remainders as fully off-screen so inert/pointer-events stay in sync. */
export function chromeFullyHidden(visiblePx: number): boolean {
  return visiblePx < 0.5;
}

/**
 * Full overlay size for sticky `top` / `--chrome-h`. Held constant while chrome
 * hides so section headers do not recost layout.
 */
export function reservedOverlayChromePx(overlay: boolean, measuredPx: number): number {
  if (!overlay || measuredPx <= 0) return 0;
  return measuredPx;
}

/**
 * Remaining visible overlay size. Published as `--footer-h` on the FAB dock so
 * the buttons sit on the footer and pick up home-indicator padding when it is
 * gone — without inheriting into the timeline.
 */
export function stickyOverlayChromePx(overlay: boolean, visiblePx: number): number {
  if (!overlay) return 0;
  return Math.max(0, visiblePx);
}

/** Same Y as the overlay header bar; published as `--chrome-shift`. */
export function overlayChromeShiftY(overlay: boolean, headerTranslateY: number): number {
  return overlay ? headerTranslateY : 0;
}

/** Compositor-only shift: header recedes up, footer recedes down. */
export function overlayChromeTranslateY(args: {
  progress: number;
  size: number;
  edge: "header" | "footer";
}): number {
  const y = Math.max(0, args.progress) * Math.max(0, args.size);
  if (y === 0) return 0;
  return args.edge === "header" ? -y : y;
}

export function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 3;
}

export function interpolateChromeOffset(start: number, target: number, t: number): number {
  return start + (target - start) * easeOutCubic(t);
}

/**
 * Where chrome should rest after the user lets go.
 * A partial hide continues fully off-screen even if the list has not
 * scrolled a full chrome-height; a pull-back finishes on-screen.
 */
export function chromeSettleOffset(args: {
  offset: number;
  maxOffset: number;
  scrollTop: number;
  lastDelta: number;
}): number {
  const { offset, maxOffset, scrollTop, lastDelta } = args;
  if (maxOffset <= 0 || scrollTop < 1) return 0;
  if (offset <= 0.5) return 0;
  if (offset >= maxOffset - 0.5) return maxOffset;
  return lastDelta < 0 ? 0 : maxOffset;
}

/** After the query is cleared, hide chrome if the list is scrolled. */
export function chromeOffsetWhenQueryCleared(args: {
  scrollTop: number;
  maxOffset: number;
}): number {
  if (args.maxOffset <= 0 || args.scrollTop < 1) return 0;
  return args.maxOffset;
}

/** Header follows hide-on-scroll; a search query only pins the footer. */
export function nextOverlayChromeOffsets(args: {
  headerPrev: number;
  footerPrev: number;
  delta: number;
  scrollTop: number;
  maxOffset: number;
  holdFooter: boolean;
}): { header: number; footer: number } {
  const header = nextChromeHideOffset({
    prev: args.headerPrev,
    delta: args.delta,
    scrollTop: args.scrollTop,
    maxOffset: args.maxOffset,
  });
  const footer = args.holdFooter
    ? 0
    : nextChromeHideOffset({
        prev: args.footerPrev,
        delta: args.delta,
        scrollTop: args.scrollTop,
        maxOffset: args.maxOffset,
      });
  return { header, footer };
}
