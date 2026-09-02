import { useMemo, useState, type FormEvent } from "react";
import { Drawer } from "vaul";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { neighborhood, rankedRails, resolveQuery, route } from "@/lib/graph";
import { bookNameForToken } from "@/lib/graph/parse-ref";
import { bibleVersionLinks } from "@/lib/timeline/bible-versions";
import { cccParagraphFor } from "@/lib/timeline/ccc";
import { showModernPlace } from "@/lib/timeline/place";
import { useTimeline } from "@/lib/timeline/store";
import { ARTIFACT_LABEL, type TimelineArtifact } from "@/lib/timeline/types";
import { ArtifactCard } from "./ArtifactCard";
import { ArtworkFrame } from "./ArtworkFrame";

/** Host + path, so ellipsis keeps the domain and clips the end of the path. */
function sourceUrlCaption(url: string): string {
  return url.replace(/^https?:\/\//i, "");
}

function Rail({
  label,
  hits,
  more,
  expanded,
  onMore,
  onOpen,
}: {
  label: string;
  hits: { artifact: TimelineArtifact }[];
  more: number;
  expanded: boolean;
  onMore: () => void;
  onOpen: (artifact: TimelineArtifact) => void;
}) {
  if (hits.length === 0 && more === 0) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold-dim">{label}</p>
      <div className="mt-2 flex flex-col gap-2">
        {hits.map((hit) => (
          <ArtifactCard key={hit.artifact.id} artifact={hit.artifact} onOpen={onOpen} />
        ))}
      </div>
      {more > 0 && !expanded ? (
        <button
          type="button"
          onClick={onMore}
          className="mt-2 text-sm text-gold"
        >
          More ({more})
        </button>
      ) : null}
    </div>
  );
}

function ScriptureVersions({ nodeId }: { nodeId: string }) {
  const match = nodeId.match(/^scripture:([a-z0-9]+)\.(\d+)/);
  if (!match) return null;
  const book = bookNameForToken(match[1]);
  if (!book) return null;
  const chapter = Number(match[2]);
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-4">
      {bibleVersionLinks(book, chapter).map((version) => (
        <a
          key={version.id}
          href={version.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-8 items-center gap-1 text-base leading-none text-gold"
          aria-label={`Read ${book} ${chapter} in ${version.label}`}
        >
          {version.label}
          <ExternalLink className="size-3.5" />
        </a>
      ))}
    </div>
  );
}

