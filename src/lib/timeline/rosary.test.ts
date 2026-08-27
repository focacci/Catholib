import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { missalSections } from "./missal.ts";
import {
  ROSARY_ORIGIN,
  ROSARY_MYSTERY_LABEL,
  rosaryMysteryForDate,
  rosaryUrl,
  todayRosaryArtifact,
} from "./rosary.ts";

function localDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 12, 0, 0);
}

describe("today's rosary", () => {
  it("maps civil weekdays to scripturally based mysteries, including luminous", () => {
    assert.equal(rosaryMysteryForDate(localDate(2026, 8, 23)), "glorious");
    assert.equal(rosaryMysteryForDate(localDate(2026, 8, 24)), "joyful");
    assert.equal(rosaryMysteryForDate(localDate(2026, 8, 25)), "sorrowful");
    assert.equal(rosaryMysteryForDate(localDate(2026, 8, 26)), "glorious");
    assert.equal(rosaryMysteryForDate(localDate(2026, 8, 27)), "luminous");
    assert.equal(rosaryMysteryForDate(localDate(2026, 8, 28)), "sorrowful");
    assert.equal(rosaryMysteryForDate(localDate(2026, 8, 29)), "joyful");
    assert.equal(rosaryMysteryForDate(new Date(NaN)), null);
  });

  it("builds confirmed Rosary Center scripturally-based URLs", () => {
    assert.equal(
      rosaryUrl("joyful"),
      `${ROSARY_ORIGIN}/the-joyful-mysteries-scripturally-based`,
    );
    assert.equal(
      rosaryUrl("luminous"),
      `${ROSARY_ORIGIN}/the-luminous-mysteries-scripturally-based`,
    );
    assert.equal(
      rosaryUrl("sorrowful"),
      `${ROSARY_ORIGIN}/the-sorrowful-mysteries-scripturally-based`,
    );
    assert.equal(
      rosaryUrl("glorious"),
      `${ROSARY_ORIGIN}/the-glorious-mysteries-scripturally-based`,
    );
  });

  it("puts Thursday's luminous rosary on the Missal Today card", () => {
    const thursday = localDate(2026, 8, 27);
    const artifact = todayRosaryArtifact(thursday);
    assert.equal(artifact.id, "missal-today-rosary");
    assert.equal(artifact.type, "rosary");
    assert.equal(artifact.title, "Today's rosary");
    assert.equal(
      artifact.subtitle,
      `${ROSARY_MYSTERY_LABEL.luminous} · Scripturally based`,
    );
    assert.equal(artifact.sourceUrl, rosaryUrl("luminous"));
    assert.equal(artifact.year, 2026);

    const today = missalSections(thursday).find((section) => section.id === "today");
    assert.ok(today);
    assert.equal(today.artifacts[1]?.id, "missal-today-rosary");
    assert.equal(today.artifacts[1]?.sourceUrl, rosaryUrl("luminous"));
  });
});
