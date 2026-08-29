import { artworkHeightForWidth } from "./artwork-size.ts";
import { partitionTimelineColumns, type ColumnItem } from "./columns.ts";

const TEXT_CARD_PX = 96;
const CHAPTER_CHROME_PX = 88;
const SECTION_CHROME_PX = 52;
const CHAPTER_INDEX_CELL_PX = 44;
const CHAPTER_INDEX_GAP_PX = 4;
const CHAPTER_INDEX_PAD_PX = 16;

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

/** Dual-column chapter: spanning header, then max(text column, artwork column). */
export function estimateDualChapterBlockHeight(
  chapter: { artifacts: readonly ColumnItem[] },
  mainWidthPx: number,
  artworkWidthPx: number,
): number {
  const { main, artwork } = partitionTimelineColumns(chapter.artifacts);
  const columns = Math.max(
    estimateArtifactListHeight(main, mainWidthPx),
    estimateArtifactListHeight(artwork, artworkWidthPx),
  );
  return CHAPTER_CHROME_PX + columns;
}

/** Dual-column church section: spanning title, then max(text column, artwork column). */
export function estimateDualSectionBodyHeight(
  artifacts: readonly ColumnItem[],
  mainWidthPx: number,
  artworkWidthPx: number,
): number {
  const { main, artwork } = partitionTimelineColumns(artifacts);
  const columns = Math.max(
    estimateArtifactListHeight(main, mainWidthPx),
    estimateArtifactListHeight(artwork, artworkWidthPx),
  );
  return SECTION_CHROME_PX + columns;
}

export function containIntrinsicSize(estimateHeight: number): string {
  return `auto ${Math.max(1, Math.round(estimateHeight))}px`;
}

/** Height of the Bible chapter-number grid (h-11 cells, gap-1, pb-3). */
export function estimateChapterIndexHeight(chapterCount: number, columns = 8): number {
  if (chapterCount <= 0) return 0;
  const rows = Math.ceil(chapterCount / columns);
  return (
    rows * CHAPTER_INDEX_CELL_PX + Math.max(0, rows - 1) * CHAPTER_INDEX_GAP_PX + CHAPTER_INDEX_PAD_PX
  );
}
