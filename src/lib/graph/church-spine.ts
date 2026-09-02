import { CHURCH_ENTRIES } from "../timeline/church.ts";
import { graph } from "./compile.ts";
import { canonicalIdForArtifact } from "./canon.ts";
import { CHURCH_ARCHIVE_ENTRY_IDS, CHURCH_SPINE_ENTRY_IDS, ENTRY_CANONICAL } from "./seeds.ts";

function citesMagisteriumOrScripture(id: string): boolean {
  const g = graph();
  for (const edge of [...(g.outgoing.get(id) ?? []), ...(g.incoming.get(id) ?? [])]) {
    if (edge.kind === "contains") continue;
    const other = edge.from === id ? edge.to : edge.from;
    if (
      other.startsWith("scripture:") ||
      other.startsWith("ccc:") ||
      other.startsWith("constitution:")
    ) {
      return true;
    }
  }
  return false;
}

export function churchEntryQualifies(entryId: string): boolean {
  const entry = CHURCH_ENTRIES.find((item) => item.id === entryId);
  if (!entry) return false;
  const ids = new Set<string>();
  const mapped = ENTRY_CANONICAL[entryId];
  if (mapped) ids.add(mapped);
  for (const artifact of entry.artifacts) ids.add(canonicalIdForArtifact(artifact, entryId));
  return [...ids].some(citesMagisteriumOrScripture);
}

export function isChurchDefaultEntry(entryId: string, query = ""): boolean {
  if (query.trim()) return true;
  if ((CHURCH_ARCHIVE_ENTRY_IDS as readonly string[]).includes(entryId)) return false;
  if (!(CHURCH_SPINE_ENTRY_IDS as readonly string[]).includes(entryId)) return false;
  return churchEntryQualifies(entryId);
}
