import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function parseAdminEmails(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const allowlist = parseAdminEmails(process.env.ADMIN_EMAILS);
  if (allowlist.length === 0) return false;
  return allowlist.includes(email.trim().toLowerCase());
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = request.nextUrl.pathname;
  const isLogin = pathname === "/admin/login";

  if (!url || !key) {
    if (isLogin) return response;
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([headerKey, headerValue]) => {
          response.headers.set(headerKey, headerValue);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowed = Boolean(user && isAdminEmail(user.email));

  if (!allowed && !isLogin) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (allowed && isLogin) {
    return NextResponse.redirect(new URL("/admin/inbox", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
