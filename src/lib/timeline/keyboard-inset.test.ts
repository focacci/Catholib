import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isSoftwareKeyboardOpen,
  keyboardInsetFromViewport,
  KEYBOARD_CLOSE_MS,
  layoutViewportBottom,
  overlaySearchBarPinStyle,
  pullingSearchBarLift,
  ridingSearchBarLift,
  shouldCaptureSearchBarPull,
  shouldCompactLibraryChrome,
  shouldPullDismissSearchBar,
  visualViewportGap,
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

  it("does not add an extra accessory offset on top of the visual viewport", () => {
    assert.equal(
      keyboardInsetFromViewport({
        layoutBottom: 714,
        visualHeight: 404,
        visualOffsetTop: 0,
      }),
      310,
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

describe("visualViewportGap", () => {
  it("keeps the shrinking gap while the keyboard is below the open threshold", () => {
    assert.equal(
      visualViewportGap({
        layoutBottom: 714,
        visualHeight: 664,
        visualOffsetTop: 0,
      }),
      50,
    );
    assert.equal(
      keyboardInsetFromViewport({
        layoutBottom: 714,
        visualHeight: 664,
        visualOffsetTop: 0,
      }),
      0,
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

describe("overlaySearchBarPinStyle", () => {
  it("fixes the search bar to the layout viewport while the keyboard is up", () => {
    assert.deepEqual(overlaySearchBarPinStyle(310), {
      position: "fixed",
      left: "0px",
      right: "0px",
      bottom: "310px",
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

describe("shouldCaptureSearchBarPull", () => {
  it("captures a downward vertical drag so the timeline cannot scroll", () => {
    assert.equal(
      shouldCaptureSearchBarPull({ gestureActive: true, fingerDx: 4, fingerDy: 12 }),
      true,
    );
  });

  it("lets a mostly-horizontal caret drag through", () => {
    assert.equal(
      shouldCaptureSearchBarPull({ gestureActive: true, fingerDx: 40, fingerDy: 8 }),
      false,
    );
  });
});

describe("pullingSearchBarLift", () => {
  it("lowers the bar by the finger distance from the open keyboard inset", () => {
    assert.equal(
      pullingSearchBarLift({
        frozenInset: 310,
        fingerDy: 80,
        liveGap: 310,
        followKeyboard: false,
      }),
      230,
    );
  });

  it("does not let a lagging visual viewport push the bar back up", () => {
    assert.equal(
      pullingSearchBarLift({
        frozenInset: 310,
        fingerDy: 80,
        liveGap: 400,
        followKeyboard: true,
      }),
      230,
    );
  });

  it("follows the keyboard once it is shorter than the finger lift", () => {
    assert.equal(
      pullingSearchBarLift({
        frozenInset: 310,
        fingerDy: 40,
        liveGap: 120,
        followKeyboard: true,
      }),
      120,
    );
  });
});

describe("ridingSearchBarLift", () => {
  it("interpolates down when the visual viewport has not started shrinking", () => {
    const start = ridingSearchBarLift({
      liveGap: 310,
      rideCeiling: 200,
      startGap: 310,
      elapsedMs: 0,
    });
    const mid = ridingSearchBarLift({
      liveGap: 310,
      rideCeiling: 200,
      startGap: 310,
      elapsedMs: KEYBOARD_CLOSE_MS / 2,
    });
    const end = ridingSearchBarLift({
      liveGap: 310,
      rideCeiling: 200,
      startGap: 310,
      elapsedMs: KEYBOARD_CLOSE_MS,
    });
    assert.equal(start, 200);
    assert.ok(mid < start && mid > 0);
    assert.equal(end, 0);
  });

  it("tracks the live keyboard height once visualViewport is moving", () => {
    assert.equal(
      ridingSearchBarLift({
        liveGap: 90,
        rideCeiling: 200,
        startGap: 310,
        elapsedMs: 40,
      }),
      90,
    );
  });

  it("never jumps above the lift where the finger released", () => {
    assert.equal(
      ridingSearchBarLift({
        liveGap: 310,
        rideCeiling: 120,
        startGap: 310,
        elapsedMs: 0,
      }),
      120,
    );
  });
});
