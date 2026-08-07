import { randomBytes } from "node:crypto";

import { getServiceRoleClient } from "@/lib/supabase/server";
import type { InvoiceRow, ClientRow } from "@/lib/admin/client-ops-queries";
import { renderInvoicePdf } from "@/lib/invoices/render-pdf";
import {
  DOCUMENT_BUCKET,
  INVOICE_BUCKET,
  downloadPrivatePdf,
  uploadPrivatePdf,
} from "@/lib/pdf/storage";

export type ViewableDoc = {
  title: string;
  bucket: string;
  storagePath: string | null;
  downloadName: string;
  externalUrl: string | null;
};

function newViewToken(): string {
  return randomBytes(24).toString("hex");
}

export async function resolveViewToken(
  token: string,
): Promise<{ doc: ViewableDoc | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { doc: null, error: "Supabase is not configured." };
  }

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("number, title, storage_path, external_url")
    .eq("view_token", token)
    .maybeSingle();

  if (invoiceError) return { doc: null, error: invoiceError.message };

  if (invoice?.storage_path || invoice?.external_url) {
    return {
      doc: {
        title: `Invoice ${invoice.number}`,
        bucket: INVOICE_BUCKET,
        storagePath: invoice.storage_path,
        downloadName: `${invoice.number}.pdf`,
        externalUrl: invoice.external_url,
      },
      error: null,
    };
  }

  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("title, storage_path, external_url")
    .eq("view_token", token)
    .maybeSingle();

  if (documentError) return { doc: null, error: documentError.message };

  if (document?.storage_path || document?.external_url) {
    return {
      doc: {
        title: document.title,
        bucket: DOCUMENT_BUCKET,
        storagePath: document.storage_path,
        downloadName: `${document.title.replace(/[^\w.-]+/g, "_") || "document"}.pdf`,
        externalUrl: document.external_url,
      },
      error: null,
    };
  }

  return { doc: null, error: null };
}

export async function ensureInvoicePdf(invoiceId: string): Promise<
  | {
      ok: true;
      invoice: InvoiceRow;
      client: ClientRow;
      viewToken: string;
    }
  | { ok: false; error: string }
> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!invoice) return { ok: false, error: "Invoice not found." };

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", invoice.client_id)
    .maybeSingle();

  if (clientError) return { ok: false, error: clientError.message };
  if (!client) return { ok: false, error: "Client not found." };

  if (invoice.storage_path && invoice.view_token) {
    return {
      ok: true,
      invoice,
      client,
      viewToken: invoice.view_token,
    };
  }

  const viewToken = invoice.view_token ?? newViewToken();
  const pdfBytes = await renderInvoicePdf({
    number: invoice.number,
    title: invoice.title,
    amount_cents: invoice.amount_cents,
    currency: invoice.currency,
    status: invoice.status,
    issued_at: invoice.issued_at,
    due_at: invoice.due_at,
    notes: invoice.notes,
    clientName: client.name,
    clientEmail: client.primary_email,
    clientCompany: client.company,
  });

  const storagePath = `${client.id}/${invoice.id}.pdf`;
  const upload = await uploadPrivatePdf(INVOICE_BUCKET, storagePath, pdfBytes);
  if (!upload.ok) return { ok: false, error: upload.error };

  const { data: updated, error: updateError } = await supabase
    .from("invoices")
    .update({
      storage_path: storagePath,
      view_token: viewToken,
      updated_at: new Date().toISOString(),
    })
    .eq("id", invoiceId)
    .select("*")
    .single();

  if (updateError || !updated) {
    return { ok: false, error: updateError?.message ?? "Update failed." };
  }

  return { ok: true, invoice: updated, client, viewToken };
}

export async function getPdfBytesForView(
  doc: ViewableDoc,
): Promise<{ bytes: Buffer; error: null } | { bytes: null; error: string }> {
  if (!doc.storagePath) {
    return { bytes: null, error: "No PDF available." };
  }

  const downloaded = await downloadPrivatePdf(doc.bucket, doc.storagePath);
  if (downloaded.error || !downloaded.data) {
    return { bytes: null, error: downloaded.error ?? "Download failed." };
  }
  return {
    bytes: Buffer.from(await downloaded.data.arrayBuffer()),
    error: null,
  };
}
