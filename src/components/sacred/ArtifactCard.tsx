import { memo } from "react";
import { ARTIFACT_LABEL, type TimelineArtifact } from "@/lib/timeline/types";
import { showModernPlace } from "@/lib/timeline/place";
import { cn } from "@/lib/utils";
import { ArtworkFrame } from "./ArtworkFrame";

export const ArtifactCard = memo(function ArtifactCard({
  artifact,
  context,
  onOpen,
}: {
  artifact: TimelineArtifact;
  context?: string;
  onOpen: (artifact: TimelineArtifact) => void;
}) {
  const description = artifact.subtitle ?? context;

  return (
    <a
      href={artifact.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
        e.preventDefault();
        onOpen(artifact);
      }}
      className={cn(
        "group block w-full overflow-hidden rounded-lg border border-line bg-elevated text-left no-underline",
        "md:transition-[border-color,box-shadow,transform] md:duration-200 md:ease-out",
        "md:hover:border-line-strong md:hover:shadow-[0_10px_28px_#00000050]",
      )}
    >
      <span className="flex flex-col md:transition-transform md:duration-200 md:ease-out md:group-hover:-translate-y-0.5">
        {artifact.imageUrl ? (
          <ArtworkFrame
            src={artifact.imageUrl}
            alt=""
            imgClassName="md:transition-[filter] md:duration-200 md:ease-out md:group-hover:brightness-110"
          />
        ) : null}
        <span className="flex flex-col gap-1 px-3 py-2.5">
          <span className="block w-full font-serif text-lg font-semibold leading-snug text-fg">
            {artifact.title}
          </span>
          {description ? (
            <span className="block w-full line-clamp-2 text-sm leading-snug text-muted">
              {description}
            </span>
          ) : null}
          {artifact.location ? (
            <span className="flex w-full flex-col gap-0.5 text-sm leading-snug text-muted">
              <span>{artifact.location.then}</span>
              {showModernPlace(artifact.location) ? (
                <span className="text-subtle">
                  <span className="mr-1.5 text-xs font-medium uppercase tracking-[0.16em] text-gold-dim">
                    now
                  </span>
                  {artifact.location.now}
                </span>
              ) : null}
            </span>
          ) : null}
          <span className="mt-1 flex items-end justify-between gap-2">
            <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-gold-dim">
              {ARTIFACT_LABEL[artifact.type]}
            </span>
            {artifact.year != null && (
              <span className="shrink-0 font-serif text-sm tabular-nums text-gold-dim">
                {artifact.year}
              </span>
            )}
          </span>
        </span>
      </span>
    </a>
  );
});
