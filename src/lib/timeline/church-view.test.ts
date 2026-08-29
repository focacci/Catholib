import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHURCH_ENTRIES } from "./church.ts";
import {
  CHURCH_ERA_NAMES,
  churchJumpItems,
  eraNameForEntryId,
  formatYearRange,
  isEraExpanded,
  uniqueChurchEraNames,
  yearRangeForEntries,
} from "./church-view.ts";

describe("formatYearRange", () => {
  it("uses an en dash for a span and a single year when the ends match", () => {
    assert.equal(formatYearRange(33, 202), "33–202");
    assert.equal(formatYearRange(537, 537), "537");
  });
});

describe("yearRangeForEntries", () => {
  it("reads the earliest and latest entry years", () => {
    assert.equal(
      yearRangeForEntries([
        { year: 324 },
        { year: 390 },
        { year: 336 },
      ]),
      "324–390",
    );
  });
});

describe("churchJumpItems", () => {
  const items = churchJumpItems();

  it("lists each era once with its full year span", () => {
    const apostolic = items.find((item) => item.label === "Apostolic Age");
    assert.deepEqual(apostolic, { id: "pentecost", label: "Apostolic Age", range: "33–202" });

    const imperial = items.find((item) => item.label === "Imperial Church");
    assert.equal(imperial?.id, "lateran");
    assert.equal(imperial?.range, "324–537");

    const contemporary = items.find((item) => item.label === "Contemporary");
    assert.equal(contemporary?.range, "1978–2013");

    const labels = items.filter((item) => item.label !== "Today").map((item) => item.label);
    assert.deepEqual(labels, uniqueChurchEraNames(CHURCH_ENTRIES));
    assert.equal(new Set(labels).size, labels.length);
  });

  it("keeps Today as a jump to Francis without a range", () => {
    assert.deepEqual(items.at(-1), { id: "francis", label: "Today" });
  });
});

describe("eraNameForEntryId", () => {
  it("maps a jump id back to its era so collapsing can open that section", () => {
    assert.equal(eraNameForEntryId("pentecost"), "Apostolic Age");
    assert.equal(eraNameForEntryId("francis"), "Contemporary");
  });
});

describe("isEraExpanded", () => {
  it("follows the user map unless a search is active", () => {
    assert.equal(isEraExpanded({ "Apostolic Age": true }, "Apostolic Age", false), true);
    assert.equal(isEraExpanded({ "Apostolic Age": false }, "Apostolic Age", false), false);
    assert.equal(isEraExpanded({ "Apostolic Age": false }, "Apostolic Age", true), true);
  });
});

describe("CHURCH_ERA_NAMES", () => {
  it("covers every era used in the catalog", () => {
    assert.ok(CHURCH_ERA_NAMES.includes("Apostolic Age"));
    assert.ok(CHURCH_ERA_NAMES.includes("Contemporary"));
    assert.equal(CHURCH_ERA_NAMES.length, uniqueChurchEraNames().length);
  });
});
