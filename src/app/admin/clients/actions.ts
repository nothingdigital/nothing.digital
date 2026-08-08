"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import {
  isAssetEnv,
  isAssetStatus,
  isAssetType,
  isBillingModel,
  isClientStatus,
  isInvoiceStatus,
  isWorkPriority,
  isWorkStatus,
} from "@/lib/admin/client-ops";
import {
  createClient,
  createClientAsset,
  createInvoice,
  createWorkItem,
  deleteWorkItem,
  getInvoice,
  updateClient,
  updateClientAsset,
  updateClientAssetStatus,
  updateInvoice,
  updateInvoiceSentEmailedAt,
  updateInvoiceStatus,
  updateWorkItem,
  updateWorkItemStatus,
} from "@/lib/admin/client-ops-queries";
import {
  createDocumentWithUpload,
  isDocumentKind,
} from "@/lib/documents/queries";
import { draftInvoiceCoverNote, isAiEnabled } from "@/lib/ai";
import { aiDraftError, guardAdminAiDraft } from "@/lib/ai/admin-guard";
import { invoiceCoverSchema } from "@/lib/ai/types";
import { buildInvoiceEmailContext } from "@/lib/invoices/invoice-email-context";
import { sendInvoiceSentEmail } from "@/lib/invoices/send-invoice-email";
import { ensureInvoicePdf } from "@/lib/pdf/resolve-view";
import { getServiceRoleClient } from "@/lib/supabase/server";

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function formOptional(formData: FormData, key: string): string | null {
  const value = formString(formData, key);
  return value.length > 0 ? value : null;
}

function dollarsToCents(raw: string): number | null {
  const cleaned = raw.replace(/[$,]/g, "").trim();
  if (!cleaned) return null;
  const dollars = Number.parseFloat(cleaned);
  if (!Number.isFinite(dollars) || dollars < 0) return null;
  return Math.round(dollars * 100);
}

