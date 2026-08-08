import type { Metadata } from "next";
import Link from "next/link";

import { OutboundMap, type SavedMapPin } from "@/components/admin/outbound-map";
import { Button } from "@/components/ui/button";
import { listLeadCandidates } from "@/lib/admin/outbound/queries";
import { MAP_HOME } from "@/lib/leads/places";

export const metadata: Metadata = {
  title: "Outbound map",
  robots: { index: false, follow: false },
};

export default async function AdminOutboundMapPage() {
  const { rows, error } = await listLeadCandidates({ withGeo: true });
  const placesConfigured = Boolean(process.env.GOOGLE_PLACES_API_KEY?.trim());

  const savedPins: SavedMapPin[] = (error ? [] : rows)
    .filter((row) => row.lat != null && row.lng != null)
    .map((row) => ({
      id: row.id,
      placeId: row.place_id,
      name: row.name,
      status: row.status,
      lat: row.lat as number,
      lng: row.lng as number,
      website: row.website,
      address: row.address,
    }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Outbound map</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search local businesses near {MAP_HOME.address}, pin them into the
            outbound queue, then approve on the list for Instantly CSV.
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/outbound">Back to outbound list</Link>
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <OutboundMap savedPins={savedPins} placesConfigured={placesConfigured} />
    </div>
  );
}
