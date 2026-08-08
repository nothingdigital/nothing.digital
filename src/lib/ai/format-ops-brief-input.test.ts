import { describe, expect, it } from "vitest";

import { formatOpsBriefInput } from "@/lib/ai/format-prompt-input";
import type { LoopCollection } from "@/lib/admin/loops/types";

const empty: LoopCollection = { open: [], later: [], recentlyClosed: [] };

describe("formatOpsBriefInput", () => {
  it("returns a stable empty message when no loops", () => {
    expect(formatOpsBriefInput(empty)).toContain("Open: none");
  });

  it("lists open loop titles with source and priority", () => {
    const text = formatOpsBriefInput({
      open: [
        {
          key: "inv-1",
          source: "billing",
          title: "Invoice 104 overdue",
          detail: "Acme · 12d",
          href: "/admin/billing",
          priority: 1,
        },
      ],
      later: [],
      recentlyClosed: [],
    });
    expect(text).toContain("billing");
    expect(text).toContain("Invoice 104 overdue");
    expect(text).toContain("p1");
  });
});
