import { describe, expect, it } from "vitest";

import {
  HEALTH_INTEGRATION_KEYS,
  chipToneForConfigured,
  labelForIntegration,
  parseHealthPayload,
} from "@/lib/admin/health";

describe("parseHealthPayload", () => {
  it("returns integrations from a valid body", () => {
    const result = parseHealthPayload({
      status: "ok",
      timestamp: "2026-08-06T12:00:00.000Z",
      integrations: {
        supabase: true,
        resend: true,
        sentry: false,
        umami: true,
        calendly: false,
        listmonk: true,
      },
    });

    expect(result).toEqual({
      ok: true,
      integrations: {
        supabase: true,
        resend: true,
        sentry: false,
        umami: true,
        calendly: false,
        listmonk: true,
      },
    });
  });

  it("returns ok: false for null or malformed payloads", () => {
    expect(parseHealthPayload(null)).toEqual({
      ok: false,
      integrations: {
        supabase: false,
        resend: false,
        sentry: false,
        umami: false,
        calendly: false,
        listmonk: false,
      },
    });
    expect(parseHealthPayload(undefined)).toEqual({
      ok: false,
      integrations: {
        supabase: false,
        resend: false,
        sentry: false,
        umami: false,
        calendly: false,
        listmonk: false,
      },
    });
    expect(parseHealthPayload({ status: "ok" })).toEqual({
      ok: false,
      integrations: {
        supabase: false,
        resend: false,
        sentry: false,
        umami: false,
        calendly: false,
        listmonk: false,
      },
    });
    expect(parseHealthPayload({ integrations: "nope" })).toEqual({
      ok: false,
      integrations: {
        supabase: false,
        resend: false,
        sentry: false,
        umami: false,
        calendly: false,
        listmonk: false,
      },
    });
  });
});

describe("labelForIntegration", () => {
  it("labels every HEALTH_INTEGRATION_KEYS entry", () => {
    for (const key of HEALTH_INTEGRATION_KEYS) {
      expect(labelForIntegration(key).length).toBeGreaterThan(0);
    }
  });
});

describe("chipToneForConfigured", () => {
  it("returns ok tone when configured and missing when not", () => {
    expect(chipToneForConfigured(true)).toBe("ok");
    expect(chipToneForConfigured(false)).toBe("missing");
  });
});
