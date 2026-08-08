import { describe, expect, it } from "vitest";

import {
  biasFromBounds,
  buildPlacesSearchBody,
  mapPlacesResponse,
} from "./places";

describe("places helpers", () => {
  it("builds locationBias from injectable center", () => {
    const body = buildPlacesSearchBody(
      { textQuery: "plumber in Berry, AL", vertical: "trades" },
      { latitude: 33.66, longitude: -87.61, radiusMeters: 15_000 },
    );
    expect(body.locationBias.circle.center.latitude).toBe(33.66);
    expect(body.locationBias.circle.radius).toBe(15_000);
    expect(body.textQuery).toContain("plumber");
  });

  it("maps Places response including lat/lng", () => {
    const rows = mapPlacesResponse(
      {
        places: [
          {
            id: "places/abc",
            displayName: { text: "Acme HVAC" },
            formattedAddress: "1 Main St",
            location: { latitude: 33.65, longitude: -87.6 },
            websiteUri: "https://example.com",
            rating: 4.2,
            userRatingCount: 10,
          },
        ],
      },
      { textQuery: "HVAC", vertical: "trades" },
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]?.placeId).toBe("places/abc");
    expect(rows[0]?.lat).toBe(33.65);
    expect(rows[0]?.lng).toBe(-87.6);
    expect(rows[0]?.name).toBe("Acme HVAC");
  });

  it("derives bias from map bounds", () => {
    const bias = biasFromBounds({
      south: 33.6,
      west: -87.7,
      north: 33.7,
      east: -87.5,
    });
    expect(bias.latitude).toBeCloseTo(33.65);
    expect(bias.longitude).toBeCloseTo(-87.6);
    expect(bias.radiusMeters).toBeGreaterThan(1000);
    expect(bias.radiusMeters).toBeLessThanOrEqual(50_000);
  });
});
