import Link from "next/link";

import {
  closeLoopAction,
  logOutboundHandoffAction,
  muteLoopAction,
  reopenLoopAction,
  snoozeLoopAction,
} from "@/app/admin/loops/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Loop } from "@/lib/admin/loops/types";

const SNOOZE_OPTIONS = [
  ["tomorrow", "Snooze tomorrow"],
  ["3d", "Snooze 3 days"],
  ["monday", "Snooze next Monday"],
] as const;

export function LoopCard({ loop }: { loop: Loop }) {
  return (
    <li className="space-y-3 rounded-lg border border-border bg-card px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {loop.source}
          </p>
          <p className="mt-1 font-medium text-foreground">{loop.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{loop.detail}</p>
        </div>
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer select-none">⋯</summary>
          <div className="mt-2 flex flex-col items-end gap-1">
            {SNOOZE_OPTIONS.map(([snooze, label]) => (
              <form key={snooze} action={snoozeLoopAction}>
                <input type="hidden" name="loop_key" value={loop.key} />
                <input type="hidden" name="snooze" value={snooze} />
                <button type="submit" className="hover:text-foreground">
                  {label}
                </button>
              </form>
            ))}
            <form action={muteLoopAction}>
              <input type="hidden" name="loop_key" value={loop.key} />
              <button type="submit" className="hover:text-foreground">
                Not a loop for me
              </button>
            </form>
          </div>
        </details>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="default">
          <Link href={loop.href}>
            {loop.source === "outbound"
              ? "Review"
              : loop.source === "setup"
                ? "Open checklist"
                : "Open"}
          </Link>
        </Button>

        {loop.source === "outbound" ? (
          <details className="w-full rounded-md border border-border px-3 py-2 text-sm">
            <summary className="cursor-pointer font-medium">
              Start handoff
            </summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
              <li>
                Run locally:{" "}
                <code className="font-mono text-xs text-foreground">
                  pnpm lead-finder --verticals=trades,pro
                </code>
              </li>
              <li>Human-review the CSV. Cold never goes to Listmonk.</li>
              <li>
                Upload the CSV on Outbound, approve rows, download Instantly
                CSV.
              </li>
              <li>Sync suppression into Instantly&apos;s global block list.</li>
            </ol>
            <form
              action={logOutboundHandoffAction}
              className="mt-3 flex flex-wrap items-end gap-2"
            >
              <input type="hidden" name="loop_key" value={loop.key} />
              <label className="text-xs text-muted-foreground">
                Rows imported
                <Input
                  name="imported"
                  type="number"
                  min={0}
                  className="mt-1 w-24"
                  placeholder="38"
                />
              </label>
              <Button type="submit" size="sm" variant="secondary">
                Log handoff
              </Button>
            </form>
          </details>
        ) : (
          <form action={closeLoopAction}>
            <input type="hidden" name="loop_key" value={loop.key} />
            <Button type="submit" size="sm" variant="secondary">
              Mark done
            </Button>
          </form>
        )}
      </div>
    </li>
  );
}

export function LoopList({
  loops,
  emptyMessage,
}: {
  loops: Loop[];
  emptyMessage: string;
}) {
  if (loops.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {loops.map((loop) => (
        <LoopCard key={loop.key} loop={loop} />
      ))}
    </ul>
  );
}

export function RecentlyClosedLoops({
  loops,
}: {
  loops: Array<Loop & { closedAt: string; note: string | null }>;
}) {
  if (loops.length === 0) return null;

  return (
    <ul className="space-y-1 text-sm text-muted-foreground">
      {loops.map((loop) => (
        <li
          key={`${loop.key}-${loop.closedAt}`}
          className="flex flex-wrap gap-2"
        >
          <span>✓ Closed · {loop.note ?? loop.title}</span>
          <form action={reopenLoopAction}>
            <input type="hidden" name="loop_key" value={loop.key} />
            <button
              type="submit"
              className="underline-offset-2 hover:text-foreground hover:underline"
            >
              Undo
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
