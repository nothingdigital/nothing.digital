import { getServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database";

import { needsAck } from "./ack";
import { extractByFilename } from "./import";
import { assertTransition, type KbStatus } from "./status";
import { uploadKbFile } from "./storage";

export type KbSpace = Database["public"]["Tables"]["kb_spaces"]["Row"];
export type KbNode = Database["public"]["Tables"]["kb_nodes"]["Row"];
export type KbPage = Database["public"]["Tables"]["kb_pages"]["Row"];
export type KbVersion = Database["public"]["Tables"]["kb_versions"]["Row"];
export type KbAttachment =
  Database["public"]["Tables"]["kb_attachments"]["Row"];
export type KbAck = Database["public"]["Tables"]["kb_acknowledgments"]["Row"];

export type PageWithNode = KbPage & { node: KbNode };

function notConfigured<T extends Record<string, unknown>>(empty: T) {
  return { ...empty, error: "Supabase is not configured." as string | null };
}

export async function listSpaces(): Promise<{
  rows: KbSpace[];
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ rows: [] as KbSpace[] });

  const { data, error } = await supabase
    .from("kb_spaces")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function listNodesForSpace(spaceId: string): Promise<{
  rows: KbNode[];
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ rows: [] as KbNode[] });

  const { data, error } = await supabase
    .from("kb_nodes")
    .select("*")
    .eq("space_id", spaceId)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function getPageById(pageId: string): Promise<{
  row: PageWithNode | null;
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ row: null });

  const { data, error } = await supabase
    .from("kb_pages")
    .select("*, node:kb_nodes(*)")
    .eq("id", pageId)
    .maybeSingle();

  if (error) return { row: null, error: error.message };
  if (!data) return { row: null, error: "Page not found." };

  const { node, ...page } = data as KbPage & { node: KbNode | null };
  if (!node) return { row: null, error: "Node not found." };
  return { row: { ...page, node }, error: null };
}

export async function createFolder(input: {
  space_id: string;
  parent_id?: string | null;
  title: string;
}): Promise<{ row: KbNode | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ row: null });

  const { data, error } = await supabase
    .from("kb_nodes")
    .insert({
      space_id: input.space_id,
      parent_id: input.parent_id ?? null,
      type: "folder",
      title: input.title,
    })
    .select("*")
    .single();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}

export async function createPage(input: {
  space_id: string;
  parent_id?: string | null;
  title: string;
  body?: string;
  author_id?: string | null;
  requires_ack?: boolean;
}): Promise<{ row: PageWithNode | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ row: null });

  const body = input.body ?? "";

  const { data: node, error: nodeError } = await supabase
    .from("kb_nodes")
    .insert({
      space_id: input.space_id,
      parent_id: input.parent_id ?? null,
      type: "page",
      title: input.title,
    })
    .select("*")
    .single();

  if (nodeError || !node) {
    return { row: null, error: nodeError?.message ?? "Create node failed." };
  }

  const { data: page, error: pageError } = await supabase
    .from("kb_pages")
    .insert({
      node_id: node.id,
      body,
      body_text: body,
      status: "draft",
      current_version: 1,
      requires_ack: input.requires_ack ?? false,
    })
    .select("*")
    .single();

  if (pageError || !page) {
    await supabase.from("kb_nodes").delete().eq("id", node.id);
    return { row: null, error: pageError?.message ?? "Create page failed." };
  }

  await supabase.from("kb_versions").insert({
    page_id: page.id,
    version: 1,
    body,
    status: "draft",
    author_id: input.author_id ?? null,
    note: "Created",
  });

  return { row: { ...page, node }, error: null };
}

export async function renameNode(
  nodeId: string,
  title: string,
): Promise<{ row: KbNode | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ row: null });

  const { data, error } = await supabase
    .from("kb_nodes")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", nodeId)
    .select("*")
    .single();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}

// ponytail: page delete only; folders stay until emptied manually later
export async function deleteNode(
  nodeId: string,
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured." };

  const { data: node, error: fetchError } = await supabase
    .from("kb_nodes")
    .select("type")
    .eq("id", nodeId)
    .maybeSingle();

  if (fetchError || !node) {
    return { ok: false, error: fetchError?.message ?? "Node not found." };
  }
  if (node.type !== "page") {
    return { ok: false, error: "Only pages can be deleted from admin v1." };
  }

  const { error } = await supabase.from("kb_nodes").delete().eq("id", nodeId);
  if (error) return { ok: false, error: error.message };
  return { ok: true, error: null };
}

