import { inboxLoop } from "../keys";
import type { Loop } from "../types";

export type StaleInboxInput = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: string;
  created_at: string;
};

export function staleInboxLoops(
  submissions: StaleInboxInput[],
  now: Date = new Date(),
): Loop[] {
  return submissions
    .filter((row) => row.status === "new")
    .map((row) => {
      const ageMs = now.getTime() - new Date(row.created_at).getTime();
      const ageHours = Math.max(0, Math.floor(ageMs / 3_600_000));
      const ageLabel =
        ageHours < 24
          ? ageHours <= 1
            ? "new"
            : `${ageHours}h old`
          : `${Math.floor(ageHours / 24)}d old`;
      const who = row.company ? `${row.name} · ${row.company}` : row.name;
      return {
        key: inboxLoop(row.id),
        source: "inbox" as const,
        title: who,
        detail: `${ageLabel} · ${row.email}`,
        href: `/admin/inbox?status=new`,
        priority: 20,
      };
    });
}
