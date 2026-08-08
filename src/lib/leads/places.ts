export type VerticalPack = "trades" | "pro" | "hospitality";

export type LocationBias = {
  latitude: number;
  longitude: number;
  radiusMeters: number;
};

export type PlacesSearchQuery = {
  textQuery: string;
  vertical: VerticalPack | "map";
};

export type PlaceCandidate = {
  placeId: string;
  name: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  types: string[];
  rating: number | null;
  reviewCount: number | null;
  vertical: VerticalPack | "map" | string;
  query: string;
  lat?: number | null;
  lng?: number | null;
};

/** Default map / Places bias — 11628 Cripple Creek Rd, Berry, AL 35546. */
export const MAP_HOME = {
  address: "11628 Cripple Creek Road, Berry, AL 35546",
  city: "Berry, AL",
  latitude: 33.6598,
  longitude: -87.6061,
  radiusMeters: 20_000,
} as const;

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
  "places.location",
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
    location?: { latitude?: number; longitude?: number };
  }>;
};

export function buildPlacesSearchBody(
  query: PlacesSearchQuery,
  bias: LocationBias,
  pageSize = 20,
) {
  return {
    textQuery: query.textQuery,
    locationBias: {
      circle: {
        center: {
          latitude: bias.latitude,
          longitude: bias.longitude,
        },
        radius: bias.radiusMeters,
      },
    },
    pageSize,
  };
}

export function mapPlacesResponse(
  data: PlacesTextSearchResponse,
  query: PlacesSearchQuery,
): PlaceCandidate[] {
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
    lat: place.location?.latitude ?? null,
    lng: place.location?.longitude ?? null,
  }));
}

export async function searchPlaces(
  apiKey: string,
  query: PlacesSearchQuery,
  bias: LocationBias,
): Promise<PlaceCandidate[]> {
  const body = buildPlacesSearchBody(query, bias);

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
  return mapPlacesResponse(data, query);
}

export async function discoverCandidates(
  apiKey: string,
  queries: PlacesSearchQuery[],
  bias: LocationBias,
  delayMs = 200,
): Promise<PlaceCandidate[]> {
  const byPlaceId = new Map<string, PlaceCandidate>();

  for (const query of queries) {
    const batch = await searchPlaces(apiKey, query, bias);
    for (const candidate of batch) {
      if (!candidate.placeId) continue;
      const existing = byPlaceId.get(candidate.placeId);
      if (!existing) {
        byPlaceId.set(candidate.placeId, candidate);
        continue;
      }
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

export function biasFromBounds(bounds: {
  south: number;
  west: number;
  north: number;
  east: number;
}): LocationBias {
  const latitude = (bounds.south + bounds.north) / 2;
  const longitude = (bounds.west + bounds.east) / 2;
  const latSpan = Math.abs(bounds.north - bounds.south) / 2;
  const lngSpan = Math.abs(bounds.east - bounds.west) / 2;
  const metersPerDegLat = 111_320;
  const metersPerDegLng = 111_320 * Math.cos((latitude * Math.PI) / 180);
  const radiusMeters = Math.min(
    50_000,
    Math.max(
      1_000,
      Math.hypot(latSpan * metersPerDegLat, lngSpan * metersPerDegLng),
    ),
  );
  return { latitude, longitude, radiusMeters };
}
