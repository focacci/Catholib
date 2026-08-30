import { memo, useLayoutEffect, useMemo, useRef } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { BIBLE_BOOKS } from "@/lib/timeline/bible";
import { bibleVersionLinks } from "@/lib/timeline/bible-versions";
import {
  periodBadgeStyle,
  periodForBook,
  periodSwatchStyle,
  TIMELINE_PERIOD_LIST,
} from "@/lib/timeline/bible-periods";
import {
  applyBibleBookExpansion,
  matchingChaptersForBook,
  matchBibleBooks,
} from "@/lib/timeline/bible-view";
import { isBookHeaderStuck, pinSectionToScrollerTop } from "@/lib/timeline/book-collapse-scroll";
import { useTimelineLayout } from "@/lib/timeline/card-width";
import { useTimeline } from "@/lib/timeline/store";
import type { BibleBook, FilterId, TimelineArtifact } from "@/lib/timeline/types";
import {
  estimateChapterBlockHeight,
  estimateChapterIndexHeight,
  estimateDualChapterBlockHeight,
  estimateExpandedBookBodyHeight,
} from "@/lib/timeline/viewport-gate";
import { cn } from "@/lib/utils";
import { ArtifactColumns } from "./ArtifactColumns";
import { StickyGroupHeader, StickyItemHeader, StickyLeafHeader } from "./StickyHeaders";
import { OffscreenSkip, ViewportGate } from "./ViewportGate";

