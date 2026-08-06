import { NextResponse } from "next/server";

import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { isAdminEmail } from "@/lib/admin/config";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/inbox";

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=missing_code`);
  }

  const supabase = await createAuthServerClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/admin/login?error=config`);
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth`);
  }

  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/admin/login?error=forbidden`);
  }

  const safeNext = next.startsWith("/admin") ? next : "/admin/inbox";
  return NextResponse.redirect(`${origin}${safeNext}`);
}
