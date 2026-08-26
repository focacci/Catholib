import { Drawer } from "vaul";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { cccParagraphFor } from "@/lib/timeline/ccc";
import { ARTIFACT_LABEL, type TimelineArtifact } from "@/lib/timeline/types";

export function ArtifactSheet({
  artifact,
  onClose,
}: {
  artifact: TimelineArtifact | null;
  onClose: () => void;
}) {
  const open = artifact !== null;
  const isCommentary = artifact?.type === "commentary";
  const cccBody =
    artifact?.type === "catechism" ? cccParagraphFor(artifact.title) : undefined;
  const quote = cccBody ?? (isCommentary ? undefined : artifact?.shortQuote);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-bg/70" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col overflow-hidden rounded-t-xl bg-surface shadow-[var(--shadow-sheet)] outline-none">
          <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-line-strong" />
          <div className="flex shrink-0 items-center justify-between px-5 pt-3 pb-1">
            <Drawer.Title className="font-serif text-xl font-semibold text-fg">
              Source
            </Drawer.Title>
            <Drawer.Description className="sr-only">
              Details and original source for the selected entry.
            </Drawer.Description>
            <button
              type="button"
              onClick={onClose}
              className="flex size-11 items-center justify-center rounded-md text-muted hover:text-fg"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </div>
          <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] [max-height:calc(88dvh-4.75rem)]">
            <AnimatePresence mode="wait">
              {artifact && (
                <motion.div
                  key={artifact.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-serif text-xl font-semibold leading-snug text-fg">
                      {artifact.title}
                    </p>
                    {artifact.subtitle && (
                      <p className="mt-1 text-base text-muted">{artifact.subtitle}</p>
                    )}
                    {!isCommentary && (
                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-gold-dim">
                        {ARTIFACT_LABEL[artifact.type]}
                        {artifact.year != null ? ` · ${artifact.year}` : ""}
                      </p>
                    )}
                  </div>

                  {artifact.imageUrl && (
                    <figure className="overflow-hidden rounded-md bg-elevated">
                      <img
                        src={artifact.imageUrl}
                        alt={artifact.title}
                        className="block h-auto w-full outline outline-1 -outline-offset-1 outline-fg/10"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {artifact.imageCredit && (
                        <figcaption className="px-3 py-2 text-sm leading-relaxed text-subtle">
                          {artifact.imageCredit}
                        </figcaption>
                      )}
                    </figure>
                  )}

                  {quote && (
                    artifact.type === "catechism" ? (
                      <p className="font-serif text-lg leading-relaxed text-fg">
                        {quote}
                      </p>
                    ) : (
                      <blockquote className="border-l-2 border-gold/50 pl-4">
                        <p className="font-serif text-lg italic leading-relaxed text-fg">
                          {quote}
                        </p>
                      </blockquote>
                    )
                  )}

                  {!isCommentary &&
                    artifact.bibleRefs &&
                    artifact.bibleRefs.length > 0 && (
                      <p className="text-base text-muted">
                        Scripture: {artifact.bibleRefs.join(" · ")}
                      </p>
                    )}

                  <a
                    href={artifact.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-gold px-4 font-medium text-bg"
                  >
                    Go to source
                    <ArrowUpRight className="size-4" strokeWidth={2} />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
