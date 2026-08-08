import { describe, expect, it } from "vitest";

import { buildNewsletterCsv, escapeCsvField } from "./newsletter-csv";

describe("escapeCsvField", () => {
  it("returns plain values unchanged", () => {
    expect(escapeCsvField("hello")).toBe("hello");
    expect(escapeCsvField("user@example.com")).toBe("user@example.com");
  });

  it("quotes values with commas, quotes, or newlines", () => {
    expect(escapeCsvField("a,b")).toBe('"a,b"');
    expect(escapeCsvField('say "hi"')).toBe('"say ""hi"""');
    expect(escapeCsvField("line1\nline2")).toBe('"line1\nline2"');
  });
});

describe("buildNewsletterCsv", () => {
  it("emits header and active/unsubscribed status rows", () => {
    const csv = buildNewsletterCsv([
      {
        email: "active@example.com",
        subscribed_at: "2026-01-02T00:00:00.000Z",
        unsubscribed_at: null,
      },
      {
        email: "gone@example.com",
        subscribed_at: "2026-01-01T00:00:00.000Z",
        unsubscribed_at: "2026-02-01T00:00:00.000Z",
      },
    ]);

    expect(csv).toBe(
      [
        "email,subscribed_at,status,unsubscribed_at",
        "active@example.com,2026-01-02T00:00:00.000Z,active,",
        "gone@example.com,2026-01-01T00:00:00.000Z,unsubscribed,2026-02-01T00:00:00.000Z",
      ].join("\n"),
    );
  });
});
