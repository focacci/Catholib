/**
 * Pin overlay chrome to the software keyboard via the visual viewport.
 * iOS does not shrink the layout viewport; Chromium may overlay when
 * VirtualKeyboard.overlaysContent is set.
 */

/** Ignore URL-bar / toolbar jitter; a real keyboard is much taller. */
export const KEYBOARD_INSET_THRESHOLD_PX = 80;

/** Downward pull on the search bar that closes the keyboard. */
export const SEARCH_BAR_PULL_DISMISS_PX = 24;

/** Keep compact chrome while the keyboard finishes closing after blur. */
export const KEYBOARD_BLUR_HOLD_MS = 280;

/** Wait for the focusing tap to finish before lifting chrome, so the click cannot hit a card. */
export const SEARCH_FOCUS_LIFT_DELAY_MS = 50;

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

/**
 * Close the keyboard by pulling the search bar down.
 * The gesture must have started on the search chrome while it was already focused,
 * and the move must be mostly vertical.
 */
export function shouldPullDismissSearchBar(args: {
  gestureActive: boolean;
  fingerDy: number;
  fingerDx: number;
  thresholdPx?: number;
}): boolean {
  if (!args.gestureActive) return false;
  const threshold = args.thresholdPx ?? SEARCH_BAR_PULL_DISMISS_PX;
  return args.fingerDy >= threshold && args.fingerDy >= Math.abs(args.fingerDx);
}
