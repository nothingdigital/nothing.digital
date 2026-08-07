import {
  setLeadStatusAction,
  updateLeadEmailAction,
} from "@/app/admin/outbound/actions";
import { AdminFilterChip } from "@/components/admin/admin-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LeadCandidateRow } from "@/lib/admin/outbound/queries";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "needs_email", label: "Needs email" },
  { key: "ready", label: "Ready" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "suppressed", label: "Suppressed" },
] as const;

export function OutboundReviewList({
  rows,
  filter,
}: {
  rows: LeadCandidateRow[];
  filter: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <AdminFilterChip
            key={item.key}
            href={
              item.key === "all"
                ? "/admin/outbound"
                : `/admin/outbound?filter=${item.key}`
            }
            label={item.label}
            active={filter === item.key}
          />
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          Nothing to review. Import a lead-finder CSV above.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="rounded-lg border border-border bg-card px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{row.name}</p>
                    <Badge variant="secondary">{row.score}</Badge>
                    <Badge variant="outline">{row.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {row.website ? (
                      <a
                        href={row.website}
                        target="_blank"
                        rel="noreferrer"
                        className="underline-offset-2 hover:underline"
                      >
                        {row.website}
                      </a>
                    ) : (
                      "No website"
                    )}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                  {row.reasons.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {row.reasons.map((reason) => (
                        <span
                          key={reason}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-end gap-2">
                <form
                  action={updateLeadEmailAction}
                  className="flex flex-wrap items-end gap-2"
                >
                  <input type="hidden" name="id" value={row.id} />
                  <label className="text-xs text-muted-foreground">
                    Email
                    <Input
                      name="email"
                      type="email"
                      defaultValue={row.email ?? ""}
                      className="mt-1 w-56"
                      placeholder="owner@example.com"
                    />
                  </label>
                  <Button type="submit" size="sm" variant="secondary">
                    Save email
                  </Button>
                </form>

                <form action={setLeadStatusAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="status" value="approved" />
                  <Button type="submit" size="sm">
                    Approve
                  </Button>
                </form>
                <form action={setLeadStatusAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <Button type="submit" size="sm" variant="outline">
                    Reject
                  </Button>
                </form>
                <form action={setLeadStatusAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="status" value="suppressed" />
                  <input type="hidden" name="email" value={row.email ?? ""} />
                  <input
                    type="hidden"
                    name="website"
                    value={row.website ?? ""}
                  />
                  <Button type="submit" size="sm" variant="destructive">
                    Suppress
                  </Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
