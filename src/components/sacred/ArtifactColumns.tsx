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

/** Left: headings and non-artwork cards. Right (desktop/landscape): artwork. */
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
      <div className="min-w-0">
        {heading}
        <ArtifactStack
          artifacts={main}
          context={context}
          onOpen={onOpen}
          className="pl-[var(--rail-pad)]"
        />
      </div>
      <ArtifactStack
        artifacts={artwork}
        context={context}
        onOpen={onOpen}
        className="min-w-0 pl-[var(--rail-pad)] dual:pl-0"
      />
    </div>
  );
}
