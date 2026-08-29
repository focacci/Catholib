import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function HeaderFade() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-full h-[var(--sticky-fade)] bg-gradient-to-b from-bg to-transparent"
    />
  );
}

export function StickyGroupHeader({ className, children, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "sticky top-[var(--chrome-h,0px)] z-30 flex h-[var(--sticky-l1)] items-center bg-bg px-2 font-serif text-sm tracking-[0.2em] text-gold-dim uppercase",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function StickyItemHeader({
  className,
  fade = false,
  nested = true,
  children,
  ...props
}: ComponentProps<"div"> & { fade?: boolean; nested?: boolean }) {
  return (
    <div
      className={cn(
        "sticky z-20 bg-bg",
        nested ? "top-[calc(var(--chrome-h,0px)+var(--sticky-l1))]" : "top-[var(--chrome-h,0px)]",
        className,
      )}
      {...props}
    >
      {children}
      {fade ? <HeaderFade /> : null}
    </div>
  );
}

export function StickyLeafHeader({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "sticky top-[calc(var(--chrome-h,0px)+var(--sticky-l1)+var(--sticky-l2))] z-10 bg-bg",
        className,
      )}
      {...props}
    >
      {children}
      <HeaderFade />
    </div>
  );
}
