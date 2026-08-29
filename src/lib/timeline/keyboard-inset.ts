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
export const KEYBOARD_BLUR_HOLD_MS = 420;

/** Wait for the focusing tap to finish before lifting chrome, so the click cannot hit a card. */
export const SEARCH_FOCUS_LIFT_DELAY_MS = 50;

/**
 * iOS keyboard hide duration. visualViewport often jumps to 0 at the end of
 * the animation; interpolate so the search bar rides down instead of snapping.
 */
export const KEYBOARD_CLOSE_MS = 380;

/** Follow the keyboard animation after focus; iOS 26 visualViewport events can lag. */
export const KEYBOARD_CHASE_MS = 800;

/** Prefer the unshrunk layout height when innerHeight collapses with the keyboard. */
export function layoutViewportBottom(args: { clientHeight: number; innerHeight: number }): number {
  return Math.max(args.clientHeight || 0, args.innerHeight || 0);
}

/** Raw gap between the visual viewport and the layout bottom (no keyboard threshold). */
export function visualViewportGap(args: {
  layoutBottom: number;
  visualHeight: number;
  visualOffsetTop: number;
  virtualKeyboardHeight?: number;
}): number {
  // Negative offsetTop is iOS rubber-band at the top; do not treat it as more keyboard.
  const offset = Math.max(0, args.visualOffsetTop);
  const visual = Math.max(0, args.layoutBottom - args.visualHeight - offset);
  const virtualKb = Math.max(0, args.virtualKeyboardHeight ?? 0);
  return Math.max(visual, virtualKb);
}

/** While search is focused, do not let overscroll raise the bar above the open keyboard. */
export function stabilizeFocusedKeyboardLift(args: {
  measuredLift: number;
  lastOpenLift: number;
  searchFocused: boolean;
  pulling: boolean;
  freezeOpenLift: boolean;
}): number {
  if (args.pulling) return args.measuredLift;
  if (!args.searchFocused || args.lastOpenLift <= 0) return args.measuredLift;
  if (args.freezeOpenLift) return args.lastOpenLift;
  return Math.min(args.measuredLift, args.lastOpenLift);
}

export function keyboardInsetFromViewport(args: {
  layoutBottom: number;
  visualHeight: number;
  visualOffsetTop: number;
  virtualKeyboardHeight?: number;
}): number {
  const base = visualViewportGap(args);
  if (!isSoftwareKeyboardOpen(base)) return 0;
  return base;
}

/** Pin overlay search chrome to the layout viewport, not a shrinking dvh shell. */
export function overlaySearchBarPinStyle(lift: number): {
  position: "fixed";
  left: "0px";
  right: "0px";
  bottom: string;
} | null {
  if (lift <= 0.5) return null;
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

/** Capture the gesture before the timeline behind the bar can scroll. */
export function shouldCaptureSearchBarPull(args: {
  gestureActive: boolean;
  fingerDy: number;
  fingerDx: number;
}): boolean {
  if (!args.gestureActive) return false;
  if (args.fingerDy <= 0) return false;
  return args.fingerDy >= Math.abs(args.fingerDx);
}

/** While dragging, the bar follows the finger down from the open-keyboard inset. */
export function pullingSearchBarLift(args: {
  frozenInset: number;
  fingerDy: number;
  liveGap: number;
  followKeyboard: boolean;
}): number {
  const fromFinger = Math.max(0, args.frozenInset - Math.max(0, args.fingerDy));
  if (!args.followKeyboard) return fromFinger;
  return Math.max(0, Math.min(fromFinger, args.liveGap));
}

function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 3;
}

/**
 * After release, ride the keyboard closed. Prefer the live visual-viewport gap
 * once it actually shrinks; until then (iOS often reports nothing until the
 * end) interpolate from the finger's last lift so the bar does not sit still
 * and then snap.
 */
export function ridingSearchBarLift(args: {
  liveGap: number;
  rideCeiling: number;
  startGap: number;
  elapsedMs: number;
  closeMs?: number;
}): number {
  const ceiling = Math.max(0, args.rideCeiling);
  const live = Math.max(0, args.liveGap);
  const keyboardMoved = live < args.startGap - 8;
  if (keyboardMoved) return Math.min(live, ceiling);
  const duration = args.closeMs ?? KEYBOARD_CLOSE_MS;
  const animated = ceiling * (1 - easeOutCubic(args.elapsedMs / duration));
  return Math.max(0, Math.min(ceiling, animated));
}
