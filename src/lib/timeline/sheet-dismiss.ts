/** Pull-down distance that closes the About sheet after the content hits the top. */
export const SHEET_DISMISS_PX = 72;

export type SheetOverscroll = {
  lastY: number;
  lastScrollTop: number;
  pulling: boolean;
  pullY: number;
};

export function startSheetOverscroll(
  clientY: number,
  scrollTop = 0,
): SheetOverscroll {
  return { lastY: clientY, lastScrollTop: scrollTop, pulling: false, pullY: 0 };
}

/**
 * Native list scrolling stays with the browser (so flings still glide).
 * While a swipe is active, leftover downward movement after the list hits
 * the top becomes a sheet pull in the same motion.
 */
export function nextSheetOverscroll(args: {
  prev: SheetOverscroll;
  clientY: number;
  scrollTop: number;
}): SheetOverscroll {
  const dy = args.clientY - args.prev.lastY;
  const scrollTop = Math.max(0, args.scrollTop);

  if (args.prev.pulling) {
    const nextPull = args.prev.pullY + dy;
    if (nextPull > 0) {
      return { lastY: args.clientY, lastScrollTop: 0, pulling: true, pullY: nextPull };
    }
    return { lastY: args.clientY, lastScrollTop: 0, pulling: false, pullY: 0 };
  }

  if (scrollTop <= 0 && dy > 0) {
    const consumed = Math.max(0, args.prev.lastScrollTop - scrollTop);
    const leftover = Math.max(0, dy - consumed);
    return {
      lastY: args.clientY,
      lastScrollTop: 0,
      pulling: leftover > 0 || args.prev.lastScrollTop <= 0,
      pullY: leftover,
    };
  }

  return {
    lastY: args.clientY,
    lastScrollTop: scrollTop,
    pulling: false,
    pullY: 0,
  };
}

export function shouldDismissSheetPull(
  pullY: number,
  thresholdPx = SHEET_DISMISS_PX,
): boolean {
  return pullY >= thresholdPx;
}
