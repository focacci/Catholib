import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BIBLE_BOOKS } from "./bible.ts";
import { collectHits, countHitsByView, filterArtifacts, searchHitStripItems } from "./search.ts";

describe("countHitsByView", () => {
  it("returns zeros when there is no query or type filter", () => {
    assert.deepEqual(countHitsByView("", "all"), {
      bible: 0,
      church: 0,
      missal: 0,
    });
  });

  it("matches collectHits totals for a book-name query", () => {
    const query = "Genesis";
    const hits = collectHits(query, "all");
    const counts = countHitsByView(query, "all");
    assert.equal(counts.bible, hits.filter((hit) => hit.view === "bible").length);
    assert.equal(counts.church, hits.filter((hit) => hit.view === "church").length);
    assert.equal(counts.missal, hits.filter((hit) => hit.view === "missal").length);
    assert.ok(counts.bible > 0);
  });

  it("matches collectHits totals for a commentary filter", () => {
    const hits = collectHits("", "commentary");
    const counts = countHitsByView("", "commentary");
    assert.equal(counts.bible, hits.length);
    assert.ok(counts.bible > 1000);
    assert.equal(counts.church, 0);
    assert.equal(counts.missal, 0);
  });
});

describe("searchHitStripItems", () => {
  it("always lists Bible, Church, then Missal so counts line up with the footer tabs", () => {
    const items = searchHitStripItems({ bible: 4, church: 0, missal: 2 });
    assert.deepEqual(
      items.map((item) => item.id),
      ["bible", "church", "missal"],
    );
    assert.deepEqual(
      items.map((item) => `${item.count} in ${item.label}`),
      ["4 in Bible", "0 in Church", "2 in Missal"],
    );
  });
});

describe("filterArtifacts", () => {
  it("keeps catechism cards whose official paragraph text matches", () => {
    const genesis = BIBLE_BOOKS.find((book) => book.name === "Genesis");
    assert.ok(genesis);
    const artifacts = genesis.populatedChapters.flatMap((chapter) => chapter.artifacts);
    const hits = filterArtifacts(artifacts, "original holiness", "all");
    assert.ok(hits.some((artifact) => artifact.type === "catechism"));
  });
});
