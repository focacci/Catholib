const DEFAULT_ROOT_MARGIN = "900px 0px 1200px 0px";
const TOP_OVERSCAN_PX = 900;
const BOTTOM_OVERSCAN_PX = 1200;

const TEXT_CARD_PX = 96;
const IMAGE_CARD_PX = 340;
const CHAPTER_CHROME_PX = 88;
const SECTION_CHROME_PX = 52;

type VisibilityCallback = (visible: boolean) => void;

const callbacks = new Map<Element, VisibilityCallback>();
let observer: IntersectionObserver | null = null;
let observedRoot: Element | null = null;

export function timelineScrollRoot(): Element | null {
  if (typeof document === "undefined") return null;
  return document.getElementById("timeline-scroll");
}

function intersectsWithOverscan(el: Element, root: Element): boolean {
  const rootRect = root.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  return (
    rect.bottom >= rootRect.top - TOP_OVERSCAN_PX &&
    rect.top <= rootRect.bottom + BOTTOM_OVERSCAN_PX
  );
}

function ensureObserver(root: Element): IntersectionObserver {
  if (observer && observedRoot === root) return observer;
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        callbacks.get(entry.target)?.(entry.isIntersecting);
      }
    },
    { root, rootMargin: DEFAULT_ROOT_MARGIN, threshold: 0 },
  );
  observedRoot = root;
  return observer;
}

/**
 * Observe `el` against the timeline scroller. Invokes `cb` immediately with the
 * current overscan intersection, then on subsequent intersection changes.
 */
export function observeTimelineViewport(
  el: Element,
  cb: VisibilityCallback,
): () => void {
  const root = timelineScrollRoot();
  if (!root) {
    cb(true);
    return () => {};
  }
  const io = ensureObserver(root);
  callbacks.set(el, cb);
  io.observe(el);
  cb(intersectsWithOverscan(el, root));
  return () => {
    callbacks.delete(el);
    io.unobserve(el);
  };
}

export function estimateArtifactListHeight(
  artifacts: readonly { imageUrl?: string }[],
): number {
  let height = 0;
  for (const artifact of artifacts) {
    height += artifact.imageUrl ? IMAGE_CARD_PX : TEXT_CARD_PX;
  }
  return Math.max(height, TEXT_CARD_PX);
}

export function estimateChapterBlockHeight(chapter: {
  artifacts: readonly { imageUrl?: string }[];
}): number {
  return CHAPTER_CHROME_PX + estimateArtifactListHeight(chapter.artifacts);
}

export function estimateSectionBodyHeight(
  artifacts: readonly { imageUrl?: string }[],
): number {
  return SECTION_CHROME_PX + estimateArtifactListHeight(artifacts);
}
