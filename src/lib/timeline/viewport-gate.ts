import { artworkHeightForWidth } from "./artwork-size.ts";
import { partitionTimelineColumns, type ColumnItem } from "./columns.ts";

const TEXT_CARD_PX = 96;
const CHAPTER_CHROME_PX = 88;
const SECTION_CHROME_PX = 52;

/** Inner width of a timeline card before the scroller has been measured. */
export const DEFAULT_CARD_IMAGE_WIDTH_PX = 360;

/** `px-2` on the chapter/section plus `--rail-pad` inset on the card column. */
export const TIMELINE_CARD_INSET_PX = 36;

export function estimateArtifactListHeight(
  artifacts: readonly { imageUrl?: string }[],
  cardWidthPx = DEFAULT_CARD_IMAGE_WIDTH_PX,
): number {
  if (artifacts.length === 0) return 0;
  let height = 0;
  for (const artifact of artifacts) {
    if (artifact.imageUrl) {
      height += artworkHeightForWidth(artifact.imageUrl, cardWidthPx) + TEXT_CARD_PX;
    } else {
      height += TEXT_CARD_PX;
    }
  }
  return Math.max(height, TEXT_CARD_PX);
}

export function estimateChapterBlockHeight(
  chapter: {
    artifacts: readonly { imageUrl?: string }[];
  },
  cardWidthPx = DEFAULT_CARD_IMAGE_WIDTH_PX,
): number {
  return CHAPTER_CHROME_PX + estimateArtifactListHeight(chapter.artifacts, cardWidthPx);
}

export function estimateSectionBodyHeight(
  artifacts: readonly { imageUrl?: string }[],
  cardWidthPx = DEFAULT_CARD_IMAGE_WIDTH_PX,
): number {
  return SECTION_CHROME_PX + estimateArtifactListHeight(artifacts, cardWidthPx);
}

/** Dual-column chapter: heading + text on the left, artwork on the right. */
export function estimateDualChapterBlockHeight(
  chapter: { artifacts: readonly ColumnItem[] },
  mainWidthPx: number,
  artworkWidthPx: number,
): number {
  const { main, artwork } = partitionTimelineColumns(chapter.artifacts);
  const left = CHAPTER_CHROME_PX + estimateArtifactListHeight(main, mainWidthPx);
  const right = estimateArtifactListHeight(artwork, artworkWidthPx);
  return Math.max(left, right, CHAPTER_CHROME_PX);
}

/** Dual-column church section: title + text on the left, artwork on the right. */
export function estimateDualSectionBodyHeight(
  artifacts: readonly ColumnItem[],
  mainWidthPx: number,
  artworkWidthPx: number,
): number {
  const { main, artwork } = partitionTimelineColumns(artifacts);
  const left = SECTION_CHROME_PX + estimateArtifactListHeight(main, mainWidthPx);
  const right = estimateArtifactListHeight(artwork, artworkWidthPx);
  return Math.max(left, right, SECTION_CHROME_PX);
}

export function containIntrinsicSize(estimateHeight: number): string {
  return `auto ${Math.max(1, Math.round(estimateHeight))}px`;
}
