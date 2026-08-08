import { describe, expect, it } from "vitest";

import { formatInvoiceCoverInput } from "@/lib/ai/format-prompt-input";

describe("formatInvoiceCoverInput", () => {
  it("includes invoice facts and does not invent a second amount", () => {
    const text = formatInvoiceCoverInput({
      clientName: "Acme",
      number: "INV-104",
      title: "Website redesign",
      amountLabel: "$4,500.00",
      dueLabel: "Aug 15, 2026",
      notes: "Net 15",
    });

    expect(text).toContain("Client: Acme");
    expect(text).toContain("Invoice: INV-104");
    expect(text).toContain("Amount: $4,500.00");
    expect(text).toContain("Due: Aug 15, 2026");
    expect(text.match(/Amount:/g)).toHaveLength(1);
  });

  it("uses em dash placeholders for missing due/notes", () => {
    const text = formatInvoiceCoverInput({
      clientName: "Acme",
      number: "INV-1",
      title: "Retainer",
      amountLabel: "$100.00",
      dueLabel: null,
      notes: null,
    });
    expect(text).toContain("Due: —");
    expect(text).toContain("Internal notes: —");
  });
});
