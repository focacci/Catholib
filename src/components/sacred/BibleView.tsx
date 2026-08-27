import { useMemo } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { BIBLE_BOOKS } from "@/lib/timeline/bible";
import { bibleVersionLinks } from "@/lib/timeline/bible-versions";
import {
  periodBadgeStyle,
  periodForBook,
  periodSwatchStyle,
  TIMELINE_PERIOD_LIST,
} from "@/lib/timeline/bible-periods";
import { bookMatchesSearch, filterArtifacts } from "@/lib/timeline/search";
import { useTimeline } from "@/lib/timeline/store";
import type { BibleBook, FilterId, TimelineArtifact } from "@/lib/timeline/types";
import { cn } from "@/lib/utils";
import { ArtifactCard } from "./ArtifactCard";

function ChapterIndex({
  book,
  onJump,
}: {
  book: BibleBook;
  onJump: (chapter: number) => void;
}) {
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
                isPop
                  ? `${book.name} chapter ${n}, sample populated`
                  : `${book.name} chapter ${n}`
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

function BookSection({
  book,
  query,
  filter,
  expanded,
  onToggle,
  onOpen,
}: {
  book: BibleBook;
  query: string;
  filter: FilterId;
  expanded: boolean;
  onToggle: () => void;
  onOpen: (a: TimelineArtifact) => void;
}) {
  const populated = book.populatedChapters;
  const matchingChapters = populated
    .map((ch) => ({
      ...ch,
      artifacts: filterArtifacts(ch.artifacts, query, filter),
    }))
    .filter((ch) => ch.artifacts.length > 0);
  const q = query.trim();
  const nameMatch = bookMatchesSearch(book.name, book.abbreviation, q);
  const showBecauseQuery = q.length > 0 && (nameMatch || matchingChapters.length > 0);
  const hideEmpty = q.length > 0 && !showBecauseQuery && filter !== "all";
  const hideUnmatched = q.length > 0 && !nameMatch && matchingChapters.length === 0;

  if (hideUnmatched || hideEmpty) return null;

  const jumpChapter = (n: number) => {
    if (!expanded) onToggle();
    const el = document.getElementById(`ch-${book.abbreviation}-${n}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!populated.some((c) => c.chapter === n)) {
      const note = document.getElementById(`empty-${book.name}`);
      note?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const period = periodForBook(book.name);

  return (
    <section id={`book-${book.name}`} className="scroll-mt-[var(--chrome-h,0px)]">
      <button
        type="button"
        onClick={onToggle}
        className="sticky top-[var(--chrome-h,0px)] z-10 flex min-h-12 w-full items-center gap-2.5 border-b border-line bg-bg px-2"
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
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-muted transition-transform duration-250 ease-[var(--ease-out)]",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded && (
        <div className="relative border-b border-line">
          <div
            className="absolute top-0 bottom-0 left-[var(--rail-x)] w-px timeline-rail"
            aria-hidden
          />

          {filter === "all" && !q && (
            <div id={`empty-${book.name}`} className="relative px-2 pt-3 pb-1">
              <div className="pl-[var(--rail-pad)]">
                <ChapterIndex book={book} onJump={jumpChapter} />
              </div>
            </div>
          )}

          {matchingChapters.map((ch) => (
            <div
              key={ch.chapter}
              id={`ch-${book.abbreviation}-${ch.chapter}`}
              className="relative scroll-mt-[calc(var(--chrome-h,0px)+3.5rem)] px-2 pt-4 pb-3"
            >
              <div className="mb-2.5 pl-[var(--rail-pad)]">
                <p className="font-serif text-base font-semibold text-fg">
                  Chapter {ch.chapter}
                  {ch.heading ? ` · ${ch.heading}` : ""}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-4">
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
              <div className="flex flex-col gap-2 pl-[var(--rail-pad)]">
                {ch.artifacts.map((a) => (
                  <ArtifactCard
                    key={a.id}
                    artifact={a}
                    context={`${book.name} ${ch.chapter}`}
                    onOpen={onOpen}
                  />
                ))}
              </div>
            </div>
          ))}

          {q && matchingChapters.length === 0 && nameMatch && (
            <p className="px-2 py-4 pl-[calc(var(--rail-pad)+0.5rem)] text-base text-muted">
              No artifacts in {book.name} match this search. Sample data from
              approved sources only for selected chapters.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export function BibleView() {
  const query = useTimeline((s) => s.query);
  const filter = useTimeline((s) => s.filter);
  const expandedBooks = useTimeline((s) => s.expandedBooks);
  const toggleBook = useTimeline((s) => s.toggleBook);
  const openArtifact = useTimeline((s) => s.openArtifact);

  const ot = useMemo(() => BIBLE_BOOKS.filter((b) => b.testament === "OT"), []);
  const nt = useMemo(() => BIBLE_BOOKS.filter((b) => b.testament === "NT"), []);

  const renderGroup = (label: string, books: BibleBook[]) => (
    <div>
      <p className="px-2 py-2.5 font-serif text-sm tracking-[0.2em] text-gold-dim uppercase">
        {label}
      </p>
      {books.map((book) => {
        const qLen = query.trim().length > 0;
        const nameMatch = bookMatchesSearch(book.name, book.abbreviation, query);
        const matchingCount = book.populatedChapters.reduce(
          (n, ch) => n + filterArtifacts(ch.artifacts, query, filter).length,
          0,
        );
        if (filter !== "all" && !qLen && matchingCount === 0) return null;
        if (qLen && !nameMatch && matchingCount === 0) return null;
        const expanded =
          Boolean(expandedBooks[book.name]) ||
          (qLen && (nameMatch || matchingCount > 0)) ||
          (filter !== "all" && matchingCount > 0 && !qLen);
        return (
          <BookSection
            key={book.name}
            book={book}
            query={query}
            filter={filter}
            expanded={expanded}
            onToggle={() => {
              toggleBook(book.name);
            }}
            onOpen={openArtifact}
          />
        );
      })}
    </div>
  );

  return (
    <div className="pb-[40vh]">
      {renderGroup("Old Testament", ot)}
      {renderGroup("New Testament", nt)}
      <TimelineColorKey />
    </div>
  );
}

function TimelineColorKey() {
  return (
    <section
      className="mt-6 border-t border-line px-2 pt-6"
      aria-labelledby="timeline-color-key"
    >
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
