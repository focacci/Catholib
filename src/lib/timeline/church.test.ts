import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHURCH_ENTRIES } from "./church.ts";
import { eventPlaceHaystack, showModernPlace } from "./place.ts";
import type { TimelineArtifact } from "./types.ts";

const CATHEN = /^https:\/\/www\.newadvent\.org\/cathen\/[0-9a-z]+\.htm$/;
const HOLY_SEE = /^https:\/\/www\.vatican\.va\//;
const PERSON_OR_EVENT = new Set(["saint", "pope", "event"]);
/** Events after the 1913 Catholic Encyclopedia, sourced from the Holy See. */
const POST_ENCYCLOPEDIA_EVENTS = new Set(["ch-vii-event"]);

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
        if (POST_ENCYCLOPEDIA_EVENTS.has(artifact.id)) {
          assert.match(
            artifact.sourceUrl,
            HOLY_SEE,
            `${artifact.id} (${artifact.type}) is after the encyclopedia and should source to vatican.va`,
          );
          continue;
        }
        assert.match(
          artifact.sourceUrl,
          CATHEN,
          `${artifact.id} (${artifact.type}) should source to newadvent.org/cathen`,
        );
      }
    }
    assert.ok(count > 0, "expected saint, pope, and event cards");
  });

  it("adds an event card for the Second Vatican Council from the Holy See", () => {
    const artifact = eventById("ch-vii-event");
    assert.equal(artifact.title, "Second Vatican Council");
    assert.match(artifact.sourceUrl, HOLY_SEE);
    assert.match(artifact.sourceUrl, /ii_vatican_council/);
    const place = artifact.location;
    assert.ok(place);
    assert.match(place.then, /St\. Peter's Basilica/i);
    assert.match(place.then, /Vatican City/i);
    assert.equal(showModernPlace(place), false);
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

  it("indexes both historic and modern names so search can find either", () => {
    const hay = eventPlaceHaystack(eventById("ch-trent-event").location);
    assert.match(hay, /Trent/);
    assert.match(hay, /Trento/);
    const nicaea = eventPlaceHaystack(eventById("ch-nicaea-event").location);
    assert.match(nicaea, /Nicaea/);
    assert.match(nicaea, /Iznik/);
  });

  it("omits a redundant Now line when the historic name already locates the place", () => {
    const pentecost = eventById("ch-pentecost-event").location;
    const assumption = eventById("ch-assump-event").location;
    const vaticanII = eventById("ch-vii-event").location;
    assert.ok(pentecost);
    assert.ok(assumption);
    assert.ok(vaticanII);
    assert.equal(showModernPlace(pentecost), false);
    assert.equal(showModernPlace(assumption), false);
    assert.equal(showModernPlace(vaticanII), false);
  });
});
