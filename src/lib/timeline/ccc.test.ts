import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BIBLE_BOOKS } from "./bible.ts";
import { CCC_PAGE, CCC_PARAGRAPH, cccParagraphFor, cccParagraphNumber, cccUrl } from "./ccc.ts";
import { CHURCH_ENTRIES } from "./church.ts";
import { graph } from "../graph/compile.ts";
import type { TimelineArtifact } from "./types.ts";

function allArtifacts(): TimelineArtifact[] {
  return [
    ...BIBLE_BOOKS.flatMap((book) =>
      book.populatedChapters.flatMap((chapter) => chapter.artifacts),
    ),
    ...CHURCH_ENTRIES.flatMap((entry) => entry.artifacts),
  ];
}

describe("Catechism cards", () => {
  const cards = allArtifacts().filter((artifact) => artifact.type === "catechism");

  it("covers every catechism card used in Bible and Church views", () => {
    assert.ok(cards.length >= 70, `expected many catechism cards, got ${cards.length}`);
  });

  it("copies an official paragraph for every CCC title and links to that page", () => {
    const used = new Set<number>();
    const graphCcc = new Set(
      [...graph().nodes.values()]
        .filter((node) => node.kind === "ccc")
        .map((node) => Number(node.id.slice(4))),
    );
    for (const artifact of cards) {
      const num = cccParagraphNumber(artifact.title);
      assert.ok(num, `${artifact.id} title should be CCC <number>`);
      used.add(num);
      const body = CCC_PARAGRAPH[num];
      assert.ok(body && body.length > 40, `${artifact.id} is missing the official CCC ${num} text`);
      assert.equal(
        artifact.sourceUrl,
        cccUrl(num),
        `${artifact.id} should open the Vatican page that contains CCC ${num}`,
      );
      assert.match(
        artifact.sourceUrl,
        /^https:\/\/www\.vatican\.va\/archive\/ENG0015\/__P[0-9A-Z]+\.HTM$/,
      );
    }
    const unused = Object.keys(CCC_PARAGRAPH)
      .map(Number)
      .filter((n) => !used.has(n) && !graphCcc.has(n));
    assert.deepEqual(unused, [], "CCC_PARAGRAPH should only hold paragraphs the cards display");
    const unpaged = [...used].filter((n) => !CCC_PAGE[n]);
    assert.deepEqual(unpaged, [], "every displayed paragraph needs a Vatican page id");
  });

  it("does not paste a different paragraph under the card title", () => {
    const thirtyTwo = cccParagraphFor("CCC 32") ?? "";
    assert.match(thirtyTwo, /starting from movement/);
    assert.doesNotMatch(thirtyTwo, /participate in Being itself/);

    const sevenSeventyNine = cccParagraphFor("CCC 779") ?? "";
    assert.match(sevenSeventyNine, /Mystical Body of Christ/);
    assert.doesNotMatch(sevenSeventyNine, /sacrament of salvation/);

    const twentyFiveSeventyFive = cccParagraphFor("CCC 2575") ?? "";
    assert.match(twentyFiveSeventyFive, /burning bush/);
    assert.doesNotMatch(twentyFiveSeventyFive, /conflict of prayer/);
  });

  it("maps each paragraph to the IntraText leaf that contains it", () => {
    assert.equal(CCC_PAGE[32], "PA");
    assert.equal(CCC_PAGE[201], "P16");
    assert.equal(CCC_PAGE[245], "P17");
    assert.equal(CCC_PAGE[424], "P1D");
    assert.equal(CCC_PAGE[447], "P1H");
    assert.equal(CCC_PAGE[465], "P1J");
    assert.equal(CCC_PAGE[601], "P1O");
    assert.equal(CCC_PAGE[779], "P27");
    assert.equal(CCC_PAGE[1060], "P2R");
    assert.equal(CCC_PAGE[1334], "P3Z");
    assert.equal(CCC_PAGE[1376], "P41");
    assert.equal(CCC_PAGE[1439], "P4B");
    assert.equal(CCC_PAGE[1826], "P66");
    assert.equal(CCC_PAGE[2084], "P7C");
    assert.equal(cccUrl(2084), "https://www.vatican.va/archive/ENG0015/__P7C.HTM");
  });
});

describe("Papal sheets", () => {
  it("do not carry doctrinal quotes", () => {
    const papal = allArtifacts().filter((artifact) => artifact.type === "papal");
    assert.ok(papal.length > 0, "expected papal cards");
    for (const artifact of papal) {
      assert.equal(
        artifact.shortQuote,
        undefined,
        `${artifact.id} should not quote doctrine; catechism cards are the only source`,
      );
    }
  });
});
