import type { Metadata } from "next";
import Link from "next/link";

import { AdminChecklist } from "@/components/admin/admin-checklist";
import { OutboundImportForm } from "@/components/admin/outbound-import-form";
import { OutboundReviewList } from "@/components/admin/outbound-review-list";
import { Button } from "@/components/ui/button";
import { getAdminToolLinks } from "@/lib/admin/config";
import { listCheckedChecklistKeys } from "@/lib/admin/loops/queries";
import { INSTANTLY_PREFLIGHT_ITEMS } from "@/lib/admin/loops/rules/runbook-setup";
import {
  listLeadCandidates,
  type LeadCandidateStatus,
} from "@/lib/admin/outbound/queries";

export const metadata: Metadata = {
  title: "Outbound",
  robots: { index: false, follow: false },
};

const STATUS_FILTERS = new Set([
  "needs_email",
  "ready",
  "approved",
  "rejected",
  "suppressed",
]);

export default async function AdminOutboundPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter =
    params.filter && STATUS_FILTERS.has(params.filter)
      ? (params.filter as LeadCandidateStatus)
      : "all";

  const tools = getAdminToolLinks();
  const [{ rows, error }, checklist, approved] = await Promise.all([
    listLeadCandidates(filter === "all" ? undefined : { status: filter }),
    listCheckedChecklistKeys("instantly-preflight"),
    listLeadCandidates({ status: "approved" }),
  ]);

  const allApproved = (approved.error ? [] : approved.rows).filter((row) =>
    Boolean(row.email),
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl tracking-tight">Outbound</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          CLI finds leads — review here, then download Instantly CSV. Never
          import cold lists into Listmonk.
        </p>
      </div>

      <section className="space-y-3 rounded-lg border border-border bg-card px-4 py-5">
        <h3 className="font-medium">1. Import</h3>
        <p className="text-sm text-muted-foreground">
          Run locally, then upload the full leads CSV from{" "}
          <code className="font-mono text-xs">data/lead-finder/out/</code>.
        </p>
        <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs">
          pnpm lead-finder --verticals=trades,pro
        </pre>
        <OutboundImportForm />
      </section>

      <section className="space-y-3">
        <h3 className="font-medium">2. Review</h3>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : (
          <OutboundReviewList
            rows={rows}
            filter={filter === "all" ? "all" : filter}
          />
        )}
      </section>

      <section className="space-y-3 rounded-lg border border-border bg-card px-4 py-5">
        <h3 className="font-medium">3. Send</h3>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{allApproved}</span>{" "}
          approved with email — ready to download.
        </p>
        <div className="flex flex-wrap gap-2">
          {allApproved > 0 ? (
            <Button asChild size="sm">
              <Link href="/admin/outbound/export">Download Instantly CSV</Link>
            </Button>
          ) : (
            <Button size="sm" disabled>
              Download Instantly CSV
            </Button>
          )}
          <Button asChild size="sm" variant="outline">
            <a href={tools.instantly} target="_blank" rel="noreferrer">
              Open Instantly ↗
            </a>
          </Button>
        </div>

        <details className="pt-2">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            Preflight checklist (advisory)
          </summary>
          <div className="mt-3">
            <AdminChecklist
              checklistKey="instantly-preflight"
              items={INSTANTLY_PREFLIGHT_ITEMS}
              checkedKeys={checklist.error ? [] : checklist.keys}
            />
          </div>
        </details>
      </section>
    </div>
  );
}
