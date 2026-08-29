import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Church,
  Info,
  ListFilter,
  Search,
  X,
} from "lucide-react";
import { BIBLE_BOOKS } from "@/lib/timeline/bible";
import { periodBadgeStyle, periodForBook } from "@/lib/timeline/bible-periods";
import { CHURCH_ENTRIES } from "@/lib/timeline/church";
import { missalJumpItems } from "@/lib/timeline/missal";
import { countHitsByView } from "@/lib/timeline/search";
import { areAllBooksExpanded, useTimeline } from "@/lib/timeline/store";
import {
  VIEW_FILTERS,
  VIEW_LABEL,
  type BibleBook,
  type FilterChip,
  type FilterId,
  type ViewMode,
} from "@/lib/timeline/types";
import { isSidebarViewport, useIsDesktop, useIsSidebarLayout } from "@/lib/media";
import {
  CHROME_SETTLE_IDLE_MS,
  CHROME_SETTLE_MS,
  chromeFullyHidden,
  chromeHideProgress,
  chromeSettleOffset,
  interpolateChromeOffset,
  nextChromeHideOffset,
  visibleChromeSize,
} from "@/lib/timeline/chrome-scroll";
import { cn } from "@/lib/utils";
import { AboutPanel } from "./AboutPanel";
import { ArtifactSheet } from "./ArtifactSheet";
import { ArtworkPreloader } from "./ArtworkPreloader";
import { BibleView } from "./BibleView";
import { ChurchView } from "./ChurchView";
import { DayHeader } from "./DayHeader";
import { MissalView } from "./MissalView";

const CHURCH_JUMPS = (() => {
  const seen = new Set<string>();
  const items: { id: string; label: string }[] = [];
  for (const entry of CHURCH_ENTRIES) {
    const label = entry.era ?? entry.title;
    if (seen.has(label)) continue;
    seen.add(label);
    items.push({ id: entry.id, label });
  }
  items.push({ id: "francis", label: "Today" });
  return items;
})();

const MISSAL_JUMPS = missalJumpItems();

const VIEWS: { id: ViewMode; label: string; Icon: typeof BookOpen }[] = [
  { id: "bible", label: "Bible", Icon: BookOpen },
  { id: "church", label: "Church", Icon: Church },
  { id: "missal", label: "Missal", Icon: CalendarDays },
];

function BibleJumpGrid({
  onPick,
  compact,
}: {
  onPick: (book: BibleBook) => void;
  compact?: boolean;
}) {
  const ot = BIBLE_BOOKS.filter((b) => b.testament === "OT");
  const nt = BIBLE_BOOKS.filter((b) => b.testament === "NT");
  const group = (label: string, books: BibleBook[]) => (
    <div>
      <p className="px-1 pb-1.5 pt-2 font-serif text-xs uppercase tracking-[0.16em] text-gold-dim">
        {label}
      </p>
      <div className={compact ? "grid grid-cols-6 gap-1 sm:grid-cols-8" : "grid grid-cols-5 gap-1"}>
        {books.map((book) => {
          const populated = book.populatedChapters.length > 0;
          const period = periodForBook(book.name);
          return (
            <button
              key={book.name}
              type="button"
              onClick={() => onPick(book)}
              className={cn(
                compact
                  ? "flex h-11 items-center justify-center rounded-sm font-serif text-sm font-semibold"
                  : "flex aspect-square min-w-0 w-full items-center justify-center rounded-sm px-0.5 text-center font-serif text-xs font-semibold leading-none",
                populated ? "opacity-100" : "opacity-40 hover:opacity-80",
              )}
              style={periodBadgeStyle(book.name)}
              aria-label={book.name}
              title={`${book.name} · ${period.label}`}
            >
              {book.abbreviation}
            </button>
          );
        })}
      </div>
    </div>
  );
  return (
    <div className="p-3">
      {group("Old Testament", ot)}
      {group("New Testament", nt)}
    </div>
  );
}

