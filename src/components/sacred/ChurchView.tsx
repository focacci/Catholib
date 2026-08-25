import { CHURCH_ENTRIES } from "@/lib/timeline/church";
import { filterArtifacts } from "@/lib/timeline/search";
import { useTimeline } from "@/lib/timeline/store";
import { ArtifactCard } from "./ArtifactCard";

export function ChurchView() {
  const query = useTimeline((s) => s.query);
  const filter = useTimeline((s) => s.filter);
  const openArtifact = useTimeline((s) => s.openArtifact);

  const q = query.trim();
  const sections = CHURCH_ENTRIES.map((entry, index) => {
    const artifacts = filterArtifacts(entry.artifacts, q, filter);
    const eraMatch =
      !q ||
      `${entry.title} ${entry.era ?? ""} ${entry.year}`
        .toLowerCase()
        .includes(q.toLowerCase());
    const visible =
      artifacts.length > 0
        ? artifacts
        : eraMatch && !q
          ? entry.artifacts.filter((a) => filter === "all" || a.type === filter)
          : eraMatch
            ? artifacts
            : [];
    if (visible.length === 0) return null;
    const showEra = Boolean(entry.era && entry.era !== CHURCH_ENTRIES[index - 1]?.era);
    return { entry, visible, showEra };
  }).filter((s) => s !== null);

  if (sections.length === 0) {
    return (
      <p className="px-6 py-16 text-center text-sm text-muted">
        No Church entries match these filters. Sample data from approved sources
        only.
      </p>
    );
  }

  return (
    <div className="relative pb-[40vh]">
      <div
        className="absolute top-2 bottom-8 left-[27px] w-px timeline-rail"
        aria-hidden
      />
      {sections.map(({ entry, visible, showEra }) => (
        <section
          key={entry.id}
          id={`era-${entry.id}`}
          className="relative scroll-mt-16"
        >
          {showEra && (
            <p className="sticky top-0 z-10 bg-bg px-4 py-2 pl-12 font-serif text-sm tracking-[0.18em] text-gold-dim uppercase">
              {entry.era}
            </p>
          )}
          <div className="px-4 pb-6 pl-4">
            <div className="flex items-baseline gap-3 pl-8">
              <span className="font-serif text-xl tabular-nums text-gold">
                {entry.year}
              </span>
              <h3 className="font-serif text-lg font-semibold leading-snug text-fg">
                {entry.title}
              </h3>
            </div>
            <div className="mt-3 flex flex-col gap-2 pl-8">
              {visible.map((a) => (
                <ArtifactCard
                  key={a.id}
                  artifact={a}
                  context={entry.title}
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
