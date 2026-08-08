import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { listClientDocuments } from "@/lib/documents/queries";
import { listClientInvoices } from "@/lib/admin/client-ops-queries";
import { effectiveInvoiceStatus, formatCents } from "@/lib/admin/client-ops";
import { getPortalClient } from "@/lib/portal/session";
import { signOutPortal } from "@/app/portal/login/actions";

export const metadata: Metadata = {
  title: "Client portal",
  robots: { index: false, follow: false },
};

export default async function PortalPage() {
  const { userEmail, client, isAdmin, error } = await getPortalClient();

  if (!userEmail) {
    redirect("/portal/login");
  }

  if (!client) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        <h1 className="font-display text-3xl tracking-tight">Client portal</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as {userEmail}, but no client record matches this email.
        </p>
        <div className="flex flex-wrap gap-2">
          {isAdmin ? (
            <Button asChild variant="outline">
              <Link href="/admin/billing">Admin billing</Link>
            </Button>
          ) : null}
          <form action={signOutPortal}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </div>
      </main>
    );
  }

  const [invoicesResult, documentsResult] = await Promise.all([
    listClientInvoices(client.id),
    listClientDocuments(client.id),
  ]);

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Nothing.Digital</p>
          <h1 className="font-display text-3xl tracking-tight">
            {client.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{userEmail}</p>
        </div>
        <form action={signOutPortal}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Invoices</h2>
        {invoicesResult.error ? (
          <p className="text-sm text-destructive">{invoicesResult.error}</p>
        ) : null}
        {invoicesResult.rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invoices yet.</p>
        ) : null}
        <ul className="space-y-3">
          {invoicesResult.rows.map((invoice) => {
            const status = effectiveInvoiceStatus(invoice);
            return (
              <li
                key={invoice.id}
                className="rounded-lg border border-border px-4 py-3"
              >
                <p className="font-medium">
                  {invoice.number} · {invoice.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCents(invoice.amount_cents, invoice.currency)} ·{" "}
                  {status}
                  {invoice.view_token ? (
                    <>
                      {" · "}
                      <Link
                        href={`/v/${invoice.view_token}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        View PDF
                      </Link>
                    </>
                  ) : invoice.external_url ? (
                    <>
                      {" · "}
                      <a
                        href={invoice.external_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Open link
                      </a>
                    </>
                  ) : null}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Documents</h2>
        {documentsResult.error ? (
          <p className="text-sm text-destructive">{documentsResult.error}</p>
        ) : null}
        {documentsResult.rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents yet.</p>
        ) : null}
        <ul className="space-y-3">
          {documentsResult.rows.map((document) => (
            <li
              key={document.id}
              className="rounded-lg border border-border px-4 py-3"
            >
              <p className="font-medium">
                {document.title}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  · {document.kind}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                {document.view_token ? (
                  <Link
                    href={`/v/${document.view_token}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    View
                  </Link>
                ) : document.external_url ? (
                  <a
                    href={document.external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Open link
                  </a>
                ) : (
                  "No file"
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
