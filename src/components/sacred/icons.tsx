import {
  BookMarked,
  BookOpen,
  CalendarDays,
  Feather,
  Flame,
  Frame,
  Heart,
  KeyRound,
  Landmark,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import type { ArtifactType } from "@/lib/timeline/types";

export const TYPE_ICON: Record<ArtifactType, LucideIcon> = {
  catechism: BookOpen,
  papal: ScrollText,
  haydock: Feather,
  artwork: Frame,
  event: Landmark,
  pope: KeyRound,
  saint: Heart,
  ordo: BookMarked,
  proper: CalendarDays,
  votive: Flame,
};

export const TYPE_TONE: Record<ArtifactType, string> = {
  catechism: "text-gold",
  papal: "text-gold",
  haydock: "text-fg",
  artwork: "text-muted",
  event: "text-gold",
  pope: "text-gold",
  saint: "text-fg",
  ordo: "text-gold",
  proper: "text-gold",
  votive: "text-fg",
};
