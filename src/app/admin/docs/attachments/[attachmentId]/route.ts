import { requireAdmin } from "@/lib/admin/auth";
import { getAttachment } from "@/lib/kb/queries";
import { downloadKbFile } from "@/lib/kb/storage";

export async function GET(
  _request: Request,
  context: { params: Promise<{ attachmentId: string }> },
) {
  await requireAdmin();
  const { attachmentId } = await context.params;

  const { row, error } = await getAttachment(attachmentId);
  if (error || !row) {
    return new Response(error ?? "Not found", { status: 404 });
  }

  const downloaded = await downloadKbFile(row.storage_path);
  if (downloaded.error || !downloaded.data) {
    return new Response(downloaded.error ?? "Download failed", { status: 500 });
  }

  const bytes = Buffer.from(await downloaded.data.arrayBuffer());
  return new Response(bytes, {
    headers: {
      "Content-Type": row.mime ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${row.filename.replace(/"/g, "")}"`,
    },
  });
}
