"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  type MapMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { addLeadFromMapAction } from "@/app/admin/outbound/actions";
import { Button } from "@/components/ui/button";
import { MAP_HOME, type PlaceCandidate } from "@/lib/leads/places";

export type SavedMapPin = {
  id: string;
  placeId: string;
  name: string;
  status: string;
  lat: number;
  lng: number;
  website: string | null;
  address: string | null;
};

type PreviewPin = PlaceCandidate & { lat: number; lng: number };

type Selected =
  { kind: "preview"; pin: PreviewPin } | { kind: "saved"; pin: SavedMapPin };

type Props = {
  savedPins: SavedMapPin[];
  placesConfigured: boolean;
};

const VERTICALS = [
  { id: "map", label: "Custom query" },
  { id: "trades", label: "Trades", query: "HVAC plumber electrician roofing" },
  { id: "pro", label: "Pros", query: "dentist lawyer accountant" },
  {
    id: "hospitality",
    label: "Hospitality",
    query: "restaurant salon boutique",
  },
] as const;

function statusColor(status: string): string {
  switch (status) {
    case "approved":
      return "#16a34a";
    case "ready":
      return "#2563eb";
    case "needs_email":
      return "#ca8a04";
    case "suppressed":
    case "rejected":
      return "#6b7280";
    default:
      return "#7c3aed";
  }
}

async function fetchPlaces(body: unknown): Promise<{
  places: PlaceCandidate[];
  error?: string;
  ok: boolean;
}> {
  const res = await fetch("/api/admin/outbound/map/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as {
    places?: PlaceCandidate[];
    error?: string;
  };
  return {
    ok: res.ok,
    places: data.places ?? [],
    error: data.error,
  };
}

function withGeo(places: PlaceCandidate[]): PreviewPin[] {
  return places.filter((p): p is PreviewPin => p.lat != null && p.lng != null);
}

