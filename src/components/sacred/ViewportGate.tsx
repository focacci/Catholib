import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { observeTimelineViewport } from "@/lib/timeline/viewport-gate";

/**
 * Mounts children only while they sit near the timeline viewport. Off-screen
 * rows keep a reserved height so jump-to anchors and scroll position stay stable.
 */
export function ViewportGate({
  id,
  className,
  estimateHeight,
  eager = false,
  children,
}: {
  id?: string;
  className?: string;
  estimateHeight: number;
  eager?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const heightRef = useRef(Math.max(1, estimateHeight));
  const activeRef = useRef(eager);
  const [active, setActive] = useState(eager);

  useLayoutEffect(() => {
    if (eager) return;
    const el = ref.current;
    if (!el) return;
    return observeTimelineViewport(el, (visible) => {
      if (!visible && activeRef.current && ref.current) {
        const measured = ref.current.offsetHeight;
        if (measured > 0) heightRef.current = measured;
      }
      if (visible === activeRef.current) return;
      activeRef.current = visible;
      setActive(visible);
    });
  }, [eager]);

  useLayoutEffect(() => {
    if (!active) return;
    const measured = ref.current?.offsetHeight;
    if (measured && measured > 0) heightRef.current = measured;
  });

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={active ? undefined : { height: heightRef.current }}
    >
      {active ? children : null}
    </div>
  );
}
