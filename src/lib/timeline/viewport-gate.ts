const TEXT_CARD_PX = 96;
const IMAGE_CARD_PX = 340;
const CHAPTER_CHROME_PX = 88;
const SECTION_CHROME_PX = 52;

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

export function containIntrinsicSize(estimateHeight: number): string {
  return `auto ${Math.max(1, Math.round(estimateHeight))}px`;
}
