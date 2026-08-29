import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { collectArtworkCatalog } from "./artwork.ts";
import {
  ARTWORK_INTRINSIC_SIZE,
  artworkHeightForWidth,
  artworkSizeForUrl,
  FALLBACK_ARTWORK_SIZE,
  hasCataloguedArtworkSize,
} from "./artwork-size.ts";
import { wikimediaFileFromUrl, wikimediaFileUrl } from "./wikimedia.ts";

describe("artwork size catalog", () => {
  it("round-trips Commons filenames through Special:FilePath URLs", () => {
    const file = "1531_Nuestra_Señora_de_Guadalupe_anagoria.jpg";
    assert.equal(wikimediaFileFromUrl(wikimediaFileUrl(file)), file);
    assert.equal(wikimediaFileFromUrl("https://example.com/not-commons.jpg"), undefined);
  });

  it("falls back to landscape 4:3 when the file is unknown", () => {
    const size = artworkSizeForUrl("https://example.com/missing.jpg");
    assert.deepEqual(size, {
      width: FALLBACK_ARTWORK_SIZE.width,
      height: FALLBACK_ARTWORK_SIZE.height,
    });
  });

  it("reserves the intrinsic ratio of a known painting", () => {
    const url = wikimediaFileUrl("El_Greco_006.jpg");
    const size = artworkSizeForUrl(url);
    assert.equal(size.width, 1428);
    assert.equal(size.height, 3126);
    assert.equal(artworkHeightForWidth(url, 360), Math.round(360 * (3126 / 1428)));
  });

  it("covers every timeline artwork URL so new paintings cannot skip a reserved ratio", () => {
    const catalog = collectArtworkCatalog();
    const urls = [...new Set([...catalog.bible, ...catalog.church, ...catalog.missal])];
    assert.ok(urls.length > 0);
    for (const url of urls) {
      assert.equal(
        hasCataloguedArtworkSize(url),
        true,
        `missing intrinsic size for ${wikimediaFileFromUrl(url) ?? url}`,
      );
    }
    assert.ok(Object.keys(ARTWORK_INTRINSIC_SIZE).length >= urls.length);
  });
});
