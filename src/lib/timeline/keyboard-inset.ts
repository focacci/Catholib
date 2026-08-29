/**
 * Pin overlay chrome to the software keyboard via the visual viewport.
 * iOS does not shrink the layout viewport; Chromium may overlay when
 * VirtualKeyboard.overlaysContent is set.
 *
 * On iOS 26, `window.innerHeight` wobbles with the keyboard. The stable
 * layout height is `document.documentElement.clientHeight` (use the max of
 * that and innerHeight so a shrinking innerHeight cannot under-lift).
 */

/** Ignore URL-bar / toolbar jitter; a real keyboard is much taller. */
export const KEYBOARD_INSET_THRESHOLD_PX = 80;

/** Downward pull on the search bar that closes the keyboard. */
export const SEARCH_BAR_PULL_DISMISS_PX = 24;

/** Keep compact chrome while the keyboard finishes closing after blur. */
export const KEYBOARD_BLUR_HOLD_MS = 280;

/** Wait for the focusing tap to finish before lifting chrome, so the click cannot hit a card. */
export const SEARCH_FOCUS_LIFT_DELAY_MS = 50;

/**
 * iOS 26 Liquid Glass form accessory (arrows + checkmark) overlays the bottom
 * of the visual viewport. Web pages cannot hide it; lift search above it.
 */
export const IOS_KEYBOARD_ACCESSORY_PX = 54;

/** Follow the keyboard animation after focus; iOS 26 visualViewport events can lag. */
export const KEYBOARD_CHASE_MS = 800;

export function isAppleTouchDevice(args: {
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
}): boolean {
  if (/iPhone|iPad|iPod/i.test(args.userAgent)) return true;
  return args.platform === "MacIntel" && args.maxTouchPoints > 1;
}

export function appleKeyboardAccessoryPx(args: {
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
}): number {
  return isAppleTouchDevice(args) ? IOS_KEYBOARD_ACCESSORY_PX : 0;
}

/** Prefer the unshrunk layout height when innerHeight collapses with the keyboard. */
export function layoutViewportBottom(args: { clientHeight: number; innerHeight: number }): number {
  return Math.max(args.clientHeight || 0, args.innerHeight || 0);
}

export function keyboardInsetFromViewport(args: {
  layoutBottom: number;
  visualHeight: number;
  visualOffsetTop: number;
  virtualKeyboardHeight?: number;
  accessoryInset?: number;
}): number {
  const visual = Math.max(0, args.layoutBottom - args.visualHeight - args.visualOffsetTop);
  const virtualKb = Math.max(0, args.virtualKeyboardHeight ?? 0);
  const base = Math.max(visual, virtualKb);
  if (!isSoftwareKeyboardOpen(base)) return 0;
  return base + Math.max(0, args.accessoryInset ?? 0);
}

/** Pin overlay search chrome to the layout viewport, not a shrinking dvh shell. */
export function overlaySearchBarPinStyle(lift: number): {
  position: "fixed";
  left: "0px";
  right: "0px";
  bottom: string;
} | null {
  if (lift <= 0) return null;
  return { position: "fixed", left: "0px", right: "0px", bottom: `${lift}px` };
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
