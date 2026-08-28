import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { collectArtworkCatalog, orderArtworkForView } from "./artwork.ts";
import { ARTWORK_DISPLAY_WIDTH } from "./wikimedia.ts";

describe("artwork catalog", () => {
  const catalog = collectArtworkCatalog();

  it("collects unique Wikimedia files at display width", () => {
    assert.ok(catalog.bible.length >= 20);
    assert.ok(catalog.church.length >= 10);
    assert.equal(new Set(catalog.bible).size, catalog.bible.length);
    assert.equal(new Set(catalog.church).size, catalog.church.length);
    for (const url of [...catalog.bible, ...catalog.church, ...catalog.missal]) {
      assert.match(
        url,
        new RegExp(`^https://commons\\.wikimedia\\.org/wiki/Special:FilePath/.+width=${ARTWORK_DISPLAY_WIDTH}$`),
      );
    }
  });

  it("puts the open book's paintings first so a fast scroll hits cache", () => {
    const genesis = catalog.bibleByBook.Genesis ?? [];
    assert.ok(genesis.length > 0);
    const ordered = orderArtworkForView(catalog, "bible", { Genesis: true });
    assert.deepEqual(ordered.slice(0, genesis.length), genesis);
  });

  it("promotes Church artwork when that view is active", () => {
    const ordered = orderArtworkForView(catalog, "church", { Genesis: true });
    assert.equal(ordered[0], catalog.church[0]);
  });
});