function ChapterIndex({ book, onJump }: { book: BibleBook; onJump: (chapter: number) => void }) {
  const populated = new Set(book.populatedChapters.map((c) => c.chapter));
  return (
    <div className="pb-3">
      <div className="grid grid-cols-8 gap-1 sm:grid-cols-10">
        {Array.from({ length: book.chapters }, (_, i) => {
          const n = i + 1;
          const isPop = populated.has(n);
          return (
            <button
              key={n}
              type="button"
              onClick={() => onJump(n)}
              className={cn(
                "flex h-11 items-center justify-center rounded-sm font-serif text-sm tabular-nums",
                isPop
                  ? "bg-gold-soft text-gold shadow-[var(--shadow-border)]"
                  : "text-subtle hover:bg-elevated hover:text-muted",
              )}
              aria-label={
                isPop ? `${book.name} chapter ${n}, sample populated` : `${book.name} chapter ${n}`
              }
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const BookSection = memo(function BookSection({
  book,
  query,
  filter,
  expanded,
  hitCount,
  nameMatch,
  cardWidth,
  artworkWidth,
  dualColumn,
  onToggle,
  onOpen,
}: {
  book: BibleBook;
  query: string;
  filter: FilterId;
  expanded: boolean;
  hitCount: number;
  nameMatch: boolean;
  cardWidth: number;
  artworkWidth: number;
  dualColumn: boolean;
  onToggle: (name: string) => void;
  onOpen: (a: TimelineArtifact) => void;
}) {
  const q = query.trim();
  const matchingChapters = useMemo(
    () => (expanded ? matchingChaptersForBook(book, query, filter) : []),
    [book, expanded, filter, query],
  );
  const bodyEstimate = useMemo(
    () =>
      estimateExpandedBookBodyHeight({
        indexChapters: expanded && filter === "all" && !query.trim() ? book.chapters : 0,
        chapters: matchingChapters,
        dualColumn,
        cardWidthPx: cardWidth,
        artworkWidthPx: artworkWidth,
      }),
    [artworkWidth, book.chapters, cardWidth, dualColumn, expanded, filter, matchingChapters, query],
  );
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLButtonElement>(null);
  const pinOnCollapseRef = useRef(false);

  useLayoutEffect(() => {
    if (expanded || !pinOnCollapseRef.current || !sectionRef.current) return;
    pinOnCollapseRef.current = false;
    pinSectionToScrollerTop(sectionRef.current);
  }, [expanded]);

  const jumpChapter = (n: number) => {
    if (!expanded) onToggle(book.name);
    const el = document.getElementById(`ch-${book.abbreviation}-${n}`);
    if (el) {
      el.scrollIntoView({ block: "start" });
      return;
    }
    if (!book.populatedChapters.some((c) => c.chapter === n)) {
      const note = document.getElementById(`empty-${book.name}`);
      note?.scrollIntoView({ block: "nearest" });
    }
  };

  const period = periodForBook(book.name);

  const handleToggle = () => {
    if (expanded && sectionRef.current && headerRef.current) {
      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const headerTop = headerRef.current.getBoundingClientRect().top;
      pinOnCollapseRef.current = isBookHeaderStuck(sectionTop, headerTop);
    }
    onToggle(book.name);
  };

  return (
    <section
      ref={sectionRef}
      id={`book-${book.name}`}
      className="scroll-mt-[calc(var(--chrome-h,0px)+var(--sticky-l1))]"
    >
      <StickyItemHeader className="h-[var(--sticky-l2)] border-b border-line">
        <button
          ref={headerRef}
          type="button"
          onClick={handleToggle}
          className="flex h-full w-full items-center gap-2.5 px-2"
          aria-expanded={expanded}
          aria-label={`${book.abbreviation} ${book.name}, ${period.label}`}
        >
          <span
            className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-sm px-1 font-serif text-xs font-semibold"
            style={periodBadgeStyle(book.name)}
            title={period.label}
          >
            {book.abbreviation}
          </span>
          <span className="min-w-0 flex-1 truncate text-left font-serif text-lg font-semibold leading-tight text-fg">
            {book.name}
          </span>
          {hitCount > 0 && (
            <span className="shrink-0 font-sans text-sm tabular-nums text-gold-dim">
              {hitCount}
            </span>
          )}
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-muted transition-transform duration-250 ease-[var(--ease-out)]",
              expanded && "rotate-180",
            )}
          />
        </button>
      </StickyItemHeader>

      {expanded && (
        <OffscreenSkip estimateHeight={bodyEstimate}>
          <div className="relative border-b border-line" style={{ overflowAnchor: "none" }}>
            <div
              className="absolute top-0 bottom-0 left-[var(--rail-x)] w-px timeline-rail"
              aria-hidden
            />

            {filter === "all" && !q && (
              <div id={`empty-${book.name}`} className="relative px-2 pt-3 pb-1">
                <div className="pl-[var(--rail-pad)]">
                  <ViewportGate estimateHeight={estimateChapterIndexHeight(book.chapters)}>
                    <ChapterIndex book={book} onJump={jumpChapter} />
                  </ViewportGate>
                </div>
              </div>
            )}

            {matchingChapters.map((ch) => (
              <section
                key={ch.chapter}
                id={`ch-${book.abbreviation}-${ch.chapter}`}
                className="relative scroll-mt-[calc(var(--chrome-h,0px)+var(--sticky-l1)+var(--sticky-l2))]"
              >
                <StickyLeafHeader className="px-2">
                  <div className="flex flex-col pl-[var(--rail-pad)] dual:flex-row dual:items-center dual:justify-between dual:gap-x-4">
                    <p className="flex h-10 min-w-0 items-center font-serif text-base font-semibold text-fg dual:h-11 dual:flex-1">
                      <span className="min-w-0 truncate">
                        Chapter {ch.chapter}
                        {ch.heading ? ` · ${ch.heading}` : ""}
                      </span>
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 dual:shrink-0 dual:justify-end">
                      {bibleVersionLinks(book.name, ch.chapter).map((version) => (
                        <a
                          key={version.id}
                          href={version.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-1 text-base text-gold"
                          aria-label={`Read ${book.name} ${ch.chapter} in ${version.label}`}
                        >
                          {version.label}
                          <ExternalLink className="size-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </StickyLeafHeader>
                <div className="px-2 pt-[var(--sticky-fade)] pb-3">
                  <ViewportGate
                    estimateHeight={
                      dualColumn
                        ? estimateDualChapterBlockHeight(ch, cardWidth, artworkWidth)
                        : estimateChapterBlockHeight(ch, cardWidth)
                    }
                  >
                    <ArtifactColumns
                      artifacts={ch.artifacts}
                      context={`${book.name} ${ch.chapter}`}
                      onOpen={onOpen}
                    />
                  </ViewportGate>
                </div>
              </section>
            ))}

            {q && matchingChapters.length === 0 && nameMatch && (
              <p className="px-2 py-4 pl-[calc(var(--rail-pad)+0.5rem)] text-base text-muted">
                No artifacts in {book.name} match this search. Sample data from approved sources only
                for selected chapters.
              </p>
            )}
          </div>
        </OffscreenSkip>
      )}
    </section>
  );
});

export const BibleView = memo(function BibleView() {
  const query = useTimeline((s) => s.query);
  const filter = useTimeline((s) => s.filter);
  const expandedBooks = useTimeline((s) => s.expandedBooks);
  const toggleBook = useTimeline((s) => s.toggleBook);
  const openArtifact = useTimeline((s) => s.openArtifact);
  const { dualColumn, cardWidth, artworkWidth } = useTimelineLayout();

  const matches = useMemo(() => matchBibleBooks(BIBLE_BOOKS, query, filter), [filter, query]);
  const rows = useMemo(
    () => applyBibleBookExpansion(matches, query, expandedBooks),
    [expandedBooks, matches, query],
  );
  const ot = useMemo(() => rows.filter((row) => row.book.testament === "OT"), [rows]);
  const nt = useMemo(() => rows.filter((row) => row.book.testament === "NT"), [rows]);

  const renderGroup = (label: string, group: typeof rows) => {
    if (group.length === 0) return null;
    return (
      <div>
        <StickyGroupHeader>{label}</StickyGroupHeader>
        {group.map((row) => (
          <BookSection
            key={row.book.name}
            book={row.book}
            query={query}
            filter={filter}
            expanded={row.expanded}
            hitCount={row.hitCount}
            nameMatch={row.nameMatch}
            cardWidth={cardWidth}
            artworkWidth={artworkWidth}
            dualColumn={dualColumn}
            onToggle={toggleBook}
            onOpen={openArtifact}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="pb-[40vh]">
      {renderGroup("Old Testament", ot)}
      {renderGroup("New Testament", nt)}
      <TimelineColorKey />
    </div>
  );
});

function TimelineColorKey() {
  return (
    <section className="mt-6 border-t border-line px-2 pt-6" aria-labelledby="timeline-color-key">
      <h2
        id="timeline-color-key"
        className="font-serif text-sm tracking-[0.2em] text-gold-dim uppercase"
      >
        Timeline colors
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Abbreviations follow The Great Adventure Bible Timeline.
      </p>
      <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {TIMELINE_PERIOD_LIST.map((period) => (
          <li key={period.id} className="flex items-center gap-2.5">
            <span
              className="size-3.5 shrink-0 rounded-sm"
              style={periodSwatchStyle(period)}
              aria-hidden
            />
            <span className="font-serif text-base text-fg">{period.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