async function appendVersion(
  supabase: NonNullable<ReturnType<typeof getServiceRoleClient>>,
  page: KbPage,
  patch: {
    body: string;
    status: string;
    author_id?: string | null;
    note?: string | null;
    approved_version?: number | null;
  },
): Promise<{ row: KbPage | null; error: string | null }> {
  const nextVersion = page.current_version + 1;
  const update: Database["public"]["Tables"]["kb_pages"]["Update"] = {
    body: patch.body,
    body_text: patch.body,
    status: patch.status,
    current_version: nextVersion,
    updated_at: new Date().toISOString(),
  };
  if (patch.approved_version !== undefined) {
    update.approved_version = patch.approved_version;
  }

  const { data: updated, error } = await supabase
    .from("kb_pages")
    .update(update)
    .eq("id", page.id)
    .select("*")
    .single();

  if (error || !updated) {
    return { row: null, error: error?.message ?? "Update failed." };
  }

  const { error: verError } = await supabase.from("kb_versions").insert({
    page_id: page.id,
    version: nextVersion,
    body: patch.body,
    status: patch.status,
    author_id: patch.author_id ?? null,
    note: patch.note ?? null,
  });

  if (verError) return { row: null, error: verError.message };
  return { row: updated, error: null };
}

export async function savePageBody(input: {
  pageId: string;
  body: string;
  author_id?: string | null;
  note?: string | null;
}): Promise<{ row: KbPage | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ row: null });

  const { data: page, error } = await supabase
    .from("kb_pages")
    .select("*")
    .eq("id", input.pageId)
    .maybeSingle();

  if (error || !page) {
    return { row: null, error: error?.message ?? "Page not found." };
  }

  // ponytail: edit after approve sends back to draft in same save
  const status =
    page.status === "approved" ? "draft" : (page.status as KbStatus);

  return appendVersion(supabase, page, {
    body: input.body,
    status,
    author_id: input.author_id,
    note: input.note ?? "Saved",
  });
}

export async function transitionPageStatus(input: {
  pageId: string;
  to: KbStatus;
  author_id?: string | null;
  note?: string | null;
}): Promise<{ row: KbPage | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ row: null });

  const { data: page, error } = await supabase
    .from("kb_pages")
    .select("*")
    .eq("id", input.pageId)
    .maybeSingle();

  if (error || !page) {
    return { row: null, error: error?.message ?? "Page not found." };
  }

  try {
    assertTransition(page.status as KbStatus, input.to);
  } catch (err) {
    return {
      row: null,
      error: err instanceof Error ? err.message : "Illegal transition.",
    };
  }

  const nextVersion = page.current_version + 1;
  return appendVersion(supabase, page, {
    body: page.body,
    status: input.to,
    author_id: input.author_id,
    note: input.note ?? `Status → ${input.to}`,
    approved_version:
      input.to === "approved" ? nextVersion : page.approved_version,
  });
}

export async function listVersions(pageId: string): Promise<{
  rows: KbVersion[];
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ rows: [] as KbVersion[] });

  const { data, error } = await supabase
    .from("kb_versions")
    .select("*")
    .eq("page_id", pageId)
    .order("version", { ascending: false });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function restoreVersionToDraft(input: {
  pageId: string;
  version: number;
  author_id?: string | null;
}): Promise<{ row: KbPage | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ row: null });

  const { data: page, error } = await supabase
    .from("kb_pages")
    .select("*")
    .eq("id", input.pageId)
    .maybeSingle();

  if (error || !page) {
    return { row: null, error: error?.message ?? "Page not found." };
  }

  const { data: snap, error: snapError } = await supabase
    .from("kb_versions")
    .select("*")
    .eq("page_id", input.pageId)
    .eq("version", input.version)
    .maybeSingle();

  if (snapError || !snap) {
    return { row: null, error: snapError?.message ?? "Version not found." };
  }

  return appendVersion(supabase, page, {
    body: snap.body,
    status: "draft",
    author_id: input.author_id,
    note: `Restored v${input.version}`,
  });
}

export async function addAttachment(input: {
  pageId: string;
  filename: string;
  mime?: string | null;
  kind?: "import_original" | "attachment";
  bytes: Buffer | Uint8Array;
}): Promise<{ row: KbAttachment | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ row: null });

  const body =
    input.bytes instanceof Buffer ? input.bytes : Buffer.from(input.bytes);
  const storagePath = `${input.pageId}/${crypto.randomUUID()}-${input.filename}`;
  const upload = await uploadKbFile(
    storagePath,
    body,
    input.mime ?? "application/octet-stream",
  );
  if (!upload.ok) return { row: null, error: upload.error };

  const { data, error } = await supabase
    .from("kb_attachments")
    .insert({
      page_id: input.pageId,
      storage_path: storagePath,
      filename: input.filename,
      mime: input.mime ?? null,
      kind: input.kind ?? "attachment",
      byte_size: body.byteLength,
    })
    .select("*")
    .single();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}

