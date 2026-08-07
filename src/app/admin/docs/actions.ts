"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import {
  acknowledgePage,
  addAttachment,
  createFolder,
  createPage,
  deleteNode,
  importPageFromFile,
  renameNode,
  restoreVersionToDraft,
  savePageBody,
  transitionPageStatus,
} from "@/lib/kb/queries";
import type { KbStatus } from "@/lib/kb/status";
import { getServiceRoleClient } from "@/lib/supabase/server";

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function formOptional(formData: FormData, key: string): string | null {
  const value = formString(formData, key);
  return value.length > 0 ? value : null;
}

function revalidateDocs(pageId?: string) {
  revalidatePath("/admin/docs");
  if (pageId) revalidatePath(`/admin/docs/${pageId}`);
}

async function resolveSpaceId(
  spaceId: string,
  parentId: string | null,
): Promise<string> {
  if (!parentId) return spaceId;
  const supabase = getServiceRoleClient();
  if (!supabase) return spaceId;
  const { data } = await supabase
    .from("kb_nodes")
    .select("space_id")
    .eq("id", parentId)
    .eq("type", "folder")
    .maybeSingle();
  return data?.space_id ?? spaceId;
}

export async function createFolderAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const title = formString(formData, "title");
  const parent_id = formOptional(formData, "parent_id");
  const space_id = await resolveSpaceId(
    formString(formData, "space_id"),
    parent_id,
  );
  if (!title || !space_id) throw new Error("Title and space are required.");

  const result = await createFolder({
    space_id,
    parent_id,
    title,
  });
  if (result.error) throw new Error(result.error);
  revalidateDocs();
}

export async function createPageAction(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const title = formString(formData, "title");
  const parent_id = formOptional(formData, "parent_id");
  const space_id = await resolveSpaceId(
    formString(formData, "space_id"),
    parent_id,
  );
  if (!title || !space_id) throw new Error("Title and space are required.");

  const result = await createPage({
    space_id,
    parent_id,
    title,
    author_id: user.id,
    requires_ack: formData.get("requires_ack") === "on",
  });
  if (result.error || !result.row) throw new Error(result.error ?? "Failed.");
  revalidateDocs(result.row.id);
  redirect(`/admin/docs/${result.row.id}`);
}

export async function importPageAction(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const parent_id = formOptional(formData, "parent_id");
  const space_id = await resolveSpaceId(
    formString(formData, "space_id"),
    parent_id,
  );
  const file = formData.get("file");
  if (!space_id || !(file instanceof File) || file.size === 0) {
    throw new Error("Space and file are required.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const title =
    formString(formData, "title") ||
    file.name.replace(/\.[^.]+$/, "") ||
    "Imported page";

  const result = await importPageFromFile({
    space_id,
    parent_id,
    title,
    filename: file.name,
    mime: file.type || null,
    bytes,
    author_id: user.id,
  });
  if (result.error || !result.row) {
    throw new Error(result.error ?? "Import failed.");
  }

  revalidateDocs(result.row.id);
  const q = result.extractError
    ? `?extractError=${encodeURIComponent(result.extractError)}`
    : "";
  redirect(`/admin/docs/${result.row.id}${q}`);
}

export async function savePageAction(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const pageId = formString(formData, "page_id");
  const body = String(formData.get("body") ?? "");
  if (!pageId) throw new Error("Missing page.");

  const result = await savePageBody({
    pageId,
    body,
    author_id: user.id,
  });
  if (result.error) throw new Error(result.error);
  revalidateDocs(pageId);
}

export async function transitionStatusAction(
  formData: FormData,
): Promise<void> {
  const user = await requireAdmin();
  const pageId = formString(formData, "page_id");
  const to = formString(formData, "to") as KbStatus;
  if (!pageId || !["draft", "in_review", "approved"].includes(to)) {
    throw new Error("Invalid transition.");
  }

  const result = await transitionPageStatus({
    pageId,
    to,
    author_id: user.id,
  });
  if (result.error) throw new Error(result.error);
  revalidateDocs(pageId);
}

export async function restoreVersionAction(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const pageId = formString(formData, "page_id");
  const version = Number.parseInt(formString(formData, "version"), 10);
  if (!pageId || !Number.isFinite(version)) throw new Error("Invalid restore.");

  const result = await restoreVersionToDraft({
    pageId,
    version,
    author_id: user.id,
  });
  if (result.error) throw new Error(result.error);
  revalidateDocs(pageId);
}

export async function acknowledgePageAction(formData: FormData): Promise<void> {
  const user = await requireAdmin();
  const pageId = formString(formData, "page_id");
  if (!pageId) throw new Error("Missing page.");

  const result = await acknowledgePage({ pageId, userId: user.id });
  if (result.error) throw new Error(result.error);
  revalidateDocs(pageId);
}

export async function renameNodeAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const nodeId = formString(formData, "node_id");
  const title = formString(formData, "title");
  const pageId = formOptional(formData, "page_id") ?? undefined;
  if (!nodeId || !title) throw new Error("Node and title required.");

  const result = await renameNode(nodeId, title);
  if (result.error) throw new Error(result.error);
  revalidateDocs(pageId);
}

export async function deleteNodeAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const nodeId = formString(formData, "node_id");
  if (!nodeId) throw new Error("Missing node.");

  const result = await deleteNode(nodeId);
  if (result.error) throw new Error(result.error);
  revalidateDocs();
  redirect("/admin/docs");
}

export async function addAttachmentAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const pageId = formString(formData, "page_id");
  const file = formData.get("file");
  if (!pageId || !(file instanceof File) || file.size === 0) {
    throw new Error("Page and file required.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const result = await addAttachment({
    pageId,
    filename: file.name,
    mime: file.type || null,
    bytes,
  });
  if (result.error) throw new Error(result.error);
  revalidateDocs(pageId);
}

export async function setRequiresAckAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const pageId = formString(formData, "page_id");
  if (!pageId) throw new Error("Missing page.");

  const supabase = getServiceRoleClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("kb_pages")
    .update({
      requires_ack: formData.get("requires_ack") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", pageId);

  if (error) throw new Error(error.message);
  revalidateDocs(pageId);
}
