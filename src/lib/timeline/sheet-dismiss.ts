/** Pull-down distance that closes the About sheet after the content hits the top. */
export const SHEET_DISMISS_PX = 72;

export type SheetScrollPull = {
  /** The finger is pulling the sheet closed instead of scrolling. */
  pulling: boolean;
  /** Client Y used as the origin for pull distance. */
  originY: number;
  /** How far the sheet has been pulled down, in px. */
  pullY: number;
};

export function idleSheetScrollPull(originY = 0): SheetScrollPull {
  return { pulling: false, originY, pullY: 0 };
}

/**
 * Nested-scroll dismiss: a downward swipe that reaches the top of the sheet
 * contents keeps going and pulls the sheet closed. Origins rebase while the
 * list is still scrolling so the pull starts at zero as the top is crossed.
 */
export function nextSheetScrollPull(args: {
  scrollTop: number;
  clientY: number;
  prev: SheetScrollPull;
  start?: boolean;
}): SheetScrollPull {
  if (args.start) return idleSheetScrollPull(args.clientY);

  const dy = args.clientY - args.prev.originY;

  if (args.prev.pulling) {
    const pullY = Math.max(0, dy);
    return pullY > 0
      ? { pulling: true, originY: args.prev.originY, pullY }
      : idleSheetScrollPull(args.clientY);
  }

  if (args.scrollTop <= 0 && dy > 0) {
    return { pulling: true, originY: args.prev.originY, pullY: dy };
  }

  return idleSheetScrollPull(args.clientY);
}

export function shouldDismissSheetPull(
  pullY: number,
  thresholdPx = SHEET_DISMISS_PX,
): boolean {
  return pullY >= thresholdPx;
}
