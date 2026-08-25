import { useMemo } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { BIBLE_BOOKS, usccbChapterUrl } from "@/lib/timeline/bible";
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
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-subtle">
        All {book.chapters} chapters
      </p>
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
      <p className="mt-3 text-xs leading-relaxed text-subtle">
        Sample data from approved sources only for selected chapters.
      </p>
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
  const hasSamples = populated.length > 0;
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

  return (
    <section id={`book-${book.name}`} className="scroll-mt-4">
      <button
        type="button"
        onClick={onToggle}
        className="sticky top-0 z-10 flex min-h-12 w-full items-center gap-3 border-b border-line bg-bg px-4"
        aria-expanded={expanded}
      >
        <span className="flex size-8 items-center justify-center rounded-sm bg-elevated font-serif text-xs text-gold">
          {book.abbreviation}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block font-serif text-lg font-semibold leading-tight text-fg">
            {book.name}
          </span>
          <span className="block text-[11px] uppercase tracking-[0.14em] text-subtle">
            {book.chapters} chapters
            {hasSamples ? " · sample chapters populated" : ""}
          </span>
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
          <div className="absolute top-0 bottom-0 left-[27px] w-px timeline-rail" aria-hidden />

          {filter === "all" && !q && (
            <div
              id={`empty-${book.name}`}
              className="relative px-4 pt-4 pb-1"
            >
              <div className="pl-8">
                <ChapterIndex book={book} onJump={jumpChapter} />
              </div>
            </div>
          )}

          {matchingChapters.map((ch) => (
            <div
              key={ch.chapter}
              id={`ch-${book.abbreviation}-${ch.chapter}`}
              className="relative scroll-mt-20 px-4 pt-5 pb-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3 pl-8">
                <div>
                  <p className="font-serif text-base font-semibold text-fg">
                    Chapter {ch.chapter}
                    {ch.heading ? ` · ${ch.heading}` : ""}
                  </p>
                  <a
                    href={usccbChapterUrl(book.name, ch.chapter)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex min-h-11 items-center gap-1 text-sm text-gold"
                  >
                    Read at USCCB
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-2 pl-8">
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
            <p className="px-4 py-4 pl-12 text-sm text-muted">
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
      <p className="px-4 py-3 font-serif text-sm tracking-[0.2em] text-gold-dim uppercase">
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
    </div>
  );
}
