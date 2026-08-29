import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
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
import { CHURCH_ERA_NAMES, CHURCH_JUMPS, eraNameForEntryId } from "@/lib/timeline/church-view";
import { missalJumpItems } from "@/lib/timeline/missal";
import { countHitsByView, searchHitStripItems } from "@/lib/timeline/search";
import { areAllBooksExpanded, useTimeline } from "@/lib/timeline/store";
import {
  VIEW_FILTERS,
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
  chromeOffsetWhenQueryCleared,
  chromeSettleOffset,
  interpolateChromeOffset,
  nextOverlayChromeOffsets,
  visibleChromeSize,
} from "@/lib/timeline/chrome-scroll";
import {
  KEYBOARD_BLUR_HOLD_MS,
  KEYBOARD_CHASE_MS,
  KEYBOARD_CLOSE_MS,
  SEARCH_FOCUS_LIFT_DELAY_MS,
  isSoftwareKeyboardOpen,
  keyboardInsetFromViewport,
  layoutViewportBottom,
  overlaySearchBarPinStyle,
  pullingSearchBarLift,
  ridingSearchBarLift,
  shouldCaptureSearchBarPull,
  shouldCompactLibraryChrome,
  shouldHoldOverlayChrome,
  shouldPullDismissSearchBar,
  stabilizeFocusedKeyboardLift,
  visualViewportGap,
} from "@/lib/timeline/keyboard-inset";
import { cn } from "@/lib/utils";
import { AboutPanel } from "./AboutPanel";
import { ArtifactSheet } from "./ArtifactSheet";
import { ArtworkPreloader } from "./ArtworkPreloader";
import { BibleView } from "./BibleView";
import { ChurchView } from "./ChurchView";
import { DayHeader } from "./DayHeader";
import { MissalView } from "./MissalView";

const MISSAL_JUMPS = missalJumpItems();

const VIEWS: { id: ViewMode; label: string; Icon: typeof BookOpen }[] = [
  { id: "bible", label: "Bible", Icon: BookOpen },
  { id: "church", label: "Church", Icon: Church },
  { id: "missal", label: "Missal", Icon: CalendarDays },
];

type VirtualKeyboardNav = Navigator & {
  virtualKeyboard?: {
    overlaysContent: boolean;
    boundingRect: { height: number };
    addEventListener(type: "geometrychange", listener: () => void): void;
    removeEventListener(type: "geometrychange", listener: () => void): void;
  };
};

function viewportMetrics() {
  const layoutBottom = layoutViewportBottom({
    clientHeight: document.documentElement.clientHeight,
    innerHeight: window.innerHeight,
  });
  const vv = window.visualViewport;
  const vk = (navigator as VirtualKeyboardNav).virtualKeyboard;
  return {
    layoutBottom,
    visualHeight: vv?.height ?? layoutBottom,
    visualOffsetTop: vv?.offsetTop ?? 0,
    virtualKeyboardHeight: vk?.boundingRect.height ?? 0,
  };
}

function measureKeyboardGap(): number {
  return visualViewportGap(viewportMetrics());
}

function measureKeyboardInset(): number {
  return keyboardInsetFromViewport(viewportMetrics());
}

type SearchBarPull = {
  active: boolean;
  riding: boolean;
  didBlur: boolean;
  x: number;
  y: number;
  dx: number;
  dy: number;
  startInset: number;
  rideCeiling: number;
  rideStartedAt: number;
};

