import type { NodeKind } from "./types.ts";

export interface ParsedNodeId {
  kind: NodeKind;
  rest: string;
  raw: string;
}

const KIND_PREFIX: Record<string, NodeKind> = {
  scripture: "scripture",
  ccc: "ccc",
  council: "council",
  constitution: "constitution",
  encyclical: "encyclical",
  haydock: "commentary",
  catena: "commentary",
  lapide: "commentary",
  person: "person",
  event: "event",
  artwork: "artwork",
  rosary: "rosary",
  day: "day",
  ordo: "ordo",
  proper: "proper",
  core: "core",
};

export function parseNodeId(id: string): ParsedNodeId | undefined {
  const cut = id.indexOf(":");
  if (cut <= 0) return undefined;
  const prefix = id.slice(0, cut);
  const kind = KIND_PREFIX[prefix];
  if (!kind) return undefined;
  const rest = id.slice(cut + 1);
  if (!rest) return undefined;
  return { kind, rest, raw: id };
}

export function cccId(n: number): string {
  return `ccc:${n}`;
}

export function scriptureChapterId(token: string, chapter: number): string {
  return `scripture:${token}.${chapter}`;
}

export function scriptureBookId(token: string): string {
  return `scripture:${token}`;
}

export function commentaryId(
  source: "haydock" | "catena" | "lapide",
  token: string,
  chapter: number,
): string {
  return `${source}:${token}.${chapter}`;
}

export function dayId(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `day:${y}-${m}-${d}`;
}

export function rosaryMysteryId(mystery: string, decade?: number): string {
  return decade == null ? `rosary:${mystery}` : `rosary:${mystery}.${decade}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
