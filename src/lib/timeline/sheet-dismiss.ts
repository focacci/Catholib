/** Pull-down distance that closes the About sheet after the content hits the top. */
export const SHEET_DISMISS_PX = 72;

export type SheetScrollGesture = {
  lastY: number;
  pulling: boolean;
  pullY: number;
};

export function startSheetScrollGesture(clientY: number): SheetScrollGesture {
  return { lastY: clientY, pulling: false, pullY: 0 };
}

/**
 * Owns both list scrolling and sheet dismiss so one downward swipe can
 * scroll to the top and, in the same motion, start pulling the sheet closed.
 * `scrollTop` is the value the caller should apply; leftover finger movement
 * after the list hits 0 becomes `pullY`.
 */
export function nextSheetScrollGesture(args: {
  prev: SheetScrollGesture;
  clientY: number;
  scrollTop: number;
  maxScrollTop: number;
}): { gesture: SheetScrollGesture; scrollTop: number } {
  const dy = args.clientY - args.prev.lastY;
  const maxScrollTop = Math.max(0, args.maxScrollTop);
  let { pulling, pullY } = args.prev;
  let scrollTop = Math.min(maxScrollTop, Math.max(0, args.scrollTop));

  if (pulling) {
    const nextPull = pullY + dy;
    if (nextPull > 0) {
      pullY = nextPull;
    } else {
      pullY = 0;
      pulling = false;
      scrollTop = Math.min(maxScrollTop, scrollTop - nextPull);
    }
  } else if (dy > 0) {
    if (scrollTop > 0) {
      const nextScroll = Math.max(0, scrollTop - dy);
      const leftover = dy - (scrollTop - nextScroll);
      scrollTop = nextScroll;
      if (leftover > 0) {
        pulling = true;
        pullY = leftover;
      }
    } else {
      pulling = true;
      pullY = dy;
    }
  } else if (dy < 0) {
    scrollTop = Math.min(maxScrollTop, scrollTop - dy);
  }

  return {
    gesture: { lastY: args.clientY, pulling, pullY },
    scrollTop,
  };
}

export function shouldDismissSheetPull(
  pullY: number,
  thresholdPx = SHEET_DISMISS_PX,
): boolean {
  return pullY >= thresholdPx;
}
