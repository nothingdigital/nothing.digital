import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminApi } from "@/lib/admin/auth";
import { env } from "@/lib/env";
import { biasFromBounds, MAP_HOME, searchPlaces } from "@/lib/leads/places";

const bodySchema = z.object({
  query: z.string().trim().min(1).max(200),
  vertical: z
    .enum(["trades", "pro", "hospitality", "map"])
    .optional()
    .default("map"),
  bounds: z
    .object({
      south: z.number(),
      west: z.number(),
      north: z.number(),
      east: z.number(),
    })
    .optional(),
});

export async function POST(request: Request) {
  const { error: authError } = await requireAdminApi();
  if (authError) return authError;

  const apiKey = env.private.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Set GOOGLE_PLACES_API_KEY on the server to search the map." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid search payload." },
      { status: 400 },
    );
  }

  const bias = parsed.data.bounds
    ? biasFromBounds(parsed.data.bounds)
    : {
        latitude: MAP_HOME.latitude,
        longitude: MAP_HOME.longitude,
        radiusMeters: MAP_HOME.radiusMeters,
      };

  try {
    const places = await searchPlaces(
      apiKey,
      { textQuery: parsed.data.query, vertical: parsed.data.vertical },
      bias,
    );
    return NextResponse.json({ places });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Places search failed.";
    console.error("[outbound/map/search]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
