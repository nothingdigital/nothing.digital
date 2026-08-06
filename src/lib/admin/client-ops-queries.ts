import { getServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database";
import type {
  AssetEnv,
  AssetStatus,
  AssetType,
  BillingModel,
  ClientStatus,
  InvoiceStatus,
  WorkPriority,
  WorkStatus,
} from "./client-ops";

export type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
export type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
export type ClientAssetRow =
  Database["public"]["Tables"]["client_assets"]["Row"];
export type ClientWorkItemRow =
  Database["public"]["Tables"]["client_work_items"]["Row"];

export type InvoiceWithClient = InvoiceRow & {
  clients: Pick<ClientRow, "id" | "name"> | null;
};

export type WorkItemWithClient = ClientWorkItemRow & {
  clients: Pick<ClientRow, "id" | "name"> | null;
};

function notConfigured<T>(): { rows: T[]; error: string } {
  return { rows: [], error: "Supabase is not configured." };
}

export async function listClients(filters?: {
  status?: ClientStatus;
  q?: string;
}): Promise<{ rows: ClientRow[]; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured();

  let query = supabase
    .from("clients")
    .select("*")
    .order("name", { ascending: true });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.q?.trim()) {
    const q = filters.q.trim();
    query = query.or(
      `name.ilike.%${q}%,primary_email.ilike.%${q}%,company.ilike.%${q}%`,
    );
  }

  const { data, error } = await query;
  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function getClient(
  id: string,
): Promise<{ row: ClientRow | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { row: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}

export type CreateClientInput = {
  name: string;
  primary_email: string;
  company?: string | null;
  status: ClientStatus;
  billing_model: BillingModel;
  default_rate_cents?: number | null;
  payment_terms?: string | null;
  notes?: string | null;
};

export async function createClient(
  input: CreateClientInput,
): Promise<{ row: ClientRow | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { row: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: input.name,
      primary_email: input.primary_email,
      company: input.company ?? null,
      status: input.status,
      billing_model: input.billing_model,
      default_rate_cents: input.default_rate_cents ?? null,
      payment_terms: input.payment_terms ?? "net_15",
      notes: input.notes ?? null,
    })
    .select("*")
    .single();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}

export async function updateClient(
  id: string,
  input: Partial<CreateClientInput>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("clients")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function listInvoices(filters?: {
  clientId?: string;
  status?: InvoiceStatus;
}): Promise<{ rows: InvoiceWithClient[]; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured();

  let query = supabase
    .from("invoices")
    .select("*, clients(id, name)")
    .order("created_at", { ascending: false });

  if (filters?.clientId) {
    query = query.eq("client_id", filters.clientId);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error) return { rows: [], error: error.message };
  return { rows: (data as InvoiceWithClient[]) ?? [], error: null };
}

export async function listClientInvoices(
  clientId: string,
): Promise<{ rows: InvoiceRow[]; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export type CreateInvoiceInput = {
  client_id: string;
  number: string;
  title: string;
  amount_cents: number;
  currency?: string;
  status: InvoiceStatus;
  issued_at?: string | null;
  due_at?: string | null;
  paid_at?: string | null;
  external_url?: string | null;
  notes?: string | null;
};

export async function createInvoice(
  input: CreateInvoiceInput,
): Promise<{ row: InvoiceRow | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { row: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      client_id: input.client_id,
      number: input.number,
      title: input.title,
      amount_cents: input.amount_cents,
      currency: input.currency ?? "USD",
      status: input.status,
      issued_at: input.issued_at ?? null,
      due_at: input.due_at ?? null,
      paid_at: input.paid_at ?? null,
      external_url: input.external_url ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const patch: Database["public"]["Tables"]["invoices"]["Update"] = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "paid") {
    patch.paid_at = new Date().toISOString();
  }

  const { error } = await supabase.from("invoices").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function listClientAssets(
  clientId: string,
): Promise<{ rows: ClientAssetRow[]; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured();

  const { data, error } = await supabase
    .from("client_assets")
    .select("*")
    .eq("client_id", clientId)
    .order("name", { ascending: true });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export type CreateAssetInput = {
  client_id: string;
  type: AssetType;
  name: string;
  url?: string | null;
  env: AssetEnv;
  managed_by_us: boolean;
  notes?: string | null;
  status: AssetStatus;
};

export async function createClientAsset(
  input: CreateAssetInput,
): Promise<{ row: ClientAssetRow | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { row: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("client_assets")
    .insert({
      client_id: input.client_id,
      type: input.type,
      name: input.name,
      url: input.url ?? null,
      env: input.env,
      managed_by_us: input.managed_by_us,
      notes: input.notes ?? null,
      status: input.status,
    })
    .select("*")
    .single();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}

export async function updateClientAssetStatus(
  id: string,
  status: AssetStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("client_assets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function listClientWorkItems(
  clientId: string,
): Promise<{ rows: ClientWorkItemRow[]; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured();

  const { data, error } = await supabase
    .from("client_work_items")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function listWorkItems(filters?: {
  status?: WorkStatus;
}): Promise<{ rows: WorkItemWithClient[]; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured();

  let query = supabase
    .from("client_work_items")
    .select("*, clients(id, name)")
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  } else {
    query = query.neq("status", "done");
  }

  const { data, error } = await query;
  if (error) return { rows: [], error: error.message };
  return { rows: (data as WorkItemWithClient[]) ?? [], error: null };
}

export type CreateWorkItemInput = {
  client_id: string;
  asset_id?: string | null;
  title: string;
  description?: string | null;
  status: WorkStatus;
  priority: WorkPriority;
  due_at?: string | null;
};

export async function createWorkItem(
  input: CreateWorkItemInput,
): Promise<{ row: ClientWorkItemRow | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { row: null, error: "Supabase is not configured." };
  }

  const { data, error } = await supabase
    .from("client_work_items")
    .insert({
      client_id: input.client_id,
      asset_id: input.asset_id ?? null,
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      priority: input.priority,
      due_at: input.due_at ?? null,
    })
    .select("*")
    .single();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}

export async function updateWorkItemStatus(
  id: string,
  status: WorkStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const { error } = await supabase
    .from("client_work_items")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function nextInvoiceNumber(): Promise<{
  number: string;
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return { number: "INV-0001", error: "Supabase is not configured." };
  }

  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;

  const { data, error } = await supabase
    .from("invoices")
    .select("number")
    .like("number", `${prefix}%`)
    .order("number", { ascending: false })
    .limit(1);

  if (error) {
    return { number: `${prefix}0001`, error: error.message };
  }

  const latest = data?.[0]?.number;
  if (!latest) {
    return { number: `${prefix}0001`, error: null };
  }

  const seq = Number.parseInt(latest.slice(prefix.length), 10);
  const next = Number.isFinite(seq) ? seq + 1 : 1;
  return {
    number: `${prefix}${String(next).padStart(4, "0")}`,
    error: null,
  };
}
