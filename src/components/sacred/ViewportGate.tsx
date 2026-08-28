import type { CSSProperties, ReactNode } from "react";
import { containIntrinsicSize } from "@/lib/timeline/viewport-gate";
import { cn } from "@/lib/utils";

/**
 * Keeps children mounted and lets the browser skip paint/layout for off-screen
 * rows. That avoids scroll-linked React mount/unmount, which feels laggy.
 */
export function ViewportGate({
  id,
  className,
  estimateHeight,
  children,
}: {
  id?: string;
  className?: string;
  estimateHeight: number;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={cn("timeline-block", className)}
      style={
        {
          contentVisibility: "auto",
          containIntrinsicSize: containIntrinsicSize(estimateHeight),
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
