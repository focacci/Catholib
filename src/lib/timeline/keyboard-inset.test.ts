import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isSoftwareKeyboardOpen,
  keyboardInsetFromViewport,
  shouldCompactLibraryChrome,
  shouldPullDismissSearchBar,
} from "./keyboard-inset.ts";

describe("keyboardInsetFromViewport", () => {
  it("is zero when the visual viewport fills the layout", () => {
    assert.equal(
      keyboardInsetFromViewport({
        innerHeight: 800,
        visualHeight: 800,
        visualOffsetTop: 0,
      }),
      0,
    );
  });

  it("measures the occluded strip including a Safari pan", () => {
    assert.equal(
      keyboardInsetFromViewport({
        innerHeight: 800,
        visualHeight: 460,
        visualOffsetTop: 40,
      }),
      300,
    );
  });

  it("uses the larger of visual occlusion and VirtualKeyboard height", () => {
    assert.equal(
      keyboardInsetFromViewport({
        innerHeight: 800,
        visualHeight: 800,
        visualOffsetTop: 0,
        virtualKeyboardHeight: 320,
      }),
      320,
    );
    assert.equal(
      keyboardInsetFromViewport({
        innerHeight: 800,
        visualHeight: 450,
        visualOffsetTop: 0,
        virtualKeyboardHeight: 200,
      }),
      350,
    );
  });
});

describe("isSoftwareKeyboardOpen", () => {
  it("ignores small toolbar changes and treats a keyboard-sized inset as open", () => {
    assert.equal(isSoftwareKeyboardOpen(24), false);
    assert.equal(isSoftwareKeyboardOpen(80), true);
    assert.equal(isSoftwareKeyboardOpen(300), true);
  });
});

describe("shouldCompactLibraryChrome", () => {
  it("stays expanded on sidebar layouts", () => {
    assert.equal(
      shouldCompactLibraryChrome({
        overlayLayout: false,
        searchFocused: true,
        holdCompact: true,
        keyboardInset: 320,
      }),
      false,
    );
  });

  it("compacts while search is focused even before the keyboard reports a height", () => {
    assert.equal(
      shouldCompactLibraryChrome({
        overlayLayout: true,
        searchFocused: true,
        holdCompact: false,
        keyboardInset: 0,
      }),
      true,
    );
  });

  it("stays compact after blur while the keyboard is still up or holding", () => {
    assert.equal(
      shouldCompactLibraryChrome({
        overlayLayout: true,
        searchFocused: false,
        holdCompact: false,
        keyboardInset: 280,
      }),
      true,
    );
    assert.equal(
      shouldCompactLibraryChrome({
        overlayLayout: true,
        searchFocused: false,
        holdCompact: true,
        keyboardInset: 0,
      }),
      true,
    );
  });

  it("expands when the keyboard is gone and search is not focused", () => {
    assert.equal(
      shouldCompactLibraryChrome({
        overlayLayout: true,
        searchFocused: false,
        holdCompact: false,
        keyboardInset: 0,
      }),
      false,
    );
  });
});

describe("shouldPullDismissSearchBar", () => {
  it("closes when the already-focused search bar is pulled down", () => {
    assert.equal(
      shouldPullDismissSearchBar({
        gestureActive: true,
        fingerDy: 24,
        fingerDx: 2,
      }),
      true,
    );
    assert.equal(
      shouldPullDismissSearchBar({
        gestureActive: true,
        fingerDy: 8,
        fingerDx: 0,
      }),
      false,
    );
  });

  it("ignores a mostly horizontal move so the caret can still be dragged", () => {
    assert.equal(
      shouldPullDismissSearchBar({
        gestureActive: true,
        fingerDy: 24,
        fingerDx: 40,
      }),
      false,
    );
  });

  it("does not close on the first tap that focuses search", () => {
    assert.equal(
      shouldPullDismissSearchBar({
        gestureActive: false,
        fingerDy: 40,
        fingerDx: 0,
      }),
      false,
    );
  });

  it("ignores an upward swipe so the field is not dismissed while adjusting", () => {
    assert.equal(
      shouldPullDismissSearchBar({
        gestureActive: true,
        fingerDy: -40,
        fingerDx: 0,
      }),
      false,
    );
  });
});
