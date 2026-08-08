import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
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

/**
 * Guard for route handlers: returns the admin user, or a JSON 401/403 response.
 * Route handlers must not use requireAdmin() — its redirect() surfaces as a
 * 307 to /admin/login, which fetch callers can follow into a 200 HTML page.
 */
export async function requireAdminApi(): Promise<
  { user: User; error: null } | { user: null; error: NextResponse }
> {
  const user = await getSessionUser();

  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!isAdminEmail(user.email)) {
    return {
      user: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user, error: null };
}
