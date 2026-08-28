import { liturgicalDay, type LiturgicalColor } from "@/lib/timeline/liturgical-day";
import { cn } from "@/lib/utils";

const COLOR_CHIP: Record<LiturgicalColor, string> = {
  white: "bg-lit-white text-bg",
  red: "bg-lit-red text-fg",
  green: "bg-lit-green text-fg",
  violet: "bg-lit-violet text-fg",
  rose: "bg-lit-rose text-bg",
  black: "bg-lit-black text-fg ring-1 ring-fg/40",
  gold: "bg-gold text-bg",
};

function fastingNote(notes: string[]): string | undefined {
  return notes.find((note) => /fast|abstinence/i.test(note));
}

export function TodayOffice() {
  const day = liturgicalDay();
  const dateLine = [day.compactDate, day.seasonWeek, day.season]
    .filter(Boolean)
    .join(" - ");
  const disciplineLine = [day.rosary, fastingNote(day.notes)]
    .filter(Boolean)
    .join(" - ");

  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-sm px-0.5 text-center font-serif text-xs font-semibold leading-none tracking-tight",
          COLOR_CHIP[day.color],
        )}
        aria-hidden
      >
        {day.colorLabel}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-lg font-semibold leading-snug text-fg">
          {day.title}
        </h3>
        <p className="mt-0.5 text-sm leading-snug text-muted">{dateLine}</p>
        {disciplineLine ? (
          <p className="mt-0.5 text-sm leading-snug text-muted">{disciplineLine}</p>
        ) : null}
      </div>
    </div>
  );
}
