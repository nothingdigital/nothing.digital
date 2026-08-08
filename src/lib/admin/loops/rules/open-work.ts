import { isWorkDueSoon } from "@/lib/admin/client-ops";

import { workLoop } from "../keys";
import type { Loop } from "../types";

export type AttentionWorkInput = {
  id: string;
  client_id: string;
  title: string;
  status: string;
  due_at: string | null;
  clients: { id: string; name: string } | null;
};

export function attentionWorkLoops(
  items: AttentionWorkInput[],
  now: Date = new Date(),
): Loop[] {
  return items
    .filter(
      (item) =>
        item.status === "blocked" ||
        (item.status !== "done" && isWorkDueSoon(item, now)),
    )
    .map((item) => {
      const clientName = item.clients?.name ?? "Unknown client";
      const reason =
        item.status === "blocked"
          ? "blocked"
          : item.due_at && new Date(item.due_at) < now
            ? "overdue"
            : "due soon";
      return {
        key: workLoop(item.id),
        source: "work" as const,
        title: item.title,
        detail: `${clientName} · ${reason}`,
        href: `/admin/clients/${item.client_id}/work/${item.id}/edit`,
        priority: item.status === "blocked" ? 15 : 30,
      };
    });
}
