import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminToolLinks } from "@/lib/admin/config";

export const metadata: Metadata = {
  title: "Bookings",
  robots: { index: false, follow: false },
};

export default async function AdminBookingsPage() {
  await requireAdmin();
  const { calendly } = getAdminToolLinks();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Bookings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Calendly stays the source of truth until booking volume needs a table.
        </p>
      </div>

      {calendly ? (
        <a
          href={calendly}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Open Calendly dashboard
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">
          Set `NEXT_PUBLIC_CALENDLY_URL` to link your scheduling page here.
        </p>
      )}
    </div>
  );
}
