import { memo, useMemo } from "react";
import { useTimelineCardWidth } from "@/lib/timeline/card-width";
import { missalSections } from "@/lib/timeline/missal";
import { sectionArtifactsForQuery } from "@/lib/timeline/search";
import { useTimeline } from "@/lib/timeline/store";
import { MISSAL_KIND_LABEL } from "@/lib/timeline/types";
import { estimateSectionBodyHeight } from "@/lib/timeline/viewport-gate";
import { ArtifactColumns } from "./ArtifactColumns";
import { TodayOffice } from "./TodayOffice";
import { ViewportGate } from "./ViewportGate";

export const MissalView = memo(function MissalView() {
  const query = useTimeline((s) => s.query);
  const filter = useTimeline((s) => s.filter);
  const openArtifact = useTimeline((s) => s.openArtifact);
  const cardWidth = useTimelineCardWidth();

  const q = query.trim();
  const sections = useMemo(() => {
    const catalog = missalSections();
    return catalog
      .map((section, index) => {
        const haystack = `${section.title} ${section.subtitle ?? ""} ${section.kind} ${MISSAL_KIND_LABEL[section.kind]}`;
        const visible = sectionArtifactsForQuery(section.artifacts, q, filter, haystack);
        if (visible.length === 0) return null;
        const showKind = section.kind !== catalog[index - 1]?.kind;
        return { section, visible, showKind };
      })
      .filter((s) => s !== null);
  }, [filter, q]);

  if (sections.length === 0) {
    return (
      <p className="px-4 py-16 text-center text-sm text-muted">
        No Missal entries match these filters. Catalog cards from Missale Meum, plus today's rosary
        from the Rosary Center.
      </p>
    );
  }

  return (
    <div className="relative pb-[40vh]">
      <div
        className="absolute top-2 bottom-8 left-[var(--rail-x)] w-px timeline-rail"
        aria-hidden
      />
      {sections.map(({ section, visible, showKind }) => (
        <section
          key={section.id}
          id={`missal-${section.id}`}
          className="relative scroll-mt-[var(--chrome-h,0px)]"
        >
          {showKind && (
            <p className="sticky top-[var(--chrome-h,0px)] z-10 bg-bg px-2 py-2 pl-[var(--rail-pad)] font-serif text-sm tracking-[0.18em] text-gold-dim uppercase">
              {MISSAL_KIND_LABEL[section.kind]}
            </p>
          )}
          <div className="px-2 pb-5">
            <ViewportGate
              className="pt-0"
              estimateHeight={estimateSectionBodyHeight(visible, cardWidth)}
            >
              <ArtifactColumns
                artifacts={visible}
                context={section.title}
                onOpen={openArtifact}
                heading={
                  section.id === "today" ? undefined : (
                    <div className="pl-[var(--rail-pad)]">
                      <h3 className="font-serif text-lg font-semibold leading-snug text-fg">
                        {section.title}
                      </h3>
                      {section.subtitle ? (
                        <p className="pt-1 text-sm text-muted">{section.subtitle}</p>
                      ) : null}
                    </div>
                  )
                }
                side={section.id === "today" ? <TodayOffice /> : undefined}
              />
            </ViewportGate>
          </div>
        </section>
      ))}
    </div>
  );
});
