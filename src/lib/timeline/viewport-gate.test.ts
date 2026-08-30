import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  containIntrinsicSize,
  estimateArtifactListHeight,
  estimateChapterBlockHeight,
  estimateChapterIndexHeight,
  estimateDualChapterBlockHeight,
  estimateDualSectionBodyHeight,
  estimateExpandedBookBodyHeight,
  estimateExpandedSectionsHeight,
  estimateSectionBodyHeight,
  isNearScrollport,
} from "./viewport-gate.ts";
import { wikimediaFileUrl } from "./wikimedia.ts";

describe("timeline height estimates", () => {
  it("reserves more space for artwork cards than text cards", () => {
    const text = estimateArtifactListHeight([{}]);
    const image = estimateArtifactListHeight([
      { imageUrl: wikimediaFileUrl("Michelangelo_-_Creation_of_Adam_(cropped).jpg") },
    ]);
    assert.ok(image > text);
    assert.ok(text > 0);
  });

  it("grows with the number of artifacts in a chapter", () => {
    const one = estimateChapterBlockHeight({ artifacts: [{}] });
    const three = estimateChapterBlockHeight({ artifacts: [{}, {}, {}] });
    assert.ok(three > one);
  });

  it("keeps section bodies at least as tall as their cards", () => {
    const cards = estimateArtifactListHeight([
      {},
      { imageUrl: wikimediaFileUrl("El_Greco_006.jpg") },
    ]);
    const section = estimateSectionBodyHeight([
      {},
      { imageUrl: wikimediaFileUrl("El_Greco_006.jpg") },
    ]);
    assert.ok(section >= cards);
  });

  it("sizes portrait artwork taller than landscape at the same card width", () => {
    const landscape = estimateArtifactListHeight(
      [{ imageUrl: wikimediaFileUrl("Michelangelo_-_Creation_of_Adam_(cropped).jpg") }],
      360,
    );
    const portrait = estimateArtifactListHeight(
      [{ imageUrl: wikimediaFileUrl("El_Greco_006.jpg") }],
      360,
    );
    assert.ok(portrait > landscape);
  });

  it("scales estimates with the measured card width", () => {
    const url = wikimediaFileUrl("The_Last_Supper_-_Leonardo_Da_Vinci_-_High_Resolution_32x16.jpg");
    const narrow = estimateArtifactListHeight([{ imageUrl: url }], 300);
    const wide = estimateArtifactListHeight([{ imageUrl: url }], 600);
    assert.ok(wide > narrow);
  });

  it("uses the taller column for dual-column chapter estimates", () => {
    const artifacts = [{}, {}, { type: "artwork", imageUrl: wikimediaFileUrl("El_Greco_006.jpg") }];
    const stacked = estimateChapterBlockHeight({ artifacts }, 360);
    const dual = estimateDualChapterBlockHeight({ artifacts }, 360, 360);
    const chrome =
      estimateChapterBlockHeight({ artifacts: [{}] }) - estimateArtifactListHeight([{}]);
    const columns = Math.max(
      estimateArtifactListHeight([{}, {}]),
      estimateArtifactListHeight([artifacts[2]], 360),
    );
    assert.ok(dual < stacked);
    assert.equal(dual, chrome + columns);
  });

  it("uses the taller column for dual-column church estimates", () => {
    const artifacts = [{}, { type: "artwork", imageUrl: wikimediaFileUrl("El_Greco_006.jpg") }];
    const stacked = estimateSectionBodyHeight(artifacts, 360);
    const dual = estimateDualSectionBodyHeight(artifacts, 360, 360);
    const chrome = estimateSectionBodyHeight([{}]) - estimateArtifactListHeight([{}]);
    const columns = Math.max(
      estimateArtifactListHeight([{}]),
      estimateArtifactListHeight([artifacts[1]], 360),
    );
    assert.ok(dual < stacked);
    assert.equal(dual, chrome + columns);
  });

  it("emits a remembered intrinsic size the browser can skip-paint with", () => {
    assert.equal(containIntrinsicSize(280), "auto 280px");
    assert.equal(containIntrinsicSize(0), "auto 1px");
  });

  it("sizes the Bible chapter-number grid from row count", () => {
    const oneRow = estimateChapterIndexHeight(8);
    const twoRows = estimateChapterIndexHeight(9);
    assert.equal(estimateChapterIndexHeight(0), 0);
    assert.ok(oneRow > 0);
    assert.equal(twoRows, oneRow + 44 + 4);
  });

  it("sizes an expanded book body from its index and chapters", () => {
    const index = estimateChapterIndexHeight(50);
    const chapters = estimateChapterBlockHeight({ artifacts: [{}, {}] });
    const body = estimateExpandedBookBodyHeight({
      indexChapters: 50,
      chapters: [{ artifacts: [{}, {}] }],
      dualColumn: false,
      cardWidthPx: 360,
      artworkWidthPx: 360,
    });
    assert.equal(body, index + chapters);
  });

  it("sizes expanded church sections from headers plus bodies", () => {
    const body = estimateSectionBodyHeight([{}]);
    const stacked = estimateExpandedSectionsHeight([{ artifacts: [{}] }, { artifacts: [{}] }], false, 360, 360);
    assert.equal(stacked, 48 + body + 48 + body);
  });
});

describe("isNearScrollport", () => {
  it("is true when the target overlaps the port, including margin", () => {
    const port = { top: 100, bottom: 500 };
    assert.equal(isNearScrollport({ top: 120, bottom: 200 }, port, 0), true);
    assert.equal(isNearScrollport({ top: 520, bottom: 600 }, port, 80), true);
    assert.equal(isNearScrollport({ top: 700, bottom: 800 }, port, 80), false);
  });
});
