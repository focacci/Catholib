import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serializeGraph } from "../src/lib/graph/index.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src/lib/graph/data");
mkdirSync(dir, { recursive: true });
const snap = serializeGraph();
writeFileSync(join(dir, "nodes.json"), `${JSON.stringify(snap.nodes)}\n`);
writeFileSync(join(dir, "edges.json"), `${JSON.stringify(snap.edges)}\n`);
console.log(`graph: ${snap.nodes.length} nodes, ${snap.edges.length} edges`);
