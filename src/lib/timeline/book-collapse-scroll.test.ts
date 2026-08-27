import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collapsePinChromeHeight,
  isBookHeaderStuck,
  scrollerTopForSection,
} from "./book-collapse-scroll.ts";

describe("isBookHeaderStuck", () => {
  it("is false when the header still sits at the section top", () => {
    assert.equal(isBookHeaderStuck(120, 120), false);
    assert.equal(isBookHeaderStuck(118, 120), false);
  });

  it("is true once the section has scrolled up under a sticky header", () => {
    assert.equal(isBookHeaderStuck(-40, 96), true);
    assert.equal(isBookHeaderStuck(-2400, 8), true);
  });
});

describe("scrollerTopForSection", () => {
  it("keeps a section already at the chrome edge", () => {
    assert.equal(
      scrollerTopForSection({
        scrollTop: 400,
        sectionTop: 96,
        scrollerTop: 0,
        chromeHeight: 96,
      }),
      400,
    );
  });

  it("scrolls up so a section above the viewport lands at the chrome edge", () => {
    assert.equal(
      scrollerTopForSection({
        scrollTop: 3200,
        sectionTop: -1800,
        scrollerTop: 0,
        chromeHeight: 0,
      }),
      1400,
    );
  });

  it("does not scroll above the start of the list", () => {
    assert.equal(
      scrollerTopForSection({
        scrollTop: 20,
        sectionTop: 0,
        scrollerTop: 0,
        chromeHeight: 96,
      }),
      0,
    );
  });
});

describe("collapsePinChromeHeight", () => {
  it("uses the full header height when the overlay is currently hidden", () => {
    assert.equal(collapsePinChromeHeight(0, 113), 113);
  });

  it("keeps the visible overlay height when it already matches the header", () => {
    assert.equal(collapsePinChromeHeight(113, 113), 113);
  });
});