function dateOrNull(raw: string | null): string | null {
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function parseInvoiceForm(formData: FormData) {
  const client_id = formString(formData, "client_id");
  const number = formString(formData, "number");
  const title = formString(formData, "title");
  const status = formString(formData, "status");
  const amount_cents = dollarsToCents(formString(formData, "amount"));

  if (amount_cents === null) {
    throw new Error("Invalid amount.");
  }
  if (!isInvoiceStatus(status)) {
    throw new Error("Invalid invoice status.");
  }

  const paid_at =
    status === "paid"
      ? (dateOrNull(formOptional(formData, "paid_at")) ??
        new Date().toISOString())
      : null;

  return {
    client_id,
    number,
    title,
    status,
    amount_cents,
    currency: formOptional(formData, "currency") ?? "USD",
    issued_at: dateOrNull(formOptional(formData, "issued_at")),
    due_at: dateOrNull(formOptional(formData, "due_at")),
    paid_at,
    external_url: formOptional(formData, "external_url"),
    notes: formOptional(formData, "notes"),
  };
}

function parseAssetForm(formData: FormData) {
  const type = formString(formData, "type");
  const name = formString(formData, "name");
  const env = formString(formData, "env");
  const status = formString(formData, "status");

  if (!isAssetType(type) || !isAssetEnv(env) || !isAssetStatus(status)) {
    throw new Error("Invalid asset fields.");
  }

  return {
    client_id: formString(formData, "client_id"),
    id: formString(formData, "id"),
    type,
    name,
    env,
    status,
    managed_by_us: formData.get("managed_by_us") === "on",
    url: formOptional(formData, "url"),
    monitor_url: formOptional(formData, "monitor_url"),
    notes: formOptional(formData, "notes"),
  };
}

function parseWorkForm(formData: FormData) {
  const status = formString(formData, "status");
  const priority = formString(formData, "priority");

  if (!isWorkStatus(status) || !isWorkPriority(priority)) {
    throw new Error("Invalid work fields.");
  }

  return {
    id: formString(formData, "id"),
    client_id: formString(formData, "client_id"),
    title: formString(formData, "title"),
    status,
    priority,
    asset_id: formOptional(formData, "asset_id"),
    description: formOptional(formData, "description"),
    due_at: dateOrNull(formOptional(formData, "due_at")),
  };
}

async function autoSendIfNewlySent(
  invoiceId: string,
  status: string,
  previousStatus?: string | null,
): Promise<void> {
  if (status !== "sent" || previousStatus === "sent") return;
  if (isAiEnabled()) return;
  const result = await sendPendingInvoiceEmailAction(invoiceId);
  if (!result.ok) {
    console.warn("[invoice-email] send failed:", result.error);
  }
}

export async function createClientAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const name = formString(formData, "name");
  const primary_email = formString(formData, "primary_email");
  const status = formString(formData, "status");
  const billing_model = formString(formData, "billing_model");
  const is_founding = formData.get("is_founding") === "on";

  if (!name || !primary_email) {
    throw new Error("Name and email are required.");
  }
  if (!isClientStatus(status) || !isBillingModel(billing_model)) {
    throw new Error("Invalid status or billing model.");
  }

  if (is_founding) {
    const { count } = (await getServiceRoleClient()
      ?.from("clients")
      .select("*", { count: "exact", head: true })
      .eq("is_founding", true)) ?? { count: 0 };
    if ((count ?? 0) >= 2) {
      throw new Error("Founding client quota reached (max 2).");
    }
  }

  const rateRaw = formOptional(formData, "default_rate");
  const default_rate_cents = rateRaw ? dollarsToCents(rateRaw) : null;
  if (rateRaw && default_rate_cents === null) {
    throw new Error("Invalid default rate.");
  }

  const care_start = is_founding ? new Date().toISOString() : null;
  const care_end = is_founding
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const result = await createClient({
    name,
    primary_email,
    company: formOptional(formData, "company"),
    status,
    billing_model,
    default_rate_cents,
    payment_terms: formOptional(formData, "payment_terms") ?? "net_15",
    notes: formOptional(formData, "notes"),
    is_founding,
    care_start,
    care_end,
  });

  if (result.error || !result.row) {
    throw new Error(result.error ?? "Create failed.");
  }

  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${result.row.id}`);
}

export async function updateClientAction(
  clientId: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const name = formString(formData, "name");
  const primary_email = formString(formData, "primary_email");
  const status = formString(formData, "status");
  const billing_model = formString(formData, "billing_model");

  if (!name || !primary_email) {
    throw new Error("Name and email are required.");
  }
  if (!isClientStatus(status) || !isBillingModel(billing_model)) {
    throw new Error("Invalid status or billing model.");
  }

  const rateRaw = formOptional(formData, "default_rate");
  const default_rate_cents = rateRaw ? dollarsToCents(rateRaw) : null;
  if (rateRaw && default_rate_cents === null) {
    throw new Error("Invalid default rate.");
  }

  const result = await updateClient(clientId, {
    name,
    primary_email,
    company: formOptional(formData, "company"),
    status,
    billing_model,
    default_rate_cents,
    payment_terms: formOptional(formData, "payment_terms") ?? "net_15",
    notes: formOptional(formData, "notes"),
  });

  if (!result.ok) {
    throw new Error(result.error);
  }

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function createInvoiceAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = parseInvoiceForm(formData);
  if (!parsed.client_id || !parsed.number || !parsed.title) {
    throw new Error("Client, number, and title required.");
  }

  const result = await createInvoice(parsed);

  if (result.error || !result.row) {
    throw new Error(result.error ?? "Create failed.");
  }

  await autoSendIfNewlySent(result.row.id, parsed.status);

  revalidatePath("/admin/billing");
  revalidatePath(`/admin/clients/${parsed.client_id}`);
  redirect(`/admin/clients/${parsed.client_id}?tab=billing`);
}

export async function startNewInvoiceAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const client_id = formString(formData, "client_id");
  if (!client_id) {
    throw new Error("Client is required.");
  }

  redirect(`/admin/clients/${client_id}/invoices/new`);
}

export async function updateInvoiceAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formString(formData, "id");
  const parsed = parseInvoiceForm(formData);
  if (!id || !parsed.client_id || !parsed.number || !parsed.title) {
    throw new Error("Invoice, client, number, and title required.");
  }

  const prior = await getInvoice(id);
  const previousStatus = prior.row?.status ?? null;

  const { client_id: _clientId, ...fields } = parsed;
  const result = await updateInvoice(id, fields);

  if (!result.ok) {
    throw new Error(result.error);
  }

  await autoSendIfNewlySent(id, parsed.status, previousStatus);

  revalidatePath("/admin/billing");
  revalidatePath(`/admin/clients/${parsed.client_id}`);
  redirect(`/admin/clients/${parsed.client_id}?tab=billing`);
}

export async function updateInvoiceStatusAction(
  id: string,
  status: string,
  clientId?: string,
) {
  await requireAdmin();

  if (!isInvoiceStatus(status)) {
    return { ok: false as const, error: "Invalid status." };
  }

  const existing = await getInvoice(id);
  if (existing.error || !existing.row) {
    return { ok: false as const, error: existing.error ?? "Not found." };
  }

  const previousStatus = existing.row.status;
  const result = await updateInvoiceStatus(id, status);
  if (!result.ok) return result;

  await autoSendIfNewlySent(id, status, previousStatus);

  revalidatePath("/admin/billing");
  if (clientId) revalidatePath(`/admin/clients/${clientId}`);
  return result;
}

export async function draftInvoiceCoverAction(invoiceId: string) {
  const user = await requireAdmin();

  if (!isAiEnabled()) {
    return { ok: false as const, error: "Invoice cover AI is disabled." };
  }

  const gated = await guardAdminAiDraft("invoice-cover", user);
  if (!gated.ok) return gated;

  const built = await buildInvoiceEmailContext(invoiceId);
  if (!built.ok) {
    return { ok: false as const, error: built.error };
  }
  if (built.context.sentEmailedAt) {
    return { ok: false as const, error: "Already emailed." };
  }

  try {
    const draft = await draftInvoiceCoverNote(built.context.coverFacts);
    return { ok: true as const, draft };
  } catch (err) {
    return { ok: false as const, error: aiDraftError(err) };
  }
}

/** Send pending invoice email. With `cover`: HITL path (flag required). Without: flag-off flush. */
export async function sendPendingInvoiceEmailAction(
  invoiceId: string,
  cover?: { subject: string; coverNote: string },
) {
  await requireAdmin();

  let subject: string | undefined;
  let coverNote: string | undefined;
  if (cover) {
    if (!isAiEnabled()) {
      return { ok: false as const, error: "Invoice cover AI is disabled." };
    }
    const parsed = invoiceCoverSchema.safeParse(cover);
    if (!parsed.success) {
      return { ok: false as const, error: "Invalid subject or cover note." };
    }
    subject = parsed.data.subject;
    coverNote = parsed.data.coverNote;
  }

  const built = await buildInvoiceEmailContext(invoiceId);
  if (!built.ok) {
    return { ok: false as const, error: built.error };
  }
  if (built.context.status !== "sent") {
    return { ok: false as const, error: "Invoice is not marked sent." };
  }
  if (built.context.sentEmailedAt) {
    return { ok: false as const, error: "Already emailed." };
  }

  const sent = await sendInvoiceSentEmail({
    to: built.context.to,
    clientName: built.context.clientName,
    number: built.context.number,
    title: built.context.title,
    amount_cents: built.context.amount_cents,
    currency: built.context.currency,
    due_at: built.context.due_at,
    viewUrl: built.context.viewUrl,
    ...(subject !== undefined && coverNote !== undefined
      ? { subject, coverNote }
      : {}),
  });

  if (!sent.ok) {
    return { ok: false as const, error: sent.error };
  }

  const stamped = await updateInvoiceSentEmailedAt(invoiceId);
  revalidatePath("/admin/billing");
  const invoice = await getInvoice(invoiceId);
  if (invoice.row) {
    revalidatePath(`/admin/clients/${invoice.row.client_id}`);
  }

  if (!stamped.ok) {
    return {
      ok: true as const,
      stampWarning:
        stamped.error ??
        "Email sent, but sent_emailed_at was not saved. Do not retry — check Resend and stamp manually.",
    };
  }

  return { ok: true as const };
}

export async function generateInvoicePdfAction(
  invoiceId: string,
  clientId: string,
): Promise<void> {
  await requireAdmin();

  const generated = await ensureInvoicePdf(invoiceId);
  if (!generated.ok) {
    throw new Error(generated.error);
  }

  revalidatePath("/admin/billing");
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath(`/admin/clients/${clientId}/invoices/${invoiceId}/edit`);
}

export async function createDocumentAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const client_id = formString(formData, "client_id");
  const title = formString(formData, "title");
  const kind = formString(formData, "kind");
  const file = formData.get("file");

  if (!client_id || !title) {
    throw new Error("Client and title are required.");
  }
  if (!isDocumentKind(kind)) {
    throw new Error("Invalid document kind.");
  }

  let fileBytes: Buffer | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > 15 * 1024 * 1024) {
      throw new Error("PDF must be under 15MB.");
    }
    const type = file.type || "";
    if (type && type !== "application/pdf") {
      throw new Error("Only PDF uploads are supported.");
    }
    fileBytes = Buffer.from(await file.arrayBuffer());
  }

  const result = await createDocumentWithUpload({
    client_id,
    title,
    kind,
    notes: formOptional(formData, "notes"),
    external_url: formOptional(formData, "external_url"),
    fileBytes,
  });

  if (result.error || !result.row) {
    throw new Error(result.error ?? "Create failed.");
  }

  revalidatePath(`/admin/clients/${client_id}`);
  redirect(`/admin/clients/${client_id}?tab=files`);
}

export async function createAssetAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = parseAssetForm(formData);
  if (!parsed.client_id || !parsed.name) {
    throw new Error("Client and name are required.");
  }

  const { id: _id, ...fields } = parsed;
  const result = await createClientAsset(fields);

  if (result.error || !result.row) {
    throw new Error(result.error ?? "Create failed.");
  }

  revalidatePath(`/admin/clients/${parsed.client_id}`);
  redirect(`/admin/clients/${parsed.client_id}?tab=assets`);
}

export async function updateAssetAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = parseAssetForm(formData);
  if (!parsed.id || !parsed.client_id || !parsed.name) {
    throw new Error("Asset, client, and name are required.");
  }

  const { client_id, ...fields } = parsed;
  const result = await updateClientAsset(fields);

  if (!result.ok) {
    throw new Error(result.error);
  }

  revalidatePath(`/admin/clients/${client_id}`);
  redirect(`/admin/clients/${client_id}?tab=assets`);
}

export async function updateAssetStatusAction(
  id: string,
  status: string,
  clientId: string,
) {
  await requireAdmin();
  if (!isAssetStatus(status)) {
    return { ok: false as const, error: "Invalid status." };
  }
  const result = await updateClientAssetStatus(id, status);
  if (result.ok) revalidatePath(`/admin/clients/${clientId}`);
  return result;
}

export async function createWorkItemAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = parseWorkForm(formData);
  if (!parsed.client_id || !parsed.title) {
    throw new Error("Client and title are required.");
  }

  const { id: _id, ...fields } = parsed;
  const result = await createWorkItem(fields);

  if (result.error || !result.row) {
    throw new Error(result.error ?? "Create failed.");
  }

  revalidatePath("/admin/work");
  revalidatePath(`/admin/clients/${parsed.client_id}`);
  redirect(`/admin/clients/${parsed.client_id}?tab=work`);
}

export async function updateWorkItemAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const parsed = parseWorkForm(formData);
  if (!parsed.id || !parsed.client_id || !parsed.title) {
    throw new Error("Work item, client, and title are required.");
  }

  const { id, client_id, ...fields } = parsed;
  const result = await updateWorkItem(id, fields);

  if (!result.ok) {
    throw new Error(result.error);
  }

  revalidatePath("/admin/work");
  revalidatePath(`/admin/clients/${client_id}`);
  redirect(`/admin/clients/${client_id}?tab=work`);
}

export async function deleteWorkItemAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formString(formData, "id");
  const client_id = formString(formData, "client_id");

  if (!id || !client_id) {
    throw new Error("Work item and client are required.");
  }

  const result = await deleteWorkItem(id);
  if (!result.ok) {
    throw new Error(result.error);
  }

  revalidatePath("/admin/work");
  revalidatePath(`/admin/clients/${client_id}`);
  redirect(`/admin/clients/${client_id}?tab=work`);
}

export async function updateWorkItemStatusAction(
  id: string,
  status: string,
  clientId?: string,
) {
  await requireAdmin();
  if (!isWorkStatus(status)) {
    return { ok: false as const, error: "Invalid status." };
  }
  const result = await updateWorkItemStatus(id, status);
  if (result.ok) {
    revalidatePath("/admin/work");
    if (clientId) revalidatePath(`/admin/clients/${clientId}`);
  }
  return result;
}
