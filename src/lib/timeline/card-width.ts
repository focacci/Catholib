import { useLayoutEffect, useState } from "react";
import {
  DEFAULT_CARD_IMAGE_WIDTH_PX,
  TIMELINE_CARD_INSET_PX,
} from "./viewport-gate.ts";

/** Live inner width of a timeline artwork card. */
export function useTimelineCardWidth(): number {
  const [width, setWidth] = useState(DEFAULT_CARD_IMAGE_WIDTH_PX);

  useLayoutEffect(() => {
    const scroller = document.getElementById("timeline-scroll");
    const column = scroller?.firstElementChild;
    if (!(column instanceof HTMLElement)) return;

    const measure = () => {
      setWidth(Math.max(200, column.clientWidth - TIMELINE_CARD_INSET_PX));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(column);
    return () => observer.disconnect();
  }, []);

  return width;
}
