import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CCC_PARAGRAPH } from "../timeline/ccc.ts";
import { parseRef, scriptureIdFromRef } from "./parse-ref.ts";
import {
  CCC_SCRIPTURE_EDGES,
  cccScriptureEdges,
  extractScriptureRefs,
} from "./seeds-ccc-scripture.ts";

describe("CCC paragraph scripture seeds", () => {
  it("mines only the closed CCC_PARAGRAPH corpus", () => {
    assert.deepEqual(cccScriptureEdges(), CCC_SCRIPTURE_EDGES);
    assert.ok(CCC_SCRIPTURE_EDGES.length > 0);
    for (const edge of CCC_SCRIPTURE_EDGES) {
      const n = Number(edge.from.slice(4));
      assert.ok(Number.isInteger(n) && CCC_PARAGRAPH[n], `unknown paragraph ${edge.from}`);
      assert.equal(edge.kind, "cites");
      assert.match(edge.to, /^scripture:[a-z0-9]+\.\d+/);
      const parsed = parseRef(edge.ref);
      assert.ok(parsed, edge.ref);
      assert.equal(scriptureIdFromRef(parsed), edge.to);
      assert.equal(edge.confidence, parsed.verse != null ? "exact" : "chapter");
    }
  });

  it("parses known locators in the official excerpts", () => {
    const byFrom = new Map(CCC_SCRIPTURE_EDGES.map((edge) => [edge.from, edge]));
    const heb65 = byFrom.get("ccc:65");
    assert.equal(heb65?.to, "scripture:heb.1.1-2");
    assert.equal(heb65?.confidence, "exact");
    const heb146 = byFrom.get("ccc:146");
    assert.equal(heb146?.to, "scripture:heb.11.1");
    assert.equal(heb146?.confidence, "exact");
    const gn390 = byFrom.get("ccc:390");
    assert.equal(gn390?.to, "scripture:gn.3");
    assert.equal(gn390?.confidence, "chapter");
    const ps447 = byFrom.get("ccc:447");
    assert.equal(ps447?.to, "scripture:ps.110");
    assert.equal(ps447?.confidence, "chapter");
    const is712 = byFrom.get("ccc:712");
    assert.equal(is712?.to, "scripture:is.11");
    assert.equal(is712?.confidence, "chapter");
    const cor1060 = byFrom.get("ccc:1060");
    assert.equal(cor1060?.to, "scripture:1cor.15.28");
    assert.equal(cor1060?.confidence, "exact");
  });

  it("skips quotations that are not compact locators", () => {
    assert.equal(extractScriptureRefs(CCC_PARAGRAPH[241] ?? "").length, 0);
    assert.equal(extractScriptureRefs(CCC_PARAGRAPH[289] ?? "").length, 0);
    assert.equal(extractScriptureRefs(CCC_PARAGRAPH[424] ?? "").length, 0);
    assert.equal(extractScriptureRefs(CCC_PARAGRAPH[1374] ?? "").length, 0);
    assert.equal(
      CCC_SCRIPTURE_EDGES.filter((edge) =>
        ["ccc:241", "ccc:289", "ccc:424", "ccc:1374"].includes(edge.from),
      ).length,
      0,
    );
  });
});
