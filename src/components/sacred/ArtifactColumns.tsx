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
 * (or other side content) on the right, so the first items in each column
 * share a top edge.
 */
export function ArtifactColumns({
  artifacts,
  context,
  onOpen,
  heading,
  side,
}: {
  artifacts: TimelineArtifact[];
  context?: string;
  onOpen: (artifact: TimelineArtifact) => void;
  heading?: ReactNode;
  side?: ReactNode;
}) {
  const { main, artwork } = partitionTimelineColumns(artifacts);
  const hasSideColumn = Boolean(side) || artwork.length > 0;

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
      {hasSideColumn ? (
        <div className={cn("min-w-0 dual:col-start-2", side && "order-first dual:order-none")}>
          {side ? <div className="pl-[var(--rail-pad)] dual:pl-0">{side}</div> : null}
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
