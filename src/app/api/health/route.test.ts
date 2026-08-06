import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    public: {
      NEXT_PUBLIC_UMAMI_WEBSITE_ID: undefined as string | undefined,
      NEXT_PUBLIC_UMAMI_SCRIPT_URL: undefined as string | undefined,
    },
    private: {
      SUPABASE_SERVICE_ROLE_KEY: "service-role",
      RESEND_API_KEY: "re_test",
      SENTRY_DSN: undefined as string | undefined,
      CALENDLY_URL: undefined as string | undefined,
    },
  },
  isListmonkConfigured: vi.fn(() => false),
}));

import { env, isListmonkConfigured } from "@/lib/env";
import { GET } from "./route";

describe("GET /api/health", () => {
  beforeEach(() => {
    env.public.NEXT_PUBLIC_UMAMI_WEBSITE_ID = undefined;
    env.public.NEXT_PUBLIC_UMAMI_SCRIPT_URL = undefined;
    env.private.SENTRY_DSN = undefined;
    env.private.CALENDLY_URL = undefined;
    vi.mocked(isListmonkConfigured).mockReturnValue(false);
  });

  it("returns ok with core integrations present", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.integrations).toEqual({
      supabase: true,
      resend: true,
      sentry: false,
      umami: false,
      calendly: false,
      listmonk: false,
    });
  });

  it("flags sidecars when configured", async () => {
    env.public.NEXT_PUBLIC_UMAMI_WEBSITE_ID = "website-id";
    env.public.NEXT_PUBLIC_UMAMI_SCRIPT_URL =
      "https://analytics.nothing.digital/script.js";
    env.private.SENTRY_DSN = "https://key@sentry.io/1";
    env.private.CALENDLY_URL = "https://calendly.com/nothing";
    vi.mocked(isListmonkConfigured).mockReturnValue(true);

    const response = await GET();
    const body = await response.json();

    expect(body.integrations).toEqual({
      supabase: true,
      resend: true,
      sentry: true,
      umami: true,
      calendly: true,
      listmonk: true,
    });
  });
});
