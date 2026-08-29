/**
 * Hide-on-scroll overlay chrome: 0 = fully shown, maxOffset = fully hidden.
 * Tracks finger movement 1:1 so the timeline does not jump when chrome recedes.
 * On release, a partial hide finishes off-screen (or a pull-back finishes on-screen).
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

export function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 3;
}

export function interpolateChromeOffset(start: number, target: number, t: number): number {
  return start + (target - start) * easeOutCubic(t);
}

/**
 * Where chrome should rest after the user lets go.
 * A partial hide continues off-screen; a pull-back (last delta negative) finishes on-screen.
 */
export function chromeSettleOffset(args: {
  offset: number;
  maxOffset: number;
  scrollTop: number;
  lastDelta: number;
}): number {
  const { offset, maxOffset, scrollTop, lastDelta } = args;
  if (maxOffset <= 0 || scrollTop < 1) return 0;
  const maxHide = Math.min(maxOffset, scrollTop);
  if (offset <= 0.5) return 0;
  if (offset >= maxHide - 0.5) return maxHide;
  return lastDelta < 0 ? 0 : maxHide;
}
