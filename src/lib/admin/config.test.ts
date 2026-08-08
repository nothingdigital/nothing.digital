import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    public: {
      NEXT_PUBLIC_SITE_URL: undefined as string | undefined,
    },
    private: {
      ADMIN_EMAILS: undefined as string | undefined,
      CALENDLY_URL: undefined as string | undefined,
      UMAMI_DASHBOARD_URL: undefined as string | undefined,
      LISTMONK_DASHBOARD_URL: undefined as string | undefined,
      N8N_DASHBOARD_URL: undefined as string | undefined,
      KUMA_DASHBOARD_URL: undefined as string | undefined,
      UPTIMEROBOT_DASHBOARD_URL: undefined as string | undefined,
    },
  },
}));

import { env } from "@/lib/env";
import {
  getAdminToolLinks,
  isInboxStatus,
  parseAdminEmails,
} from "@/lib/admin/config";

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

  it("includes tools.uptimerobot when UPTIMEROBOT_DASHBOARD_URL is set", () => {
    env.private.UPTIMEROBOT_DASHBOARD_URL = "https://dashboard.uptimerobot.com";
    expect(getAdminToolLinks().uptimerobot).toBe(
      "https://dashboard.uptimerobot.com",
    );
    env.private.UPTIMEROBOT_DASHBOARD_URL = undefined;
  });

  it("omits tools.uptimerobot when UPTIMEROBOT_DASHBOARD_URL is unset", () => {
    env.private.UPTIMEROBOT_DASHBOARD_URL = undefined;
    expect(getAdminToolLinks().uptimerobot).toBeUndefined();
  });

  it("always includes Instantly dashboard link", () => {
    expect(getAdminToolLinks().instantly).toBe("https://app.instantly.ai");
  });
});
