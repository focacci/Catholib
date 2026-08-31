import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  areAllBooksExpanded,
  mapAllBooks,
  nextExpandedBooks,
  useTimeline,
} from "./store.ts";

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

describe("mapAllBooks", () => {
  it("expands or collapses every named book", () => {
    assert.deepEqual(mapAllBooks(["Genesis", "Exodus"], true), {
      Genesis: true,
      Exodus: true,
    });
    assert.deepEqual(mapAllBooks(["Genesis", "Exodus"], false), {
      Genesis: false,
      Exodus: false,
    });
  });
});

describe("areAllBooksExpanded", () => {
  it("is true only when every named book is open", () => {
    assert.equal(
      areAllBooksExpanded({ Genesis: true, Exodus: true }, ["Genesis", "Exodus"]),
      true,
    );
    assert.equal(
      areAllBooksExpanded({ Genesis: true, Exodus: false }, ["Genesis", "Exodus"]),
      false,
    );
  });

  it("is true when every Church era is open", () => {
    assert.equal(
      areAllBooksExpanded({ "Apostolic Age": true, Contemporary: true }, [
        "Apostolic Age",
        "Contemporary",
      ]),
      true,
    );
    assert.equal(
      areAllBooksExpanded({ "Apostolic Age": true, Contemporary: false }, [
        "Apostolic Age",
        "Contemporary",
      ]),
      false,
    );
  });
});

describe("setView", () => {
  it("closes About so the chosen library view is visible", () => {
    useTimeline.setState({ aboutOpen: true, view: "bible" });
    useTimeline.getState().setView("church");
    assert.equal(useTimeline.getState().view, "church");
    assert.equal(useTimeline.getState().aboutOpen, false);
    useTimeline.setState({ aboutOpen: false, view: "bible", filter: "all" });
  });
});
