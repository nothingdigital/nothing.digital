import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isAdminEmail } from "@/lib/admin/config";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  request.headers.set("x-pathname", pathname);

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isAdminPath = pathname.startsWith("/admin");
  const isPortalPath = pathname.startsWith("/portal");
  const isAdminLogin = pathname === "/admin/login";
  const isPortalLogin = pathname === "/portal/login";

  if (!url || !key) {
    if (isAdminLogin || isPortalLogin) return response;
    return NextResponse.redirect(
      new URL(isPortalPath ? "/portal/login" : "/admin/login", request.url),
    );
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

  if (isAdminPath) {
    const allowed = Boolean(user && isAdminEmail(user.email));

    if (!allowed && !isAdminLogin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (allowed && isAdminLogin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
  }

  // Matcher is only /admin + /portal — portal path when not admin.
  if (!user && !isPortalLogin) {
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
