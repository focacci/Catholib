import { CCC_PARAGRAPH } from "../timeline/ccc.ts";
import { parseRef, scriptureIdFromRef, type ParsedRef } from "./parse-ref.ts";

export type ScriptureConfidence = "exact" | "chapter";

export interface CccScriptureEdge {
  from: string;
  to: string;
  kind: "cites";
  /** Compact locator passed to parseRef / ensureScriptureRef. */
  ref: string;
  confidence: ScriptureConfidence;
}

/** Chapter/verse locators as they appear in running CCC English. */
const LOCATOR = /\d+(?::\d+(?:\s*-\s*(?:\d+:)?\d+)?)?/g;

function looksLikeBookLead(lead: string): boolean {
  return /^(?:[1-3]\s+)?[A-Z]/.test(lead);
}

/**
 * Pull compact Scripture locators out of official CCC excerpt prose.
 * Skip anything parseRef cannot read. Do not invent refs from quotations.
 */
export function extractScriptureRefs(text: string): ParsedRef[] {
  const normalized = text.replace(/\u2013|\u2014/g, "-");
  const found: ParsedRef[] = [];
  const seen = new Set<string>();
  for (const match of normalized.matchAll(LOCATOR)) {
    const loc = match.index ?? 0;
    const num = match[0];
    const before = normalized.slice(Math.max(0, loc - 64), loc);
    const tokens = before.trim().split(/\s+/).filter(Boolean);
    let parsed: ParsedRef | undefined;
    for (let n = Math.min(4, tokens.length); n >= 1; n--) {
      const lead = tokens
        .slice(-n)
        .join(" ")
        .replace(/^[\s("'“‘]+/, "")
        .replace(/[)"'”’.,;:]+$/, "");
      if (!looksLikeBookLead(lead)) continue;
      const hit = parseRef(`${lead} ${num}`);
      if (hit) {
        parsed = hit;
        break;
      }
    }
    if (!parsed) continue;
    const id = scriptureIdFromRef(parsed);
    if (seen.has(id)) continue;
    seen.add(id);
    found.push(parsed);
  }
  return found;
}

function confidenceFor(ref: ParsedRef): ScriptureConfidence {
  return ref.verse != null ? "exact" : "chapter";
}

/** Mine cites edges from the closed CCC_PARAGRAPH map only. */
export function cccScriptureEdges(): CccScriptureEdge[] {
  const edges: CccScriptureEdge[] = [];
  const seen = new Set<string>();
  for (const key of Object.keys(CCC_PARAGRAPH)) {
    const n = Number(key);
    const text = CCC_PARAGRAPH[n];
    if (!text) continue;
    for (const parsed of extractScriptureRefs(text)) {
      const from = `ccc:${n}`;
      const to = scriptureIdFromRef(parsed);
      const dedupe = `${from}->${to}`;
      if (seen.has(dedupe)) continue;
      seen.add(dedupe);
      edges.push({
        from,
        to,
        kind: "cites",
        ref: parsed.raw,
        confidence: confidenceFor(parsed),
      });
    }
  }
  return edges;
}

export const CCC_SCRIPTURE_EDGES = cccScriptureEdges();
