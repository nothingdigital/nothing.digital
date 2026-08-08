import type { Loop, LoopCollection } from "@/lib/admin/loops/types";

function loopLine(loop: Loop): string {
  return `- [${loop.source}] p${loop.priority} ${loop.title} — ${loop.detail}`;
}

export function formatOpsBriefInput(collection: LoopCollection): string {
  const open =
    collection.open.length === 0
      ? "Open: none"
      : ["Open:", ...collection.open.map(loopLine)].join("\n");
  const later =
    collection.later.length === 0
      ? "Later: none"
      : ["Later:", ...collection.later.map(loopLine)].join("\n");
  const closed =
    collection.recentlyClosed.length === 0
      ? "Recently closed: none"
      : [
          "Recently closed:",
          ...collection.recentlyClosed.map(
            (l) => `${loopLine(l)} (closed ${l.closedAt})`,
          ),
        ].join("\n");
  return [open, later, closed].join("\n\n");
}

export type InvoiceCoverFacts = {
  clientName: string;
  number: string;
  title: string;
  amountLabel: string;
  dueLabel: string | null;
  notes: string | null;
};

export function formatInvoiceCoverInput(facts: InvoiceCoverFacts): string {
  return [
    `Client: ${facts.clientName}`,
    `Invoice: ${facts.number}`,
    `Title: ${facts.title}`,
    `Amount: ${facts.amountLabel}`,
    `Due: ${facts.dueLabel ?? "—"}`,
    `Internal notes: ${facts.notes?.trim() || "—"}`,
  ].join("\n");
}