const IDLE_SEARCH_PULL: SearchBarPull = {
  active: false,
  riding: false,
  didBlur: false,
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  startInset: 0,
  rideCeiling: 0,
  rideStartedAt: 0,
};

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
  compact,
}: {
  items: { id: string; label: string; range?: string }[];
  onPick: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="py-1">
      {items.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onPick(opt.id)}
          className={cn(
            "flex w-full items-start gap-3 px-4 text-left text-fg hover:bg-gold-soft",
            compact ? "min-h-11 py-2 text-sm" : "min-h-12 py-2.5 text-base",
          )}
        >
          <span className="min-w-0 flex-1 leading-snug">{opt.label}</span>
          {opt.range ? (
            <span className="shrink-0 pt-0.5 tabular-nums text-gold-dim">{opt.range}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

function ExpandControls({
  compact,
  allOpen,
  allClosed,
  noun,
  onCollapse,
  onExpand,
}: {
  compact?: boolean;
  allOpen: boolean;
  allClosed: boolean;
  noun: string;
  onCollapse: () => void;
  onExpand: () => void;
}) {
  if (compact) {
    return (
      <div
        className="flex h-12 overflow-hidden rounded-full bg-elevated shadow-fab"
        role="group"
        aria-label={`Expand or collapse all ${noun}`}
      >
        <button
          type="button"
          onClick={onCollapse}
          disabled={allClosed}
          className="flex h-full w-12 items-center justify-center text-gold transition-colors duration-150 hover:bg-gold-soft disabled:opacity-40"
          aria-label={`Collapse all ${noun}`}
        >
          <ChevronsDownUp className="size-5" strokeWidth={1.75} />
        </button>
        <span className="my-2 w-px shrink-0 bg-line" aria-hidden />
        <button
          type="button"
          onClick={onExpand}
          disabled={allOpen}
          className="flex h-full w-12 items-center justify-center text-gold transition-colors duration-150 hover:bg-gold-soft disabled:opacity-40"
          aria-label={`Expand all ${noun}`}
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
        onClick={onCollapse}
        disabled={allClosed}
        className="flex h-10 items-center justify-center rounded-md border border-line-strong bg-elevated px-2 text-xs font-medium text-muted transition-colors duration-150 hover:text-fg disabled:opacity-40"
      >
        Collapse all
      </button>
      <button
        type="button"
        onClick={onExpand}
        disabled={allOpen}
        className="flex h-10 items-center justify-center rounded-md border border-line-strong bg-elevated px-2 text-xs font-medium text-muted transition-colors duration-150 hover:text-fg disabled:opacity-40"
      >
        Expand all
      </button>
    </div>
  );
}

function ViewExpandControls({ compact }: { compact?: boolean }) {
  const view = useTimeline((s) => s.view);
  const expandedBooks = useTimeline((s) => s.expandedBooks);
  const expandAllBooks = useTimeline((s) => s.expandAllBooks);
  const collapseAllBooks = useTimeline((s) => s.collapseAllBooks);
  const expandedEras = useTimeline((s) => s.expandedEras);
  const expandAllEras = useTimeline((s) => s.expandAllEras);
  const collapseAllEras = useTimeline((s) => s.collapseAllEras);

  if (view === "bible") {
    return (
      <ExpandControls
        compact={compact}
        noun="books"
        allOpen={areAllBooksExpanded(expandedBooks)}
        allClosed={Object.values(expandedBooks).every((open) => !open)}
        onCollapse={collapseAllBooks}
        onExpand={expandAllBooks}
      />
    );
  }

  if (view === "church") {
    return (
      <ExpandControls
        compact={compact}
        noun="eras"
        allOpen={areAllBooksExpanded(expandedEras, CHURCH_ERA_NAMES)}
        allClosed={CHURCH_ERA_NAMES.every((name) => !expandedEras[name])}
        onCollapse={collapseAllEras}
        onExpand={expandAllEras}
      />
    );
  }

  return null;
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
    return <SectionJumpList items={CHURCH_JUMPS} onPick={onChurch} compact={compact} />;
  }
  return <SectionJumpList items={MISSAL_JUMPS} onPick={onMissal} compact={compact} />;
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
  const expandEra = useTimeline((s) => s.expandEra);

  const shellRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const searchNavRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const lastScrollRef = useRef(0);
  const lastDeltaRef = useRef(0);
  const pointerDownRef = useRef(false);
  const headerOffsetRef = useRef(0);
  const footerOffsetRef = useRef(0);
  const headerHRef = useRef(48);
  const footerHRef = useRef(108);
  const settleRafRef = useRef(0);
  const settleTimerRef = useRef(0);
  const searchFocusedRef = useRef(false);
  const searchHoldCompactRef = useRef(false);
  const searchHoldTimerRef = useRef(0);
  const lastKeyboardInsetRef = useRef(0);
  const searchFocusPointerRef = useRef(false);
  const searchFocusLiftTimerRef = useRef(0);
  const searchPullRef = useRef<SearchBarPull>({ ...IDLE_SEARCH_PULL });
  const keyboardChaseRafRef = useRef(0);
  const pullCaptureRef = useRef(false);
  const pullTouchMoveRef = useRef<(e: TouchEvent) => void>(() => {});
  const pullPointerMoveRef = useRef<(e: PointerEvent) => void>(() => {});
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

  const applyChrome = (next?: { header?: number; footer?: number }) => {
    const overlay = !isSidebarViewport();
    const header = headerRef.current;
    const footer = footerRef.current;
    const shell = shellRef.current;
    const headerH = header?.offsetHeight || headerHRef.current;
    const footerH = footer?.offsetHeight || footerHRef.current;
    const maxOffset = Math.max(headerH, footerH);
    const clamp = (offset: number) => (overlay ? Math.max(0, Math.min(maxOffset, offset)) : 0);
    headerOffsetRef.current = clamp(next?.header ?? headerOffsetRef.current);
    footerOffsetRef.current = clamp(next?.footer ?? footerOffsetRef.current);
    const headerProgress = overlay ? chromeHideProgress(headerOffsetRef.current, maxOffset) : 0;
    const footerProgress = overlay ? chromeHideProgress(footerOffsetRef.current, maxOffset) : 0;
    const headerVisible = overlay ? visibleChromeSize(headerProgress, headerH) : 0;
    const footerVisible = overlay ? visibleChromeSize(footerProgress, footerH) : 0;
    const headerGone = overlay && chromeFullyHidden(headerVisible);
    const footerGone = overlay && chromeFullyHidden(footerVisible);

    if (header) {
      header.style.transform =
        overlay && headerProgress ? `translate3d(0, ${-headerProgress * headerH}px, 0)` : "";
      header.toggleAttribute("inert", headerGone);
      header.style.pointerEvents = headerGone ? "none" : "";
    }
    if (footer) {
      footer.style.transform =
        overlay && footerProgress ? `translate3d(0, ${footerProgress * footerH}px, 0)` : "";
      footer.style.willChange = overlay && footerProgress ? "transform" : "";
      footer.toggleAttribute("inert", footerGone);
      footer.style.pointerEvents = footerGone ? "none" : "";
    }
    shell?.style.setProperty("--chrome-h", `${headerVisible}px`);
    shell?.style.setProperty("--footer-h", `${footerVisible}px`);
  };

  const animateChromeTo = (target: { header: number; footer: number }) => {
    const startHeader = headerOffsetRef.current;
    const startFooter = footerOffsetRef.current;
    if (
      Math.abs(target.header - startHeader) < 0.5 &&
      Math.abs(target.footer - startFooter) < 0.5
    ) {
      applyChrome(target);
      return;
    }
    cancelChromeAnimation();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyChrome(target);
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / CHROME_SETTLE_MS);
      applyChrome({
        header: interpolateChromeOffset(startHeader, target.header, t),
        footer: interpolateChromeOffset(startFooter, target.footer, t),
      });
      if (t < 1) settleRafRef.current = requestAnimationFrame(tick);
      else settleRafRef.current = 0;
    };
    settleRafRef.current = requestAnimationFrame(tick);
  };

  const hideFooterAfterQueryCleared = () => {
    const headerH = headerRef.current?.offsetHeight || headerHRef.current;
    const footerH = footerRef.current?.offsetHeight || footerHRef.current;
    animateChromeTo({
      header: headerOffsetRef.current,
      footer: chromeOffsetWhenQueryCleared({
        scrollTop: lastScrollRef.current,
        maxOffset: Math.max(headerH, footerH),
      }),
    });
  };

  const applyKeyboardInset = (inset: number) => {
    const overlay = !isSidebarViewport();
    const pull = searchPullRef.current;
    const liveGap = overlay ? measureKeyboardGap() : 0;
    let lift = overlay ? inset : 0;
    if (overlay && pull.active) {
      lift = pullingSearchBarLift({
        frozenInset: pull.startInset,
        fingerDy: pull.dy,
        liveGap,
        followKeyboard: pull.didBlur,
      });
    } else if (overlay && pull.riding) {
      const elapsed = performance.now() - pull.rideStartedAt;
      lift = ridingSearchBarLift({
        liveGap,
        rideCeiling: pull.rideCeiling,
        startGap: pull.startInset,
        elapsedMs: elapsed,
      });
      const keyboardGone = liveGap < 20;
      const rideTimedOut = elapsed >= KEYBOARD_CHASE_MS;
      if (keyboardGone || rideTimedOut) {
        searchPullRef.current = { ...IDLE_SEARCH_PULL };
        searchHoldCompactRef.current = false;
        lift = keyboardGone ? 0 : inset;
      } else if (elapsed >= KEYBOARD_CLOSE_MS && liveGap >= pull.startInset - 8) {
        // visualViewport is still stuck at the open height; stay down until it catches up.
        lift = 0;
      }
    }
    lift = stabilizeFocusedKeyboardLift({
      measuredLift: lift,
      lastOpenLift: lastKeyboardInsetRef.current,
      searchFocused: searchFocusedRef.current,
      pulling: pull.active || pull.riding,
      freezeOpenLift: pointerDownRef.current && !pull.active,
    });
    const compact = shouldCompactLibraryChrome({
      overlayLayout: overlay,
      searchFocused: searchFocusedRef.current,
      holdCompact: searchHoldCompactRef.current || pull.active || pull.riding,
      keyboardInset: Math.max(inset, lift),
    });
    if (isSoftwareKeyboardOpen(lift) && !pull.active && !pull.riding) {
      lastKeyboardInsetRef.current = lift;
    }

    const searchNav = searchNavRef.current;
    const footer = footerRef.current;
    const shell = shellRef.current;
    const scroll = scrollRef.current;
    if (searchNav) {
      const pin = overlaySearchBarPinStyle(lift);
      if (pin) {
        searchNav.style.position = pin.position;
        searchNav.style.left = pin.left;
        searchNav.style.right = pin.right;
        searchNav.style.bottom = pin.bottom;
        searchNav.style.zIndex = "21";
      } else {
        searchNav.style.position = "";
        searchNav.style.left = "";
        searchNav.style.right = "";
        searchNav.style.bottom = "";
        searchNav.style.zIndex = "";
      }
      searchNav.toggleAttribute("data-keyboard", compact);
    }
    if (footer) footer.toggleAttribute("data-keyboard", compact);
    if (shell) {
      shell.style.setProperty("--keyboard-inset", `${lift}px`);
      shell.toggleAttribute("data-keyboard", compact);
    }
    if (scroll) scroll.style.paddingBottom = lift ? `${lift}px` : "";
    if (compact && !pull.active) applyChrome({ footer: 0 });
  };

  const blurSearch = () => {
    searchRef.current?.blur();
  };

  const lockTimelinePointers = (lock: boolean) => {
    const scroll = scrollRef.current;
    if (scroll) scroll.style.pointerEvents = lock ? "none" : "";
  };

  const setPullCapture = (on: boolean) => {
    if (on === pullCaptureRef.current) return;
    pullCaptureRef.current = on;
    if (on) {
      window.addEventListener("touchmove", pullTouchMoveRef.current, {
        passive: false,
        capture: true,
      });
      window.addEventListener("pointermove", pullPointerMoveRef.current, { passive: false });
    } else {
      window.removeEventListener("touchmove", pullTouchMoveRef.current, true);
      window.removeEventListener("pointermove", pullPointerMoveRef.current);
    }
  };

  const clearSearchFocusLiftTimer = () => {
    if (searchFocusLiftTimerRef.current) {
      clearTimeout(searchFocusLiftTimerRef.current);
      searchFocusLiftTimerRef.current = 0;
    }
  };

  const cancelKeyboardChase = () => {
    if (keyboardChaseRafRef.current) {
      cancelAnimationFrame(keyboardChaseRafRef.current);
      keyboardChaseRafRef.current = 0;
    }
  };

  const startKeyboardChase = () => {
    cancelKeyboardChase();
    const until = performance.now() + KEYBOARD_CHASE_MS;
    const tick = (now: number) => {
      applyKeyboardInset(measureKeyboardInset());
      const riding = searchPullRef.current.riding;
      if (now < until || riding) {
        keyboardChaseRafRef.current = requestAnimationFrame(tick);
      } else {
        keyboardChaseRafRef.current = 0;
      }
    };
    keyboardChaseRafRef.current = requestAnimationFrame(tick);
  };

  const releaseSearchFocusPointer = () => {
    if (!searchFocusPointerRef.current) return;
    searchFocusPointerRef.current = false;
    clearSearchFocusLiftTimer();
    searchFocusLiftTimerRef.current = window.setTimeout(() => {
      searchFocusLiftTimerRef.current = 0;
      if (!searchPullRef.current.active && !searchPullRef.current.riding) {
        lockTimelinePointers(false);
      }
      if (searchFocusedRef.current) {
        applyKeyboardInset(Math.max(measureKeyboardInset(), lastKeyboardInsetRef.current));
        startKeyboardChase();
      }
    }, SEARCH_FOCUS_LIFT_DELAY_MS);
  };

  const moveSearchBarPull = (clientX: number, clientY: number) => {
    const pull = searchPullRef.current;
    if (!pull.active) return false;
    const dy = clientY - pull.y;
    const dx = clientX - pull.x;
    pull.dy = dy;
    pull.dx = dx;
    applyKeyboardInset(measureKeyboardInset());
    if (
      !pull.didBlur &&
      shouldPullDismissSearchBar({
        gestureActive: true,
        fingerDy: dy,
        fingerDx: dx,
      })
    ) {
      pull.didBlur = true;
      blurSearch();
    }
    return shouldCaptureSearchBarPull({
      gestureActive: true,
      fingerDy: dy,
      fingerDx: dx,
    });
  };

  const endSearchBarPull = () => {
    setPullCapture(false);
    const pull = searchPullRef.current;
    if (pull.riding) return;
    if (!pull.active) return;
    const dismiss =
      pull.didBlur ||
      shouldPullDismissSearchBar({
        gestureActive: true,
        fingerDy: pull.dy,
        fingerDx: pull.dx,
      });
    if (dismiss) {
      pull.active = false;
      pull.riding = true;
      pull.rideCeiling = pullingSearchBarLift({
        frozenInset: pull.startInset,
        fingerDy: pull.dy,
        liveGap: measureKeyboardGap(),
        followKeyboard: true,
      });
      pull.rideStartedAt = performance.now();
      pull.dy = 0;
      if (!pull.didBlur) {
        pull.didBlur = true;
        blurSearch();
      }
      lockTimelinePointers(false);
      applyKeyboardInset(measureKeyboardInset());
      startKeyboardChase();
      return;
    }
    searchPullRef.current = { ...IDLE_SEARCH_PULL };
    lockTimelinePointers(false);
    applyKeyboardInset(measureKeyboardInset());
  };

  const settleChrome = () => {
    if (isSidebarViewport() || pointerDownRef.current) return;
    const holdFooter = shouldHoldOverlayChrome({
      overlayLayout: true,
      searchFocused: searchFocusedRef.current,
      holdCompact: searchHoldCompactRef.current,
      keyboardInset: measureKeyboardInset(),
      hasQuery: Boolean(useTimeline.getState().query.trim()),
    });
    const maxOffset = Math.max(headerHRef.current, footerHRef.current);
    const headerTarget = chromeSettleOffset({
      offset: headerOffsetRef.current,
      maxOffset,
      scrollTop: lastScrollRef.current,
      lastDelta: lastDeltaRef.current,
    });
    const footerTarget = holdFooter
      ? 0
      : chromeSettleOffset({
          offset: footerOffsetRef.current,
          maxOffset,
          scrollTop: lastScrollRef.current,
          lastDelta: lastDeltaRef.current,
        });
    if (
      Math.abs(headerTarget - headerOffsetRef.current) < 0.5 &&
      Math.abs(footerTarget - footerOffsetRef.current) < 0.5
    ) {
      return;
    }
    animateChromeTo({ header: headerTarget, footer: footerTarget });
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
  const applyKeyboardInsetRef = useRef(applyKeyboardInset);
  applyKeyboardInsetRef.current = applyKeyboardInset;
  const releaseSearchFocusPointerRef = useRef(releaseSearchFocusPointer);
  releaseSearchFocusPointerRef.current = releaseSearchFocusPointer;
  const moveSearchBarPullRef = useRef(moveSearchBarPull);
  moveSearchBarPullRef.current = moveSearchBarPull;
  const endSearchBarPullRef = useRef(endSearchBarPull);
  endSearchBarPullRef.current = endSearchBarPull;

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
      applyChrome();
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    if (footer) ro.observe(footer);
    return () => ro.disconnect();
  }, [isSidebar]);

  useEffect(() => {
    const vk = (navigator as VirtualKeyboardNav).virtualKeyboard;
    if (vk) {
      try {
        vk.overlaysContent = true;
      } catch {
        /* Safari ignores this API */
      }
    }
    const sync = () => {
      if (window.scrollY) window.scrollTo(0, 0);
      applyKeyboardInsetRef.current(measureKeyboardInset());
    };
    const syncFromVisualScroll = () => {
      if (window.scrollY) window.scrollTo(0, 0);
      if (
        searchFocusedRef.current &&
        !searchPullRef.current.active &&
        !searchPullRef.current.riding
      ) {
        return;
      }
      applyKeyboardInsetRef.current(measureKeyboardInset());
    };
    sync();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", syncFromVisualScroll);
    vk?.addEventListener("geometrychange", sync);
    window.addEventListener("resize", sync);
    return () => {
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", syncFromVisualScroll);
      vk?.removeEventListener("geometrychange", sync);
      window.removeEventListener("resize", sync);
      if (searchHoldTimerRef.current) {
        clearTimeout(searchHoldTimerRef.current);
        searchHoldTimerRef.current = 0;
      }
      if (searchFocusLiftTimerRef.current) {
        clearTimeout(searchFocusLiftTimerRef.current);
        searchFocusLiftTimerRef.current = 0;
      }
      if (keyboardChaseRafRef.current) {
        cancelAnimationFrame(keyboardChaseRafRef.current);
        keyboardChaseRafRef.current = 0;
      }
    };
  }, [isSidebar]);

  const hitCounts = useMemo(() => countHitsByView(query, filter), [filter, query]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    lastScrollRef.current = 0;
    lastDeltaRef.current = 0;
    cancelChromeAnimation();
    cancelChromeSettleTimer();
    applyChrome({ header: 0, footer: 0 });
    setFilterOpen(false);
    setJumpOpen(false);
  }, [view]);

  useEffect(() => {
    if (isSidebarViewport()) return;
    if (
      shouldHoldOverlayChrome({
        overlayLayout: true,
        searchFocused: searchFocusedRef.current,
        holdCompact: searchHoldCompactRef.current,
        keyboardInset: measureKeyboardInset(),
        hasQuery: Boolean(query.trim()),
      })
    ) {
      cancelChromeAnimation();
      applyChrome({ footer: 0 });
      return;
    }
    hideFooterAfterQueryCleared();
  }, [query]);

  useEffect(() => {
    if (isDesktop) closeArtifact();
  }, [isDesktop, closeArtifact]);

  useEffect(() => {
    const el = scrollRef.current;
    const footer = footerRef.current;
    const onScrollEnd = () => {
      if (!pointerDownRef.current) settleChromeRef.current();
    };
    const onPointerDown = () => {
      pointerDownRef.current = true;
      cancelChromeAnimation();
      cancelChromeSettleTimer();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (moveSearchBarPullRef.current(e.clientX, e.clientY) && e.cancelable) {
        e.preventDefault();
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      if (moveSearchBarPullRef.current(touch.clientX, touch.clientY) && e.cancelable) {
        e.preventDefault();
      }
    };
    pullTouchMoveRef.current = onTouchMove;
    pullPointerMoveRef.current = onPointerMove;
    const onRelease = () => {
      endSearchBarPullRef.current();
      if (pointerDownRef.current) {
        pointerDownRef.current = false;
        scheduleChromeSettleRef.current();
      }
      releaseSearchFocusPointerRef.current();
    };
    el?.addEventListener("scrollend", onScrollEnd);
    el?.addEventListener("pointerdown", onPointerDown);
    footer?.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("pointerup", onRelease, true);
    window.addEventListener("pointercancel", onRelease, true);
    window.addEventListener("mouseup", onRelease, true);
    window.addEventListener("touchend", onRelease, true);
    return () => {
      el?.removeEventListener("scrollend", onScrollEnd);
      el?.removeEventListener("pointerdown", onPointerDown);
      footer?.removeEventListener("touchmove", onTouchMove);
      if (pullCaptureRef.current) {
        window.removeEventListener("touchmove", onTouchMove, true);
        window.removeEventListener("pointermove", onPointerMove);
        pullCaptureRef.current = false;
      }
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

  const onSearchChromePointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (isSidebarViewport()) return;
    if (e.target instanceof Element && e.target.closest("[data-search-clear]")) return;
    searchFocusPointerRef.current = true;
    lockTimelinePointers(true);
    if (document.activeElement === searchRef.current) {
      setPullCapture(true);
      searchPullRef.current = {
        ...IDLE_SEARCH_PULL,
        active: true,
        x: e.clientX,
        y: e.clientY,
        startInset: Math.max(
          measureKeyboardInset(),
          lastKeyboardInsetRef.current,
          measureKeyboardGap(),
        ),
      };
    }
  };

  const onSearchFocus = () => {
    searchFocusedRef.current = true;
    searchHoldCompactRef.current = false;
    if (searchHoldTimerRef.current) {
      clearTimeout(searchHoldTimerRef.current);
      searchHoldTimerRef.current = 0;
    }
    setFilterOpen(false);
    setJumpOpen(false);
    if (!searchFocusPointerRef.current) {
      applyKeyboardInset(Math.max(measureKeyboardInset(), lastKeyboardInsetRef.current));
      startKeyboardChase();
    }
  };

  const onSearchBlur = () => {
    searchFocusedRef.current = false;
    if (searchHoldTimerRef.current) clearTimeout(searchHoldTimerRef.current);
    const inset = measureKeyboardInset();
    const pull = searchPullRef.current;
    const keyboardOpen =
      isSoftwareKeyboardOpen(inset) || pull.active || pull.riding;
    if (!keyboardOpen) {
      searchHoldCompactRef.current = false;
      applyKeyboardInset(inset);
      if (!useTimeline.getState().query.trim()) {
        hideFooterAfterQueryCleared();
      }
      return;
    }
    searchHoldCompactRef.current = true;
    applyKeyboardInset(inset);
    startKeyboardChase();
    searchHoldTimerRef.current = window.setTimeout(() => {
      searchHoldTimerRef.current = 0;
      if (searchPullRef.current.active || searchPullRef.current.riding) return;
      searchHoldCompactRef.current = false;
      applyKeyboardInset(measureKeyboardInset());
      if (!useTimeline.getState().query.trim()) {
        hideFooterAfterQueryCleared();
      }
    }, KEYBOARD_BLUR_HOLD_MS);
  };

  const clearSearchQuery = () => {
    searchRef.current?.blur();
    setQuery("");
  };

  const onClearSearchPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    // Prevent focus only. Clearing on pointerdown unmounts this control and the
    // rest of the tap lands on the input, which reopens the keyboard.
    e.preventDefault();
    e.stopPropagation();
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el || isSidebarViewport()) return;
    cancelChromeAnimation();
    const y = Math.max(0, el.scrollTop);
    const delta = y - lastScrollRef.current;
    lastScrollRef.current = y;
    if (delta !== 0) lastDeltaRef.current = delta;
    const holdFooter = shouldHoldOverlayChrome({
      overlayLayout: true,
      searchFocused: searchFocusedRef.current,
      holdCompact: searchHoldCompactRef.current,
      keyboardInset: measureKeyboardInset(),
      hasQuery: Boolean(query.trim()),
    });
    const maxOffset = Math.max(headerHRef.current, footerHRef.current);
    const next = nextOverlayChromeOffsets({
      headerPrev: headerOffsetRef.current,
      footerPrev: footerOffsetRef.current,
      delta,
      scrollTop: y,
      maxOffset,
      holdFooter,
    });
    if (headerOffsetRef.current < 1 && next.header > 1) setFilterOpen(false);
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
    if (prefix === "era") {
      const era = eraNameForEntryId(id);
      if (era) expandEra(era, true);
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(`${prefix}-${id}`)?.scrollIntoView({ block: "start" });
      });
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
      className="relative flex h-dvh flex-col overflow-hidden overscroll-none bg-bg text-fg"
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
        className="max-lg:absolute max-lg:inset-x-0 max-lg:top-0 max-lg:z-20 max-lg:overscroll-none"
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
          {view === "bible" || view === "church" ? (
            <div className="border-t border-line">
              <ViewExpandControls />
            </div>
          ) : null}
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
              className="h-full overflow-y-scroll overscroll-y-contain [overflow-anchor:none] [-webkit-overflow-scrolling:touch]"
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

          <div
            ref={footerRef}
            className="library-footer shrink-0 max-lg:absolute max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-20"
          >
            <nav
              ref={searchNavRef}
              className="library-nav border-t border-line bg-bg"
              aria-label="Library"
              onPointerDown={onSearchChromePointerDown}
            >
              {query.trim() ? (
                <div className="px-3 pt-2">
                  <div
                    className="grid grid-cols-3 p-0.5 text-center text-sm"
                    aria-label="Search hits by view"
                  >
                    {searchHitStripItems(hitCounts).map(({ id, label, count }) => (
                      <button
                        key={id}
                        type="button"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => setView(id)}
                        className={cn(
                          "min-w-0 truncate px-1",
                          id === view ? "text-fg" : "text-gold",
                        )}
                      >
                        {count} in {label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex items-center gap-2 px-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAboutOpen(true)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-md text-gold hover:bg-gold-soft"
                  aria-label="About and sources"
                >
                  <Info className="size-5" strokeWidth={1.75} />
                </button>
                <div className="relative min-w-0 flex-1">
                  <label className="block">
                    <span className="sr-only">Search Scripture, Magisterium, and Missal</span>
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-subtle" />
                    <input
                      ref={searchRef}
                      type="search"
                      inputMode="search"
                      enterKeyHint="search"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={onSearchFocus}
                      onBlur={onSearchBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                      placeholder="Search"
                      className="h-10 w-full rounded-md border border-line-strong bg-elevated pr-9 pl-8 text-base text-fg outline-none placeholder:text-subtle focus:border-gold"
                    />
                  </label>
                  {query ? (
                    <button
                      type="button"
                      data-search-clear
                      tabIndex={-1}
                      onPointerDown={onClearSearchPointerDown}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearSearchQuery();
                      }}
                      className="absolute top-1/2 right-0.5 z-10 flex size-8 -translate-y-1/2 items-center justify-center text-muted"
                      aria-label="Clear search"
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : null}
                </div>
                <FilterMenu
                  filters={VIEW_FILTERS[view]}
                  value={filter}
                  open={filterOpen}
                  onOpenChange={setFilterOpen}
                  onChange={setFilter}
                />
              </div>
            </nav>

            <div className="library-tabs bg-bg px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
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
                    onPointerDown={(e) => {
                      e.preventDefault();
                    }}
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
          </div>

          <div
            aria-hidden
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[19] bg-bg lg:hidden"
            style={{ height: "var(--keyboard-inset, 0px)" }}
          />

          <div
            className="timeline-fab-dock pointer-events-none absolute inset-x-0 z-40 px-[max(0.75rem,var(--safe-x))] lg:hidden"
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
                      "absolute inset-x-0 bottom-14 overflow-y-auto rounded-lg bg-elevated shadow-[var(--shadow-border)]",
                      view === "bible"
                        ? "max-h-[min(28rem,50dvh)]"
                        : "max-h-[calc(100dvh-var(--footer-h,0px)-5.5rem-env(safe-area-inset-top,0px))]",
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
                  {(view === "bible" || view === "church") && <ViewExpandControls compact />}
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
