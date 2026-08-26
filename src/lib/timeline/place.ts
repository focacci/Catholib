import type { EventPlace } from "./types";

export function foldPlaceText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

/** True when the present-day name adds information beyond the historic name. */
export function showModernPlace(place: EventPlace): boolean {
  const then = foldPlaceText(place.then);
  const now = foldPlaceText(place.now);
  if (then === now) return false;
  // Historic line already names the present-day place (e.g. Jerusalem).
  if (then.includes(now)) return false;
  return true;
}

export function eventPlaceHaystack(place: EventPlace | undefined): string {
  if (!place) return "";
  return `${place.then} ${place.now}`;
}
