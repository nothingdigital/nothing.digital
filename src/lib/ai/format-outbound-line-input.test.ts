import { describe, expect, it } from "vitest";

import { formatOutboundLineInput } from "@/lib/ai/format-prompt-input";

describe("formatOutboundLineInput", () => {
  it("includes lead facts from the input only", () => {
    const text = formatOutboundLineInput({
      name: "Acme Plumbing",
      website: "https://acmeplumbing.com",
      city: "Northport, AL",
      vertical: "trades",
      reasons: ["thin-site", "local"],
    });
    expect(text).toContain("Acme Plumbing");
    expect(text).toContain("https://acmeplumbing.com");
    expect(text).toContain("Northport, AL");
    expect(text).toContain("thin-site | local");
  });
});
