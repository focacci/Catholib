import { BIBLE_BOOKS } from "./bible.ts";
import { CHURCH_ENTRIES } from "./church.ts";
import type { TimelineArtifact } from "./types";

function wiki(file: string, width = 640): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

function art(partial: TimelineArtifact): TimelineArtifact {
  return partial;
}

function addBibleArt(
  bookName: string,
  chapter: number,
  heading: string,
  arts: TimelineArtifact[],
) {
  const book = BIBLE_BOOKS.find((item) => item.name === bookName);
  if (!book) return;
  let ch = book.populatedChapters.find((item) => item.chapter === chapter);
  if (!ch) {
    ch = { chapter, heading, artifacts: [] };
    book.populatedChapters.push(ch);
    book.populatedChapters.sort((a, b) => a.chapter - b.chapter);
  } else if (!ch.heading) {
    ch.heading = heading;
  }
  for (const artifact of arts) {
    if (!ch.artifacts.some((item) => item.id === artifact.id)) {
      ch.artifacts.push(artifact);
    }
  }
}

function addChurchArt(entryId: string, artifact: TimelineArtifact) {
  const entry = CHURCH_ENTRIES.find((item) => item.id === entryId);
  if (!entry) return;
  if (!entry.artifacts.some((item) => item.id === artifact.id)) {
    entry.artifacts.push(artifact);
  }
}
