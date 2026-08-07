import { NORTHPORT_AL } from "./categories";
import type { CategoryQuery, PlaceCandidate, VerticalPack } from "./types";

const PLACES_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.types",
  "places.rating",
  "places.userRatingCount",
].join(",");

type PlacesTextSearchResponse = {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    nationalPhoneNumber?: string;
    websiteUri?: string;
    types?: string[];
    rating?: number;
    userRatingCount?: number;
  }>;
};

export async function searchPlaces(
  apiKey: string,
  query: CategoryQuery,
): Promise<PlaceCandidate[]> {
  const body = {
    textQuery: query.textQuery,
    locationBias: {
      circle: {
        center: {
          latitude: NORTHPORT_AL.latitude,
          longitude: NORTHPORT_AL.longitude,
        },
        radius: NORTHPORT_AL.radiusMeters,
      },
    },
    pageSize: 20,
  };

  const response = await fetch(PLACES_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Places API ${response.status} for "${query.textQuery}": ${text.slice(0, 300)}`,
    );
  }

  const data = (await response.json()) as PlacesTextSearchResponse;
  return (data.places ?? []).map((place) => ({
    placeId: place.id ?? "",
    name: place.displayName?.text ?? "Unknown",
    phone: place.nationalPhoneNumber ?? null,
    address: place.formattedAddress ?? null,
    website: place.websiteUri ?? null,
    types: place.types ?? [],
    rating: place.rating ?? null,
    reviewCount: place.userRatingCount ?? null,
    vertical: query.vertical,
    query: query.textQuery,
  }));
}

export async function discoverCandidates(
  apiKey: string,
  queries: CategoryQuery[],
  delayMs = 200,
): Promise<PlaceCandidate[]> {
  const byPlaceId = new Map<string, PlaceCandidate>();

  for (const query of queries) {
    const batch = await searchPlaces(apiKey, query);
    for (const candidate of batch) {
      if (!candidate.placeId) continue;
      const existing = byPlaceId.get(candidate.placeId);
      if (!existing) {
        byPlaceId.set(candidate.placeId, candidate);
        continue;
      }
      // Prefer row that already has a website URL.
      if (!existing.website && candidate.website) {
        byPlaceId.set(candidate.placeId, candidate);
      }
    }
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return [...byPlaceId.values()];
}

export function parseVerticals(
  raw: string | undefined,
): VerticalPack[] | undefined {
  if (!raw?.trim()) return undefined;
  const allowed: VerticalPack[] = ["trades", "pro", "hospitality"];
  const parts = raw.split(",").map((part) => part.trim().toLowerCase());
  const verticals = parts.filter((part): part is VerticalPack =>
    (allowed as string[]).includes(part),
  );
  return verticals.length ? verticals : undefined;
}
