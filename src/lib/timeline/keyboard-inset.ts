/**
 * Pin overlay chrome to the software keyboard via the visual viewport.
 * iOS does not shrink the layout viewport; Chromium may overlay when
 * VirtualKeyboard.overlaysContent is set.
 */

/** Ignore URL-bar / toolbar jitter; a real keyboard is much taller. */
export const KEYBOARD_INSET_THRESHOLD_PX = 80;

/** Finger-down distance that dismisses search, matching a short swipe. */
export const SEARCH_KEYBOARD_DISMISS_PX = 12;

/** Keep compact chrome while the keyboard finishes closing after blur. */
export const KEYBOARD_BLUR_HOLD_MS = 280;

export function keyboardInsetFromViewport(args: {
  innerHeight: number;
  visualHeight: number;
  visualOffsetTop: number;
  virtualKeyboardHeight?: number;
}): number {
  const visual = Math.max(0, args.innerHeight - args.visualHeight - args.visualOffsetTop);
  const virtualKb = Math.max(0, args.virtualKeyboardHeight ?? 0);
  return Math.max(visual, virtualKb);
}

export function isSoftwareKeyboardOpen(inset: number): boolean {
  return inset >= KEYBOARD_INSET_THRESHOLD_PX;
}

export function shouldCompactLibraryChrome(args: {
  overlayLayout: boolean;
  searchFocused: boolean;
  holdCompact: boolean;
  keyboardInset: number;
}): boolean {
  if (!args.overlayLayout) return false;
  return args.searchFocused || args.holdCompact || isSoftwareKeyboardOpen(args.keyboardInset);
}

/** Finger moving down (positive dy) closes the keyboard. */
export function shouldDismissSearchKeyboard(args: {
  searchFocused: boolean;
  active: boolean;
  fingerDy: number;
  thresholdPx?: number;
}): boolean {
  if (!args.searchFocused || !args.active) return false;
  return args.fingerDy >= (args.thresholdPx ?? SEARCH_KEYBOARD_DISMISS_PX);
}

/** Tap outside the search row, not a drag. */
export function isSearchDismissTap(args: {
  searchFocused: boolean;
  active: boolean;
  totalMovement: number;
  thresholdPx?: number;
}): boolean {
  if (!args.searchFocused || !args.active) return false;
  return args.totalMovement < (args.thresholdPx ?? SEARCH_KEYBOARD_DISMISS_PX);
}

/** Downward finger on the timeline decreases scrollTop. */
export function shouldDismissSearchKeyboardOnScroll(args: {
  searchFocused: boolean;
  scrollDelta: number;
  thresholdPx?: number;
}): boolean {
  return shouldDismissSearchKeyboard({
    searchFocused: args.searchFocused,
    active: true,
    fingerDy: -args.scrollDelta,
    thresholdPx: args.thresholdPx,
  });
}
