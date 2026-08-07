"use server";

import { redirect } from "next/navigation";

import { isAdminEmail } from "@/lib/admin/config";
import { findClientByEmail } from "@/lib/documents/queries";
import { createAuthServerClient } from "@/lib/supabase/auth-server";

export async function signInPortalWithPassword(
  email: string,
  password: string,
): Promise<
  | { ok: true }
  | { ok: false; error: "config" | "forbidden" | "auth"; message?: string }
> {
  const supabase = await createAuthServerClient();
  if (!supabase) return { ok: false, error: "config" };

  const normalized = email.trim().toLowerCase();
  const { row } = await findClientByEmail(normalized);
  if (!row && !isAdminEmail(normalized)) {
    return { ok: false, error: "forbidden" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: normalized,
    password,
  });

  if (error) {
    return { ok: false, error: "auth", message: error.message };
  }

  return { ok: true };
}

export async function signOutPortal(): Promise<void> {
  const supabase = await createAuthServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/portal/login");
}