export function OutboundMap({ savedPins, placesConfigured }: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  const [query, setQuery] = useState(`small business near ${MAP_HOME.city}`);
  const [vertical, setVertical] =
    useState<(typeof VERTICALS)[number]["id"]>("map");
  const [dropPinMode, setDropPinMode] = useState(false);
  const [preview, setPreview] = useState<PreviewPin[]>([]);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [MAP_HOME.longitude, MAP_HOME.latitude],
      zoom: 11,
    });
    map.addControl(new NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const savedIds = new Set(savedPins.map((p) => p.placeId));

    for (const marker of markersRef.current) marker.remove();
    markersRef.current = [];

    function addPin(
      lng: number,
      lat: number,
      className: string,
      color: string | null,
      title: string,
      onClick: () => void,
    ) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = className;
      if (color) el.style.backgroundColor = color;
      el.title = title;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onClick();
      });
      markersRef.current.push(
        new Marker({ element: el }).setLngLat([lng, lat]).addTo(map!),
      );
    }

    for (const pin of savedPins) {
      addPin(
        pin.lng,
        pin.lat,
        "h-3 w-3 rounded-full border border-white shadow",
        statusColor(pin.status),
        pin.name,
        () => setSelected({ kind: "saved", pin }),
      );
    }

    for (const pin of preview) {
      if (savedIds.has(pin.placeId)) continue;
      addPin(
        pin.lng,
        pin.lat,
        "h-3 w-3 rotate-45 border-2 border-white bg-orange-500 shadow",
        null,
        pin.name,
        () => setSelected({ kind: "preview", pin }),
      );
    }
  }, [savedPins, preview]);

  async function runPlacesQuery(
    body: unknown,
    failMsg: string,
  ): Promise<PreviewPin[] | null> {
    setBusy(true);
    setMessage(null);
    try {
      const data = await fetchPlaces(body);
      if (!data.ok) {
        setMessage(data.error ?? failMsg);
        return null;
      }
      return withGeo(data.places);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onClick = async (e: MapMouseEvent) => {
      if (!dropPinMode || !placesConfigured) return;
      const lat = e.lngLat.lat;
      const lng = e.lngLat.lng;
      const pins = await runPlacesQuery(
        {
          query: `business near ${lat.toFixed(4)},${lng.toFixed(4)}`,
          vertical: "map",
          bounds: {
            south: lat - 0.01,
            west: lng - 0.01,
            north: lat + 0.01,
            east: lng + 0.01,
          },
        },
        "Resolve failed.",
      );
      if (!pins) return;
      if (pins.length === 0) {
        setMessage("No Places match near that pin. Try Search this area.");
        return;
      }
      setPreview(pins);
      setSelected({ kind: "preview", pin: pins[0]! });
      setDropPinMode(false);
    };

    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
    };
  }, [dropPinMode, placesConfigured]);

  async function searchArea() {
    if (!placesConfigured) return;
    const map = mapRef.current;
    if (!map) return;

    const preset = VERTICALS.find((v) => v.id === vertical);
    const text =
      vertical !== "map" && preset && "query" in preset
        ? `${preset.query} in ${MAP_HOME.city}`
        : query.trim();
    if (!text) {
      setMessage("Enter a search query.");
      return;
    }

    const b = map.getBounds();
    const pins = await runPlacesQuery(
      {
        query: text,
        vertical,
        bounds: {
          south: b.getSouth(),
          west: b.getWest(),
          north: b.getNorth(),
          east: b.getEast(),
        },
      },
      "Search failed.",
    );
    if (!pins) {
      setPreview([]);
      return;
    }
    setPreview(pins);
    setMessage(
      pins.length
        ? `${pins.length} preview pin(s). Click one to add.`
        : "No results with coordinates.",
    );
  }

  async function addSelected() {
    if (!selected || selected.kind !== "preview") return;
    const pin = selected.pin;
    const savedIds = new Set(savedPins.map((p) => p.placeId));
    if (savedIds.has(pin.placeId)) {
      setMessage("Already in outbound queue.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const result = await addLeadFromMapAction({
        placeId: pin.placeId,
        name: pin.name,
        website: pin.website,
        phone: pin.phone,
        address: pin.address,
        vertical: pin.vertical,
        query: pin.query,
        rating: pin.rating,
        reviewCount: pin.reviewCount,
        lat: pin.lat,
        lng: pin.lng,
        email: null,
      });
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setMessage(
        result.alreadyInQueue
          ? "Already in outbound queue."
          : "Added to outbound.",
      );
      setPreview((prev) => prev.filter((p) => p.placeId !== pin.placeId));
      setSelected(null);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-[70vh] overflow-hidden rounded-lg border border-border">
      <div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center gap-2 border-b border-border bg-background/95 p-3 backdrop-blur">
        <input
          className="min-w-[12rem] flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search query"
          disabled={!placesConfigured || vertical !== "map"}
        />
        <select
          className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
          value={vertical}
          onChange={(e) =>
            setVertical(e.target.value as (typeof VERTICALS)[number]["id"])
          }
        >
          {VERTICALS.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
        <Button
          type="button"
          size="sm"
          onClick={() => void searchArea()}
          disabled={!placesConfigured || busy}
        >
          Search this area
        </Button>
        <Button
          type="button"
          size="sm"
          variant={dropPinMode ? "default" : "outline"}
          onClick={() => setDropPinMode((v) => !v)}
          disabled={!placesConfigured || busy}
        >
          {dropPinMode ? "Click map…" : "Drop pin"}
        </Button>
      </div>

      {!placesConfigured ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 p-6 text-center text-sm">
          Set <code className="font-mono">GOOGLE_PLACES_API_KEY</code> on the
          server to search and pin businesses.
        </div>
      ) : null}

      <div ref={containerRef} className="absolute inset-0 top-14" />

      {(selected || message) && (
        <div className="absolute bottom-3 left-3 right-3 z-10 max-w-md space-y-2 rounded-lg border border-border bg-background/95 p-3 text-sm shadow backdrop-blur">
          {message ? <p className="text-muted-foreground">{message}</p> : null}
          {selected ? (
            <div className="space-y-1">
              <p className="font-medium">{selected.pin.name}</p>
              {selected.pin.address ? (
                <p className="text-xs text-muted-foreground">
                  {selected.pin.address}
                </p>
              ) : null}
              {selected.pin.website ? (
                <a
                  className="text-xs underline"
                  href={selected.pin.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website
                </a>
              ) : null}
              {selected.kind === "saved" ? (
                <p className="text-xs text-muted-foreground">
                  In queue · {selected.pin.status}
                </p>
              ) : savedPins.some((p) => p.placeId === selected.pin.placeId) ? (
                <p className="text-xs text-muted-foreground">In queue</p>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="mt-2"
                  onClick={() => void addSelected()}
                  disabled={busy}
                >
                  Add to outbound
                </Button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
