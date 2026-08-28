import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
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
import { useTimeline } from "@/lib/timeline/store";
import {
  VIEW_FILTERS,
  VIEW_LABEL,
  type BibleBook,
  type FilterChip,
  type FilterId,
  type ViewMode,
} from "@/lib/timeline/types";
import { useIsDesktop } from "@/lib/media";
import { cn } from "@/lib/utils";
import { AboutPanel } from "./AboutPanel";
import { ArtifactSheet } from "./ArtifactSheet";
import { ArtworkPreloader } from "./ArtworkPreloader";
import { BibleView } from "./BibleView";
import { ChurchView } from "./ChurchView";
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

function BibleJumpGrid({ onPick }: { onPick: (book: BibleBook) => void }) {
  const ot = BIBLE_BOOKS.filter((b) => b.testament === "OT");
  const nt = BIBLE_BOOKS.filter((b) => b.testament === "NT");
  const group = (label: string, books: BibleBook[]) => (
    <div>
      <p className="px-1 pb-1.5 pt-2 font-serif text-xs uppercase tracking-[0.16em] text-gold-dim">
        {label}
      </p>
      <div className="grid grid-cols-6 gap-1 sm:grid-cols-8">
        {books.map((book) => {
          const populated = book.populatedChapters.length > 0;
          const period = periodForBook(book.name);
          return (
            <button
              key={book.name}
              type="button"
              onClick={() => onPick(book)}
              className={cn(
                "flex h-11 items-center justify-center rounded-sm font-serif text-sm font-semibold",
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
    <div className="max-h-[min(28rem,55dvh)] overflow-y-auto p-3">
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
    <div className="max-h-[min(24rem,50dvh)] overflow-y-auto py-1">
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
          "flex h-10 max-w-[8.5rem] items-center gap-1 rounded-md border px-2 text-sm font-medium",
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
          className="absolute right-0 z-30 mt-1 min-w-[10.5rem] overflow-hidden rounded-md bg-elevated py-1 shadow-[var(--shadow-border)]"
        >
          {filters.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                role="option"
                aria-selected={f.id === value}
                className={cn(
                  "flex h-11 w-full items-center px-3 text-left text-base",
                  f.id === value
                    ? "bg-gold-soft text-gold"
                    : "text-fg hover:bg-gold-soft",
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
  const aboutOpen = useTimeline((s) => s.aboutOpen);
  const setAboutOpen = useTimeline((s) => s.setAboutOpen);
  const expandBook = useTimeline((s) => s.expandBook);

  const scrollRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const lastScrollRef = useRef(0);
  const chromeOffsetRef = useRef(0);
  const headerHRef = useRef(96);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [headerH, setHeaderH] = useState(96);

  const applyChrome = (offset: number) => {
    const h = headerHRef.current;
    const next = Math.max(0, Math.min(h, offset));
    chromeOffsetRef.current = next;
    const header = headerRef.current;
    const shell = shellRef.current;
    if (header) {
      header.style.transform = next ? `translate3d(0, ${-next}px, 0)` : "";
      const hidden = h > 0 && next >= h - 0.5;
      header.toggleAttribute("inert", hidden);
      header.style.pointerEvents = hidden ? "none" : "";
    }
    shell?.style.setProperty("--chrome-h", `${Math.max(0, h - next)}px`);
  };

  const hitCounts = useMemo(
    () => countHitsByView(query, filter),
    [filter, query],
  );
  const otherViews = (["bible", "church", "missal"] as const).filter(
    (id) => id !== view && hitCounts[id] > 0,
  );

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => {
      const h = el.offsetHeight;
      headerHRef.current = h;
      setHeaderH(h);
      applyChrome(Math.min(chromeOffsetRef.current, h));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    lastScrollRef.current = 0;
    applyChrome(0);
    setFilterOpen(false);
    setJumpOpen(false);
  }, [view]);

  useEffect(() => {
    if (isDesktop) closeArtifact();
  }, [isDesktop, closeArtifact]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const y = Math.max(0, el.scrollTop);
    const delta = y - lastScrollRef.current;
    lastScrollRef.current = y;
    const h = headerHRef.current;
    if (delta < -h) {
      applyChrome(0);
      return;
    }
    const prev = chromeOffsetRef.current;
    const next =
      y < 1 ? 0 : Math.min(Math.max(prev + delta, 0), Math.min(h, y));
    if (prev < 1 && next > 1) setFilterOpen(false);
    applyChrome(next);
  };

  const jumpToBook = (book: BibleBook) => {
    setJumpOpen(false);
    expandBook(book.name, true);
    requestAnimationFrame(() => {
      document
        .getElementById(`book-${book.name}`)
        ?.scrollIntoView({ block: "start" });
    });
  };

  const jumpToAnchor = (prefix: string, id: string) => {
    setJumpOpen(false);
    requestAnimationFrame(() => {
      document
        .getElementById(`${prefix}-${id}`)
        ?.scrollIntoView({ block: "start" });
    });
  };

  const jumpMinimap = (index: number) => {
    if (view === "bible") {
      const book = BIBLE_BOOKS[index];
      if (!book) return;
      expandBook(book.name, true);
      document.getElementById(`book-${book.name}`)?.scrollIntoView({ block: "start" });
    }
  };

  return (
    <div
      ref={shellRef}
      className="relative flex h-dvh flex-col overflow-hidden bg-bg text-fg"
      style={{ "--chrome-h": `${headerH}px` } as CSSProperties}
    >
      <ArtworkPreloader />
      <header
        ref={headerRef}
        id="timeline-chrome"
        className="absolute inset-x-0 top-0 z-20 border-b border-line bg-bg pt-[env(safe-area-inset-top)] will-change-transform"
      >
        <div className="px-3 pt-2">
          <div
            role="tablist"
            aria-label="Timeline view"
            className="grid grid-cols-3 rounded-md bg-elevated p-0.5"
            style={{
              boxShadow:
                "0 0 0 1px color-mix(in oklab, var(--color-gold) 30%, transparent)",
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

        <div className="flex items-center gap-2 px-3 pt-2 pb-2">
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

        {query.trim() && (
          <p className="px-3 pb-2 text-sm text-muted">
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
      </header>

      <main
        ref={scrollRef}
        id="timeline-scroll"
        onScroll={onScroll}
        className="relative min-h-0 flex-1 overflow-y-auto [overflow-anchor:none]"
      >
        <div aria-hidden className="shrink-0" style={{ height: headerH }} />
        <div className="mx-auto w-full max-w-xl">
          {view === "bible" ? (
            <BibleView />
          ) : view === "church" ? (
            <ChurchView />
          ) : (
            <MissalView />
          )}
        </div>
      </main>

      {view === "bible" && (
        <div
          className="pointer-events-none absolute right-1 bottom-24 hidden w-3 md:block"
          style={{ top: "calc(var(--chrome-h, 0px) + 8px)" }}
          aria-hidden
        >
          <div className="pointer-events-auto flex h-full flex-col">
            {BIBLE_BOOKS.filter((b) => b.populatedChapters.length > 0).map((b) => (
              <button
                key={b.name}
                type="button"
                onClick={() => jumpMinimap(BIBLE_BOOKS.indexOf(b))}
                className="flex-1 rounded-full bg-gold-dim/40 hover:bg-gold"
                aria-label={`Jump to ${b.name}`}
                title={b.name}
              />
            ))}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto relative mx-auto w-full max-w-xl">
          <AnimatePresence>
            {jumpOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "absolute bottom-14 overflow-hidden rounded-lg bg-elevated shadow-[var(--shadow-border)]",
                  view === "bible" ? "inset-x-0" : "left-1/2 w-72 -translate-x-1/2",
                )}
              >
                {view === "bible" ? (
                  <BibleJumpGrid onPick={jumpToBook} />
                ) : view === "church" ? (
                  <SectionJumpList
                    items={CHURCH_JUMPS}
                    onPick={(id) => jumpToAnchor("era", id)}
                  />
                ) : (
                  <SectionJumpList
                    items={MISSAL_JUMPS}
                    onPick={(id) => jumpToAnchor("missal", id)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setJumpOpen((v) => !v)}
              className="flex h-12 min-w-32 items-center justify-center rounded-full bg-elevated px-5 font-serif text-lg text-gold shadow-[var(--shadow-border)]"
            >
              Jump to…
            </button>
          </div>
        </div>
      </div>

      {!isDesktop && (
        <ArtifactSheet artifact={selected} onClose={closeArtifact} />
      )}
      <AboutPanel open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
}
