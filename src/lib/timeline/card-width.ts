import { useLayoutEffect, useState } from "react";
import { useDualColumn } from "@/lib/media";
import { dualColumnCardWidths, singleColumnCardWidth } from "./columns.ts";
import { DEFAULT_CARD_IMAGE_WIDTH_PX, TIMELINE_CARD_INSET_PX } from "./viewport-gate.ts";

export function useTimelineLayout(): {
  dualColumn: boolean;
  cardWidth: number;
  artworkWidth: number;
} {
  const dualColumn = useDualColumn();
  const [wrapperWidth, setWrapperWidth] = useState(
    DEFAULT_CARD_IMAGE_WIDTH_PX + TIMELINE_CARD_INSET_PX,
  );

  useLayoutEffect(() => {
    const scroller = document.getElementById("timeline-scroll");
    const column = scroller?.firstElementChild;
    if (!(column instanceof HTMLElement)) return;

    const measure = () => setWrapperWidth(column.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(column);
    return () => observer.disconnect();
  }, [dualColumn]);

  if (dualColumn) {
    const widths = dualColumnCardWidths(wrapperWidth);
    return { dualColumn, cardWidth: widths.main, artworkWidth: widths.artwork };
  }
  const cardWidth = singleColumnCardWidth(wrapperWidth, TIMELINE_CARD_INSET_PX);
  return { dualColumn, cardWidth, artworkWidth: cardWidth };
}

/** Live inner width of a timeline artwork card. */
export function useTimelineCardWidth(): number {
  return useTimelineLayout().cardWidth;
}
