/**
 * Hide-on-scroll overlay chrome: 0 = fully shown, maxOffset = fully hidden.
 * Tracks finger movement 1:1 so the timeline does not jump when chrome recedes.
 */
export function nextChromeHideOffset(args: {
  prev: number;
  delta: number;
  scrollTop: number;
  maxOffset: number;
}): number {
  const { prev, delta, scrollTop, maxOffset } = args;
  if (maxOffset <= 0 || scrollTop < 1 || delta < -maxOffset) return 0;
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
