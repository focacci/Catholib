import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import {
  containIntrinsicSize,
  isNearScrollport,
  OFFSCREEN_SKIP_MARGIN_VIEWPORTS,
} from "@/lib/timeline/viewport-gate";
import { cn } from "@/lib/utils";

function timelineScrollRoot(): HTMLElement | null {
  const el = document.getElementById("timeline-scroll");
  return el instanceof HTMLElement ? el : null;
}

function syncNearAttribute(el: HTMLElement, root: HTMLElement | null) {
  const port = root?.getBoundingClientRect() ?? {
    top: 0,
    bottom: window.innerHeight,
  };
  const margin = (root?.clientHeight ?? window.innerHeight) * OFFSCREEN_SKIP_MARGIN_VIEWPORTS;
  const near = isNearScrollport(el.getBoundingClientRect(), port, margin);
  el.toggleAttribute("data-near", near);
}

/**
 * Skip layout/paint for far timeline books/eras, including their sticky
 * headers. Nearby sections get `content-visibility: visible` so nested
 * sticky headers still stick to `#timeline-scroll`.
 */
export function OffscreenSkip({
  className,
  estimateHeight,
  children,
}: {
  className?: string;
  estimateHeight: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = timelineScrollRoot();
    syncNearAttribute(el, root);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) el.toggleAttribute("data-near", entry.isIntersecting);
      },
      { root, rootMargin: `${OFFSCREEN_SKIP_MARGIN_VIEWPORTS * 100}% 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("timeline-skip", className)}
      style={{ containIntrinsicSize: containIntrinsicSize(estimateHeight) } as CSSProperties}
    >
      {children}
    </div>
  );
}

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
