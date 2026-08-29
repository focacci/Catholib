import { memo, useMemo } from "react";
import { useTimelineCardWidth } from "@/lib/timeline/card-width";
import { CHURCH_ENTRIES } from "@/lib/timeline/church";
import { sectionArtifactsForQuery } from "@/lib/timeline/search";
import { useTimeline } from "@/lib/timeline/store";
import { estimateSectionBodyHeight } from "@/lib/timeline/viewport-gate";
import { ArtifactCard } from "./ArtifactCard";
import { ViewportGate } from "./ViewportGate";

export const ChurchView = memo(function ChurchView() {
  const query = useTimeline((s) => s.query);
  const filter = useTimeline((s) => s.filter);
  const openArtifact = useTimeline((s) => s.openArtifact);
  const cardWidth = useTimelineCardWidth();

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
        No Church entries match these filters. Sample data from approved sources
        only.
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
            <div className="flex items-baseline gap-3 pl-[var(--rail-pad)]">
              <span className="font-serif text-xl tabular-nums text-gold">
                {entry.year}
              </span>
              <h3 className="font-serif text-lg font-semibold leading-snug text-fg">
                {entry.title}
              </h3>
            </div>
            <ViewportGate
              className="mt-2.5 flex flex-col gap-2 pl-[var(--rail-pad)]"
              estimateHeight={estimateSectionBodyHeight(visible, cardWidth)}
            >
              {visible.map((a) => (
                <ArtifactCard
                  key={a.id}
                  artifact={a}
                  context={entry.title}
                  onOpen={openArtifact}
                />
              ))}
            </ViewportGate>
          </div>
        </section>
      ))}
    </div>
  );
});
