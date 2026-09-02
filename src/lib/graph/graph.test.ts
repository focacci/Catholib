import assert from "node:assert/strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { serializeGraph } from "./index.ts";
import { graph, resetGraph } from "./compile.ts";
import { children, getNode, neighborhood, parents, rankedRails, resolveQuery, route } from "./api.ts";
import { isChurchDefaultEntry } from "./church-spine.ts";
import { todayBoard } from "./today.ts";
import { REQUIRED_PATHS } from "./seeds.ts";
import { CORE_NODES, CORE_WALKS } from "./seeds-cores.ts";
import { CCC_SCRIPTURE_EDGES } from "./seeds-ccc-scripture.ts";
import { BAPTISM_DV4_NODES } from "./seeds-baptism-dv4.ts";
import { CHURCH_ENTRIES } from "../timeline/church.ts";

describe("graph compile", () => {
  const g = graph();

  it("collapses CCC 289 to one node", () => {
    const node = getNode("ccc:289");
    assert.ok(node);
    assert.equal(node.kind, "ccc");
    assert.ok(node.aliases.length >= 1);
    const clones = [...g.nodes.values()].filter((item) => item.title === "CCC 289");
    assert.equal(clones.length, 1);
  });

  it("synthesizes chapter nodes for the whole canon", () => {
    assert.ok(getNode("scripture:jn.1"));
    assert.ok(getNode("scripture:gn.50"));
    assert.ok(getNode("scripture:rev.22"));
    const chapters = [...g.nodes.values()].filter(
      (node) => node.kind === "scripture" && /^scripture:[a-z0-9]+\.\d+$/.test(node.id),
    );
    assert.ok(chapters.length > 1000);
  });

  it("parents and children follow containment", () => {
    const p = parents("scripture:jn.1.1-18").map((n) => n.id);
    assert.ok(p.includes("scripture:jn.1"));
    const ch = children("scripture:jn").map((n) => n.id);
    assert.ok(ch.includes("scripture:jn.1"));
  });

  it("puts CCC 241 and Dei Verbum 4 on the John 1 rails", () => {
    const hits = neighborhood("scripture:jn.1", 1);
    assert.ok(hitCcc(hits, 241));
    assert.ok(hits.some((hit) => hit.id === "constitution:dei-verbum.4"));
    const rails = rankedRails("scripture:jn.1");
    assert.ok(rails.citedBy.length + rails.drawsOn.length > 0);
    assert.ok(rails.citedBy.length <= 6);
    assert.ok(
      [...rails.citedBy, ...rails.drawsOn].some((hit) => hit.id === "constitution:dei-verbum.4"),
    );
  });

  it("walks Dei Verbum to Nicaea in three or four cards", () => {
    const nodes = route("constitution:dei-verbum", "council:nicaea-i", { maxHops: 4 });
    assert.ok(nodes.length >= 3 && nodes.length <= 4, nodes.map((n) => n.id).join(" → "));
    const fromFour = route("constitution:dei-verbum.4", "council:nicaea-i", { maxHops: 4 });
    assert.ok(
      fromFour.length >= 3 && fromFour.length <= 4,
      fromFour.map((n) => n.id).join(" → "),
    );
    assert.equal(resolveQuery("Nicaea")[0]?.id, "council:nicaea-i");
  });

  it("walks the required onboarding paths", () => {
    for (const path of REQUIRED_PATHS) {
      const nodes = route(path[0], path[path.length - 1], { maxHops: 4 });
      const ids = nodes.map((node) => node.id);
      for (const id of path) {
        assert.ok(getNode(id), `missing ${id}`);
        assert.ok(ids.includes(id), `${path[0]} → ${path.at(-1)} missing ${id} in ${ids.join(" → ")}`);
      }
    }
  });

  it("walks each remaining core to Scripture in three or four cards", () => {
    for (const walk of CORE_WALKS) {
      for (const id of [walk.core, walk.to, walk.magisterium, ...walk.via]) {
        const node = getNode(id);
        assert.ok(node, `missing ${id}`);
        assert.match(node.sourceUrl, /^https:\/\//, `${id} needs a confirmed sourceUrl`);
      }
      const walked = route(walk.core, walk.to, { maxHops: 4 });
      const ids = walked.map((node) => node.id);
      assert.ok(
        walked.length >= 3 && walked.length <= 4,
        `${walk.core} → ${walk.to} is ${walked.length} cards: ${ids.join(" → ")}`,
      );
      for (const id of walk.via) {
        assert.ok(ids.includes(id), `${walk.core} → ${walk.to} missing ${id} in ${ids.join(" → ")}`);
      }
      assert.ok(walked.some((node) => node.kind === "ccc"), `${walk.core} path should include a CCC paragraph`);
      const magisterium = route(walk.core, walk.magisterium, { maxHops: 4 });
      assert.ok(
        magisterium.length >= 2 && magisterium.length <= 4,
        `${walk.core} → ${walk.magisterium} is ${magisterium.length} cards: ${magisterium.map((n) => n.id).join(" → ")}`,
      );
    }
  });

  it("points baptism at CCC 1213 and keeps 849 on the mission neighborhood", () => {
    const core = getNode("core:baptism");
    assert.ok(core);
    assert.match(core.sourceUrl, /__P3G\.HTM$/);
    assert.ok(getNode("ccc:1213"));
    const walked = route("core:baptism", "scripture:rom.6.3-4", { maxHops: 4 });
    assert.ok(walked.some((node) => node.id === "ccc:1213"));
    assert.ok(!walked.some((node) => node.id === "ccc:849"));
    assert.ok(getNode("ccc:849"));
    const mission = route("ccc:849", "scripture:mt.28.19-20", { maxHops: 4 });
    assert.ok(mission.some((node) => node.id === "ccc:849"));
    const toEens = route("ccc:849", "ccc:846", { maxHops: 4 });
    assert.ok(toEens.some((node) => node.id === "ccc:846"));
  });

  it("teaches extra ecclesiam as CCC 846–848 and Lumen Gentium 14–16", () => {
    assert.ok(getNode("ccc:846"));
    assert.ok(getNode("ccc:847"));
    assert.ok(getNode("ccc:848"));
    assert.ok(getNode("constitution:lumen-gentium.14"));
    assert.ok(getNode("constitution:lumen-gentium.16"));
    const toSixteen = route("ccc:847", "constitution:lumen-gentium.16", { maxHops: 4 });
    assert.ok(toSixteen.some((node) => node.id === "constitution:lumen-gentium.16"));
    const evangelize = route("ccc:848", "scripture:heb.11.6", { maxHops: 4 });
    assert.ok(evangelize.some((node) => node.id === "scripture:heb.11.6"));
  });

  it("gives every core locator a working vatican.va URL", () => {
    for (const seed of [...CORE_NODES, ...BAPTISM_DV4_NODES]) {
      const node = getNode(seed.id);
      assert.ok(node, `missing ${seed.id}`);
      assert.equal(node.sourceUrl, seed.sourceUrl);
      assert.match(node.sourceUrl, /^https:\/\/www\.vatican\.va\//);
    }
    for (const n of [232, 296, 848, 2174, 1213]) {
      const node = getNode(`ccc:${n}`);
      assert.ok(node, `missing ccc:${n}`);
      assert.match(node.sourceUrl, /^https:\/\/www\.vatican\.va\/archive\/ENG0015\/__P/);
    }
  });

  it("resolves Mt 16:18 onto the Petrine locator", () => {
    const hits = resolveQuery("Mt 16:18");
    assert.ok(hits.some((node) => node.id === "scripture:mt.16.18-19" || node.id.startsWith("scripture:mt.16")));
    const walked = route("scripture:mt.16.18-19", "constitution:pastor-aeternus");
    assert.ok(walked.some((node) => node.id === "ccc:424"));
  });

  it("keeps Lapide off Job and Psalms", () => {
    assert.equal(getNode("lapide:jb.1"), undefined);
    assert.equal(getNode("lapide:ps.1"), undefined);
  });
});

function hitCcc(hits: { artifact: { title: string }; id: string }[], n: number): boolean {
  return hits.some((hit) => hit.id === `ccc:${n}` || hit.artifact.title === `CCC ${n}`);
}

describe("Today board", () => {
  it("stays at or under seven cards and always includes office, proper, ordo, rosary", () => {
    const sunday = todayBoard(new Date(2026, 7, 30, 12));
    assert.ok(sunday.length <= 7);
    assert.ok(sunday.some((card) => card.subtitle?.includes("1962 calendar")));
    assert.ok(sunday.some((card) => card.id === "missal-today"));
    assert.ok(sunday.some((card) => card.id === "missal-ordo"));
    assert.ok(sunday.some((card) => card.type === "rosary"));
    assert.ok(sunday.some((card) => /obligation/i.test(card.title)));
  });

  it("omits obligation and diet cards on an ordinary weekday", () => {
    const monday = todayBoard(new Date(2026, 7, 31, 12));
    assert.ok(!monday.some((card) => /obligation|abstain|fast/i.test(card.title)));
  });

  it("reuses the Augustine person node on 28 August", () => {
    const day = todayBoard(new Date(2026, 7, 28, 12));
    assert.ok(day.some((card) => /Augustine/i.test(card.title) && card.id.startsWith("ch-")));
    const proper = getNode("proper:today");
    assert.match(proper?.subtitle ?? "", /August 28/);
  });
});

describe("Church spine", () => {
  it("hides archive buildings from the default list", () => {
    assert.equal(isChurchDefaultEntry("lateran"), false);
    assert.equal(isChurchDefaultEntry("st-peters"), false);
    assert.equal(isChurchDefaultEntry("lateran", "basilica"), true);
  });

  it("keeps spine councils that cite CCC or constitutions", () => {
    assert.equal(isChurchDefaultEntry("nicaea"), true);
    assert.equal(isChurchDefaultEntry("vatican-i"), true);
    assert.equal(isChurchDefaultEntry("vatican-ii"), true);
    const spine = CHURCH_ENTRIES.filter((entry) => isChurchDefaultEntry(entry.id));
    assert.ok(spine.length >= 20);
    assert.ok(spine.length <= 40);
  });
});

describe("CCC prose scripture cites", () => {
  it("emits cites from mined locators including verses not on the timeline card", () => {
    assert.ok(CCC_SCRIPTURE_EDGES.length > 0);
    const g = graph();
    const cites = (from: string, to: string) =>
      g.edges.some((edge) => edge.kind === "cites" && edge.from === from && edge.to === to);
    assert.ok(cites("ccc:65", "scripture:heb.1.1-2"));
    assert.ok(cites("ccc:146", "scripture:heb.11.1"));
    assert.ok(cites("ccc:390", "scripture:gn.3"));
    assert.ok(cites("ccc:447", "scripture:ps.110"));
    assert.ok(cites("ccc:712", "scripture:is.11"));
    assert.ok(cites("ccc:1060", "scripture:1cor.15.28"));
    assert.ok(getNode("scripture:heb.11.1"));
    assert.ok(getNode("scripture:1cor.15.28"));
    const rails = rankedRails("ccc:1060");
    assert.ok(
      [...rails.citedBy, ...rails.drawsOn].some((hit) => hit.id === "scripture:1cor.15.28"),
    );
  });
});

describe("graph snapshot", () => {
  it("writes nodes.json and edges.json", () => {
    resetGraph();
    const snap = serializeGraph();
    const dir = join(import.meta.dirname, "data");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "nodes.json"), `${JSON.stringify(snap.nodes)}\n`);
    writeFileSync(join(dir, "edges.json"), `${JSON.stringify(snap.edges)}\n`);
    assert.ok(snap.nodes.length > 1000);
    assert.ok(snap.edges.length > 500);
  });
});
