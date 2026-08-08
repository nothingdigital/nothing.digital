import { describe, expect, it } from "vitest";

import {
  WORK_SORTS,
  compareWorkItems,
  effectiveInvoiceStatus,
  formatCents,
  isAssetEnv,
  isAssetStatus,
  isAssetType,
  isBillingModel,
  isClientStatus,
  isInvoiceStatus,
  isWorkDueSoon,
  isWorkPriority,
  isWorkSort,
  isWorkStatus,
  openBalanceCents,
  truncateText,
} from "./client-ops";

type SortableWork = {
  due_at: string | null;
  priority: string;
  created_at: string;
};

describe("client ops enums", () => {
  it("validates client status", () => {
    expect(isClientStatus("active")).toBe(true);
    expect(isClientStatus("lead")).toBe(true);
    expect(isClientStatus("unknown")).toBe(false);
  });

  it("validates billing model", () => {
    expect(isBillingModel("retainer")).toBe(true);
    expect(isBillingModel("none")).toBe(true);
    expect(isBillingModel("subscription")).toBe(false);
  });

  it("validates invoice status", () => {
    expect(isInvoiceStatus("draft")).toBe(true);
    expect(isInvoiceStatus("paid")).toBe(true);
    expect(isInvoiceStatus("pending")).toBe(false);
  });

  it("validates asset and work enums", () => {
    expect(isAssetType("website")).toBe(true);
    expect(isAssetEnv("prod")).toBe(true);
    expect(isAssetStatus("retired")).toBe(true);
    expect(isWorkStatus("in_progress")).toBe(true);
    expect(isWorkPriority("med")).toBe(true);
    expect(isAssetType("server")).toBe(false);
    expect(isWorkStatus("todo")).toBe(false);
  });
});

describe("effectiveInvoiceStatus", () => {
  const duePast = "2020-01-01T00:00:00.000Z";
  const dueFuture = "2099-01-01T00:00:00.000Z";
  const now = new Date("2026-08-06T12:00:00.000Z");

  it("keeps paid and void as-is", () => {
    expect(
      effectiveInvoiceStatus({ status: "paid", due_at: duePast }, now),
    ).toBe("paid");
    expect(
      effectiveInvoiceStatus({ status: "void", due_at: duePast }, now),
    ).toBe("void");
  });

  it("marks sent/draft past due as overdue on read", () => {
    expect(
      effectiveInvoiceStatus({ status: "sent", due_at: duePast }, now),
    ).toBe("overdue");
    expect(
      effectiveInvoiceStatus({ status: "draft", due_at: duePast }, now),
    ).toBe("overdue");
  });

  it("keeps stored overdue", () => {
    expect(
      effectiveInvoiceStatus({ status: "overdue", due_at: dueFuture }, now),
    ).toBe("overdue");
  });

  it("does not mark future due as overdue", () => {
    expect(
      effectiveInvoiceStatus({ status: "sent", due_at: dueFuture }, now),
    ).toBe("sent");
  });

  it("handles null due_at", () => {
    expect(effectiveInvoiceStatus({ status: "sent", due_at: null }, now)).toBe(
      "sent",
    );
  });
});

describe("formatCents and openBalanceCents", () => {
  it("formats USD cents", () => {
    expect(formatCents(150050, "USD")).toBe("$1,500.50");
    expect(formatCents(0, "USD")).toBe("$0.00");
  });

  it("sums open balance excluding paid and void", () => {
    expect(
      openBalanceCents([
        { amount_cents: 10000, status: "sent", due_at: null },
        { amount_cents: 5000, status: "paid", due_at: null },
        { amount_cents: 2000, status: "void", due_at: null },
        { amount_cents: 3000, status: "overdue", due_at: null },
        { amount_cents: 1000, status: "draft", due_at: null },
      ]),
    ).toBe(14000);
  });

  it("truncates long text", () => {
    expect(truncateText("short")).toBe("short");
    expect(truncateText("a".repeat(120)).length).toBe(100);
    expect(truncateText("a".repeat(120)).endsWith("…")).toBe(true);
  });
});

describe("work queue sort and due-soon", () => {
  const now = new Date("2026-08-06T12:00:00.000Z");

  it("exposes WORK_SORTS and validates isWorkSort", () => {
    expect(WORK_SORTS).toEqual(["due", "priority", "created"]);
    expect(isWorkSort("due")).toBe(true);
    expect(isWorkSort("priority")).toBe(true);
    expect(isWorkSort("created")).toBe(true);
    expect(isWorkSort("status")).toBe(false);
  });

  it("marks overdue and within 7 days as due soon", () => {
    expect(isWorkDueSoon({ due_at: "2026-07-01T00:00:00.000Z" }, now)).toBe(
      true,
    );
    expect(isWorkDueSoon({ due_at: "2026-08-13T12:00:00.000Z" }, now)).toBe(
      true,
    );
    expect(isWorkDueSoon({ due_at: "2026-08-06T12:00:00.000Z" }, now)).toBe(
      true,
    );
  });

  it("excludes null and far-future due dates", () => {
    expect(isWorkDueSoon({ due_at: null }, now)).toBe(false);
    expect(isWorkDueSoon({ due_at: "2026-08-14T12:00:00.000Z" }, now)).toBe(
      false,
    );
  });

  it("sorts by due ascending with nulls last", () => {
    const items: SortableWork[] = [
      {
        due_at: null,
        priority: "low",
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        due_at: "2026-08-20T00:00:00.000Z",
        priority: "low",
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        due_at: "2026-08-10T00:00:00.000Z",
        priority: "low",
        created_at: "2026-01-01T00:00:00.000Z",
      },
    ];
    const sorted = [...items].sort((a, b) => compareWorkItems(a, b, "due"));
    expect(sorted.map((i) => i.due_at)).toEqual([
      "2026-08-10T00:00:00.000Z",
      "2026-08-20T00:00:00.000Z",
      null,
    ]);
  });

  it("sorts by priority high > med > low", () => {
    const items: SortableWork[] = [
      {
        due_at: null,
        priority: "low",
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        due_at: null,
        priority: "high",
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        due_at: null,
        priority: "med",
        created_at: "2026-01-01T00:00:00.000Z",
      },
    ];
    const sorted = [...items].sort((a, b) =>
      compareWorkItems(a, b, "priority"),
    );
    expect(sorted.map((i) => i.priority)).toEqual(["high", "med", "low"]);
  });

  it("sorts by created descending", () => {
    const items: SortableWork[] = [
      {
        due_at: null,
        priority: "med",
        created_at: "2026-01-01T00:00:00.000Z",
      },
      {
        due_at: null,
        priority: "med",
        created_at: "2026-03-01T00:00:00.000Z",
      },
      {
        due_at: null,
        priority: "med",
        created_at: "2026-02-01T00:00:00.000Z",
      },
    ];
    const sorted = [...items].sort((a, b) => compareWorkItems(a, b, "created"));
    expect(sorted.map((i) => i.created_at)).toEqual([
      "2026-03-01T00:00:00.000Z",
      "2026-02-01T00:00:00.000Z",
      "2026-01-01T00:00:00.000Z",
    ]);
  });
});
