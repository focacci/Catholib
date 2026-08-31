import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  idleSheetScrollPull,
  nextSheetScrollPull,
  shouldDismissSheetPull,
} from "./sheet-dismiss.ts";

describe("nextSheetScrollPull", () => {
  it("starts idle at the touch origin", () => {
    assert.deepEqual(
      nextSheetScrollPull({
        scrollTop: 40,
        clientY: 200,
        prev: idleSheetScrollPull(),
        start: true,
      }),
      { pulling: false, originY: 200, pullY: 0 },
    );
  });

  it("pulls the sheet when the gesture begins at the top and moves down", () => {
    const start = nextSheetScrollPull({
      scrollTop: 0,
      clientY: 100,
      prev: idleSheetScrollPull(),
      start: true,
    });
    const pull = nextSheetScrollPull({
      scrollTop: 0,
      clientY: 140,
      prev: start,
    });
    assert.deepEqual(pull, { pulling: true, originY: 100, pullY: 40 });
  });

  it("rebases while scrolling so crossing the top starts a fresh pull", () => {
    const start = nextSheetScrollPull({
      scrollTop: 80,
      clientY: 300,
      prev: idleSheetScrollPull(),
      start: true,
    });
    const scrolling = nextSheetScrollPull({
      scrollTop: 40,
      clientY: 340,
      prev: start,
    });
    assert.deepEqual(scrolling, { pulling: false, originY: 340, pullY: 0 });

    const crossedTop = nextSheetScrollPull({
      scrollTop: 0,
      clientY: 360,
      prev: scrolling,
    });
    assert.deepEqual(crossedTop, { pulling: true, originY: 340, pullY: 20 });

    const continued = nextSheetScrollPull({
      scrollTop: 0,
      clientY: 400,
      prev: crossedTop,
    });
    assert.deepEqual(continued, { pulling: true, originY: 340, pullY: 60 });
  });

  it("returns to scrolling when the pull is released back to the top", () => {
    const pulling = { pulling: true, originY: 200, pullY: 30 };
    const released = nextSheetScrollPull({
      scrollTop: 0,
      clientY: 200,
      prev: pulling,
    });
    assert.deepEqual(released, { pulling: false, originY: 200, pullY: 0 });
  });

  it("does not pull when the list is still scrolled and the finger moves up", () => {
    const start = nextSheetScrollPull({
      scrollTop: 60,
      clientY: 250,
      prev: idleSheetScrollPull(),
      start: true,
    });
    const up = nextSheetScrollPull({
      scrollTop: 80,
      clientY: 220,
      prev: start,
    });
    assert.deepEqual(up, { pulling: false, originY: 220, pullY: 0 });
  });
});

describe("shouldDismissSheetPull", () => {
  it("dismisses once the pull crosses the threshold", () => {
    assert.equal(shouldDismissSheetPull(71), false);
    assert.equal(shouldDismissSheetPull(72), true);
  });
});
