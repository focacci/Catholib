import { useEffect, useState } from "react";

/** Tailwind `md` — treat this width and above as desktop. */
export const DESKTOP_MQ = "(min-width: 768px)";

/** Tailwind `lg` — sidebar jump list; header and footer stay put. */
export const SIDEBAR_MQ = "(min-width: 1024px)";

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
