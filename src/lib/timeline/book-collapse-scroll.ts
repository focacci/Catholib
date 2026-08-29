import { cssLengthToPx } from "./sticky-stack.ts";

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

/** Visible overlay may be 0 while the header is hidden; leave room for it to return. */
export function collapsePinChromeHeight(cssChrome: number, headerHeight: number): number {
  return Math.max(cssChrome, headerHeight);
}

/** Pin below returning chrome and the sticky group header (testament / era / kind). */
export function collapsePinStackOffset(
  cssChrome: number,
  headerHeight: number,
  groupHeaderPx: number,
): number {
  return collapsePinChromeHeight(cssChrome, headerHeight) + Math.max(0, groupHeaderPx);
}

function cssVarPx(element: Element, property: string): number {
  const value = getComputedStyle(element).getPropertyValue(property);
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return cssLengthToPx(value, rootFontSize);
}

export function pinSectionToScrollerTop(section: HTMLElement): void {
  const scroller = document.getElementById("timeline-scroll");
  if (!(scroller instanceof HTMLElement)) {
    section.scrollIntoView({ block: "start" });
    return;
  }
  const cssChrome = cssVarPx(scroller, "--chrome-h");
  const header = document.getElementById("timeline-chrome");
  const headerHeight = header instanceof HTMLElement ? header.offsetHeight : cssChrome;
  const groupHeaderPx = cssVarPx(scroller, "--sticky-l1");
  const chromeHeight = collapsePinStackOffset(cssChrome, headerHeight, groupHeaderPx);
  const top = scrollerTopForSection({
    scrollTop: scroller.scrollTop,
    sectionTop: section.getBoundingClientRect().top,
    scrollerTop: scroller.getBoundingClientRect().top,
    chromeHeight,
  });
  scroller.scrollTo({ top });
}
