import { ARTIFACT_LABEL, type TimelineArtifact } from "@/lib/timeline/types";
import { cn } from "@/lib/utils";
import { TYPE_ICON } from "./icons";

export function ArtifactCard({
  artifact,
  context,
  onOpen,
}: {
  artifact: TimelineArtifact;
  context?: string;
  onOpen: (artifact: TimelineArtifact) => void;
}) {
  const Icon = TYPE_ICON[artifact.type];
  return (
    <button
      type="button"
      onClick={() => onOpen(artifact)}
      className={cn(
        "group flex w-full min-h-11 items-start gap-3 rounded-lg border border-line bg-elevated px-3 py-3 text-left",
        "transition-[border-color,transform,background-color] duration-150 ease-out",
        "active:scale-[0.96] hover:border-line-strong",
      )}
    >
      {artifact.imageUrl ? (
        <img
          src={artifact.imageUrl}
          alt=""
          className="mt-0.5 size-11 shrink-0 rounded-sm object-cover outline outline-1 -outline-offset-1 outline-fg/15"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span
          className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm bg-gold-soft text-gold"
          aria-hidden
        >
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-serif text-base font-semibold leading-snug text-fg">
            {artifact.title}
          </span>
          <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold-dim">
            {ARTIFACT_LABEL[artifact.type]}
          </span>
        </span>
        <span className="mt-0.5 block truncate text-sm text-muted">
          {artifact.subtitle ?? context ?? artifact.year ?? "Approved source"}
        </span>
      </span>
      {artifact.year != null && (
        <span className="shrink-0 pt-0.5 font-serif text-sm tabular-nums text-gold-dim">
          {artifact.year}
        </span>
      )}
    </button>
  );
}
