import { memo, useMemo } from "react";
import { useTimelineCardWidth } from "@/lib/timeline/card-width";
import { liturgicalDay } from "@/lib/timeline/liturgical-day";
import { missalSections } from "@/lib/timeline/missal";
import { sectionArtifactsForQuery } from "@/lib/timeline/search";
import { groupConsecutiveBy } from "@/lib/timeline/sticky-stack";
import { useTimeline } from "@/lib/timeline/store";
import { MISSAL_KIND_LABEL } from "@/lib/timeline/types";
import { estimateSectionBodyHeight } from "@/lib/timeline/viewport-gate";
import { ArtifactColumns } from "./ArtifactColumns";
import { StickyGroupHeader, StickyItemHeader } from "./StickyHeaders";
import { TodayOffice } from "./TodayOffice";
import { ViewportGate } from "./ViewportGate";

export const MissalView = memo(function MissalView() {
  const query = useTimeline((s) => s.query);
  const filter = useTimeline((s) => s.filter);
  const openArtifact = useTimeline((s) => s.openArtifact);
  const cardWidth = useTimelineCardWidth();
  const office = liturgicalDay();

  const q = query.trim();
  const sections = useMemo(() => {
    const catalog = missalSections();
    return catalog
      .map((section) => {
        const haystack = `${section.title} ${section.subtitle ?? ""} ${section.kind} ${MISSAL_KIND_LABEL[section.kind]}`;
        const visible = sectionArtifactsForQuery(section.artifacts, q, filter, haystack);
        if (visible.length === 0) return null;
        return { section, visible };
      })
      .filter((s) => s !== null);
  }, [filter, q]);

  const groups = useMemo(
    () => groupConsecutiveBy(sections, (item) => item.section.kind),
    [sections],
  );

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
      {groups.map((group) => (
        <div key={group.key}>
          <StickyGroupHeader className="pl-[var(--rail-pad)]">
            {MISSAL_KIND_LABEL[group.key]}
          </StickyGroupHeader>
          {group.items.map(({ section, visible }) => {
            const isToday = section.id === "today";
            return (
              <section
                key={section.id}
                id={`missal-${section.id}`}
                className="relative scroll-mt-[calc(var(--chrome-h,0px)+var(--sticky-l1))]"
              >
                <StickyItemHeader fade className="px-2 py-2">
                  <div className="pl-[var(--rail-pad)]">
                    <h3 className="truncate font-serif text-lg font-semibold leading-snug text-fg">
                      {isToday ? office.title : section.title}
                    </h3>
                    {isToday || !section.subtitle ? null : (
                      <p className="pt-1 text-sm text-muted">{section.subtitle}</p>
                    )}
                  </div>
                </StickyItemHeader>
                <div className="px-2 pt-[var(--sticky-fade)] pb-5">
                  <ViewportGate estimateHeight={estimateSectionBodyHeight(visible, cardWidth)}>
                    <ArtifactColumns
                      artifacts={visible}
                      context={section.title}
                      onOpen={openArtifact}
                      side={isToday ? <TodayOffice hideTitle /> : undefined}
                    />
                  </ViewportGate>
                </div>
              </section>
            );
          })}
        </div>
      ))}
    </div>
  );
});
