import { describe, expect, it } from "vitest";

import { collectLoops } from "./collect";
import { cadenceLoop, inboxLoop, invoiceLoop, isoWeekPeriod } from "./keys";
import { resolveLoopState } from "./state";

describe("isoWeekPeriod", () => {
  it("returns ISO week for a known Thursday", () => {
    expect(isoWeekPeriod(new Date("2026-08-06T12:00:00.000Z"))).toBe(
      "2026-W32",
    );
  });
});

describe("resolveLoopState", () => {
  const now = new Date("2026-08-06T12:00:00.000Z");

  it("is open with no events", () => {
    expect(resolveLoopState([], now).state).toBe("open");
  });

  it("respects closed until reopened", () => {
    expect(
      resolveLoopState(
        [
          {
            loop_key: "x",
            action: "closed",
            note: null,
            snoozed_until: null,
            created_at: "2026-08-06T10:00:00.000Z",
          },
        ],
        now,
      ).state,
    ).toBe("closed");

    expect(
      resolveLoopState(
        [
          {
            loop_key: "x",
            action: "closed",
            note: null,
            snoozed_until: null,
            created_at: "2026-08-06T10:00:00.000Z",
          },
          {
            loop_key: "x",
            action: "reopened",
            note: null,
            snoozed_until: null,
            created_at: "2026-08-06T11:00:00.000Z",
          },
        ],
        now,
      ).state,
    ).toBe("open");
  });

  it("keeps snooze until expiry", () => {
    expect(
      resolveLoopState(
        [
          {
            loop_key: "x",
            action: "snoozed",
            note: null,
            snoozed_until: "2026-08-07T12:00:00.000Z",
            created_at: "2026-08-06T10:00:00.000Z",
          },
        ],
        now,
      ).state,
    ).toBe("snoozed");

    expect(
      resolveLoopState(
        [
          {
            loop_key: "x",
            action: "snoozed",
            note: null,
            snoozed_until: "2026-08-05T12:00:00.000Z",
            created_at: "2026-08-05T10:00:00.000Z",
          },
        ],
        now,
      ).state,
    ).toBe("open");
  });
});

describe("collectLoops", () => {
  const now = new Date("2026-08-06T12:00:00.000Z");

  it("caps visible open loops and puts the rest in later", () => {
    const result = collectLoops({
      invoices: [
        {
          id: "inv-1",
          client_id: "c1",
          number: "INV-1",
          amount_cents: 10000,
          currency: "USD",
          status: "sent",
          due_at: "2020-01-01T00:00:00.000Z",
          clients: { id: "c1", name: "Acme" },
        },
      ],
      inbox: [
        {
          id: "sub-1",
          name: "Dana",
          email: "dana@example.com",
          company: null,
          message: "hi",
          status: "new",
          created_at: "2026-08-05T12:00:00.000Z",
        },
        {
          id: "sub-2",
          name: "Lee",
          email: "lee@example.com",
          company: "Lee Co",
          message: "hi",
          status: "new",
          created_at: "2026-08-04T12:00:00.000Z",
        },
      ],
      work: [
        {
          id: "w1",
          client_id: "c1",
          title: "Blocked redesign",
          status: "blocked",
          due_at: null,
          clients: { id: "c1", name: "Acme" },
        },
      ],
      readyLeadCount: 0,
      checkedListmonkKeys: [
        "templates",
        "sequence",
        "live-form",
        "unsubscribe",
      ],
      events: [],
      now,
      visibleCap: 3,
    });

    expect(result.open).toHaveLength(3);
    expect(result.later.length).toBeGreaterThan(0);
    expect(result.open[0]?.key).toBe(invoiceLoop("inv-1"));
  });

  it("hides closed loops and surfaces recent closes for undo", () => {
    const key = inboxLoop("sub-1");
    const result = collectLoops({
      invoices: [],
      inbox: [
        {
          id: "sub-1",
          name: "Dana",
          email: "dana@example.com",
          company: null,
          message: "hi",
          status: "new",
          created_at: "2026-08-05T12:00:00.000Z",
        },
      ],
      work: [],
      readyLeadCount: 2,
      checkedListmonkKeys: [
        "templates",
        "sequence",
        "live-form",
        "unsubscribe",
      ],
      events: [
        {
          loop_key: key,
          action: "closed",
          note: "triaged",
          snoozed_until: null,
          created_at: "2026-08-06T11:55:00.000Z",
        },
      ],
      now,
    });

    expect(result.open.every((loop) => loop.key !== key)).toBe(true);
    expect(result.recentlyClosed.some((loop) => loop.key === key)).toBe(true);
    expect(
      result.open.some(
        (loop) => loop.key === cadenceLoop("outbound-weekly", "2026-W32"),
      ),
    ).toBe(true);
  });
});
