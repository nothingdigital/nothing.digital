"use server";

import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { isAdminEmail } from "@/lib/admin/config";

type AdminPasswordSignInResult =
  | { ok: true }
  | {
      ok: false;
      error: "config" | "forbidden" | "credentials";
      message?: string;
    };

export async function signInAdminWithPassword(
  email: string,
  password: string,
): Promise<AdminPasswordSignInResult> {
  const supabase = await createAuthServerClient();
  if (!supabase) {
    return { ok: false, error: "config" };
  }

  const trimmedEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (error || !data.user) {
    return {
      ok: false,
      error: "credentials",
      message: error?.message ?? "Invalid email or password.",
    };
  }

  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { ok: false, error: "forbidden" };
  }

  return { ok: true };
}
