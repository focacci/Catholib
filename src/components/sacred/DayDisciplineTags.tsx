import { Ban, Fish, Lock, type LucideIcon } from "lucide-react";
import type { DietKind, LiturgicalDay, ObligationKind } from "@/lib/timeline/liturgical-day";
import { cn } from "@/lib/utils";

const OBLIGATION: Record<
  ObligationKind,
  { label: string; Icon?: LucideIcon; className: string }
> = {
  obligation: {
    label: "Obligation",
    Icon: Lock,
    className: "bg-discipline-obligation/25 text-discipline-obligation",
  },
  none: {
    label: "No Obligation",
    className: "bg-discipline-free/20 text-discipline-free",
  },
};

const DIET: Record<
  Exclude<DietKind, "none">,
  { label: string; Icon: LucideIcon; className: string }
> = {
  abstain: {
    label: "Abstain",
    Icon: Fish,
    className: "bg-discipline-abstain/25 text-discipline-abstain",
  },
  fast: {
    label: "Fast",
    Icon: Ban,
    className: "bg-discipline-fast/25 text-discipline-fast",
  },
};

function DisciplineTag({
  label,
  Icon,
  className,
  compact,
}: {
  label: string;
  Icon?: LucideIcon;
  className: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-[3px] border border-current/20 font-sans leading-none font-semibold tracking-wide whitespace-nowrap",
        compact
          ? "h-3.5 gap-0.5 px-1 text-[0.5625rem]"
          : "h-[1.125rem] gap-1 px-1.5 text-[0.625rem]",
        className,
      )}
    >
      {label}
      {Icon ? (
        <Icon
          className={cn("shrink-0", compact ? "size-2" : "size-2.5")}
          strokeWidth={2.25}
          aria-hidden
        />
      ) : null}
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
      <DisciplineTag compact {...obligation} />
      {diet ? <DisciplineTag {...diet} /> : null}
    </div>
  );
}
