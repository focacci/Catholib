/** Confirmed Catena Aurea chapter pages on ecatholic2000.com. Gospels only. */
const CATENA: Record<string, { start: number; max: number }> = {
  Matthew: { start: 8, max: 28 },
  Mark: { start: 41, max: 16 },
  Luke: { start: 62, max: 24 },
  John: { start: 89, max: 21 },
};

export const CATENA_SLUG: Record<string, { max: number }> = Object.fromEntries(
  Object.entries(CATENA).map(([book, spec]) => [book, { max: spec.max }]),
);

function pageName(index: number): string {
  return `untitled-${String(index).padStart(2, "0")}.shtml`;
}

export function catenaUrl(book: string, chapter: number): string | null {
  const spec = CATENA[book];
  if (!spec || chapter < 1 || chapter > spec.max) return null;
  return `https://www.ecatholic2000.com/catena/${pageName(spec.start + chapter - 1)}`;
}
