import { cccParagraphNumber } from "../timeline/ccc.ts";
import { CATENA_SLUG } from "../timeline/catena.ts";
import { HAYDOCK_SLUG } from "../timeline/haydock.ts";
import { LAPIDE_SLUG } from "../timeline/lapide.ts";
import type { TimelineArtifact } from "../timeline/types.ts";
import { commentaryId, slugify } from "./ids.ts";
import { bookToken } from "./parse-ref.ts";
import { DOCUMENT_TITLE_ID, ENTRY_CANONICAL } from "./seeds.ts";

export function commentarySource(
  artifact: TimelineArtifact,
): "haydock" | "catena" | "lapide" | undefined {
  if (artifact.sourceUrl.includes("haydockcommentary.com")) return "haydock";
  if (artifact.sourceUrl.includes("ecatholic2000.com/catena")) return "catena";
  if (artifact.sourceUrl.includes("lapide.org")) return "lapide";
  return undefined;
}

function bookAndChapterFromCommentary(artifact: TimelineArtifact): {
  token: string;
  chapter: number;
} | undefined {
  const title = artifact.title;
  const named = title.match(/on\s+(.+?)\s+(\d+)/i);
  if (named) {
    const token = bookToken(named[1]) ?? named[1].toLowerCase().replace(/\s+/g, "");
    const chapter = Number(named[2]);
    if (token && chapter > 0) return { token, chapter };
  }
  const idMatch = artifact.id.match(/^(?:hd|ca|cl)-(.+)-(\d+)$/);
  if (idMatch) {
    const rawName = idMatch[1].replace(/-/g, " ");
    const fromSlug =
      Object.keys(HAYDOCK_SLUG).find((n) => n.toLowerCase().replace(/\s+/g, "-") === idMatch[1]) ??
      Object.keys(CATENA_SLUG).find((n) => n.toLowerCase().replace(/\s+/g, "-") === idMatch[1]) ??
      Object.keys(LAPIDE_SLUG).find((n) => n.toLowerCase().replace(/\s+/g, "-") === idMatch[1]);
    const name = fromSlug ?? rawName.replace(/\b\w/g, (c) => c.toUpperCase());
    const token = bookToken(fromSlug ?? name);
    const chapter = Number(idMatch[2]);
    if (token && chapter > 0) return { token, chapter };
  }
  return undefined;
}

export function canonicalIdForArtifact(
  artifact: TimelineArtifact,
  entryId?: string,
): string {
  const ccc = cccParagraphNumber(artifact.title);
  if (ccc != null) return `ccc:${ccc}`;

  for (const rule of DOCUMENT_TITLE_ID) {
    if (rule.pattern.test(artifact.title)) return rule.id;
  }

  const source = commentarySource(artifact);
  if (source) {
    const parsed = bookAndChapterFromCommentary(artifact);
    if (parsed) return commentaryId(source, parsed.token, parsed.chapter);
  }

  if (artifact.type === "artwork") return `artwork:${slugify(artifact.id)}`;
  if (artifact.type === "ordo") return "ordo:missae";
  if (artifact.id === "missal-today") return "proper:today";
  if (artifact.type === "rosary") {
    const mystery = artifact.subtitle?.toLowerCase().includes("joyful")
      ? "joyful"
      : artifact.subtitle?.toLowerCase().includes("luminous")
        ? "luminous"
        : artifact.subtitle?.toLowerCase().includes("sorrowful")
          ? "sorrowful"
          : artifact.subtitle?.toLowerCase().includes("glorious")
            ? "glorious"
            : "rosary";
    return mystery === "rosary" ? "rosary:today" : `rosary:${mystery}`;
  }

  if (entryId && ENTRY_CANONICAL[entryId] && (artifact.type === "event" || artifact.type === "pope" || artifact.type === "saint")) {
    return ENTRY_CANONICAL[entryId];
  }

  if (artifact.type === "pope" || artifact.type === "saint") {
    return `person:${slugify(artifact.id.replace(/^ch-/, "").replace(/-pope$|-saint$/, ""))}`;
  }
  if (artifact.type === "event") return `event:${slugify(artifact.id.replace(/^ch-/, "").replace(/-event$/, ""))}`;
  if (artifact.type === "papal") return `encyclical:${slugify(artifact.title)}`;
  if (artifact.type === "proper" || artifact.type === "votive") return `proper:${slugify(artifact.id)}`;
  return `event:${slugify(artifact.id)}`;
}

export function kindFromId(id: string): import("./types.ts").NodeKind {
  if (id.startsWith("scripture:")) return "scripture";
  if (id.startsWith("ccc:")) return "ccc";
  if (id.startsWith("council:")) return "council";
  if (id.startsWith("constitution:")) return "constitution";
  if (id.startsWith("encyclical:")) return "encyclical";
  if (id.startsWith("haydock:") || id.startsWith("catena:") || id.startsWith("lapide:")) {
    return "commentary";
  }
  if (id.startsWith("person:")) return "person";
  if (id.startsWith("artwork:")) return "artwork";
  if (id.startsWith("rosary:")) return "rosary";
  if (id.startsWith("day:")) return "day";
  if (id.startsWith("ordo:")) return "ordo";
  if (id.startsWith("proper:")) return "proper";
  if (id.startsWith("core:")) return "core";
  return "event";
}
