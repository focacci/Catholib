import { memo, useLayoutEffect, useMemo, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { isBookHeaderStuck, pinSectionToScrollerTop } from "@/lib/timeline/book-collapse-scroll";
import { useTimelineLayout } from "@/lib/timeline/card-width";
import { isChurchDefaultEntry } from "@/lib/graph";
import { CHURCH_ENTRIES } from "@/lib/timeline/church";
import { isEraExpanded, yearRangeForEntries } from "@/lib/timeline/church-view";
import { sectionArtifactsForQuery } from "@/lib/timeline/search";
import { groupConsecutiveBy } from "@/lib/timeline/sticky-stack";
import { useTimeline } from "@/lib/timeline/store";
import type { ChurchEntry, TimelineArtifact } from "@/lib/timeline/types";
import {
  estimateDualSectionBodyHeight,
  estimateSectionBodyHeight,
} from "@/lib/timeline/viewport-gate";
import { cn } from "@/lib/utils";
import { ArtifactColumns } from "./ArtifactColumns";
import { StickyGroupHeader, StickyItemHeader } from "./StickyHeaders";
import { ViewportGate } from "./ViewportGate";

type ChurchSection = { entry: ChurchEntry; visible: TimelineArtifact[] };

const EraGroup = memo(function EraGroup({
  era,
  eraKey,
  items,
  expanded,
  dualColumn,
  cardWidth,
  artworkWidth,
  onToggle,
  onOpen,
}: {
  era: string;
  eraKey: string;
  items: ChurchSection[];
  expanded: boolean;
  dualColumn: boolean;
  cardWidth: number;
  artworkWidth: number;
  onToggle: (name: string) => void;
  onOpen: (artifact: TimelineArtifact) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLButtonElement>(null);
  const pinOnCollapseRef = useRef(false);
  const range = yearRangeForEntries(items.map((item) => item.entry));
  const firstId = items[0]?.entry.id;

  useLayoutEffect(() => {
    if (expanded || !pinOnCollapseRef.current || !sectionRef.current) return;
    pinOnCollapseRef.current = false;
    pinSectionToScrollerTop(sectionRef.current, { nested: false });
  }, [expanded]);

  const handleToggle = () => {
    if (expanded && sectionRef.current && headerRef.current) {
      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const headerTop = headerRef.current.getBoundingClientRect().top;
      pinOnCollapseRef.current = isBookHeaderStuck(sectionTop, headerTop);
    }
    onToggle(eraKey);
  };

  return (
    <section
      ref={sectionRef}
      id={firstId ? `era-${firstId}` : undefined}
      className="scroll-mt-[var(--chrome-h,0px)]"
    >
      <StickyGroupHeader className="px-0 tracking-normal normal-case">
        <button
          ref={headerRef}
          type="button"
          onClick={handleToggle}
          className="flex h-full w-full min-w-0 items-center gap-2 px-2 pl-[var(--rail-pad)]"
          aria-expanded={expanded}
          aria-label={range ? `${era}, ${range}` : era}
        >
          <span className="min-w-0 truncate font-serif text-sm tracking-[0.08em] text-gold-dim uppercase sm:tracking-[0.14em]">
            {era}
          </span>
          {range ? (
            <span className="shrink-0 font-serif text-sm tabular-nums tracking-normal text-gold-dim">
              {range}
            </span>
          ) : null}
          <ChevronDown
            className={cn(
              "ml-auto size-4 shrink-0 text-muted transition-transform duration-250 ease-[var(--ease-out)]",
              expanded && "rotate-180",
            )}
          />
        </button>
      </StickyGroupHeader>
      {expanded
        ? items.map(({ entry, visible }) => (
            <ChurchEntrySection
              key={entry.id}
              entry={entry}
              visible={visible}
              skipAnchor={entry.id === firstId}
              dualColumn={dualColumn}
              cardWidth={cardWidth}
              artworkWidth={artworkWidth}
              onOpen={onOpen}
            />
          ))
        : null}
    </section>
  );
});

const ChurchEntrySection = memo(function ChurchEntrySection({
  entry,
  visible,
  skipAnchor,
  dualColumn,
  cardWidth,
  artworkWidth,
  onOpen,
}: {
  entry: ChurchEntry;
  visible: TimelineArtifact[];
  skipAnchor: boolean;
  dualColumn: boolean;
  cardWidth: number;
  artworkWidth: number;
  onOpen: (artifact: TimelineArtifact) => void;
}) {
  return (
    <section
      id={skipAnchor ? undefined : `era-${entry.id}`}
      className="relative scroll-mt-[calc(var(--chrome-h,0px)+var(--sticky-l1))]"
    >
      <StickyItemHeader fade nested className="px-2 py-2">
        <div className="flex min-h-10 items-baseline gap-3 pl-[var(--rail-pad)]">
          <span className="font-serif text-xl tabular-nums text-gold">{entry.year}</span>
          <h3 className="min-w-0 truncate font-serif text-lg font-semibold leading-snug text-fg">
            {entry.title}
          </h3>
        </div>
      </StickyItemHeader>
      <div className="px-2 pt-[var(--sticky-fade)] pb-5">
        <ViewportGate
          estimateHeight={
            dualColumn
              ? estimateDualSectionBodyHeight(visible, cardWidth, artworkWidth)
              : estimateSectionBodyHeight(visible, cardWidth)
          }
        >
          <ArtifactColumns artifacts={visible} context={entry.title} onOpen={onOpen} />
        </ViewportGate>
      </div>
    </section>
  );
});

export const ChurchView = memo(function ChurchView() {
  const query = useTimeline((s) => s.query);
  const filter = useTimeline((s) => s.filter);
  const openArtifact = useTimeline((s) => s.openArtifact);
  const expandedEras = useTimeline((s) => s.expandedEras);
  const toggleEra = useTimeline((s) => s.toggleEra);
  const { dualColumn, cardWidth, artworkWidth } = useTimelineLayout();

  const q = query.trim();
  const sections = useMemo(
    () =>
      CHURCH_ENTRIES.map((entry) => {
        if (!isChurchDefaultEntry(entry.id, q)) return null;
        const visible = sectionArtifactsForQuery(
          entry.artifacts,
          q,
          filter,
          `${entry.title} ${entry.era ?? ""} ${entry.year}`,
        );
        if (visible.length === 0) return null;
        return { entry, visible };
      }).filter((s) => s !== null),
    [filter, q],
  );

  const groups = useMemo(
    () => groupConsecutiveBy(sections, (section) => section.entry.era ?? section.entry.id),
    [sections],
  );

  if (sections.length === 0) {
    return (
      <p className="px-4 py-16 text-center text-sm text-muted">
        No Church entries match these filters. Sample data from approved sources only.
      </p>
    );
  }

  return (
    <div className="relative pb-[40vh]">
      <div
        className="absolute top-2 bottom-8 left-[var(--rail-x)] w-px timeline-rail"
        aria-hidden
      />
      {groups.map((group) => {
        const era = group.items[0]?.entry.era;
        const firstId = group.items[0]?.entry.id ?? group.key;
        if (!era) {
          return (
            <div key={group.key}>
              {group.items.map(({ entry, visible }) => (
                <ChurchEntrySection
                  key={entry.id}
                  entry={entry}
                  visible={visible}
                  skipAnchor={false}
                  dualColumn={dualColumn}
                  cardWidth={cardWidth}
                  artworkWidth={artworkWidth}
                  onOpen={openArtifact}
                />
              ))}
            </div>
          );
        }
        return (
          <EraGroup
            key={`${group.key}-${firstId}`}
            era={era}
            eraKey={group.key}
            items={group.items}
            expanded={isEraExpanded(expandedEras, group.key, q.length > 0)}
            dualColumn={dualColumn}
            cardWidth={cardWidth}
            artworkWidth={artworkWidth}
            onToggle={toggleEra}
            onOpen={openArtifact}
          />
        );
      })}
    </div>
  );
});
