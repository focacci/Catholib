import { useEffect } from "react";
import { collectArtworkCatalog, orderArtworkForView } from "@/lib/timeline/artwork";
import { preloadArtwork } from "@/lib/timeline/preload-artwork";
import { useTimeline } from "@/lib/timeline/store";

const catalog = collectArtworkCatalog();

export function ArtworkPreloader() {
  const view = useTimeline((s) => s.view);
  const expandedBooks = useTimeline((s) => s.expandedBooks);

  useEffect(() => {
    preloadArtwork(orderArtworkForView(catalog, view, expandedBooks));
  }, [expandedBooks, view]);

  return null;
}
