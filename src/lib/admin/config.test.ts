import { describe, expect, it } from "vitest";

import { isInboxStatus, parseAdminEmails } from "@/lib/admin/config";

describe("admin config", () => {
  it("accepts known inbox statuses", () => {
    expect(isInboxStatus("new")).toBe(true);
    expect(isInboxStatus("archived")).toBe(true);
    expect(isInboxStatus("closed")).toBe(false);
  });

  it("parses ADMIN_EMAILS allowlist", () => {
    expect(parseAdminEmails("Owner@Nothing.Digital, ops@example.com")).toEqual([
      "owner@nothing.digital",
      "ops@example.com",
    ]);
    expect(parseAdminEmails(undefined)).toEqual([]);
    expect(parseAdminEmails("")).toEqual([]);
  });
});
