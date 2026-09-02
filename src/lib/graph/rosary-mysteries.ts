import { rosaryUrl, type RosaryMystery } from "../timeline/rosary.ts";
import type { TimelineArtifact } from "../timeline/types.ts";

export interface RosaryDecadeSpec {
  id: string;
  mystery: RosaryMystery;
  decade: 1 | 2 | 3 | 4 | 5;
  title: string;
  bibleRefs: string[];
}

export const ROSARY_DECADES: RosaryDecadeSpec[] = [
  { id: "rosary:joyful.1", mystery: "joyful", decade: 1, title: "The Annunciation", bibleRefs: ["Lk 1:26–38"] },
  { id: "rosary:joyful.2", mystery: "joyful", decade: 2, title: "The Visitation", bibleRefs: ["Lk 1:39–56"] },
  { id: "rosary:joyful.3", mystery: "joyful", decade: 3, title: "The Nativity", bibleRefs: ["Lk 2:1–20"] },
  { id: "rosary:joyful.4", mystery: "joyful", decade: 4, title: "The Presentation", bibleRefs: ["Lk 2:22–38"] },
  { id: "rosary:joyful.5", mystery: "joyful", decade: 5, title: "The Finding in the Temple", bibleRefs: ["Lk 2:41–52"] },
  { id: "rosary:luminous.1", mystery: "luminous", decade: 1, title: "The Baptism in the Jordan", bibleRefs: ["Mt 3:13–17"] },
  { id: "rosary:luminous.2", mystery: "luminous", decade: 2, title: "The Wedding at Cana", bibleRefs: ["Jn 2:1–11"] },
  { id: "rosary:luminous.3", mystery: "luminous", decade: 3, title: "The Proclamation of the Kingdom", bibleRefs: ["Mk 1:14–15"] },
  { id: "rosary:luminous.4", mystery: "luminous", decade: 4, title: "The Transfiguration", bibleRefs: ["Mt 17:1–8"] },
  { id: "rosary:luminous.5", mystery: "luminous", decade: 5, title: "The Institution of the Eucharist", bibleRefs: ["Mt 26:26–29"] },
  { id: "rosary:sorrowful.1", mystery: "sorrowful", decade: 1, title: "The Agony in the Garden", bibleRefs: ["Mt 26:36–46"] },
  { id: "rosary:sorrowful.2", mystery: "sorrowful", decade: 2, title: "The Scourging at the Pillar", bibleRefs: ["Jn 19:1"] },
  { id: "rosary:sorrowful.3", mystery: "sorrowful", decade: 3, title: "The Crowning with Thorns", bibleRefs: ["Mt 27:27–31"] },
  { id: "rosary:sorrowful.4", mystery: "sorrowful", decade: 4, title: "The Carrying of the Cross", bibleRefs: ["Jn 19:17"] },
  { id: "rosary:sorrowful.5", mystery: "sorrowful", decade: 5, title: "The Crucifixion", bibleRefs: ["Jn 19:18–30"] },
  { id: "rosary:glorious.1", mystery: "glorious", decade: 1, title: "The Resurrection", bibleRefs: ["Mt 28:1–10"] },
  { id: "rosary:glorious.2", mystery: "glorious", decade: 2, title: "The Ascension", bibleRefs: ["Acts 1:6–11"] },
  { id: "rosary:glorious.3", mystery: "glorious", decade: 3, title: "The Descent of the Holy Spirit", bibleRefs: ["Acts 2:1–11"] },
  { id: "rosary:glorious.4", mystery: "glorious", decade: 4, title: "The Assumption", bibleRefs: ["Lk 1:46–55"] },
  { id: "rosary:glorious.5", mystery: "glorious", decade: 5, title: "The Coronation of Mary", bibleRefs: ["Rev 12:1"] },
];

export function rosaryDecadeArtifact(spec: RosaryDecadeSpec): TimelineArtifact {
  return {
    id: spec.id.replace(":", "-"),
    type: "rosary",
    title: spec.title,
    subtitle: `${spec.mystery[0].toUpperCase()}${spec.mystery.slice(1)} Mysteries · ${spec.decade}`,
    sourceUrl: rosaryUrl(spec.mystery),
    bibleRefs: spec.bibleRefs,
  };
}