export async function listAttachments(pageId: string): Promise<{
  rows: KbAttachment[];
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ rows: [] as KbAttachment[] });

  const { data, error } = await supabase
    .from("kb_attachments")
    .select("*")
    .eq("page_id", pageId)
    .order("created_at", { ascending: false });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function getAttachment(attachmentId: string): Promise<{
  row: KbAttachment | null;
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ row: null });

  const { data, error } = await supabase
    .from("kb_attachments")
    .select("*")
    .eq("id", attachmentId)
    .maybeSingle();

  if (error) return { row: null, error: error.message };
  return { row: data, error: null };
}

export async function acknowledgePage(input: {
  pageId: string;
  userId: string;
}): Promise<{ row: KbAck | null; error: string | null }> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ row: null });

  const { data: page, error } = await supabase
    .from("kb_pages")
    .select("*")
    .eq("id", input.pageId)
    .maybeSingle();

  if (error || !page) {
    return { row: null, error: error?.message ?? "Page not found." };
  }

  if (
    !needsAck({
      status: page.status,
      requiresAck: page.requires_ack,
      approvedVersion: page.approved_version,
      userAckVersion: null,
    })
  ) {
    return {
      row: null,
      error: "Page does not require acknowledgment at this version.",
    };
  }

  const { data, error: ackError } = await supabase
    .from("kb_acknowledgments")
    .insert({
      page_id: input.pageId,
      user_id: input.userId,
      version: page.approved_version!,
    })
    .select("*")
    .single();

  if (ackError) return { row: null, error: ackError.message };
  return { row: data, error: null };
}

export async function listAcknowledgments(pageId: string): Promise<{
  rows: KbAck[];
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ rows: [] as KbAck[] });

  const { data, error } = await supabase
    .from("kb_acknowledgments")
    .select("*")
    .eq("page_id", pageId)
    .order("acked_at", { ascending: false });

  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [], error: null };
}

export async function listPagesNeedingAckForUser(userId: string): Promise<{
  rows: PageWithNode[];
  error: string | null;
}> {
  const supabase = getServiceRoleClient();
  if (!supabase) return notConfigured({ rows: [] as PageWithNode[] });

  const { data: pages, error } = await supabase
    .from("kb_pages")
    .select("*")
    .eq("status", "approved")
    .eq("requires_ack", true);

  if (error) return { rows: [], error: error.message };
  if (!pages?.length) return { rows: [], error: null };

  const { data: acks, error: ackError } = await supabase
    .from("kb_acknowledgments")
    .select("*")
    .eq("user_id", userId)
    .in(
      "page_id",
      pages.map((p) => p.id),
    );

  if (ackError) return { rows: [], error: ackError.message };

  const ackByPage = new Map<string, number>();
  for (const ack of acks ?? []) {
    const prev = ackByPage.get(ack.page_id) ?? -1;
    if (ack.version > prev) ackByPage.set(ack.page_id, ack.version);
  }

  const needing = pages.filter((p) =>
    needsAck({
      status: p.status,
      requiresAck: p.requires_ack,
      approvedVersion: p.approved_version,
      userAckVersion: ackByPage.get(p.id) ?? null,
    }),
  );

  if (needing.length === 0) return { rows: [], error: null };

  const { data: nodes, error: nodeError } = await supabase
    .from("kb_nodes")
    .select("*")
    .in(
      "id",
      needing.map((p) => p.node_id),
    );

  if (nodeError) return { rows: [], error: nodeError.message };
  const nodeById = new Map((nodes ?? []).map((n) => [n.id, n]));

  const rows: PageWithNode[] = [];
  for (const p of needing) {
    const node = nodeById.get(p.node_id);
    if (node) rows.push({ ...p, node });
  }
  return { rows, error: null };
}

export async function importPageFromFile(input: {
  space_id: string;
  parent_id?: string | null;
  title: string;
  filename: string;
  mime?: string | null;
  bytes: Buffer | Uint8Array;
  author_id?: string | null;
}): Promise<{
  row: PageWithNode | null;
  extractError: string | null;
  error: string | null;
}> {
  const extracted = await extractByFilename(input.filename, input.bytes);
  const created = await createPage({
    space_id: input.space_id,
    parent_id: input.parent_id,
    title: input.title,
    body: extracted.markdown,
    author_id: input.author_id,
  });

  if (created.error || !created.row) {
    return {
      row: null,
      extractError: extracted.ok ? null : (extracted.error ?? null),
      error: created.error ?? "Create failed.",
    };
  }

  const attachment = await addAttachment({
    pageId: created.row.id,
    filename: input.filename,
    mime: input.mime,
    kind: "import_original",
    bytes: input.bytes,
  });

  if (attachment.error) {
    return {
      row: created.row,
      extractError: extracted.ok ? null : (extracted.error ?? null),
      error: `Page created but attachment failed: ${attachment.error}`,
    };
  }

  return {
    row: created.row,
    extractError: extracted.ok ? null : (extracted.error ?? null),
    error: null,
  };
}
