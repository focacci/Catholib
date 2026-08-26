import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHURCH_ENTRIES } from "./church.ts";
import { eventPlaceHaystack, showModernPlace } from "./place.ts";
import { collectHits } from "./search.ts";
import type { TimelineArtifact } from "./types.ts";

const CATHEN = /^https:\/\/www\.newadvent\.org\/cathen\/[0-9a-z]+\.htm$/;
const PERSON_OR_EVENT = new Set(["saint", "pope", "event"]);

function eventCards(): TimelineArtifact[] {
  return CHURCH_ENTRIES.flatMap((entry) =>
    entry.artifacts.filter((artifact) => artifact.type === "event"),
  );
}

function eventById(id: string): TimelineArtifact {
  const artifact = eventCards().find((item) => item.id === id);
  assert.ok(artifact, `missing event ${id}`);
  return artifact;
}

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

  it("records historic and present-day names for every event card", () => {
    const events = eventCards();
    assert.ok(events.length > 0, "expected event cards");
    for (const artifact of events) {
      const place = artifact.location;
      assert.ok(place, `${artifact.id} is missing the place the event took place`);
      assert.ok(
        place.then.trim().length > 0,
        `${artifact.id} is missing the historic place name`,
      );
      assert.ok(
        place.now.trim().length > 0,
        `${artifact.id} is missing the present-day place name`,
      );
      assert.ok(
        /[,\s]/.test(place.then.trim()),
        `${artifact.id} historic place should include region or geography, not only a city name`,
      );
    }
  });

  it("names the modern city when the historic name has changed", () => {
    const renamed: Array<{ id: string; then: RegExp; now: RegExp }> = [
      { id: "ch-trent-event", then: /Trent/i, now: /Trento/i },
      { id: "ch-nicaea-event", then: /Nicaea/i, now: /Iznik/i },
      { id: "ch-nicaea2-event", then: /Nicaea/i, now: /Iznik/i },
      { id: "ch-const1-event", then: /Constantinople/i, now: /Istanbul/i },
      { id: "ch-const2-event", then: /Constantinople/i, now: /Istanbul/i },
      { id: "ch-const3-event", then: /Constantinople/i, now: /Istanbul/i },
      { id: "ch-ephesus-event", then: /Ephesus/i, now: /Selcuk|Turkey/i },
      { id: "ch-chalcedon-event", then: /Chalcedon/i, now: /Kadikoy|Istanbul/i },
      { id: "ch-florence-event", then: /Florence/i, now: /Italy/i },
      { id: "ch-lat4-event", then: /Lateran|Rome/i, now: /Italy/i },
      { id: "ch-vi-event", then: /Rome/i, now: /Vatican City/i },
    ];
    for (const { id, then, now } of renamed) {
      const place = eventById(id).location;
      assert.ok(place, `${id} is missing a place`);
      assert.match(place.then, then, `${id} historic name`);
      assert.match(place.now, now, `${id} present-day name`);
      assert.equal(showModernPlace(place), true, `${id} should show the modern name`);
    }
  });

  it("finds councils by their modern place names", () => {
    const trent = collectHits("Trento", "event");
    assert.ok(
      trent.some((hit) => hit.artifact.id === "ch-trent-event"),
      "searching Trento should find the Council of Trent",
    );
    const nicaea = collectHits("Iznik", "event");
    assert.ok(
      nicaea.some((hit) => hit.artifact.id === "ch-nicaea-event"),
      "searching Iznik should find Nicaea",
    );
  });

  it("indexes both historic and modern names in the search haystack", () => {
    const place = eventById("ch-trent-event").location;
    assert.ok(place);
    const hay = eventPlaceHaystack(place);
    assert.match(hay, /Trent/);
    assert.match(hay, /Trento/);
  });

  it("omits a redundant Now line when the historic name already locates the place", () => {
    const pentecost = eventById("ch-pentecost-event").location;
    const assumption = eventById("ch-assump-event").location;
    assert.ok(pentecost);
    assert.ok(assumption);
    assert.equal(showModernPlace(pentecost), false);
    assert.equal(showModernPlace(assumption), false);
  });
});
