import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BIBLE_BOOKS } from "./bible.ts";
import {
  AUTO_EXPAND_MATCH_LIMIT,
  planBibleBookRows,
  shouldAutoExpandBook,
} from "./bible-view.ts";

describe("shouldAutoExpandBook", () => {
  it("keeps a book the user already opened", () => {
    assert.equal(
      shouldAutoExpandBook({
        userExpanded: true,
        nameMatch: false,
        queryActive: false,
        hitCount: 0,
        autoExpandMatches: false,
      }),
      true,
    );
  });

  it("opens a book whose name matches the query", () => {
    assert.equal(
      shouldAutoExpandBook({
        userExpanded: false,
        nameMatch: true,
        queryActive: true,
        hitCount: 0,
        autoExpandMatches: false,
      }),
      true,
    );
  });

  it("does not open every type-filter match", () => {
    assert.equal(
      shouldAutoExpandBook({
        userExpanded: false,
        nameMatch: false,
        queryActive: false,
        hitCount: 40,
        autoExpandMatches: false,
      }),
      false,
    );
  });
});

describe("planBibleBookRows", () => {
  it("leaves only the default Genesis expansion when browsing idle", () => {
    const rows = planBibleBookRows(BIBLE_BOOKS, "", "all", { Genesis: true });
    assert.equal(rows.length, BIBLE_BOOKS.length);
    const expanded = rows.filter((row) => row.expanded).map((row) => row.book.name);
    assert.deepEqual(expanded, ["Genesis"]);
  });

  it("does not explode every book open for a commentary filter", () => {
    const rows = planBibleBookRows(BIBLE_BOOKS, "", "commentary", { Genesis: true });
    assert.ok(rows.length > 50);
    const expanded = rows.filter((row) => row.expanded);
    assert.deepEqual(
      expanded.map((row) => row.book.name),
      ["Genesis"],
    );
    assert.ok(rows.every((row) => row.hitCount > 0));
  });

  it("opens a named book and a small artifact-match set", () => {
    const rows = planBibleBookRows(BIBLE_BOOKS, "Prodigal", "all", {});
    const expanded = rows.filter((row) => row.expanded);
    assert.ok(expanded.length > 0);
    assert.ok(expanded.length <= AUTO_EXPAND_MATCH_LIMIT);
    assert.ok(expanded.some((row) => row.book.name === "Luke"));
  });

  it("keeps broad searches collapsed except name matches", () => {
    const rows = planBibleBookRows(BIBLE_BOOKS, "the", "all", { Genesis: true });
    const expanded = rows.filter((row) => row.expanded);
    assert.ok(rows.length > AUTO_EXPAND_MATCH_LIMIT);
    assert.ok(expanded.every((row) => row.book.name === "Genesis" || row.nameMatch));
  });
});
