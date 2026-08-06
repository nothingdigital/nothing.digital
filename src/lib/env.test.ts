import { afterEach, describe, expect, it, vi } from "vitest";

describe("env field isolation", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("keeps valid keys when one optional field is invalid", async () => {
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CALENDLY_URL", "https://calendly.com/nothing");
    // Common mistake: Listmonk numeric id instead of public UUID
    vi.stubEnv("LISTMONK_LIST_UUID", "3");
    vi.stubEnv("LISTMONK_URL", "https://newsletter.nothing.digital");

    const { env, isListmonkConfigured } = await import("@/lib/env");

    expect(env.private.SUPABASE_SERVICE_ROLE_KEY).toBe("service-role-key");
    expect(env.private.RESEND_API_KEY).toBe("re_test");
    expect(env.private.CALENDLY_URL).toBe("https://calendly.com/nothing");
    expect(env.private.LISTMONK_URL).toBe("https://newsletter.nothing.digital");
    expect(env.private.LISTMONK_LIST_UUID).toBeUndefined();
    expect(isListmonkConfigured()).toBe(false);
  });

  it("treats empty strings as unset", async () => {
    vi.stubEnv("CALENDLY_URL", "");
    vi.stubEnv("SENTRY_DSN", "");
    vi.stubEnv("ADMIN_EMAILS", "owner@nothing.digital");

    const { env } = await import("@/lib/env");

    expect(env.private.CALENDLY_URL).toBeUndefined();
    expect(env.private.SENTRY_DSN).toBeUndefined();
    expect(env.private.ADMIN_EMAILS).toBe("owner@nothing.digital");
  });
});
