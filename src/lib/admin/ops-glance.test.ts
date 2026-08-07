import { describe, expect, it } from "vitest";

import { countOverdueInvoices } from "./ops-glance";

describe("countOverdueInvoices", () => {
  const duePast = "2020-01-01T00:00:00.000Z";
  const dueFuture = "2099-01-01T00:00:00.000Z";
  const now = new Date("2026-08-06T12:00:00.000Z");

  it("counts overdue among mixed statuses", () => {
    expect(
      countOverdueInvoices(
        [
          { status: "sent", due_at: duePast },
          { status: "overdue", due_at: dueFuture },
          { status: "paid", due_at: duePast },
          { status: "sent", due_at: dueFuture },
          { status: "void", due_at: duePast },
        ],
        now,
      ),
    ).toBe(2);
  });

  it("returns 0 for an empty list", () => {
    expect(countOverdueInvoices([], now)).toBe(0);
  });
});
