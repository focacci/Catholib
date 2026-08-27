const STUCK_THRESHOLD_PX = 8;

/** True when the sticky book header has left the section's natural top. */
export function isBookHeaderStuck(
  sectionTop: number,
  headerTop: number,
  thresholdPx = STUCK_THRESHOLD_PX,
): boolean {
  return sectionTop < headerTop - thresholdPx;
}

/**
 * Scroll offset that places `section` at the chrome edge of `scroller`.
 * Rect values are viewport-relative (getBoundingClientRect).
 */
export function scrollerTopForSection(args: {
  scrollTop: number;
  sectionTop: number;
  scrollerTop: number;
  chromeHeight: number;
}): number {
  const { scrollTop, sectionTop, scrollerTop, chromeHeight } = args;
  return Math.max(0, scrollTop + (sectionTop - scrollerTop) - chromeHeight);
}

export function pinSectionToScrollerTop(section: HTMLElement): void {
  const scroller = document.getElementById("timeline-scroll");
  if (!(scroller instanceof HTMLElement)) {
    section.scrollIntoView({ block: "start" });
    return;
  }
  const chromeHeight =
    Number.parseFloat(
      getComputedStyle(scroller).getPropertyValue("--chrome-h"),
    ) || 0;
  const top = scrollerTopForSection({
    scrollTop: scroller.scrollTop,
    sectionTop: section.getBoundingClientRect().top,
    scrollerTop: scroller.getBoundingClientRect().top,
    chromeHeight,
  });
  scroller.scrollTo({ top });
}
