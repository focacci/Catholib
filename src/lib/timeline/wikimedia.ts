/** Display width for timeline artwork. Sharp on a max-w-xl card at 2x, without original 4k files. */
export const ARTWORK_DISPLAY_WIDTH = 1600;

const FILEPATH_PREFIX = "/wiki/Special:FilePath/";

export function wikimediaFileUrl(
  file: string,
  width = ARTWORK_DISPLAY_WIDTH,
): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

/** Original Commons filename from a Special:FilePath URL. */
export function wikimediaFileFromUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    const index = parsed.pathname.indexOf(FILEPATH_PREFIX);
    if (index === -1) return undefined;
    return decodeURIComponent(parsed.pathname.slice(index + FILEPATH_PREFIX.length));
  } catch {
    return undefined;
  }
}
