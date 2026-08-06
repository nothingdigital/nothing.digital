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
  updateClient,
  updateClientAssetStatus,
  updateInvoice,
  updateInvoiceStatus,
  updateWorkItem,
  updateWorkItemStatus,
} from "@/lib/admin/client-ops-queries";

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

export async function createClientAction(formData: FormData): Promise<void> {
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

  const result = await createClient({
    name,
    primary_email,
    company: formOptional(formData, "company"),
    status,
    billing_model,
    default_rate_cents,
    payment_terms: formOptional(formData, "payment_terms") ?? "net_15",
    notes: formOptional(formData, "notes"),
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

  const client_id = formString(formData, "client_id");
  const number = formString(formData, "number");
  const title = formString(formData, "title");
  const status = formString(formData, "status");
  const amount_cents = dollarsToCents(formString(formData, "amount"));

  if (!client_id || !number || !title) {
    throw new Error("Client, number, and title required.");
  }
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

  const result = await createInvoice({
    client_id,
    number,
    title,
    amount_cents,
    currency: formOptional(formData, "currency") ?? "USD",
    status,
    issued_at: dateOrNull(formOptional(formData, "issued_at")),
    due_at: dateOrNull(formOptional(formData, "due_at")),
    paid_at,
    external_url: formOptional(formData, "external_url"),
    notes: formOptional(formData, "notes"),
  });

  if (result.error || !result.row) {
    throw new Error(result.error ?? "Create failed.");
  }

  revalidatePath("/admin/billing");
  revalidatePath(`/admin/clients/${client_id}`);
  redirect(`/admin/clients/${client_id}?tab=billing`);
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
  const client_id = formString(formData, "client_id");
  const number = formString(formData, "number");
  const title = formString(formData, "title");
  const status = formString(formData, "status");
  const amount_cents = dollarsToCents(formString(formData, "amount"));

  if (!id || !client_id || !number || !title) {
    throw new Error("Invoice, client, number, and title required.");
  }
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

  const result = await updateInvoice(id, {
    number,
    title,
    amount_cents,
    currency: formOptional(formData, "currency") ?? "USD",
    status,
    issued_at: dateOrNull(formOptional(formData, "issued_at")),
    due_at: dateOrNull(formOptional(formData, "due_at")),
    paid_at,
    external_url: formOptional(formData, "external_url"),
    notes: formOptional(formData, "notes"),
  });

  if (!result.ok) {
    throw new Error(result.error);
  }

  revalidatePath("/admin/billing");
  revalidatePath(`/admin/clients/${client_id}`);
  redirect(`/admin/clients/${client_id}?tab=billing`);
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

  const result = await updateInvoiceStatus(id, status);
  if (result.ok) {
    revalidatePath("/admin/billing");
    if (clientId) revalidatePath(`/admin/clients/${clientId}`);
  }
  return result;
}

export async function createAssetAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const client_id = formString(formData, "client_id");
  const type = formString(formData, "type");
  const name = formString(formData, "name");
  const env = formString(formData, "env");
  const status = formString(formData, "status");
  const managed_by_us = formData.get("managed_by_us") === "on";

  if (!client_id || !name) {
    throw new Error("Client and name are required.");
  }
  if (!isAssetType(type) || !isAssetEnv(env) || !isAssetStatus(status)) {
    throw new Error("Invalid asset fields.");
  }

  const result = await createClientAsset({
    client_id,
    type,
    name,
    url: formOptional(formData, "url"),
    env,
    managed_by_us,
    notes: formOptional(formData, "notes"),
    status,
  });

  if (result.error || !result.row) {
    throw new Error(result.error ?? "Create failed.");
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

  const client_id = formString(formData, "client_id");
  const title = formString(formData, "title");
  const status = formString(formData, "status");
  const priority = formString(formData, "priority");
  const asset_id = formOptional(formData, "asset_id");

  if (!client_id || !title) {
    throw new Error("Client and title are required.");
  }
  if (!isWorkStatus(status) || !isWorkPriority(priority)) {
    throw new Error("Invalid work fields.");
  }

  const result = await createWorkItem({
    client_id,
    asset_id,
    title,
    description: formOptional(formData, "description"),
    status,
    priority,
    due_at: dateOrNull(formOptional(formData, "due_at")),
  });

  if (result.error || !result.row) {
    throw new Error(result.error ?? "Create failed.");
  }

  revalidatePath("/admin/work");
  revalidatePath(`/admin/clients/${client_id}`);
  redirect(`/admin/clients/${client_id}?tab=work`);
}

export async function updateWorkItemAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formString(formData, "id");
  const client_id = formString(formData, "client_id");
  const title = formString(formData, "title");
  const status = formString(formData, "status");
  const priority = formString(formData, "priority");
  const asset_id = formOptional(formData, "asset_id");

  if (!id || !client_id || !title) {
    throw new Error("Work item, client, and title are required.");
  }
  if (!isWorkStatus(status) || !isWorkPriority(priority)) {
    throw new Error("Invalid work fields.");
  }

  const result = await updateWorkItem(id, {
    title,
    description: formOptional(formData, "description"),
    status,
    priority,
    due_at: dateOrNull(formOptional(formData, "due_at")),
    asset_id,
  });

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
