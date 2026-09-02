import { memo, useMemo, useState } from "react";
import { todayBoard } from "@/lib/graph";
import { useTimelineCardWidth } from "@/lib/timeline/card-width";
import { missalSections } from "@/lib/timeline/missal";
import { sectionArtifactsForQuery } from "@/lib/timeline/search";
import { groupConsecutiveBy } from "@/lib/timeline/sticky-stack";
import { useTimeline } from "@/lib/timeline/store";
import { MISSAL_KIND_LABEL } from "@/lib/timeline/types";
import { estimateSectionBodyHeight } from "@/lib/timeline/viewport-gate";
import { ArtifactColumns } from "./ArtifactColumns";
import { StickyGroupHeader, StickyItemHeader } from "./StickyHeaders";
import { ViewportGate } from "./ViewportGate";

export const MissalView = memo(function MissalView({ now }: { now?: Date }) {
  const query = useTimeline((s) => s.query);
  const filter = useTimeline((s) => s.filter);
  const openArtifact = useTimeline((s) => s.openArtifact);
  const cardWidth = useTimelineCardWidth();
  const [mountedAt] = useState(() => new Date());
  const when = now ?? mountedAt;

  const q = query.trim();
  const board = useMemo(() => {
    const cards = todayBoard(when);
    return sectionArtifactsForQuery(cards, q, filter, "today office rosary ordo");
  }, [filter, q, when]);

  const catalog = useMemo(() => {
    const sections = missalSections(when).filter((section) => section.kind !== "today");
    return sections
      .map((section) => {
        const haystack = `${section.title} ${section.subtitle ?? ""} ${section.kind} ${MISSAL_KIND_LABEL[section.kind]}`;
        const visible = sectionArtifactsForQuery(section.artifacts, q, filter, haystack);
        if (visible.length === 0) return null;
        return { section, visible };
      })
      .filter((s) => s !== null);
  }, [filter, q, when]);

  const groups = useMemo(
    () => groupConsecutiveBy(catalog, (item) => item.section.kind),
    [catalog],
  );

  const showPractice = q.length > 0 || filter !== "all" || catalog.length > 0;

  if (board.length === 0 && catalog.length === 0) {
    return (
      <p className="px-4 py-16 text-center text-sm text-muted">
        No Today entries match these filters. Office, obligation, missal proper, and rosary from
        confirmed sources.
      </p>
    );
  }

  return (
    <div className="relative pb-[40vh]">
      <div
        className="absolute top-2 bottom-8 left-[var(--rail-x)] w-px timeline-rail"
        aria-hidden
      />
      {board.length > 0 ? (
        <section id="missal-today" className="relative scroll-mt-[calc(var(--chrome-h,0px)+var(--sticky-l1))]">
          <StickyGroupHeader className="pl-[var(--rail-pad)]">Today</StickyGroupHeader>
          <div className="px-2 pt-[var(--sticky-fade)] pb-5">
            <ViewportGate estimateHeight={estimateSectionBodyHeight(board, cardWidth)}>
              <ArtifactColumns artifacts={board} context="Today" onOpen={openArtifact} />
            </ViewportGate>
          </div>
        </section>
      ) : null}

      {showPractice
        ? groups.map((group) => (
            <div key={group.key}>
              <StickyGroupHeader className="pl-[var(--rail-pad)]">
                Practice · {MISSAL_KIND_LABEL[group.key]}
              </StickyGroupHeader>
              {group.items.map(({ section, visible }) => (
                <section
                  key={section.id}
                  id={`missal-${section.id}`}
                  className="relative scroll-mt-[calc(var(--chrome-h,0px)+var(--sticky-l1))]"
                >
                  <StickyItemHeader fade className="px-2 py-2">
                    <div className="pl-[var(--rail-pad)]">
                      <h3 className="truncate font-serif text-lg font-semibold leading-snug text-fg">
                        {section.title}
                      </h3>
                      {section.subtitle ? (
                        <p className="pt-1 text-sm text-muted">{section.subtitle}</p>
                      ) : null}
                    </div>
                  </StickyItemHeader>
                  <div className="px-2 pt-[var(--sticky-fade)] pb-5">
                    <ViewportGate estimateHeight={estimateSectionBodyHeight(visible, cardWidth)}>
                      <ArtifactColumns
                        artifacts={visible}
                        context={section.title}
                        onOpen={openArtifact}
                      />
                    </ViewportGate>
                  </div>
                </section>
              ))}
            </div>
          ))
        : null}
    </div>
  );
});
