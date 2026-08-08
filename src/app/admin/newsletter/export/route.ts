import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/admin/auth";
import { buildNewsletterCsv } from "@/lib/admin/newsletter-csv";
import { listNewsletterSubscribers } from "@/lib/admin/queries";

export async function GET() {
  const { error: authError } = await requireAdminApi();
  if (authError) return authError;

  const { rows, error } = await listNewsletterSubscribers();
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const csv = buildNewsletterCsv(rows);
  const date = new Date().toISOString().slice(0, 10);
  const filename = `newsletter-subscribers-${date}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
