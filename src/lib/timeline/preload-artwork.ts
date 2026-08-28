const CONCURRENCY = 3;
const HEAD_PRELOAD_COUNT = 3;
const PRELOAD_LINK_ATTR = "data-artwork-preload";

const loaded = new Set<string>();
const inFlight = new Set<string>();
let queue: string[] = [];
let active = 0;
let headPreloads: string[] = [];

function finish(url: string) {
  inFlight.delete(url);
  loaded.add(url);
  active -= 1;
  pump();
}

function pump() {
  if (typeof Image === "undefined") return;
  while (active < CONCURRENCY && queue.length > 0) {
    const url = queue.shift();
    if (!url || loaded.has(url) || inFlight.has(url)) continue;
    active += 1;
    inFlight.add(url);
    const image = new Image();
    image.decoding = "async";
    const settle = () => {
      const decoded =
        typeof image.decode === "function" ? image.decode() : Promise.resolve();
      void decoded.then(
        () => finish(url),
        () => finish(url),
      );
    };
    image.onload = settle;
    image.onerror = () => finish(url);
    image.src = url;
  }
}

function syncHeadPreloads(urls: string[]) {
  if (typeof document === "undefined") return;
  const next = urls.slice(0, HEAD_PRELOAD_COUNT);
  if (
    next.length === headPreloads.length &&
    next.every((url, i) => url === headPreloads[i])
  ) {
    return;
  }
  for (const node of document.head.querySelectorAll(`link[${PRELOAD_LINK_ATTR}]`)) {
    node.remove();
  }
  headPreloads = next;
  for (const url of next) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    link.setAttribute(PRELOAD_LINK_ATTR, "");
    document.head.appendChild(link);
  }
}

/** Warm the HTTP and decode caches without blocking the timeline. */
export function preloadArtwork(urls: string[]) {
  const upcoming = new Set(queue);
  const prepend: string[] = [];
  for (const url of urls) {
    if (loaded.has(url) || inFlight.has(url) || upcoming.has(url)) continue;
    upcoming.add(url);
    prepend.push(url);
  }
  if (prepend.length > 0) queue = prepend.concat(queue);
  syncHeadPreloads(urls);
  pump();
}

export function resetArtworkPreloadForTests() {
  loaded.clear();
  inFlight.clear();
  queue = [];
  active = 0;
  headPreloads = [];
}
