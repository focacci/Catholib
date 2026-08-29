import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  appleKeyboardAccessoryPx,
  IOS_KEYBOARD_ACCESSORY_PX,
  isAppleTouchDevice,
  isSoftwareKeyboardOpen,
  keyboardInsetFromViewport,
  layoutViewportBottom,
  overlaySearchBarPinStyle,
  shouldCompactLibraryChrome,
  shouldPullDismissSearchBar,
} from "./keyboard-inset.ts";

describe("layoutViewportBottom", () => {
  it("keeps the unshrunk layout height when innerHeight wobbles (iOS 26)", () => {
    assert.equal(layoutViewportBottom({ clientHeight: 714, innerHeight: 561 }), 714);
    assert.equal(layoutViewportBottom({ clientHeight: 714, innerHeight: 714 }), 714);
  });
});

describe("keyboardInsetFromViewport", () => {
  it("returns 0 when the visual viewport fills the layout viewport", () => {
    assert.equal(
      keyboardInsetFromViewport({
        layoutBottom: 800,
        visualHeight: 800,
        visualOffsetTop: 0,
      }),
      0,
    );
  });

  it("returns the gap between the visual viewport bottom and the layout bottom", () => {
    assert.equal(
      keyboardInsetFromViewport({
        layoutBottom: 800,
        visualHeight: 500,
        visualOffsetTop: 0,
      }),
      300,
    );
  });

  it("uses the visual viewport even when innerHeight also shrinks (iOS 26)", () => {
    assert.equal(
      keyboardInsetFromViewport({
        layoutBottom: 714,
        visualHeight: 404,
        visualOffsetTop: 0,
      }),
      310,
    );
  });

  it("under-lifts if layoutBottom is the shrunk innerHeight instead of clientHeight", () => {
    assert.equal(
      keyboardInsetFromViewport({
        layoutBottom: 561,
        visualHeight: 404,
        visualOffsetTop: 0,
      }),
      157,
    );
    assert.equal(
      keyboardInsetFromViewport({
        layoutBottom: layoutViewportBottom({ clientHeight: 714, innerHeight: 561 }),
        visualHeight: 404,
        visualOffsetTop: 0,
      }),
      310,
    );
  });

  it("adds the iOS accessory inset only while the software keyboard is open", () => {
    assert.equal(
      keyboardInsetFromViewport({
        layoutBottom: 800,
        visualHeight: 800,
        visualOffsetTop: 0,
        accessoryInset: IOS_KEYBOARD_ACCESSORY_PX,
      }),
      0,
    );
    assert.equal(
      keyboardInsetFromViewport({
        layoutBottom: 714,
        visualHeight: 404,
        visualOffsetTop: 0,
        accessoryInset: IOS_KEYBOARD_ACCESSORY_PX,
      }),
      310 + IOS_KEYBOARD_ACCESSORY_PX,
    );
  });

  it("ignores a visual viewport that is only slightly smaller than the layout", () => {
    assert.equal(
      keyboardInsetFromViewport({
        layoutBottom: 800,
        visualHeight: 780,
        visualOffsetTop: 0,
      }),
      0,
    );
  });

  it("uses the Virtual Keyboard API height when it is larger", () => {
    assert.equal(
      keyboardInsetFromViewport({
        layoutBottom: 800,
        visualHeight: 780,
        visualOffsetTop: 0,
        virtualKeyboardHeight: 280,
      }),
      280,
    );
  });
});

describe("isSoftwareKeyboardOpen", () => {
  it("is false for a small visual-viewport shrink", () => {
    assert.equal(isSoftwareKeyboardOpen(20), false);
  });

  it("is true once the inset looks like a software keyboard", () => {
    assert.equal(isSoftwareKeyboardOpen(80), true);
  });
});

describe("isAppleTouchDevice", () => {
  it("detects iPhone Safari", () => {
    assert.equal(
      isAppleTouchDevice({
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
        platform: "iPhone",
        maxTouchPoints: 5,
      }),
      true,
    );
  });

  it("detects iPadOS that reports as Macintosh", () => {
    assert.equal(
      isAppleTouchDevice({
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        platform: "MacIntel",
        maxTouchPoints: 5,
      }),
      true,
    );
  });

  it("does not treat a Mac with a trackpad as a phone", () => {
    assert.equal(
      isAppleTouchDevice({
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        platform: "MacIntel",
        maxTouchPoints: 0,
      }),
      false,
    );
  });
});

describe("appleKeyboardAccessoryPx", () => {
  it("is only applied on Apple touch devices", () => {
    assert.equal(
      appleKeyboardAccessoryPx({
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
        platform: "iPhone",
        maxTouchPoints: 5,
      }),
      IOS_KEYBOARD_ACCESSORY_PX,
    );
    assert.equal(
      appleKeyboardAccessoryPx({
        userAgent: "Mozilla/5.0 (Linux; Android 14)",
        platform: "Linux armv8l",
        maxTouchPoints: 5,
      }),
      0,
    );
  });
});

describe("overlaySearchBarPinStyle", () => {
  it("fixes the search bar to the layout viewport while the keyboard is up", () => {
    assert.deepEqual(overlaySearchBarPinStyle(364), {
      position: "fixed",
      left: "0px",
      right: "0px",
      bottom: "364px",
    });
    assert.equal(overlaySearchBarPinStyle(0), null);
  });
});

describe("shouldCompactLibraryChrome", () => {
  it("compacts overlay chrome while search is focused or the keyboard is open", () => {
    assert.equal(
      shouldCompactLibraryChrome({
        overlayLayout: true,
        searchFocused: true,
        holdCompact: false,
        keyboardInset: 0,
      }),
      true,
    );
    assert.equal(
      shouldCompactLibraryChrome({
        overlayLayout: true,
        searchFocused: false,
        holdCompact: false,
        keyboardInset: 0,
      }),
      false,
    );
    assert.equal(
      shouldCompactLibraryChrome({
        overlayLayout: true,
        searchFocused: false,
        holdCompact: false,
        keyboardInset: 300,
      }),
      true,
    );
    assert.equal(
      shouldCompactLibraryChrome({
        overlayLayout: false,
        searchFocused: true,
        holdCompact: false,
        keyboardInset: 300,
      }),
      false,
    );
  });
});

describe("shouldPullDismissSearchBar", () => {
  it("dismisses a mostly-vertical pull down past the threshold", () => {
    assert.equal(
      shouldPullDismissSearchBar({ gestureActive: true, fingerDx: 4, fingerDy: 40 }),
      true,
    );
  });

  it("ignores a short pull, a horizontal swipe, or a gesture that did not start on search", () => {
    assert.equal(
      shouldPullDismissSearchBar({ gestureActive: true, fingerDx: 2, fingerDy: 10 }),
      false,
    );
    assert.equal(
      shouldPullDismissSearchBar({ gestureActive: true, fingerDx: 80, fingerDy: 20 }),
      false,
    );
    assert.equal(
      shouldPullDismissSearchBar({ gestureActive: false, fingerDx: 0, fingerDy: 40 }),
      false,
    );
  });
});
