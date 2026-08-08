import type { CategoryQuery, VerticalPack } from "./types";

/** Northport, AL — approximate center for Places locationBias. */
export const NORTHPORT_AL = {
  city: "Northport, AL",
  latitude: 33.229,
  longitude: -87.5772,
  radiusMeters: 15_000,
} as const;

const LABELS: Record<VerticalPack, readonly string[]> = {
  trades: ["HVAC", "plumber", "electrician", "roofing"],
  pro: ["dentist", "lawyer", "accountant", "real estate agent"],
  hospitality: ["restaurant", "hair salon", "clothing boutique"],
};

export function allCategoryQueries(
  verticals?: VerticalPack[],
): CategoryQuery[] {
  const keys = verticals?.length
    ? verticals
    : (Object.keys(LABELS) as VerticalPack[]);
  return keys.flatMap((vertical) =>
    LABELS[vertical].map((label) => ({
      vertical,
      textQuery: `${label} in ${NORTHPORT_AL.city}`,
      label,
    })),
  );
}
