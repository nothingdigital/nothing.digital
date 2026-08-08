import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin/auth";
import { buildInstantlyCsv } from "@/lib/admin/outbound/instantly-csv";
import { listLeadCandidates } from "@/lib/admin/outbound/queries";

export async function GET() {
  const { error: authError } = await requireAdminApi();
  if (authError) return authError;

  const { rows, error } = await listLeadCandidates({ status: "approved" });
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const csv = buildInstantlyCsv(rows);

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
