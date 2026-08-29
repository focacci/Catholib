import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function DayHeader({ className, ref, ...props }: ComponentProps<"header">) {
  return (
    <header
      ref={ref}
      className={cn("shrink-0 border-b border-line bg-bg pt-[env(safe-area-inset-top)]", className)}
      {...props}
    >
      <div className="flex h-12">
        <div className="flex w-full items-center justify-center px-5 lg:w-64 lg:justify-start lg:border-r lg:border-line lg:bg-surface">
          <div className="flex items-center gap-2">
            <img
              src="/crucifix.png"
              alt=""
              width={154}
              height={256}
              draggable={false}
              aria-hidden
              className="h-9 w-auto shrink-0 select-none object-contain"
            />
            <p className="font-serif text-lg font-semibold tracking-tight text-gold">Catholib</p>
          </div>
        </div>
        <div className="hidden min-w-0 flex-1 lg:block" aria-hidden />
      </div>
    </header>
  );
}
