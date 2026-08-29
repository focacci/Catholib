import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  chromeFullyHidden,
  chromeHideProgress,
  chromeOffsetWhenQueryCleared,
  chromeSettleOffset,
  interpolateChromeOffset,
  nextChromeHideOffset,
  nextOverlayChromeOffsets,
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

  it("tracks a large flick 1:1 instead of snapping past the finger", () => {
    assert.equal(
      nextChromeHideOffset({
        prev: 80,
        delta: -30,
        scrollTop: 400,
        maxOffset: 120,
      }),
      50,
    );
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

describe("chromeSettleOffset", () => {
  it("leaves fully shown or fully hidden chrome where it is", () => {
    assert.equal(
      chromeSettleOffset({
        offset: 0,
        maxOffset: 120,
        scrollTop: 400,
        lastDelta: 20,
      }),
      0,
    );
    assert.equal(
      chromeSettleOffset({
        offset: 120,
        maxOffset: 120,
        scrollTop: 400,
        lastDelta: -8,
      }),
      120,
    );
  });

  it("finishes hiding after a partial hide when the user lets go", () => {
    assert.equal(
      chromeSettleOffset({
        offset: 40,
        maxOffset: 120,
        scrollTop: 200,
        lastDelta: 12,
      }),
      120,
    );
  });

  it("finishes showing if the last move was a pull-back", () => {
    assert.equal(
      chromeSettleOffset({
        offset: 40,
        maxOffset: 120,
        scrollTop: 200,
        lastDelta: -12,
      }),
      0,
    );
  });

  it("finishes fully off-screen even if the list has not scrolled a full chrome height", () => {
    assert.equal(
      chromeSettleOffset({
        offset: 20,
        maxOffset: 120,
        scrollTop: 50,
        lastDelta: 10,
      }),
      120,
    );
  });

  it("stays shown at the top of the list", () => {
    assert.equal(
      chromeSettleOffset({
        offset: 40,
        maxOffset: 120,
        scrollTop: 0,
        lastDelta: 20,
      }),
      0,
    );
  });
});

describe("chromeOffsetWhenQueryCleared", () => {
  it("targets fully hidden when the list is already scrolled", () => {
    assert.equal(chromeOffsetWhenQueryCleared({ scrollTop: 240, maxOffset: 120 }), 120);
  });

  it("stays shown at the top of the list", () => {
    assert.equal(chromeOffsetWhenQueryCleared({ scrollTop: 0, maxOffset: 120 }), 0);
  });
});

describe("nextOverlayChromeOffsets", () => {
  it("hides the header on scroll while a query keeps the footer on-screen", () => {
    assert.deepEqual(
      nextOverlayChromeOffsets({
        headerPrev: 20,
        footerPrev: 0,
        delta: 40,
        scrollTop: 80,
        maxOffset: 120,
        holdFooter: true,
      }),
      { header: 60, footer: 0 },
    );
  });

  it("brings a hidden footer back when a query starts holding it", () => {
    assert.deepEqual(
      nextOverlayChromeOffsets({
        headerPrev: 120,
        footerPrev: 120,
        delta: 10,
        scrollTop: 400,
        maxOffset: 120,
        holdFooter: true,
      }),
      { header: 120, footer: 0 },
    );
  });

  it("hides header and footer together when the footer is not held", () => {
    assert.deepEqual(
      nextOverlayChromeOffsets({
        headerPrev: 20,
        footerPrev: 20,
        delta: 40,
        scrollTop: 80,
        maxOffset: 120,
        holdFooter: false,
      }),
      { header: 60, footer: 60 },
    );
  });
});

describe("interpolateChromeOffset", () => {
  it("starts at the origin and lands on the target", () => {
    assert.equal(interpolateChromeOffset(10, 110, 0), 10);
    assert.equal(interpolateChromeOffset(10, 110, 1), 110);
  });
});
