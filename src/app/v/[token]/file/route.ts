import { NextResponse } from "next/server";

import { getPdfBytesForView, resolveViewToken } from "@/lib/pdf/resolve-view";

export async function GET(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const { searchParams } = new URL(request.url);
  const download = searchParams.get("download") === "1";

  const { doc, error } = await resolveViewToken(token);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!doc.storagePath && doc.externalUrl) {
    return NextResponse.redirect(doc.externalUrl);
  }

  const result = await getPdfBytesForView(doc);
  if (result.error || !result.bytes) {
    return NextResponse.json(
      { error: result.error ?? "Missing file" },
      { status: 404 },
    );
  }

  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Cache-Control": "private, max-age=60",
    "Content-Length": String(result.bytes.byteLength),
  });

  if (download) {
    headers.set(
      "Content-Disposition",
      `attachment; filename="${doc.downloadName}"`,
    );
  } else {
    headers.set(
      "Content-Disposition",
      `inline; filename="${doc.downloadName}"`,
    );
  }

  return new NextResponse(new Uint8Array(result.bytes), {
    status: 200,
    headers,
  });
}