export function ArtifactSheet({
  artifact,
  onClose,
}: {
  artifact: TimelineArtifact | null;
  onClose: () => void;
}) {
  const open = artifact !== null;
  const focusId = useTimeline((s) => s.focusId);
  const connectQuery = useTimeline((s) => s.connectQuery);
  const setConnectQuery = useTimeline((s) => s.setConnectQuery);
  const openArtifact = useTimeline((s) => s.openArtifact);
  const openNode = useTimeline((s) => s.openNode);
  const [citedMore, setCitedMore] = useState(false);
  const [drawsMore, setDrawsMore] = useState(false);
  const [routeError, setRouteError] = useState("");

  const allHits = useMemo(() => (focusId ? neighborhood(focusId, 1) : []), [focusId]);
  const rails = useMemo(
    () => (focusId ? rankedRails(focusId) : { citedBy: [], drawsOn: [], citedByMore: 0, drawsOnMore: 0 }),
    [focusId],
  );
  const citedHits = citedMore ? allHits.filter((hit) => hit.rail === "cited-by") : rails.citedBy;
  const drawsHits = drawsMore ? allHits.filter((hit) => hit.rail === "draws-on") : rails.drawsOn;
  const connected = useMemo(() => {
    const q = connectQuery.trim();
    if (!q || !focusId) return [];
    const dest = resolveQuery(q)[0];
    if (!dest) return [];
    return route(focusId, dest.id, { maxHops: 4 });
  }, [connectQuery, focusId]);

  const isCommentary = artifact?.type === "commentary";
  const quote =
    artifact?.type === "catechism"
      ? cccParagraphFor(artifact.title)
      : artifact?.type === "papal" || isCommentary
        ? undefined
        : artifact?.shortQuote;

  const onConnect = (event: FormEvent) => {
    event.preventDefault();
    const dest = resolveQuery(connectQuery)[0];
    setRouteError(dest ? "" : "No connected source matches that search.");
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setCitedMore(false);
          setDrawsMore(false);
          setRouteError("");
          onClose();
        }
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-bg/70" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col overflow-hidden rounded-t-xl bg-surface shadow-[var(--shadow-sheet)] outline-none">
          <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-line-strong" />
          <div className="flex shrink-0 items-center justify-between px-[max(1.25rem,var(--safe-x))] pt-3 pb-1">
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
          <div className="overflow-y-auto overscroll-contain px-[max(1.25rem,var(--safe-x))] pb-[max(1.5rem,env(safe-area-inset-bottom))] [max-height:calc(88dvh-4.75rem)]">
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
                  <Rail
                    label="Cited by"
                    hits={citedHits}
                    more={citedMore ? 0 : rails.citedByMore}
                    expanded={citedMore}
                    onMore={() => setCitedMore(true)}
                    onOpen={openArtifact}
                  />

                  <div className="min-w-0">
                    <p className="font-serif text-xl font-semibold leading-snug text-fg">
                      {artifact.title}
                    </p>
                    {artifact.subtitle && (
                      <p className="mt-1 text-base text-muted">{artifact.subtitle}</p>
                    )}
                    {artifact.location && (
                      <div className="mt-2 text-base text-muted">
                        <p>
                          <span className="mr-2 text-xs font-medium uppercase tracking-[0.16em] text-gold-dim">
                            {showModernPlace(artifact.location) ? "Then" : "Place"}
                          </span>
                          {artifact.location.then}
                        </p>
                        {showModernPlace(artifact.location) ? (
                          <p className="mt-1">
                            <span className="mr-2 text-xs font-medium uppercase tracking-[0.16em] text-gold-dim">
                              Now
                            </span>
                            {artifact.location.now}
                          </p>
                        ) : null}
                      </div>
                    )}
                    {!isCommentary && (
                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-gold-dim">
                        {ARTIFACT_LABEL[artifact.type]}
                        {artifact.year != null ? ` · ${artifact.year}` : ""}
                      </p>
                    )}
                    {focusId ? <ScriptureVersions nodeId={focusId} /> : null}
                  </div>

                  {artifact.imageUrl && (
                    <figure className="overflow-hidden rounded-md bg-elevated">
                      <ArtworkFrame
                        src={artifact.imageUrl}
                        alt={artifact.title}
                        className="outline outline-1 -outline-offset-1 outline-fg/10"
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

                  <Rail
                    label="This draws on"
                    hits={drawsHits}
                    more={drawsMore ? 0 : rails.drawsOnMore}
                    expanded={drawsMore}
                    onMore={() => setDrawsMore(true)}
                    onOpen={openArtifact}
                  />

                  <form onSubmit={onConnect} className="min-w-0">
                    <label className="text-xs font-medium uppercase tracking-[0.16em] text-gold-dim">
                      How is this connected?
                    </label>
                    <input
                      value={connectQuery}
                      onChange={(event) => setConnectQuery(event.target.value)}
                      placeholder="Nicaea, Mt 16:18…"
                      className="mt-2 h-11 w-full rounded-md border border-line bg-elevated px-3 text-base text-fg outline-none placeholder:text-subtle"
                    />
                    {routeError ? <p className="mt-1 text-sm text-muted">{routeError}</p> : null}
                    {connected.length > 0 ? (
                      <div className="mt-2 flex flex-col gap-2">
                        {connected.map((node) => (
                          <ArtifactCard
                            key={node.id}
                            artifact={node.artifact}
                            onOpen={() => openNode(node.id)}
                          />
                        ))}
                      </div>
                    ) : null}
                  </form>

                  <div className="min-w-0">
                    <a
                      href={artifact.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-gold px-4 font-medium text-bg"
                    >
                      Go to source
                      <ArrowUpRight className="size-4" strokeWidth={2} />
                    </a>
                    <p
                      className="mt-1.5 w-full truncate text-center text-xs text-gold"
                      title={artifact.sourceUrl}
                    >
                      {sourceUrlCaption(artifact.sourceUrl)}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
