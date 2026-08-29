import { memo, useMemo } from "react";
import { useTimelineLayout } from "@/lib/timeline/card-width";
import { CHURCH_ENTRIES } from "@/lib/timeline/church";
import { sectionArtifactsForQuery } from "@/lib/timeline/search";
import { groupConsecutiveBy } from "@/lib/timeline/sticky-stack";
import { useTimeline } from "@/lib/timeline/store";
import {
  estimateDualSectionBodyHeight,
  estimateSectionBodyHeight,
} from "@/lib/timeline/viewport-gate";
import { ArtifactColumns } from "./ArtifactColumns";
import { StickyGroupHeader, StickyItemHeader } from "./StickyHeaders";
import { ViewportGate } from "./ViewportGate";

export const ChurchView = memo(function ChurchView() {
  const query = useTimeline((s) => s.query);
  const filter = useTimeline((s) => s.filter);
  const openArtifact = useTimeline((s) => s.openArtifact);
  const { dualColumn, cardWidth, artworkWidth } = useTimelineLayout();

  const q = query.trim();
  const sections = useMemo(
    () =>
      CHURCH_ENTRIES.map((entry) => {
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
        return (
          <div key={group.key}>
            {era ? (
              <StickyGroupHeader className="pl-[var(--rail-pad)]">{era}</StickyGroupHeader>
            ) : null}
            {group.items.map(({ entry, visible }) => (
              <section
                key={entry.id}
                id={`era-${entry.id}`}
                className="relative scroll-mt-[calc(var(--chrome-h,0px)+var(--sticky-l1))]"
              >
                <StickyItemHeader fade nested={Boolean(era)} className="px-2 py-2">
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
                    <ArtifactColumns
                      artifacts={visible}
                      context={entry.title}
                      onOpen={openArtifact}
                    />
                  </ViewportGate>
                </div>
              </section>
            ))}
          </div>
        );
      })}
    </div>
  );
});
