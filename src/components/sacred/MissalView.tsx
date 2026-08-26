import { MISSAL_KIND_LABEL } from "@/lib/timeline/types";
import { missalSections } from "@/lib/timeline/missal";
import { sectionArtifactsForQuery } from "@/lib/timeline/search";
import { useTimeline } from "@/lib/timeline/store";
import { ArtifactCard } from "./ArtifactCard";

export function MissalView() {
  const query = useTimeline((s) => s.query);
  const filter = useTimeline((s) => s.filter);
  const openArtifact = useTimeline((s) => s.openArtifact);

  const q = query.trim();
  const catalog = missalSections();
  const sections = catalog
    .map((section, index) => {
      const haystack = `${section.title} ${section.subtitle ?? ""} ${section.kind} ${MISSAL_KIND_LABEL[section.kind]}`;
      const visible = sectionArtifactsForQuery(
        section.artifacts,
        q,
        filter,
        haystack,
      );
      if (visible.length === 0) return null;
      const showKind = section.kind !== catalog[index - 1]?.kind;
      return { section, visible, showKind };
    })
    .filter((s) => s !== null);

  if (sections.length === 0) {
    return (
      <p className="px-4 py-16 text-center text-sm text-muted">
        No Missal entries match these filters. Catalog cards from Missale Meum
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
            <div className="flex items-baseline gap-3 pl-[var(--rail-pad)]">
              <h3 className="font-serif text-lg font-semibold leading-snug text-fg">
                {section.title}
              </h3>
            </div>
            {section.subtitle && (
              <p className="pl-[var(--rail-pad)] pt-1 text-sm text-muted">
                {section.subtitle}
              </p>
            )}
            <div className="mt-2.5 flex flex-col gap-2 pl-[var(--rail-pad)]">
              {visible.map((a) => (
                <ArtifactCard
                  key={a.id}
                  artifact={a}
                  context={section.title}
                  onOpen={openArtifact}
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
