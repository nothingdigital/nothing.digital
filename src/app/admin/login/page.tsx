import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

const ERROR_COPY: Record<string, string> = {
  missing_code: "Sign-in link was incomplete. Try again.",
  config: "Supabase is not configured.",
  auth: "Could not complete sign-in.",
  forbidden: "That email is not on the admin allowlist.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextPath =
    params.next?.startsWith("/admin") && params.next !== "/admin/login"
      ? params.next
      : "/admin/inbox";
  const errorMessage = params.error ? ERROR_COPY[params.error] : null;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Sign in</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Password, Google, or magic link — allowlisted owners only.
        </p>
      </div>
      {errorMessage ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      <AdminLoginForm nextPath={nextPath} />
    </div>
  );
}
