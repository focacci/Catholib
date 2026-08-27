import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BIBLE_BOOKS, nabreChapterUrl, usccbChapterUrl } from "./bible.ts";
import {
  bibleVersionLinks,
  DOUAY_RHEIMS_SLUG,
  douayRheimsChapterUrl,
  RSVCE_SLUG,
  rsvceChapterUrl,
} from "./bible-versions.ts";

describe("Bible chapter version URLs", () => {
  it("keeps NABRE on the USCCB host", () => {
    assert.equal(
      nabreChapterUrl("Genesis", 1),
      "https://bible.usccb.org/bible/genesis/1",
    );
    assert.equal(
      nabreChapterUrl("1 Samuel", 17),
      "https://bible.usccb.org/bible/1samuel/17",
    );
    assert.equal(
      nabreChapterUrl("Song of Songs", 8),
      "https://bible.usccb.org/bible/songofsongs/8",
    );
    assert.equal(
      nabreChapterUrl("Acts of the Apostles", 2),
      "https://bible.usccb.org/bible/acts/2",
    );
    assert.equal(nabreChapterUrl("Genesis", 1), usccbChapterUrl("Genesis", 1));
  });

  it("builds RSV-CE chapter URLs on ewtn.com", () => {
    assert.equal(
      rsvceChapterUrl("Genesis", 1),
      "https://www.ewtn.com/bible/33-genesis/1",
    );
    assert.equal(
      rsvceChapterUrl("1 Samuel", 17),
      "https://www.ewtn.com/bible/7-1-samuel/17",
    );
    assert.equal(
      rsvceChapterUrl("Song of Songs", 8),
      "https://www.ewtn.com/bible/68-song-of-solomon/8",
    );
    assert.equal(
      rsvceChapterUrl("Acts of the Apostles", 2),
      "https://www.ewtn.com/bible/20-acts/2",
    );
    assert.equal(
      rsvceChapterUrl("Revelation", 21),
      "https://www.ewtn.com/bible/64-revelation/21",
    );
  });

  it("builds Douay-Rheims chapter URLs on thedouayrheims.com", () => {
    assert.equal(
      douayRheimsChapterUrl("Genesis", 1),
      "https://thedouayrheims.com/odr/genesis/1",
    );
    assert.equal(
      douayRheimsChapterUrl("Joshua", 1),
      "https://thedouayrheims.com/odr/josue/1",
    );
    assert.equal(
      douayRheimsChapterUrl("1 Samuel", 1),
      "https://thedouayrheims.com/odr/1-kings/1",
    );
    assert.equal(
      douayRheimsChapterUrl("1 Kings", 8),
      "https://thedouayrheims.com/odr/3-kings/8",
    );
    assert.equal(
      douayRheimsChapterUrl("Song of Songs", 1),
      "https://thedouayrheims.com/odr/canticle-of-canticles/1",
    );
    assert.equal(
      douayRheimsChapterUrl("Isaiah", 7),
      "https://thedouayrheims.com/odr/isaie/7",
    );
    assert.equal(
      douayRheimsChapterUrl("Revelation", 21),
      "https://thedouayrheims.com/odr/apocalypse/21",
    );
  });

  it("lists NABRE, RSV-CE, then Douay Rheims for every book", () => {
    assert.equal(BIBLE_BOOKS.length, 73);
    assert.equal(Object.keys(RSVCE_SLUG).length, 73);
    assert.equal(Object.keys(DOUAY_RHEIMS_SLUG).length, 73);

    for (const book of BIBLE_BOOKS) {
      const links = bibleVersionLinks(book.name, 1);
      assert.deepEqual(
        links.map((link) => link.label),
        ["NABRE", "RSV-CE", "Douay Rheims"],
        book.name,
      );
      assert.match(links[0].href, /^https:\/\/bible\.usccb\.org\/bible\//);
      assert.match(links[1].href, /^https:\/\/www\.ewtn\.com\/bible\//);
      assert.match(links[2].href, /^https:\/\/thedouayrheims\.com\/odr\//);
      assert.doesNotMatch(links[0].href, /undefined/);
      assert.doesNotMatch(links[1].href, /undefined/);
      assert.doesNotMatch(links[2].href, /undefined/);
    }
  });
});
