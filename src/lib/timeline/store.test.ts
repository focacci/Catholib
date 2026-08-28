import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextExpandedBooks } from "./store.ts";

describe("nextExpandedBooks", () => {
  it("opens one book at a time so Jump to… does not keep Genesis mounted", () => {
    assert.deepEqual(nextExpandedBooks({ Genesis: true }, "Psalms", true), {
      Psalms: true,
    });
  });

  it("closes a book without wiping the rest of the map", () => {
    assert.deepEqual(
      nextExpandedBooks({ Genesis: true, Exodus: true }, "Exodus", false),
      { Genesis: true, Exodus: false },
    );
  });
});
