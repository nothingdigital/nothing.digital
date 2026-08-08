import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PortalLoginForm } from "@/components/portal/portal-login-form";
import { getPortalClient } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Client portal login",
  robots: { index: false, follow: false },
};

const ERROR_COPY: Record<string, string> = {
  missing_code: "Sign-in link was incomplete. Try again.",
  config: "Supabase is not configured.",
  auth: "Could not complete sign-in.",
  forbidden: "No client account matches that email.",
};

export default async function PortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const { userEmail, client, isAdmin } = await getPortalClient();

  if (userEmail && (client || isAdmin)) {
    redirect("/portal");
  }

  const errorMessage = params.error ? ERROR_COPY[params.error] : null;

  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-16">
      <div>
        <h1 className="font-display text-3xl tracking-tight">Client portal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with the email on your client record to view invoices and
          documents.
        </p>
      </div>
      {errorMessage ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      <PortalLoginForm />
    </main>
  );
}
