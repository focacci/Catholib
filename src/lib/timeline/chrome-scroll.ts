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

/**
 * Inline --chrome-h / --footer-h. `null` clears the inline property so the
 * same `lg` / `max-lg` CSS that overlays the header can set the inset.
 * Writing `0px` in the sidebar layout must not survive iPad rotation onto
 * overlay chrome — sticky section titles would then sit under the header.
 */
export function overlayChromeVars(args: {
  overlay: boolean;
  headerProgress: number;
  footerProgress: number;
  headerVisiblePx: number;
  footerVisiblePx: number;
}): { chromeH: string | null; footerH: string | null } {
  if (!args.overlay || (args.headerProgress <= 0 && args.footerProgress <= 0)) {
    return { chromeH: null, footerH: null };
  }
  return {
    chromeH: `${args.headerVisiblePx}px`,
    footerH: `${args.footerVisiblePx}px`,
  };
}

export function assignChromeVars(
  style: {
    setProperty: (name: string, value: string) => void;
    removeProperty: (name: string) => string;
  },
  vars: { chromeH: string | null; footerH: string | null },
): void {
  if (vars.chromeH == null) style.removeProperty("--chrome-h");
  else style.setProperty("--chrome-h", vars.chromeH);
  if (vars.footerH == null) style.removeProperty("--footer-h");
  else style.setProperty("--footer-h", vars.footerH);
}
