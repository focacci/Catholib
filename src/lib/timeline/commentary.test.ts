import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { catenaUrl } from "./catena.ts";
import { haydockUrl } from "./haydock.ts";
import { lapideUrl } from "./lapide.ts";

describe("commentary URLs", () => {
  it("builds confirmed Haydock chapter URLs", () => {
    assert.equal(haydockUrl("Genesis", 1), "https://haydockcommentary.com/genesis-1");
    assert.equal(haydockUrl("Revelation", 21), "https://haydockcommentary.com/apocalypse-21");
    assert.equal(haydockUrl("Jeremiah", 4), null);
    assert.equal(haydockUrl("Song of Songs", 1), null);
  });

  it("builds Catena Aurea URLs for the four Gospels", () => {
    assert.equal(
      catenaUrl("Matthew", 1),
      "https://www.ecatholic2000.com/catena/untitled-08.shtml",
    );
    assert.equal(
      catenaUrl("Matthew", 28),
      "https://www.ecatholic2000.com/catena/untitled-35.shtml",
    );
    assert.equal(
      catenaUrl("Mark", 1),
      "https://www.ecatholic2000.com/catena/untitled-41.shtml",
    );
    assert.equal(
      catenaUrl("Luke", 24),
      "https://www.ecatholic2000.com/catena/untitled-85.shtml",
    );
    assert.equal(
      catenaUrl("John", 21),
      "https://www.ecatholic2000.com/catena/untitled-109.shtml",
    );
    assert.equal(catenaUrl("Genesis", 1), null);
    assert.equal(catenaUrl("Matthew", 29), null);
  });

  it("builds confirmed Lapide chapter URLs", () => {
    assert.equal(lapideUrl("Genesis", 1), "https://lapide.org/01_genesis_01.html");
    assert.equal(lapideUrl("1 Samuel", 17), "https://lapide.org/09_i_regum_17.html");
    assert.equal(lapideUrl("Song of Songs", 8), "https://lapide.org/24_canticum_08.html");
    assert.equal(lapideUrl("Mark", 16), "https://lapide.org/50_marcus_16.html");
    assert.equal(lapideUrl("3 John", 1), "https://lapide.org/79_iii_joannis_01.html");
    assert.equal(lapideUrl("Job", 1), null);
    assert.equal(lapideUrl("Psalms", 1), null);
  });
});
