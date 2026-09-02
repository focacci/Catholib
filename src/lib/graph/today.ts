import { CCC_PARAGRAPH, cccUrl } from "../timeline/ccc.ts";
import { CHURCH_ENTRIES } from "../timeline/church.ts";
import { liturgicalDay } from "../timeline/liturgical-day.ts";
import { todayArtifact } from "../timeline/missal.ts";
import { missalOrdoUrl } from "../timeline/missal-urls.ts";
import { todayRosaryArtifact } from "../timeline/rosary.ts";
import type { TimelineArtifact } from "../timeline/types.ts";
import { upsertEdge, upsertNode, graph } from "./compile.ts";
import { dayId } from "./ids.ts";
import { ENTRY_CANONICAL, OFFICE_PERSON } from "./seeds.ts";
import type { DoctrineNode } from "./types.ts";

function personArtifactForOffice(title: string): TimelineArtifact | undefined {
  const match = OFFICE_PERSON.find((row) => row.pattern.test(title));
  if (!match) return undefined;
  const entry = CHURCH_ENTRIES.find((item) => item.id === match.entryId);
  if (!entry) return undefined;
  return entry.artifacts.find((a) => a.type === "saint" || a.type === "pope") ?? entry.artifacts[0];
}

function obligationArtifact(day: ReturnType<typeof liturgicalDay>): TimelineArtifact {
  const holyDay = day.obligation === "obligation";
  const ccc = holyDay ? 2177 : 2043;
  const title = holyDay
    ? day.diet === "fast"
      ? "Holy day of obligation · Fast"
      : day.diet === "abstain"
        ? "Holy day of obligation · Abstain"
        : "Holy day of obligation"
    : day.diet === "fast"
      ? "Fast and abstinence"
      : "Friday abstinence";
  const subtitle = holyDay
    ? "CCC 2041–2043, 2177"
    : "CCC 2041–2043";
  return {
    id: `today-discipline-${dayId(day.date)}`,
    type: "catechism",
    title,
    subtitle,
    sourceUrl: cccUrl(ccc),
    year: 1992,
  };
}

function officeArtifact(day: ReturnType<typeof liturgicalDay>): TimelineArtifact {
  const bits = ["1962 calendar", day.season];
  if (day.seasonWeek) bits.push(day.seasonWeek);
  bits.push(day.rankLabel, day.colorLabel);
  return {
    id: dayId(day.date),
    type: "event",
    title: day.title,
    subtitle: bits.join(" · "),
    sourceUrl: day.missalUrl,
    year: day.date.getFullYear(),
  };
}

function ordoArtifact(): TimelineArtifact {
  return {
    id: "missal-ordo",
    type: "ordo",
    title: "Order of Mass",
    subtitle: "Ordo Missae",
    shortQuote: "Introíbo ad altáre Dei.",
    sourceUrl: missalOrdoUrl(),
  };
}

function commemorationArtifact(day: ReturnType<typeof liturgicalDay>): TimelineArtifact | undefined {
  const note = day.notes.find((item) => /commemoration of/i.test(item));
  if (!note) return undefined;
  return {
    id: `today-also-${dayId(day.date)}`,
    type: "event",
    title: "Also today",
    subtitle: note,
    sourceUrl: day.missalUrl,
    year: day.date.getFullYear(),
  };
}

function mysteryIdFromRosary(artifact: TimelineArtifact): string | undefined {
  const subtitle = artifact.subtitle?.toLowerCase() ?? "";
  if (subtitle.includes("joyful")) return "rosary:joyful";
  if (subtitle.includes("luminous")) return "rosary:luminous";
  if (subtitle.includes("sorrowful")) return "rosary:sorrowful";
  if (subtitle.includes("glorious")) return "rosary:glorious";
  return undefined;
}

function attachTodayCluster(now: Date, cards: TimelineArtifact[]): void {
  const day = liturgicalDay(now);
  const id = dayId(day.date);
  const office = cards[0];
  if (!office) return;
  const node: DoctrineNode = {
    id,
    kind: "day",
    title: office.title,
    subtitle: office.subtitle,
    sourceUrl: office.sourceUrl,
    year: office.year,
    artifact: office,
    aliases: [office.id],
    lens: "missal",
  };
  upsertNode(node);

  const rosary = cards.find((card) => card.type === "rosary");
  const rosaryId = rosary ? mysteryIdFromRosary(rosary) : undefined;
  if (rosaryId) upsertEdge(id, rosaryId, "observes");
  if (graph().nodes.has("proper:today")) upsertEdge(id, "proper:today", "observes");
  if (graph().nodes.has("ordo:missae")) upsertEdge(id, "ordo:missae", "observes");

  const mapped = OFFICE_PERSON.find((row) => row.pattern.test(day.title));
  const personId = mapped ? ENTRY_CANONICAL[mapped.entryId] : undefined;
  if (personId) upsertEdge(id, personId, "commemorates");

  if (day.obligation !== "none" || day.diet !== "none") {
    const ccc = day.obligation === "obligation" ? 2177 : 2043;
    upsertEdge(id, `ccc:${ccc}`, "cites");
  }
}

export function todayBoard(now = new Date()): TimelineArtifact[] {
  const day = liturgicalDay(now);
  const cards: TimelineArtifact[] = [officeArtifact(day)];
  if (day.obligation !== "none" || day.diet !== "none") {
    cards.push(obligationArtifact(day));
  }
  cards.push(todayArtifact(now));
  cards.push(ordoArtifact());
  cards.push(todayRosaryArtifact(now));
  const person = personArtifactForOffice(day.title);
  if (person) cards.push(person);
  const also = commemorationArtifact(day);
  if (also) cards.push(also);
  const board = cards.slice(0, 7);
  attachTodayCluster(now, board);
  return board;
}

export function todayClusterIds(now = new Date()): string[] {
  const g = graph();
  return todayBoard(now)
    .map((artifact) => g.byAlias.get(artifact.id) ?? (artifact.id.startsWith("day:") ? artifact.id : undefined))
    .filter((id): id is string => Boolean(id));
}

export function cccParagraphsOnToday(now = new Date()): number[] {
  return todayBoard(now)
    .filter((card) => card.type === "catechism")
    .flatMap((card) => {
      const nums = [...(card.subtitle?.match(/\d+/g) ?? [])].map(Number);
      return nums.filter((n) => CCC_PARAGRAPH[n]);
    });
}
