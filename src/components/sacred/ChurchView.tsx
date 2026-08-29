import { memo, useMemo } from "react";
import { useTimelineLayout } from "@/lib/timeline/card-width";
import { CHURCH_ENTRIES } from "@/lib/timeline/church";
import { sectionArtifactsForQuery } from "@/lib/timeline/search";
import { useTimeline } from "@/lib/timeline/store";
import {
  estimateDualSectionBodyHeight,
  estimateSectionBodyHeight,
} from "@/lib/timeline/viewport-gate";
import { ArtifactColumns } from "./ArtifactColumns";
import { ViewportGate } from "./ViewportGate";

export const ChurchView = memo(function ChurchView() {
  const query = useTimeline((s) => s.query);
  const filter = useTimeline((s) => s.filter);
  const openArtifact = useTimeline((s) => s.openArtifact);
  const { dualColumn, cardWidth, artworkWidth } = useTimelineLayout();

  const q = query.trim();
  const sections = useMemo(
    () =>
      CHURCH_ENTRIES.map((entry, index) => {
        const visible = sectionArtifactsForQuery(
          entry.artifacts,
          q,
          filter,
          `${entry.title} ${entry.era ?? ""} ${entry.year}`,
        );
        if (visible.length === 0) return null;
        const showEra = Boolean(entry.era && entry.era !== CHURCH_ENTRIES[index - 1]?.era);
        return { entry, visible, showEra };
      }).filter((s) => s !== null),
    [filter, q],
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
      {sections.map(({ entry, visible, showEra }) => (
        <section
          key={entry.id}
          id={`era-${entry.id}`}
          className="relative scroll-mt-[var(--chrome-h,0px)]"
        >
          {showEra && (
            <p className="sticky top-[var(--chrome-h,0px)] z-10 bg-bg px-2 py-2 pl-[var(--rail-pad)] font-serif text-sm tracking-[0.18em] text-gold-dim uppercase">
              {entry.era}
            </p>
          )}
          <div className="px-2 pb-5">
            <ViewportGate
              className="pt-0"
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
                heading={
                  <div className="mb-2.5 flex items-baseline gap-3 pl-[var(--rail-pad)]">
                    <span className="font-serif text-xl tabular-nums text-gold">{entry.year}</span>
                    <h3 className="font-serif text-lg font-semibold leading-snug text-fg">
                      {entry.title}
                    </h3>
                  </div>
                }
              />
            </ViewportGate>
          </div>
        </section>
      ))}
    </div>
  );
});
