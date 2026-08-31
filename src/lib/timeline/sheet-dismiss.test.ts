import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  nextSheetScrollGesture,
  shouldDismissSheetPull,
  startSheetScrollGesture,
} from "./sheet-dismiss.ts";

describe("nextSheetScrollGesture", () => {
  it("scrolls toward the top without pulling while content remains", () => {
    const start = startSheetScrollGesture(200);
    const next = nextSheetScrollGesture({
      prev: start,
      clientY: 230,
      scrollTop: 80,
      maxScrollTop: 400,
    });
    assert.deepEqual(next, {
      gesture: { lastY: 230, pulling: false, pullY: 0 },
      scrollTop: 50,
    });
  });

  it("turns leftover movement into a sheet pull the moment the top is crossed", () => {
    const start = startSheetScrollGesture(300);
    const scrolling = nextSheetScrollGesture({
      prev: start,
      clientY: 340,
      scrollTop: 80,
      maxScrollTop: 400,
    });
    assert.equal(scrolling.scrollTop, 40);
    assert.equal(scrolling.gesture.pulling, false);

    const crossed = nextSheetScrollGesture({
      prev: scrolling.gesture,
      clientY: 390,
      scrollTop: scrolling.scrollTop,
      maxScrollTop: 400,
    });
    assert.equal(crossed.scrollTop, 0);
    assert.deepEqual(crossed.gesture, { lastY: 390, pulling: true, pullY: 10 });

    const continued = nextSheetScrollGesture({
      prev: crossed.gesture,
      clientY: 430,
      scrollTop: crossed.scrollTop,
      maxScrollTop: 400,
    });
    assert.equal(continued.scrollTop, 0);
    assert.deepEqual(continued.gesture, { lastY: 430, pulling: true, pullY: 50 });
  });

  it("pulls immediately when the gesture begins at the top", () => {
    const start = startSheetScrollGesture(100);
    const pull = nextSheetScrollGesture({
      prev: start,
      clientY: 140,
      scrollTop: 0,
      maxScrollTop: 400,
    });
    assert.deepEqual(pull, {
      gesture: { lastY: 140, pulling: true, pullY: 40 },
      scrollTop: 0,
    });
  });

  it("returns leftover reverse movement to scrolling", () => {
    const pulling = { lastY: 200, pulling: true, pullY: 30 };
    const reversed = nextSheetScrollGesture({
      prev: pulling,
      clientY: 160,
      scrollTop: 0,
      maxScrollTop: 400,
    });
    assert.deepEqual(reversed, {
      gesture: { lastY: 160, pulling: false, pullY: 0 },
      scrollTop: 10,
    });
  });

  it("scrolls into the page when the finger moves up", () => {
    const start = startSheetScrollGesture(250);
    const down = nextSheetScrollGesture({
      prev: start,
      clientY: 220,
      scrollTop: 60,
      maxScrollTop: 400,
    });
    assert.deepEqual(down, {
      gesture: { lastY: 220, pulling: false, pullY: 0 },
      scrollTop: 90,
    });
  });
});

describe("shouldDismissSheetPull", () => {
  it("dismisses once the pull crosses the threshold", () => {
    assert.equal(shouldDismissSheetPull(71), false);
    assert.equal(shouldDismissSheetPull(72), true);
  });
});
