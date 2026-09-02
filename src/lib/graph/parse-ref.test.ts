import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  bookToken,
  parseRef,
  scriptureIdFromRef,
  chapterIdFromRef,
} from "./parse-ref.ts";
import { parseNodeId, cccId, dayId } from "./ids.ts";

describe("parseRef", () => {
  it("parses Jn 1:1–18 into scripture:jn.1.1-18", () => {
    const ref = parseRef("Jn 1:1–18");
    assert.ok(ref);
    assert.equal(ref.bookName, "John");
    assert.equal(ref.token, "jn");
    assert.equal(ref.chapter, 1);
    assert.equal(ref.verse, 1);
    assert.equal(ref.endVerse, 18);
    assert.equal(scriptureIdFromRef(ref), "scripture:jn.1.1-18");
    assert.equal(chapterIdFromRef(ref), "scripture:jn.1");
  });

  it("parses a cross-chapter Genesis range", () => {
    const ref = parseRef("Gn 1:1–2:4");
    assert.ok(ref);
    assert.equal(scriptureIdFromRef(ref), "scripture:gn.1.1-2.4");
  });

  it("parses a chapter-only ref", () => {
    const ref = parseRef("Gn 1");
    assert.ok(ref);
    assert.equal(scriptureIdFromRef(ref), "scripture:gn.1");
  });

  it("parses Mt 16:18-19", () => {
    const ref = parseRef("Mt 16:18-19");
    assert.ok(ref);
    assert.equal(scriptureIdFromRef(ref), "scripture:mt.16.18-19");
  });

  it("maps book names onto tokens used in ids", () => {
    assert.equal(bookToken("John"), "jn");
    assert.equal(bookToken("1 Corinthians"), "1cor");
    assert.equal(bookToken("Acts of the Apostles"), "acts");
  });
});

describe("parseNodeId", () => {
  it("reads kind prefixes including commentary hosts", () => {
    assert.equal(parseNodeId("ccc:289")?.kind, "ccc");
    assert.equal(parseNodeId("haydock:jn.6")?.kind, "commentary");
    assert.equal(parseNodeId("constitution:pastor-aeternus")?.kind, "constitution");
    assert.equal(parseNodeId("rosary:luminous.5")?.kind, "rosary");
    assert.equal(cccId(424), "ccc:424");
    assert.equal(dayId(new Date(2026, 8, 2)), "day:2026-09-02");
  });
});
