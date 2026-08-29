import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { wikimediaFileUrl } from "./wikimedia.ts";
import {
  belongsInArtworkColumn,
  dualColumnCardWidths,
  partitionTimelineColumns,
  singleColumnCardWidth,
} from "./columns.ts";

describe("partitionTimelineColumns", () => {
  it("sends artwork cards to the right and everything else to the left", () => {
    const items = [
      { type: "catechism" as const, id: "ccc" },
      { type: "artwork" as const, id: "art" },
      { type: "papal" as const, id: "papal" },
    ];
    const { main, artwork } = partitionTimelineColumns(items);
    assert.deepEqual(
      main.map((item) => item.id),
      ["ccc", "papal"],
    );
    assert.deepEqual(
      artwork.map((item) => item.id),
      ["art"],
    );
  });

  it("treats untyped estimate fixtures with an image as artwork", () => {
    const url = wikimediaFileUrl("El_Greco_006.jpg");
    assert.equal(belongsInArtworkColumn({ imageUrl: url }), true);
    assert.equal(belongsInArtworkColumn({ type: "catechism", imageUrl: url }), false);
    const { main, artwork } = partitionTimelineColumns([{}, { imageUrl: url }]);
    assert.equal(main.length, 1);
    assert.equal(artwork.length, 1);
  });

  it("keeps a chapter of only text in the main column", () => {
    const { main, artwork } = partitionTimelineColumns([
      { type: "commentary" as const },
      { type: "catechism" as const },
    ]);
    assert.equal(main.length, 2);
    assert.equal(artwork.length, 0);
  });
});

describe("column width math", () => {
  it("splits a dual wrapper into two card columns", () => {
    const { main, artwork } = dualColumnCardWidths(1152);
    assert.ok(artwork > main);
    assert.equal(artwork, (1152 - 16 - 16) / 2);
    assert.equal(main, artwork - 20);
  });

  it("subtracts the single-column inset from the wrapper", () => {
    assert.equal(singleColumnCardWidth(576, 36), 540);
  });
});
