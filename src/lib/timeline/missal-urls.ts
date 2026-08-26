/** Confirmed missalemeum.com paths. Omit a slug or mass id rather than risk a 404. */

export const MISSAL_ORIGIN = "https://www.missalemeum.com";

/** Confirmed `/en/votive/{slug}` pages. */
export const MISSAL_VOTIVE_SLUG = {
  rorate: true,
  "vultum-tuum": true,
  "salve-sancta-parens-3": true,
  "salve-sancta-parens-4": true,
  "salve-sancta-parens-5": true,
  trinitas: true,
  angelis: true,
  joseph: true,
  "aeterno-sacerdote": true,
  "cordis-jesu": true,
  "cordis-mariae": true,
  "tempore-mortalitatis": true,
  "ad-vocationes": true,
} as const;

export type MissalVotiveSlug = keyof typeof MISSAL_VOTIVE_SLUG;

/** Confirmed `/en/mass/{id}` pages. */
export const MISSAL_MASS_ID = {
  "tempora:Adv1-0:1:v": true,
  "tempora:Adv3-0:1:pv": true,
  "tempora:Adv4-0:1:v": true,
  "sancti:12-24:1:v": true,
  "sancti:12-25m1:1:w": true,
  "sancti:12-25m3:1:w": true,
  "sancti:01-01:1:w": true,
  "sancti:01-06:1:w": true,
  "tempora:Epi1-0:2:w": true,
  "tempora:Quadp3-3:1:v": true,
  "tempora:Quad1-0:1:v": true,
  "tempora:Quad5-0:1:v": true,
  "tempora:Quad6-0r:1:rv": true,
  "tempora:Quad6-4r:1:w": true,
  "tempora:Quad6-5r:1:bv": true,
  "tempora:Quad6-6r:1:vw": true,
  "tempora:Pasc0-0:1:w": true,
  "tempora:Pasc5-4:1:w": true,
  "tempora:Pasc7-0:1:r": true,
  "tempora:Pent01-0r:1:w": true,
  "tempora:Pent01-4:1:w": true,
  "tempora:Pent02-5:1:w": true,
  "sancti:10-DU:1:w": true,
  "sancti:02-02:2:w": true,
  "sancti:02-22:2:w": true,
  "sancti:03-19:1:w": true,
  "sancti:03-25:1:w": true,
  "sancti:06-24:1:w": true,
  "sancti:06-29:1:r": true,
  "sancti:08-15:1:w": true,
  "sancti:09-14:2:r": true,
  "sancti:09-29:1:w": true,
  "sancti:11-01:1:w": true,
  "sancti:11-02m1:1:b": true,
  "sancti:12-08:1:w": true,
  "commune:C4b:0:w": true,
  "commune:C2:0:r": true,
  "commune:C3:0:r": true,
  "commune:C4:0:w": true,
  "commune:C5:0:w": true,
  "commune:C6a:0:w": true,
  "commune:C7a:0:w": true,
} as const;

export type MissalMassId = keyof typeof MISSAL_MASS_ID;

export function missalHomeUrl(): string {
  return `${MISSAL_ORIGIN}/en`;
}

export function missalCalendarUrl(): string {
  return `${MISSAL_ORIGIN}/en/calendar`;
}

export function missalOrdoUrl(): string {
  return `${MISSAL_ORIGIN}/en/ordo`;
}

export function missalVotiveIndexUrl(): string {
  return `${MISSAL_ORIGIN}/en/votive`;
}

export function missalDayUrl(date: Date): string | null {
  if (Number.isNaN(date.getTime())) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${MISSAL_ORIGIN}/en/calendar/${y}-${m}-${d}`;
}

export function missalVotiveUrl(slug: string): string | null {
  if (!(slug in MISSAL_VOTIVE_SLUG)) return null;
  return `${MISSAL_ORIGIN}/en/votive/${slug}`;
}

export function missalMassUrl(id: string): string | null {
  if (!(id in MISSAL_MASS_ID)) return null;
  return `${MISSAL_ORIGIN}/en/mass/${id}`;
}
