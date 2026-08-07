import { describe, expect, it } from "vitest";

import { buildClientNotesFromSubmission } from "./inbox-lead";

const base = {
  id: "sub-123",
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  service: "web" as string | null,
  budget: "$5k–$10k" as string | null,
  message: "  Need a new site.  ",
  status: "new",
  created_at: "2026-08-01T00:00:00Z",
  updated_at: "2026-08-01T00:00:00Z",
};

describe("buildClientNotesFromSubmission", () => {
  it("includes service, budget, and trimmed message", () => {
    expect(buildClientNotesFromSubmission(base)).toBe(
      [
        "Inbox lead sub-123",
        "Service: web",
        "Budget: $5k–$10k",
        "",
        "Need a new site.",
      ].join("\n"),
    );
  });

  it("omits null service and budget", () => {
    expect(
      buildClientNotesFromSubmission({
        ...base,
        service: null,
        budget: null,
        message: "Hello",
      }),
    ).toBe(["Inbox lead sub-123", "", "Hello"].join("\n"));
  });
});
