import type { Loop, LoopCollection } from "@/lib/admin/loops/types";

function loopLine(loop: Loop): string {
  return `- [${loop.source}] p${loop.priority} ${loop.title} — ${loop.detail}`;
}

function section<T extends Loop>(
  label: string,
  loops: readonly T[],
  line: (loop: T) => string = loopLine as (loop: T) => string,
): string {
  if (loops.length === 0) return `${label}: none`;
  return [`${label}:`, ...loops.map(line)].join("\n");
}

export function formatOpsBriefInput(collection: LoopCollection): string {
  return [
    section("Open", collection.open),
    section("Later", collection.later),
    section(
      "Recently closed",
      collection.recentlyClosed,
      (l) => `${loopLine(l)} (closed ${l.closedAt})`,
    ),
  ].join("\n\n");
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
