import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { buildInstantlyCsv } from "@/lib/admin/outbound/instantly-csv";
import { listLeadCandidates } from "@/lib/admin/outbound/queries";
import { isOutboundPersonalizationEnabled } from "@/lib/ai";

export async function GET() {
  await requireAdmin();

  const { rows, error } = await listLeadCandidates({ status: "approved" });
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const csv = buildInstantlyCsv(
    rows.map((row) => ({
      email: row.email,
      name: row.name,
      website: row.website,
      phone: row.phone,
      city: row.city,
      score: row.score,
      reasons: row.reasons,
      status: row.status,
      personalization: row.personalization,
    })),
    isOutboundPersonalizationEnabled(),
  );

  const date = new Date().toISOString().slice(0, 10);
  const filename = `instantly-import-${date}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
