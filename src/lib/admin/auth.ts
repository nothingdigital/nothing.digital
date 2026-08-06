import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { isAdminEmail } from "./config";

export async function getSessionUser(): Promise<User | null> {
  const supabase = await createAuthServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await getSessionUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin/login");
  }

  return user;
}
