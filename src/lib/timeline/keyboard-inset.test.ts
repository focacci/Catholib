import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isSearchDismissTap,
  isSoftwareKeyboardOpen,
  keyboardInsetFromViewport,
  shouldCompactLibraryChrome,
  shouldDismissSearchKeyboard,
  shouldDismissSearchKeyboardOnScroll,
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

describe("shouldDismissSearchKeyboard", () => {
  it("closes on a downward swipe outside the search row", () => {
    assert.equal(
      shouldDismissSearchKeyboard({
        searchFocused: true,
        active: true,
        fingerDy: 12,
      }),
      true,
    );
    assert.equal(
      shouldDismissSearchKeyboard({
        searchFocused: true,
        active: true,
        fingerDy: 4,
      }),
      false,
    );
  });

  it("ignores an upward swipe so results can still be scrolled", () => {
    assert.equal(
      shouldDismissSearchKeyboard({
        searchFocused: true,
        active: true,
        fingerDy: -40,
      }),
      false,
    );
  });

  it("does not dismiss from gestures that started on the search row", () => {
    assert.equal(
      shouldDismissSearchKeyboard({
        searchFocused: true,
        active: false,
        fingerDy: 40,
      }),
      false,
    );
  });
});

describe("isSearchDismissTap", () => {
  it("treats a short press outside the search row as a dismiss tap", () => {
    assert.equal(
      isSearchDismissTap({
        searchFocused: true,
        active: true,
        totalMovement: 2,
      }),
      true,
    );
    assert.equal(
      isSearchDismissTap({
        searchFocused: true,
        active: true,
        totalMovement: 20,
      }),
      false,
    );
  });
});

describe("shouldDismissSearchKeyboardOnScroll", () => {
  it("closes when scrollTop drops (finger moving down)", () => {
    assert.equal(
      shouldDismissSearchKeyboardOnScroll({
        searchFocused: true,
        scrollDelta: -16,
      }),
      true,
    );
    assert.equal(
      shouldDismissSearchKeyboardOnScroll({
        searchFocused: true,
        scrollDelta: 16,
      }),
      false,
    );
  });
});
