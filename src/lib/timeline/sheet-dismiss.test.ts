import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  nextSheetOverscroll,
  shouldDismissSheetPull,
  startSheetOverscroll,
} from "./sheet-dismiss.ts";

describe("nextSheetOverscroll", () => {
  it("leaves mid-list movement to native scrolling", () => {
    const start = startSheetOverscroll(200, 80);
    const next = nextSheetOverscroll({
      prev: start,
      clientY: 230,
      scrollTop: 50,
    });
    assert.deepEqual(next, {
      lastY: 230,
      lastScrollTop: 50,
      pulling: false,
      pullY: 0,
    });
  });

  it("turns leftover movement into a sheet pull the moment the top is crossed", () => {
    const start = startSheetOverscroll(300, 80);
    const scrolling = nextSheetOverscroll({
      prev: start,
      clientY: 340,
      scrollTop: 40,
    });
    assert.equal(scrolling.pulling, false);

    const crossed = nextSheetOverscroll({
      prev: scrolling,
      clientY: 390,
      scrollTop: 0,
    });
    assert.deepEqual(crossed, {
      lastY: 390,
      lastScrollTop: 0,
      pulling: true,
      pullY: 10,
    });

    const continued = nextSheetOverscroll({
      prev: crossed,
      clientY: 430,
      scrollTop: 0,
    });
    assert.deepEqual(continued, {
      lastY: 430,
      lastScrollTop: 0,
      pulling: true,
      pullY: 50,
    });
  });

  it("pulls immediately when the gesture begins at the top", () => {
    const start = startSheetOverscroll(100, 0);
    const pull = nextSheetOverscroll({
      prev: start,
      clientY: 140,
      scrollTop: 0,
    });
    assert.deepEqual(pull, {
      lastY: 140,
      lastScrollTop: 0,
      pulling: true,
      pullY: 40,
    });
  });

  it("returns to native scrolling when the pull is released back to the top", () => {
    const pulling = {
      lastY: 200,
      lastScrollTop: 0,
      pulling: true,
      pullY: 30,
    };
    const released = nextSheetOverscroll({
      prev: pulling,
      clientY: 160,
      scrollTop: 0,
    });
    assert.deepEqual(released, {
      lastY: 160,
      lastScrollTop: 0,
      pulling: false,
      pullY: 0,
    });
  });
});

describe("shouldDismissSheetPull", () => {
  it("dismisses once the pull crosses the threshold", () => {
    assert.equal(shouldDismissSheetPull(71), false);
    assert.equal(shouldDismissSheetPull(72), true);
  });
});
