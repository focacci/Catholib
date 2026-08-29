import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  containIntrinsicSize,
  estimateArtifactListHeight,
  estimateChapterBlockHeight,
  estimateSectionBodyHeight,
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

  it("emits a remembered intrinsic size the browser can skip-paint with", () => {
    assert.equal(containIntrinsicSize(280), "auto 280px");
    assert.equal(containIntrinsicSize(0), "auto 1px");
  });
});
