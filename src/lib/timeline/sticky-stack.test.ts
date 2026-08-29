import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cssLengthToPx,
  groupConsecutiveBy,
  stickyGroupHeaderPx,
  STICKY_L1_REM,
} from "./sticky-stack.ts";

describe("groupConsecutiveBy", () => {
  it("keeps separate runs of the same key as their own groups", () => {
    const items = [
      { id: "a1", era: "Imperial Church" },
      { id: "a2", era: "Imperial Church" },
      { id: "b1", era: "Patristic Age" },
      { id: "c1", era: "Imperial Church" },
    ];
    const groups = groupConsecutiveBy(items, (item) => item.era);
    assert.deepEqual(
      groups.map((group) => ({ key: group.key, ids: group.items.map((item) => item.id) })),
      [
        { key: "Imperial Church", ids: ["a1", "a2"] },
        { key: "Patristic Age", ids: ["b1"] },
        { key: "Imperial Church", ids: ["c1"] },
      ],
    );
  });

  it("returns an empty list for no items", () => {
    assert.deepEqual(
      groupConsecutiveBy([], () => "x"),
      [],
    );
  });
});

describe("cssLengthToPx", () => {
  it("converts rem using the root font size", () => {
    assert.equal(cssLengthToPx("2.5rem", 16), 40);
    assert.equal(cssLengthToPx(`${STICKY_L1_REM}rem`, 16), 40);
  });

  it("passes through pixel values", () => {
    assert.equal(cssLengthToPx("40px", 16), 40);
    assert.equal(cssLengthToPx("12", 16), 12);
  });

  it("treats empty or invalid values as zero", () => {
    assert.equal(cssLengthToPx("", 16), 0);
    assert.equal(cssLengthToPx("nope", 16), 0);
  });
});

describe("stickyGroupHeaderPx", () => {
  it("reads the group header custom property as pixels", () => {
    assert.equal(stickyGroupHeaderPx("2.5rem", 16), 40);
  });
});
