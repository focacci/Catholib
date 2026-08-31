import { Ban, Fish, Lock, Unlock, type LucideIcon } from "lucide-react";
import type { DietKind, LiturgicalDay, ObligationKind } from "@/lib/timeline/liturgical-day";
import { cn } from "@/lib/utils";

const OBLIGATION: Record<
  ObligationKind,
  { label: string; Icon: LucideIcon; className: string }
> = {
  obligation: {
    label: "Obligation",
    Icon: Lock,
    className: "bg-discipline-obligation text-white",
  },
  none: {
    label: "No Obligation",
    Icon: Unlock,
    className: "bg-discipline-free text-white/90",
  },
};

const DIET: Record<
  Exclude<DietKind, "none">,
  { label: string; Icon: LucideIcon; className: string }
> = {
  abstain: {
    label: "Abstain",
    Icon: Fish,
    className: "bg-discipline-abstain text-[#1a1406]",
  },
  fast: {
    label: "Fast",
    Icon: Ban,
    className: "bg-discipline-fast text-white",
  },
};

function DisciplineTag({
  label,
  Icon,
  className,
}: {
  label: string;
  Icon: LucideIcon;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[1.125rem] max-w-full items-center gap-0.5 rounded-sm px-1.5 font-sans text-[0.625rem] leading-none font-semibold tracking-wide whitespace-nowrap",
        className,
      )}
    >
      <Icon className="size-2.5 shrink-0" strokeWidth={2.25} aria-hidden />
      {label}
    </span>
  );
}

export function DayDisciplineTags({
  day,
  className,
}: {
  day: Pick<LiturgicalDay, "obligation" | "diet">;
  className?: string;
}) {
  const obligation = OBLIGATION[day.obligation];
  const diet = day.diet === "none" ? null : DIET[day.diet];
  const summary = diet
    ? `${obligation.label}, ${diet.label}`
    : obligation.label;

  return (
    <div
      className={cn(
        "flex flex-col items-end",
        diet ? "justify-center gap-0.5" : "justify-center",
        className,
      )}
      aria-label={summary}
      title={summary}
    >
      <DisciplineTag {...obligation} />
      {diet ? <DisciplineTag {...diet} /> : null}
    </div>
  );
}
