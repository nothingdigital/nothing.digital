import { NextResponse } from "next/server";

import { createAuthServerClient } from "@/lib/supabase/auth-server";
import { isAdminEmail } from "@/lib/admin/config";
import { findClientByEmail } from "@/lib/documents/queries";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/inbox";
  const isPortal = next.startsWith("/portal");
  const login = isPortal ? "/portal/login" : "/admin/login";

  if (!code) {
    return NextResponse.redirect(`${origin}${login}?error=missing_code`);
  }

  const supabase = await createAuthServerClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}${login}?error=config`);
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}${login}?error=auth`);
  }

  if (isPortal) {
    const email = data.user.email;
    const { row: client } = await findClientByEmail(email ?? "");
    if (!isAdminEmail(email) && !client) {
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/portal/login?error=forbidden`);
    }
    // ponytail: isPortal already means next starts with /portal.
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/admin/login?error=forbidden`);
  }

  return NextResponse.redirect(
    `${origin}${next.startsWith("/admin") ? next : "/admin/inbox"}`,
  );
}
