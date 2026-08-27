import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  estimateArtifactListHeight,
  estimateChapterBlockHeight,
  estimateSectionBodyHeight,
} from "./viewport-gate.ts";

describe("timeline height estimates", () => {
  it("reserves more space for artwork cards than text cards", () => {
    const text = estimateArtifactListHeight([{}]);
    const image = estimateArtifactListHeight([{ imageUrl: "https://example.com/a.jpg" }]);
    assert.ok(image > text);
    assert.ok(text > 0);
  });

  it("grows with the number of artifacts in a chapter", () => {
    const one = estimateChapterBlockHeight({ artifacts: [{}] });
    const three = estimateChapterBlockHeight({ artifacts: [{}, {}, {}] });
    assert.ok(three > one);
  });

  it("keeps section bodies at least as tall as their cards", () => {
    const cards = estimateArtifactListHeight([{}, { imageUrl: "https://example.com/a.jpg" }]);
    const section = estimateSectionBodyHeight([{}, { imageUrl: "https://example.com/a.jpg" }]);
    assert.ok(section >= cards);
  });
});
