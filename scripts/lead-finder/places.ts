import { NORTHPORT_AL } from "./categories";
import type { CategoryQuery, PlaceCandidate } from "./types";
import {
  discoverCandidates as discoverShared,
  searchPlaces as searchShared,
} from "../../src/lib/leads/places";

export { parseVerticals } from "../../src/lib/leads/places";

const NORTHPORT_BIAS = {
  latitude: NORTHPORT_AL.latitude,
  longitude: NORTHPORT_AL.longitude,
  radiusMeters: NORTHPORT_AL.radiusMeters,
};

export async function searchPlaces(
  apiKey: string,
  query: CategoryQuery,
): Promise<PlaceCandidate[]> {
  return searchShared(
    apiKey,
    { textQuery: query.textQuery, vertical: query.vertical },
    NORTHPORT_BIAS,
  );
}

export async function discoverCandidates(
  apiKey: string,
  queries: CategoryQuery[],
  delayMs = 200,
): Promise<PlaceCandidate[]> {
  return discoverShared(
    apiKey,
    queries.map((q) => ({ textQuery: q.textQuery, vertical: q.vertical })),
    NORTHPORT_BIAS,
    delayMs,
  );
}
