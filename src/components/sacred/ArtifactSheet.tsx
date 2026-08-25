import { Drawer } from "vaul";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { ARTIFACT_LABEL, type TimelineArtifact } from "@/lib/timeline/types";
import { TYPE_ICON } from "./icons";

export function ArtifactSheet({
  artifact,
  onClose,
}: {
  artifact: TimelineArtifact | null;
  onClose: () => void;
}) {
  const open = artifact !== null;
  const Icon = artifact ? TYPE_ICON[artifact.type] : null;

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-bg/70" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-xl bg-surface shadow-[var(--shadow-sheet)] outline-none">
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-line-strong" />
          <div className="flex items-center justify-between px-5 pt-3 pb-1">
            <Drawer.Title className="font-serif text-lg font-semibold text-fg">
              Source
            </Drawer.Title>
            <button
              type="button"
              onClick={onClose}
              className="flex size-11 items-center justify-center rounded-md text-muted hover:text-fg"
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </div>
          <div className="overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <AnimatePresence mode="wait">
              {artifact && Icon && (
                <motion.div
                  key={artifact.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gold-soft text-gold">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif text-xl font-semibold leading-snug text-fg">
                        {artifact.title}
                      </p>
                      {artifact.subtitle && (
                        <p className="mt-1 text-sm text-muted">{artifact.subtitle}</p>
                      )}
                      <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.16em] text-gold-dim">
                        {ARTIFACT_LABEL[artifact.type]}
                        {artifact.year != null ? ` · ${artifact.year}` : ""}
                      </p>
                    </div>
                  </div>

                  {artifact.imageUrl && (
                    <figure className="overflow-hidden rounded-md bg-elevated">
                      <img
                        src={artifact.imageUrl}
                        alt={artifact.title}
                        className="max-h-64 w-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {artifact.imageCredit && (
                        <figcaption className="px-3 py-2 text-xs leading-relaxed text-subtle">
                          {artifact.imageCredit}
                        </figcaption>
                      )}
                    </figure>
                  )}

                  {artifact.shortQuote && (
                    <blockquote className="border-l-2 border-gold/50 pl-4">
                      <p className="font-serif text-lg italic leading-relaxed text-fg">
                        {artifact.shortQuote}
                      </p>
                    </blockquote>
                  )}

                  {artifact.bibleRefs && artifact.bibleRefs.length > 0 && (
                    <p className="text-sm text-muted">
                      Scripture: {artifact.bibleRefs.join(" · ")}
                    </p>
                  )}

                  <a
                    href={artifact.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-gold px-4 font-medium text-bg transition-transform duration-150 ease-out active:scale-[0.96]"
                  >
                    View original source
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
