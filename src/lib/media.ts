import { useEffect, useLayoutEffect, useState } from "react";

/** Tailwind `md` — treat this width and above as desktop. */
export const DESKTOP_MQ = "(min-width: 768px)";

/** Tailwind `lg` — sidebar jump list; header and footer stay put. */
export const SIDEBAR_MQ = "(min-width: 1024px)";

/**
 * Two-column content: desktop widths, or any landscape viewport (phones
 * included). Must stay aligned with the `dual` variant in `styles.css`.
 */
export const DUAL_COLUMN_MQ = "(min-width: 768px), (orientation: landscape)";

function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function isDesktopViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia(DESKTOP_MQ).matches;
}

export function isDualColumnViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia(DUAL_COLUMN_MQ).matches;
}

export function useIsDesktop(): boolean {
  return useMatchMedia(DESKTOP_MQ);
}

export function useDualColumn(): boolean {
  return useMatchMedia(DUAL_COLUMN_MQ);
}

export function isSidebarViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia(SIDEBAR_MQ).matches;
}

export function useIsSidebarLayout(): boolean {
  const [sidebar, setSidebar] = useState(isSidebarViewport);
  useEffect(() => {
    const mq = window.matchMedia(SIDEBAR_MQ);
    const update = () => setSidebar(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return sidebar;
}
