import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHURCH_ENTRIES } from "./church.ts";

const CATHEN = /^https:\/\/www\.newadvent\.org\/cathen\/[0-9a-z]+\.htm$/;
const PERSON_OR_EVENT = new Set(["saint", "pope", "event"]);

describe("Church encyclopedia sources", () => {
  it("sends saint, pope, and event cards to confirmed Catholic Encyclopedia pages", () => {
    let count = 0;
    for (const entry of CHURCH_ENTRIES) {
      for (const artifact of entry.artifacts) {
        if (!PERSON_OR_EVENT.has(artifact.type)) continue;
        count += 1;
        assert.match(
          artifact.sourceUrl,
          CATHEN,
          `${artifact.id} (${artifact.type}) should source to newadvent.org/cathen`,
        );
      }
    }
    assert.ok(count > 0, "expected saint, pope, and event cards");
  });

  it("records a place for every event card", () => {
    const events = CHURCH_ENTRIES.flatMap((entry) =>
      entry.artifacts.filter((artifact) => artifact.type === "event"),
    );
    assert.ok(events.length > 0, "expected event cards");
    for (const artifact of events) {
      assert.ok(
        artifact.location && artifact.location.trim().length > 0,
        `${artifact.id} is missing the place the event took place`,
      );
    }
  });
});
