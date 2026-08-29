import type { ReactNode } from "react";
import { DUAL_COLUMN_GRID_CLASS, partitionTimelineColumns } from "@/lib/timeline/columns";
import type { TimelineArtifact } from "@/lib/timeline/types";
import { cn } from "@/lib/utils";
import { ArtifactCard } from "./ArtifactCard";

function ArtifactStack({
  artifacts,
  context,
  onOpen,
  className,
}: {
  artifacts: TimelineArtifact[];
  context?: string;
  onOpen: (artifact: TimelineArtifact) => void;
  className?: string;
}) {
  if (artifacts.length === 0) return null;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {artifacts.map((artifact) => (
        <ArtifactCard key={artifact.id} artifact={artifact} context={context} onOpen={onOpen} />
      ))}
    </div>
  );
}

/**
 * Headings span both columns. Then non-artwork cards on the left and artwork
 * on the right, so the first cards in each column share a top edge.
 */
export function ArtifactColumns({
  artifacts,
  context,
  onOpen,
  heading,
}: {
  artifacts: TimelineArtifact[];
  context?: string;
  onOpen: (artifact: TimelineArtifact) => void;
  heading?: ReactNode;
}) {
  const { main, artwork } = partitionTimelineColumns(artifacts);

  return (
    <div className={DUAL_COLUMN_GRID_CLASS}>
      {heading ? <div className="min-w-0 dual:col-span-2">{heading}</div> : null}
      {main.length > 0 ? (
        <div className="min-w-0 dual:col-start-1">
          <ArtifactStack
            artifacts={main}
            context={context}
            onOpen={onOpen}
            className="pl-[var(--rail-pad)]"
          />
        </div>
      ) : null}
      {artwork.length > 0 ? (
        <div className="min-w-0 dual:col-start-2">
          <ArtifactStack
            artifacts={artwork}
            context={context}
            onOpen={onOpen}
            className="pl-[var(--rail-pad)] dual:pl-0"
          />
        </div>
      ) : null}
    </div>
  );
}
