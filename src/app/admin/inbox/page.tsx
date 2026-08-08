import type { Metadata } from "next";

import { createClientFromInboxAction } from "@/app/admin/inbox/actions";
import {
  AdminFilterChip,
  adminControlClass,
} from "@/components/admin/admin-form";
import { InboxReplyDraftPanel } from "@/components/admin/inbox-reply-draft-panel";
import { StatusSelect } from "@/components/admin/status-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INBOX_STATUSES, isInboxStatus } from "@/lib/admin/config";
import { isAiEnabled } from "@/lib/ai";
import { listContactSubmissions } from "@/lib/admin/queries";
import { scoreLead } from "@/lib/admin/client-ops";

export const metadata: Metadata = {
  title: "Inbox",
  robots: { index: false, follow: false },
};

export default async function AdminInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter =
    params.status && isInboxStatus(params.status) ? params.status : undefined;

  const { rows, error } = await listContactSubmissions(statusFilter);
  const scoredRows = rows
    .map((row) => ({ ...row, score: scoreLead(row) }))
    .sort((a, b) => b.score - a.score);
  const draftsEnabled = isAiEnabled();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl tracking-tight">Inbox</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Triage contact submissions ({scoredRows.length})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminFilterChip
            href="/admin/inbox"
            label="All"
            active={!statusFilter}
          />
          {INBOX_STATUSES.map((status) => (
            <AdminFilterChip
              key={status}
              href={`/admin/inbox?status=${status}`}
              label={status}
              active={statusFilter === status}
            />
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {scoredRows.length === 0 && !error ? (
        <p className="text-sm text-muted-foreground">No submissions yet.</p>
      ) : null}

      <ul className="space-y-4">
        {scoredRows.map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{row.name}</p>
                <a
                  href={`mailto:${row.email}`}
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  {row.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    row.score > 70
                      ? "default"
                      : row.score > 40
                        ? "secondary"
                        : "outline"
                  }
                  className="font-mono"
                >
                  {row.score}
                </Badge>
                <Badge variant="secondary">{row.status}</Badge>
                <StatusSelect id={row.id} status={row.status} />
              </div>
            </div>
            <dl className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-3">
              <div>
                <dt className="inline font-medium text-foreground">
                  Service:{" "}
                </dt>
                <dd className="inline">{row.service ?? "—"}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-foreground">
                  Company:{" "}
                </dt>
                <dd className="inline">{row.company ?? "—"}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-foreground">When: </dt>
                <dd className="inline">
                  {new Date(row.created_at).toLocaleString()}
                </dd>
              </div>
            </dl>
            <p className="mt-3 whitespace-pre-wrap text-sm">{row.message}</p>
            {draftsEnabled ? (
              <InboxReplyDraftPanel submissionId={row.id} />
            ) : null}
            <form
              action={createClientFromInboxAction}
              className="mt-4 flex flex-wrap items-end gap-2 border-t border-border pt-3"
            >
              <input type="hidden" name="submission_id" value={row.id} />
              <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                After create
                <select
                  name="mark_status"
                  defaultValue="replied"
                  className={adminControlClass}
                >
                  <option value="">Leave status</option>
                  <option value="replied">Mark replied</option>
                  <option value="archived">Mark archived</option>
                </select>
              </label>
              <Button type="submit" size="sm" variant="secondary">
                Create client
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
