import { artworkHeightForWidth } from "./artwork-size.ts";

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

export function containIntrinsicSize(estimateHeight: number): string {
  return `auto ${Math.max(1, Math.round(estimateHeight))}px`;
}
