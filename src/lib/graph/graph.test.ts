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

  it("puts CCC 241 and Dei Verbum on the John 1 rails", () => {
    const hits = neighborhood("scripture:jn.1", 1);
    const titles = hits.map((hit) => hit.artifact.title);
    assert.ok(titles.some((title) => title.includes("CCC 241") || hitCcc(hits, 241)));
    assert.ok(
      titles.some((title) => /Dei Verbum/i.test(title)) ||
        hits.some((hit) => hit.id === "constitution:dei-verbum"),
    );
    const rails = rankedRails("scripture:jn.1");
    assert.ok(rails.citedBy.length + rails.drawsOn.length > 0);
    assert.ok(rails.citedBy.length <= 6);
    assert.ok(
      [...rails.citedBy, ...rails.drawsOn].some((hit) => /Dei Verbum/i.test(hit.artifact.title)),
    );
  });

  it("walks Dei Verbum to Nicaea in three or four cards", () => {
    const nodes = route("constitution:dei-verbum", "council:nicaea-i", { maxHops: 4 });
    assert.ok(nodes.length >= 3 && nodes.length <= 4, nodes.map((n) => n.id).join(" → "));
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
