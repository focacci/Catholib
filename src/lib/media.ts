import { useEffect, useLayoutEffect, useState } from "react";

/** Tailwind `md` — treat this width and above as desktop. */
export const DESKTOP_MQ = "(min-width: 768px)";

/**
 * Tailwind `lg` / `max-lg` (`64rem`). Keep in sync with `.timeline-shell`
 * chrome insets and `max-lg:absolute` on the overlay header.
 */
export const SIDEBAR_MQ = "(min-width: 64rem)";

/**
 * Two-column content: desktop widths, or any landscape viewport (phones
 * included). Must stay aligned with the `dual` variant in `styles.css`.
 */
export const DUAL_COLUMN_MQ = "(min-width: 768px), (orientation: landscape)";

export function isDesktopViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia(DESKTOP_MQ).matches;
}

export function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

export function isDualColumnViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia(DUAL_COLUMN_MQ).matches;
}

export function useDualColumn(): boolean {
  const [dual, setDual] = useState(isDualColumnViewport);
  useLayoutEffect(() => {
    const mq = window.matchMedia(DUAL_COLUMN_MQ);
    const update = () => setDual(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return dual;
}

export function isSidebarViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia(SIDEBAR_MQ).matches;
}

export function useIsSidebarLayout(): boolean {
  const [sidebar, setSidebar] = useState(isSidebarViewport);
  useLayoutEffect(() => {
    const mq = window.matchMedia(SIDEBAR_MQ);
    const update = () => setSidebar(mq.matches);
    const updateAfterRotate = () => {
      update();
      requestAnimationFrame(() => {
        requestAnimationFrame(update);
      });
    };
    update();
    mq.addEventListener("change", update);
    window.addEventListener("orientationchange", updateAfterRotate);
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("orientationchange", updateAfterRotate);
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);
  return sidebar;
}
