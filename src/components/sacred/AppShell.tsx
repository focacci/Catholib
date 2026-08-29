import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { DayFooter } from '@/components/sacred/DayFooter';
import { DayHeader } from '@/components/sacred/DayHeader';
import { Sidebar } from '@/components/sacred/Sidebar';
import { useTimeline } from '@/lib/timeline/context';
import { isSidebarViewport, useIsSidebarLayout } from '@/lib/media';

function applyChrome(root: HTMLElement, hidden: boolean, headerH: number, footerH: number) {
  root.style.setProperty('--header-h', `${hidden ? 0 : headerH}px`);
  root.style.setProperty('--footer-h', `${hidden ? 0 : footerH}px`);
  root.toggleAttribute('data-chrome-hidden', hidden);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { view, setView } = useTimeline();
  const isSidebar = useIsSidebarLayout();
  const [showJump, setShowJump] = useState(false);
  const [chromeHidden, setChromeHidden] = useState(false);
  const [headerH, setHeaderH] = useState(0);
  const [footerH, setFooterH] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const chromeHiddenRef = useRef(false);

  const measure = useCallback(() => {
    const header = headerRef.current?.offsetHeight ?? 0;
    const footer = footerRef.current?.offsetHeight ?? 0;
    setHeaderH(header);
    setFooterH(footer);
    if (!chromeHiddenRef.current) {
      applyChrome(document.documentElement, false, header, footer);
    }
  }, []);

  useLayoutEffect(() => {
    measure();
    const header = headerRef.current;
    const footer = footerRef.current;
    if (!header || !footer) return;
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    observer.observe(footer);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        const y = window.scrollY;
        const delta = y - lastY.current;
        lastY.current = y;
        setShowJump(y > 480);
        if (isSidebarViewport()) {
          chromeHiddenRef.current = false;
          setChromeHidden(false);
          applyChrome(document.documentElement, false, headerH, footerH);
          return;
        }
        const hide = y > 80 && delta > 6;
        const show = y < 40 || delta < -6;
        if (hide && !chromeHiddenRef.current) {
          chromeHiddenRef.current = true;
          setChromeHidden(true);
          applyChrome(document.documentElement, true, headerH, footerH);
        } else if (show && chromeHiddenRef.current) {
          chromeHiddenRef.current = false;
          setChromeHidden(false);
          applyChrome(document.documentElement, false, headerH, footerH);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [headerH, footerH]);

  const overlay = useMemo(
    () =>
      !isSidebar
        ? chromeHidden
          ? 'max-lg:absolute max-lg:left-0 max-lg:right-0 max-lg:-translate-y-full max-lg:opacity-0 max-lg:pointer-events-none'
          : 'max-lg:absolute max-lg:left-0 max-lg:right-0 max-lg:translate-y-0'
        : '',
    [chromeHidden, isSidebar],
  );

  return (
    <div className="min-h-dvh bg-background">
      <DayHeader
        ref={headerRef}
        className={`z-40 max-lg:top-0 ${overlay}`}
      />
      {!isSidebar && <div aria-hidden style={{ height: headerH }} />}
      <div className="flex">
        {isSidebar && <Sidebar view={view} onViewChange={setView} />}
        <main className="min-w-0 flex-1 px-6 py-8 lg:px-16">
          <div className="mx-auto w-full max-w-xl dual:max-w-6xl">{children}</div>
        </main>
      </div>
      <DayFooter
        ref={footerRef}
        className={`z-40 max-lg:bottom-0 ${overlay}`}
      />
      {showJump && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-4 z-30 rounded-full bg-gold p-3 text-background shadow-lg transition-all duration-200 lg:hidden"
          style={{ bottom: 'calc(var(--footer-h) + 1rem)' }}
          aria-label="Jump to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