function SectionJumpList({
  items,
  onPick,
}: {
  items: { id: string; label: string }[];
  onPick: (id: string) => void;
}) {
  return (
    <div className="py-1">
      {items.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onPick(opt.id)}
          className="flex h-12 w-full items-center px-4 text-left text-base text-fg hover:bg-gold-soft"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function BookExpandControls({ compact }: { compact?: boolean }) {
  const expandedBooks = useTimeline((s) => s.expandedBooks);
  const expandAllBooks = useTimeline((s) => s.expandAllBooks);
  const collapseAllBooks = useTimeline((s) => s.collapseAllBooks);
  const allOpen = areAllBooksExpanded(expandedBooks);

  if (compact) {
    const allClosed = Object.values(expandedBooks).every((open) => !open);
    return (
      <div
        className="flex h-12 overflow-hidden rounded-full bg-elevated shadow-fab"
        role="group"
        aria-label="Expand or collapse all books"
      >
        <button
          type="button"
          onClick={collapseAllBooks}
          disabled={allClosed}
          className="flex h-full w-12 items-center justify-center text-gold transition-colors duration-150 hover:bg-gold-soft disabled:opacity-40"
          aria-label="Collapse all books"
        >
          <ChevronsDownUp className="size-5" strokeWidth={1.75} />
        </button>
        <span className="my-2 w-px shrink-0 bg-line" aria-hidden />
        <button
          type="button"
          onClick={expandAllBooks}
          disabled={allOpen}
          className="flex h-full w-12 items-center justify-center text-gold transition-colors duration-150 hover:bg-gold-soft disabled:opacity-40"
          aria-label="Expand all books"
        >
          <ChevronsUpDown className="size-5" strokeWidth={1.75} />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-1 px-3 py-2">
      <button
        type="button"
        onClick={collapseAllBooks}
        disabled={Object.values(expandedBooks).every((open) => !open)}
        className="flex h-10 items-center justify-center rounded-md border border-line-strong bg-elevated px-2 text-xs font-medium text-muted transition-colors duration-150 hover:text-fg disabled:opacity-40"
      >
        Collapse all
      </button>
      <button
        type="button"
        onClick={expandAllBooks}
        disabled={allOpen}
        className="flex h-10 items-center justify-center rounded-md border border-line-strong bg-elevated px-2 text-xs font-medium text-muted transition-colors duration-150 hover:text-fg disabled:opacity-40"
      >
        Expand all
      </button>
    </div>
  );
}

function FilterMenu({
  filters,
  value,
  open,
  onOpenChange,
  onChange,
}: {
  filters: FilterChip[];
  value: FilterId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (id: FilterId) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const current = filters.find((f) => f.id === value) ?? filters[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Filter: ${current.label}`}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex h-10 max-w-[8.5rem] items-center gap-1 rounded-md border px-2 text-sm font-medium transition-transform duration-150 ease-out active:scale-95",
          value !== "all"
            ? "border-gold bg-gold text-bg"
            : "border-line-strong bg-elevated text-muted",
        )}
      >
        <ListFilter className="size-3.5 shrink-0" strokeWidth={1.75} />
        <span className="min-w-0 truncate">{current.label}</span>
        <ChevronDown
          className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-180")}
          strokeWidth={1.75}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Filter artifacts"
          className="absolute right-0 bottom-full z-40 mb-1 min-w-[10.5rem] overflow-hidden rounded-md bg-elevated py-1 shadow-[var(--shadow-border)]"
        >
          {filters.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                role="option"
                aria-selected={f.id === value}
                className={cn(
                  "flex h-11 w-full items-center px-3 text-left text-base",
                  f.id === value ? "bg-gold-soft text-gold" : "text-fg hover:bg-gold-soft",
                )}
                onClick={() => {
                  onChange(f.id);
                  onOpenChange(false);
                }}
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function JumpBody({
  view,
  onBook,
  onChurch,
  onMissal,
  compact,
}: {
  view: ViewMode;
  onBook: (book: BibleBook) => void;
  onChurch: (id: string) => void;
  onMissal: (id: string) => void;
  compact?: boolean;
}) {
  if (view === "bible") return <BibleJumpGrid onPick={onBook} compact={compact} />;
  if (view === "church") {
    return <SectionJumpList items={CHURCH_JUMPS} onPick={onChurch} />;
  }
  return <SectionJumpList items={MISSAL_JUMPS} onPick={onMissal} />;
}

export function AppShell() {
  const view = useTimeline((s) => s.view);
  const setView = useTimeline((s) => s.setView);
  const filter = useTimeline((s) => s.filter);
  const setFilter = useTimeline((s) => s.setFilter);
  const query = useTimeline((s) => s.query);
  const setQuery = useTimeline((s) => s.setQuery);
  const selected = useTimeline((s) => s.selected);
  const closeArtifact = useTimeline((s) => s.closeArtifact);
  const isDesktop = useIsDesktop();
  const isSidebar = useIsSidebarLayout();
  const aboutOpen = useTimeline((s) => s.aboutOpen);
  const setAboutOpen = useTimeline((s) => s.setAboutOpen);
  const expandBook = useTimeline((s) => s.expandBook);

  const shellRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const lastScrollRef = useRef(0);
  const lastDeltaRef = useRef(0);
  const pointerDownRef = useRef(false);
  const chromeOffsetRef = useRef(0);
  const headerHRef = useRef(48);
  const footerHRef = useRef(108);
  const settleRafRef = useRef(0);
  const settleTimerRef = useRef(0);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [headerH, setHeaderH] = useState(48);
  const [footerH, setFooterH] = useState(108);

  const cancelChromeAnimation = () => {
    if (settleRafRef.current) {
      cancelAnimationFrame(settleRafRef.current);
      settleRafRef.current = 0;
    }
  };

  const cancelChromeSettleTimer = () => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = 0;
    }
  };

  const applyChrome = (offset: number) => {
    const overlay = !isSidebarViewport();
    const header = headerRef.current;
    const footer = footerRef.current;
    const shell = shellRef.current;
    const headerH = headerHRef.current;
    const footerH = footerHRef.current;
    const maxOffset = Math.max(headerH, footerH);
    const next = overlay ? Math.max(0, Math.min(maxOffset, offset)) : 0;
    chromeOffsetRef.current = next;
    const progress = overlay ? chromeHideProgress(next, maxOffset) : 0;
    const headerVisible = overlay ? visibleChromeSize(progress, headerH) : 0;
    const footerVisible = overlay ? visibleChromeSize(progress, footerH) : 0;
    const headerGone = overlay && chromeFullyHidden(headerVisible);
    const footerGone = overlay && chromeFullyHidden(footerVisible);

    if (header) {
      header.style.transform =
        overlay && progress ? `translate3d(0, ${-progress * headerH}px, 0)` : "";
      header.toggleAttribute("inert", headerGone);
      header.style.pointerEvents = headerGone ? "none" : "";
    }
    if (footer) {
      footer.style.transform =
        overlay && progress ? `translate3d(0, ${progress * footerH}px, 0)` : "";
      footer.toggleAttribute("inert", footerGone);
      footer.style.pointerEvents = footerGone ? "none" : "";
    }
    shell?.style.setProperty("--chrome-h", `${headerVisible}px`);
    shell?.style.setProperty("--footer-h", `${footerVisible}px`);
  };

  const settleChrome = () => {
    if (isSidebarViewport() || pointerDownRef.current) return;
    const maxOffset = Math.max(headerHRef.current, footerHRef.current);
    const target = chromeSettleOffset({
      offset: chromeOffsetRef.current,
      maxOffset,
      scrollTop: lastScrollRef.current,
      lastDelta: lastDeltaRef.current,
    });
    if (Math.abs(target - chromeOffsetRef.current) < 0.5) return;
    cancelChromeAnimation();
    const start = chromeOffsetRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyChrome(target);
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / CHROME_SETTLE_MS);
      applyChrome(interpolateChromeOffset(start, target, t));
      if (t < 1) settleRafRef.current = requestAnimationFrame(tick);
      else settleRafRef.current = 0;
    };
    settleRafRef.current = requestAnimationFrame(tick);
  };

  const scheduleChromeSettle = () => {
    cancelChromeSettleTimer();
    settleTimerRef.current = window.setTimeout(() => {
      settleTimerRef.current = 0;
      settleChrome();
    }, CHROME_SETTLE_IDLE_MS);
  };

  const scheduleChromeSettleRef = useRef(scheduleChromeSettle);
  scheduleChromeSettleRef.current = scheduleChromeSettle;
  const settleChromeRef = useRef(settleChrome);
  settleChromeRef.current = settleChrome;

  useLayoutEffect(() => {
    const header = headerRef.current;
    const footer = footerRef.current;
    if (!header) return;
    const update = () => {
      const nextHeader = header.offsetHeight;
      const nextFooter = footer?.offsetHeight ?? 0;
      headerHRef.current = nextHeader;
      footerHRef.current = nextFooter;
      setHeaderH(nextHeader);
      setFooterH(nextFooter);
      applyChrome(chromeOffsetRef.current);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    if (footer) ro.observe(footer);
    return () => ro.disconnect();
  }, [isSidebar]);

  const hitCounts = useMemo(() => countHitsByView(query, filter), [filter, query]);
  const otherViews = (["bible", "church", "missal"] as const).filter(
    (id) => id !== view && hitCounts[id] > 0,
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    lastScrollRef.current = 0;
    lastDeltaRef.current = 0;
    cancelChromeAnimation();
    cancelChromeSettleTimer();
    applyChrome(0);
    setFilterOpen(false);
    setJumpOpen(false);
  }, [view]);

  useEffect(() => {
    if (isDesktop) closeArtifact();
  }, [isDesktop, closeArtifact]);

  useEffect(() => {
    const el = scrollRef.current;
    const onScrollEnd = () => {
      if (!pointerDownRef.current) settleChromeRef.current();
    };
    const onPointerDown = () => {
      pointerDownRef.current = true;
      cancelChromeAnimation();
      cancelChromeSettleTimer();
    };
    const onRelease = () => {
      if (!pointerDownRef.current) return;
      pointerDownRef.current = false;
      scheduleChromeSettleRef.current();
    };
    el?.addEventListener("scrollend", onScrollEnd);
    el?.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onRelease, true);
    window.addEventListener("pointercancel", onRelease, true);
    window.addEventListener("mouseup", onRelease, true);
    window.addEventListener("touchend", onRelease, true);
    return () => {
      el?.removeEventListener("scrollend", onScrollEnd);
      el?.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onRelease, true);
      window.removeEventListener("pointercancel", onRelease, true);
      window.removeEventListener("mouseup", onRelease, true);
      window.removeEventListener("touchend", onRelease, true);
      cancelChromeAnimation();
      cancelChromeSettleTimer();
    };
  }, [isSidebar]);

  const onChromePointerDown = () => {
    pointerDownRef.current = true;
    cancelChromeAnimation();
    cancelChromeSettleTimer();
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el || isSidebarViewport()) return;
    cancelChromeAnimation();
    if (document.activeElement === searchRef.current) {
      applyChrome(0);
      lastScrollRef.current = Math.max(0, el.scrollTop);
      lastDeltaRef.current = 0;
      return;
    }
    const y = Math.max(0, el.scrollTop);
    const delta = y - lastScrollRef.current;
    lastScrollRef.current = y;
    if (delta !== 0) lastDeltaRef.current = delta;
    const maxOffset = Math.max(headerHRef.current, footerHRef.current);
    const prev = chromeOffsetRef.current;
    const next = nextChromeHideOffset({
      prev,
      delta,
      scrollTop: y,
      maxOffset,
    });
    if (prev < 1 && next > 1) setFilterOpen(false);
    applyChrome(next);
    if (!pointerDownRef.current) scheduleChromeSettle();
  };

  const jumpToBook = (book: BibleBook) => {
    setJumpOpen(false);
    expandBook(book.name, true);
    requestAnimationFrame(() => {
      document.getElementById(`book-${book.name}`)?.scrollIntoView({ block: "start" });
    });
  };

  const jumpToAnchor = (prefix: string, id: string) => {
    setJumpOpen(false);
    requestAnimationFrame(() => {
      document.getElementById(`${prefix}-${id}`)?.scrollIntoView({ block: "start" });
    });
  };

  const jumpLabel =
    view === "bible"
      ? "Jump to a book"
      : view === "church"
        ? "Jump to an era"
        : "Jump in the Missal";

  return (
    <div
      ref={shellRef}
      className="app-shell relative flex h-dvh flex-col overflow-hidden bg-bg text-fg"
      style={
        {
          "--chrome-h": isSidebar ? "0px" : `${headerH}px`,
          "--footer-h": isSidebar ? "0px" : `${footerH}px`,
        } as CSSProperties
      }
    >
      <ArtworkPreloader />
      <DayHeader
        ref={headerRef}
        id="timeline-chrome"
        className="max-lg:absolute max-lg:inset-x-0 max-lg:top-0 max-lg:z-20 max-lg:will-change-transform"
      />

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
          <p className="px-5 pt-4 pb-2 font-serif text-xs tracking-[0.16em] text-gold-dim uppercase">
            {jumpLabel}
          </p>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <JumpBody
              view={view}
              onBook={jumpToBook}
              onChurch={(id) => jumpToAnchor("era", id)}
              onMissal={(id) => jumpToAnchor("missal", id)}
            />
          </div>
          {view === "bible" && (
            <div className="border-t border-line">
              <BookExpandControls />
            </div>
          )}
          <div className="border-t border-line p-3">
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              className="flex h-11 w-full items-center gap-2 rounded-md px-2 text-sm text-muted transition-colors duration-150 hover:bg-gold-soft hover:text-fg"
            >
              <Info className="size-4 text-gold" strokeWidth={1.75} />
              About and sources
            </button>
          </div>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1">
            <main
              ref={scrollRef}
              id="timeline-scroll"
              onScroll={onScroll}
              onPointerDown={onChromePointerDown}
              className="h-full overflow-y-auto [overflow-anchor:none]"
            >
              {!isSidebar && <div aria-hidden className="shrink-0" style={{ height: headerH }} />}
              <div className="mx-auto w-full max-w-xl dual:max-w-6xl">
                {view === "bible" ? (
                  <BibleView />
                ) : view === "church" ? (
                  <ChurchView />
                ) : (
                  <MissalView />
                )}
              </div>
            </main>
          </div>

          <nav
            ref={footerRef}
            className="shrink-0 border-t border-line bg-bg pb-[max(0.5rem,env(safe-area-inset-bottom))] max-lg:absolute max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-20 max-lg:will-change-transform"
            aria-label="Library"
          >
            {query.trim() && (
              <p className="px-3 pt-2 text-sm text-muted">
                {hitCounts[view] === 0
                  ? `No matches in ${VIEW_LABEL[view]}`
                  : `${hitCounts[view]} in ${VIEW_LABEL[view]}`}
                {otherViews.map((id) => (
                  <span key={id}>
                    {" · "}
                    <button
                      type="button"
                      className="text-gold underline-offset-2 hover:underline"
                      onClick={() => setView(id)}
                    >
                      {hitCounts[id]} in {VIEW_LABEL[id]}
                    </button>
                  </span>
                ))}
              </p>
            )}

            <div className="flex items-center gap-2 px-3 pt-2">
              <button
                type="button"
                onClick={() => setAboutOpen(true)}
                className="flex size-11 shrink-0 items-center justify-center rounded-md text-gold hover:bg-gold-soft"
                aria-label="About and sources"
              >
                <Info className="size-5" strokeWidth={1.75} />
              </button>
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search Scripture, Magisterium, and Missal</span>
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-subtle" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="h-10 w-full rounded-md border border-line-strong bg-elevated pr-9 pl-8 text-base text-fg outline-none placeholder:text-subtle focus:border-gold"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute top-1/2 right-0.5 flex size-8 -translate-y-1/2 items-center justify-center text-muted"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </label>
              <FilterMenu
                filters={VIEW_FILTERS[view]}
                value={filter}
                open={filterOpen}
                onOpenChange={setFilterOpen}
                onChange={setFilter}
              />
            </div>

            <div className="px-3 pt-2">
              <div
                role="tablist"
                aria-label="Timeline view"
                className="grid grid-cols-3 rounded-md bg-elevated p-0.5"
                style={{
                  boxShadow: "0 0 0 1px color-mix(in oklab, var(--color-gold) 30%, transparent)",
                }}
              >
                {VIEWS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={view === id}
                    onClick={() => setView(id)}
                    className={cn(
                      "flex h-10 items-center justify-center gap-1 rounded-sm text-base font-medium transition-colors duration-150",
                      view === id ? "bg-gold text-bg" : "text-muted",
                    )}
                  >
                    <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <div
            className="timeline-fab-dock pointer-events-none absolute inset-x-0 z-30 px-3 lg:hidden"
            style={{ bottom: "var(--footer-h, 0px)" }}
          >
            <div className="pointer-events-auto relative mx-auto w-full max-w-xl">
              <AnimatePresence>
                {jumpOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "absolute bottom-14 max-h-[min(28rem,50dvh)] overflow-y-auto rounded-lg bg-elevated shadow-[var(--shadow-border)]",
                      view === "bible" ? "inset-x-0" : "left-1/2 w-72 -translate-x-1/2",
                    )}
                  >
                    <JumpBody
                      view={view}
                      compact
                      onBook={jumpToBook}
                      onChurch={(id) => jumpToAnchor("era", id)}
                      onMissal={(id) => jumpToAnchor("missal", id)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                <span />
                <button
                  type="button"
                  onClick={() => setJumpOpen((v) => !v)}
                  className="flex h-12 min-w-32 items-center justify-center rounded-full bg-elevated px-5 font-serif text-lg text-gold shadow-fab transition-transform duration-150 ease-out active:scale-95"
                >
                  Jump to…
                </button>
                <div className="flex justify-end">
                  {view === "bible" && <BookExpandControls compact />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isDesktop && <ArtifactSheet artifact={selected} onClose={closeArtifact} />}
      <AboutPanel open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
}
