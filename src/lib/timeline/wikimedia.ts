/** Display width for timeline artwork. Sharp on a max-w-xl card at 2x, without original 4k files. */
export const ARTWORK_DISPLAY_WIDTH = 1600;

export function wikimediaFileUrl(
  file: string,
  width = ARTWORK_DISPLAY_WIDTH,
): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}
