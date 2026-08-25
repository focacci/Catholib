import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Church, Info, Search, X } from "lucide-react";
import { BIBLE_BOOKS } from "@/lib/timeline/bible";
import { CHURCH_ENTRIES } from "@/lib/timeline/church";
import { collectHits } from "@/lib/timeline/search";
import { useTimeline } from "@/lib/timeline/store";
import { FILTERS, type BibleBook } from "@/lib/timeline/types";
import { cn } from "@/lib/utils";
import { AboutPanel } from "./AboutPanel";
import { ArtifactSheet } from "./ArtifactSheet";
import { BibleView } from "./BibleView";
import { ChurchView } from "./ChurchView";

function CrossMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 3v18M8 8h8" strokeLinecap="round" />
    </svg>
  );
}

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

function BibleJumpGrid({ onPick }: { onPick: (book: BibleBook) => void }) {
  const ot = BIBLE_BOOKS.filter((b) => b.testament === "OT");
  const nt = BIBLE_BOOKS.filter((b) => b.testament === "NT");
  const group = (label: string, books: BibleBook[]) => (
    <div>
      <p className="px-1 pb-1.5 pt-2 font-serif text-[10px] uppercase tracking-[0.16em] text-gold-dim">
        {label}
      </p>
      <div className="grid grid-cols-6 gap-1 sm:grid-cols-8">
        {books.map((book) => {
          const populated = book.populatedChapters.length > 0;
          return (
            <button
              key={book.name}
              type="button"
              onClick={() => onPick(book)}
              className={cn(
                "flex h-11 items-center justify-center rounded-sm font-serif text-xs",
                populated
                  ? "bg-gold-soft text-gold shadow-[var(--shadow-border)]"
                  : "text-muted hover:bg-gold-soft hover:text-fg",
              )}
              aria-label={book.name}
              title={book.name}
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

function ChurchJumpList({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="max-h-[min(24rem,50dvh)] overflow-y-auto py-1">
      {CHURCH_JUMPS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onPick(opt.id)}
          className="flex h-12 w-full items-center px-4 text-left text-sm text-fg hover:bg-gold-soft"
        >
          {opt.label}
        </button>
      ))}
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
  const aboutOpen = useTimeline((s) => s.aboutOpen);
  const setAboutOpen = useTimeline((s) => s.setAboutOpen);
  const expandBook = useTimeline((s) => s.expandBook);

  const scrollRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [jumpOpen, setJumpOpen] = useState(false);

  const hits = useMemo(() => collectHits(query, filter), [query, filter]);
  const bibleHits = hits.filter((h) => h.view === "bible").length;
  const churchHits = hits.filter((h) => h.view === "church").length;
  const otherCount = view === "bible" ? churchHits : bibleHits;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [view]);

  useEffect(() => {
    setJumpOpen(false);
  }, [view]);

  const jumpToBook = (book: BibleBook) => {
    setJumpOpen(false);
    expandBook(book.name, true);
    requestAnimationFrame(() => {
      document
        .getElementById(`book-${book.name}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const jumpToEra = (id: string) => {
    setJumpOpen(false);
    requestAnimationFrame(() => {
      document
        .getElementById(`era-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const jumpMinimap = (index: number) => {
    if (view === "bible") {
      const book = BIBLE_BOOKS[index];
      if (!book) return;
      expandBook(book.name, true);
      document.getElementById(`book-${book.name}`)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <header className="relative z-20 shrink-0 border-b border-line bg-bg pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-elevated text-gold shadow-[var(--shadow-border)]">
            <CrossMark className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-xl font-semibold leading-none tracking-tight text-fg">
              Sacred Timeline
            </h1>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-gold-dim">
              Scripture and Magisterium
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            className="flex size-11 items-center justify-center rounded-md text-muted hover:text-fg"
            aria-label="About and sources"
          >
            <Info className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-4 pb-3">
          <div
            role="tablist"
            aria-label="Timeline view"
            className="grid grid-cols-2 rounded-md bg-elevated p-1"
            style={{ boxShadow: "0 0 0 1px color-mix(in oklab, var(--color-gold) 30%, transparent)" }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === "bible"}
              onClick={() => setView("bible")}
              className={cn(
                "flex min-h-11 items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-150",
                view === "bible" ? "bg-gold text-bg" : "text-muted",
              )}
            >
              <BookOpen className="size-4" strokeWidth={1.75} />
              Bible
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "church"}
              onClick={() => setView("church")}
              className={cn(
                "flex min-h-11 items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-150",
                view === "church" ? "bg-gold text-bg" : "text-muted",
              )}
            >
              <Church className="size-4" strokeWidth={1.75} />
              Church
            </button>
          </div>
        </div>

        <div className="px-4 pb-3">
          <label className="relative block">
            <span className="sr-only">Search Scripture and Magisterium</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, quotes, saints…"
              className="h-11 w-full rounded-md border border-line-strong bg-elevated pr-11 pl-10 text-sm text-fg outline-none placeholder:text-subtle focus:border-gold"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center text-muted"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </label>
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-3">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "h-11 shrink-0 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150",
                filter === f.id
                  ? "bg-gold text-bg"
                  : "border border-line-strong bg-elevated text-muted",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {query.trim() && (
          <p className="px-4 pb-3 text-xs text-muted">
            {view === "bible" ? bibleHits : churchHits} in this view
            {otherCount > 0 && (
              <>
                {" · "}
                <button
                  type="button"
                  className="text-gold underline-offset-2 hover:underline"
                  onClick={() => setView(view === "bible" ? "church" : "bible")}
                >
                  {otherCount} in {view === "bible" ? "Church" : "Bible"}
                </button>
              </>
            )}
          </p>
        )}
      </header>

      <main
        ref={scrollRef}
        id="timeline-scroll"
        className="relative min-h-0 flex-1 overflow-y-auto"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-xl"
          >
            {view === "bible" ? <BibleView /> : <ChurchView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {view === "bible" && (
        <div
          className="pointer-events-none absolute top-[220px] right-1 bottom-24 hidden w-3 md:block"
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
                  view === "bible"
                    ? "inset-x-0"
                    : "left-1/2 w-64 -translate-x-1/2",
                )}
              >
                {view === "bible" ? (
                  <BibleJumpGrid onPick={jumpToBook} />
                ) : (
                  <ChurchJumpList onPick={jumpToEra} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setJumpOpen((v) => !v)}
              className="flex h-12 min-w-32 items-center justify-center rounded-full bg-elevated px-5 font-serif text-base text-gold shadow-[var(--shadow-border)]"
            >
              Jump to…
            </button>
          </div>
        </div>
      </div>

      <ArtifactSheet artifact={selected} onClose={closeArtifact} />
      <AboutPanel open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
}
