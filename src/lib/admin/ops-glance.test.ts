import { describe, expect, it } from "vitest";

import { countOverdueInvoices, selectOverdueInvoices } from "./ops-glance";

describe("selectOverdueInvoices / countOverdueInvoices", () => {
  const duePast = "2020-01-01T00:00:00.000Z";
  const dueFuture = "2099-01-01T00:00:00.000Z";
  const now = new Date("2026-08-06T12:00:00.000Z");

  const mixed = [
    { id: "a", status: "sent", due_at: duePast },
    { id: "b", status: "overdue", due_at: dueFuture },
    { id: "c", status: "paid", due_at: duePast },
    { id: "d", status: "sent", due_at: dueFuture },
    { id: "e", status: "void", due_at: duePast },
  ];

  it("selects overdue rows among mixed statuses", () => {
    expect(selectOverdueInvoices(mixed, now).map((row) => row.id)).toEqual([
      "a",
      "b",
    ]);
  });

  it("counts overdue among mixed statuses", () => {
    expect(countOverdueInvoices(mixed, now)).toBe(2);
  });

  it("returns 0 for an empty list", () => {
    expect(countOverdueInvoices([], now)).toBe(0);
  });
});
