import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  chromeFullyHidden,
  chromeHideProgress,
  nextChromeHideOffset,
  visibleChromeSize,
} from "./chrome-scroll.ts";

describe("nextChromeHideOffset", () => {
  it("stays shown at the top of the list", () => {
    assert.equal(
      nextChromeHideOffset({
        prev: 40,
        delta: 12,
        scrollTop: 0,
        maxOffset: 120,
      }),
      0,
    );
  });

  it("hides with downward scroll and shows with upward scroll", () => {
    assert.equal(
      nextChromeHideOffset({
        prev: 20,
        delta: 30,
        scrollTop: 80,
        maxOffset: 120,
      }),
      50,
    );
    assert.equal(
      nextChromeHideOffset({
        prev: 50,
        delta: -20,
        scrollTop: 60,
        maxOffset: 120,
      }),
      30,
    );
  });

  it("snaps fully shown on a large flick up", () => {
    assert.equal(
      nextChromeHideOffset({
        prev: 120,
        delta: -130,
        scrollTop: 400,
        maxOffset: 120,
      }),
      0,
    );
  });

  it("cannot hide more than the chrome height or the current scroll", () => {
    assert.equal(
      nextChromeHideOffset({
        prev: 0,
        delta: 200,
        scrollTop: 40,
        maxOffset: 120,
      }),
      40,
    );
    assert.equal(
      nextChromeHideOffset({
        prev: 100,
        delta: 50,
        scrollTop: 400,
        maxOffset: 120,
      }),
      120,
    );
  });
});

describe("chromeHideProgress", () => {
  it("maps offset onto 0–1 so header and footer recede together", () => {
    assert.equal(chromeHideProgress(0, 140), 0);
    assert.equal(chromeHideProgress(70, 140), 0.5);
    assert.equal(chromeHideProgress(140, 140), 1);
    assert.equal(chromeHideProgress(10, 0), 0);
  });
});

describe("visibleChromeSize", () => {
  it("shrinks the remaining overlay height with progress", () => {
    assert.equal(visibleChromeSize(0, 96), 96);
    assert.equal(visibleChromeSize(1, 96), 0);
    assert.equal(visibleChromeSize(0.5, 80), 40);
  });
});

describe("chromeFullyHidden", () => {
  it("treats a sub-pixel sliver as gone", () => {
    assert.equal(chromeFullyHidden(12), false);
    assert.equal(chromeFullyHidden(0), true);
    assert.equal(chromeFullyHidden(0.25), true);
  });
});
