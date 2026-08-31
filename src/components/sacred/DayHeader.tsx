import type { ComponentProps } from "react";
import { Info } from "lucide-react";
import { liturgicalDay } from "@/lib/timeline/liturgical-day";
import { cn } from "@/lib/utils";
import { DayDisciplineTags } from "./DayDisciplineTags";

export function DayHeader({
  className,
  ref,
  onBrandClick,
  onAboutClick,
  now,
  ...props
}: ComponentProps<"header"> & {
  onBrandClick?: () => void;
  onAboutClick?: () => void;
  /** Override "today" for previews and tests. */
  now?: Date;
}) {
  const day = liturgicalDay(now);

  return (
    <header
      ref={ref}
      className={cn("shrink-0 border-b border-line bg-bg pt-[env(safe-area-inset-top)]", className)}
      {...props}
    >
      <div className="relative flex h-12 w-full items-center justify-center px-3 lg:px-5">
        {onAboutClick ? (
          <button
            type="button"
            onClick={onAboutClick}
            className="absolute top-1/2 left-2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-gold hover:bg-gold-soft lg:hidden"
            aria-label="About and sources"
          >
            <Info className="size-5" strokeWidth={1.75} />
          </button>
        ) : null}
        <button
          type="button"
          onClick={onBrandClick}
          aria-label="Catholib, scroll to top"
          className="relative z-[1] flex cursor-pointer select-none items-center gap-2 rounded-md px-1 [-webkit-touch-callout:none] [-webkit-user-drag:none]"
        >
          <img
            src="/crucifix.png"
            alt=""
            width={154}
            height={256}
            draggable={false}
            aria-hidden
            className="pointer-events-none h-9 w-auto shrink-0 select-none object-contain"
          />
          <span className="select-none font-serif text-lg font-semibold tracking-tight text-gold">
            Catholib
          </span>
        </button>
        <DayDisciplineTags
          day={day}
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 lg:right-5"
        />
      </div>
    </header>
  );
}
