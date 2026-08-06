import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    private: {
      RESEND_API_KEY: "re_test",
      SUPABASE_SERVICE_ROLE_KEY: "sb_test",
      LISTMONK_URL: undefined,
      LISTMONK_LIST_UUID: undefined,
    },
    public: {
      NEXT_PUBLIC_SUPABASE_URL: "https://sb.example.com",
    },
  },
  isListmonkConfigured: vi.fn(() => false),
  isN8nConfigured: vi.fn(() => false),
}));

vi.mock("@/lib/rate-limit", () => {
  const limit = vi.fn();
  return {
    getRateLimiter: vi.fn(() => ({ limit })),
  };
});

vi.mock("@/lib/resend", () => ({
  getResendClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  getServiceRoleClient: vi.fn(),
}));

vi.mock("@/lib/listmonk", () => ({
  subscribeToListmonk: vi.fn(),
}));

vi.mock("@/lib/n8n", () => ({
  notifyN8n: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "./route";
import { getRateLimiter } from "@/lib/rate-limit";
import { getResendClient } from "@/lib/resend";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { subscribeToListmonk } from "@/lib/listmonk";
import { isListmonkConfigured } from "@/lib/env";
import { notifyN8n } from "@/lib/n8n";
import type { SupabaseClient } from "@supabase/supabase-js";

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;
}

function makeSupabaseClient(error: { message: string } | null = null) {
  const client = {
    from: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockResolvedValue({ error }),
  };
  return client as unknown as SupabaseClient;
}

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    vi.mocked(getRateLimiter().limit)
      .mockReset()
      .mockResolvedValue({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 60 * 60 * 1000,
      });

    vi.mocked(getResendClient)
      .mockReset()
      .mockReturnValue({
        emails: {
          send: vi.fn().mockResolvedValue({ id: "email-id" }),
        },
      } as never);

    vi.mocked(getServiceRoleClient)
      .mockReset()
      .mockReturnValue(makeSupabaseClient());

    vi.mocked(isListmonkConfigured).mockReturnValue(false);
    vi.mocked(subscribeToListmonk).mockReset();
    vi.mocked(notifyN8n).mockClear();
  });

  it("returns 400 for invalid JSON", async () => {
    const request = new Request("http://localhost/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    }) as unknown as import("next/server").NextRequest;

    const response = await POST(request);
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid JSON body",
    });
  });

  it("returns 400 with validation details for bad email", async () => {
    const response = await POST(makeRequest({ email: "not-an-email" }));

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe("Validation failed");
    expect(json.details).toEqual(expect.any(Array));
  });

  it("returns 429 when rate limiter rejects", async () => {
    vi.mocked(getRateLimiter().limit).mockResolvedValue({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Date.now() + 60 * 60 * 1000,
    });

    const response = await POST(makeRequest({ email: "jane@example.com" }));

    expect(response.status).toBe(429);
    expect(subscribeToListmonk).not.toHaveBeenCalled();
  });

  it("subscribes via Listmonk when configured and succeeds", async () => {
    vi.mocked(isListmonkConfigured).mockReturnValue(true);
    vi.mocked(subscribeToListmonk).mockResolvedValue({ ok: true });

    const response = await POST(makeRequest({ email: "jane@example.com" }));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: "Check your email to confirm your subscription.",
    });
    expect(subscribeToListmonk).toHaveBeenCalledWith("jane@example.com");
    await vi.waitFor(() =>
      expect(notifyN8n).toHaveBeenCalledWith(
        "newsletter",
        expect.objectContaining({
          email: "jane@example.com",
          provider: "listmonk",
        }),
      ),
    );
  });

  it("returns 502 when Listmonk subscription fails", async () => {
    vi.mocked(isListmonkConfigured).mockReturnValue(true);
    vi.mocked(subscribeToListmonk).mockResolvedValue({
      ok: false,
      reason: "upstream",
    });

    const response = await POST(makeRequest({ email: "jane@example.com" }));

    expect(response.status).toBe(502);
  });

  it("falls back to Supabase + Resend when Listmonk is not configured", async () => {
    const response = await POST(makeRequest({ email: "jane@example.com" }));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: "Subscribed successfully",
    });

    expect(getServiceRoleClient).toHaveBeenCalled();
    expect(getResendClient).toHaveBeenCalled();

    const resend = vi.mocked(getResendClient).mock.results[0].value as {
      emails: { send: ReturnType<typeof vi.fn> };
    };
    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "jane@example.com",
        subject: "Welcome to Nothing.Digital newsletter",
      }),
    );

    await vi.waitFor(() =>
      expect(notifyN8n).toHaveBeenCalledWith(
        "newsletter",
        expect.objectContaining({
          email: "jane@example.com",
          provider: "supabase",
        }),
      ),
    );
  });

  it("returns 201 and skips welcome email when Resend is unavailable", async () => {
    vi.mocked(getResendClient).mockReturnValue(null);

    const response = await POST(makeRequest({ email: "jane@example.com" }));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: "Subscribed successfully",
    });
    expect(getServiceRoleClient).toHaveBeenCalled();
  });

  it("returns 201 even when Supabase upsert fails", async () => {
    vi.mocked(getServiceRoleClient).mockReturnValue(
      makeSupabaseClient({ message: "upsert failed" }),
    );
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(makeRequest({ email: "jane@example.com" }));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: "Subscribed successfully",
    });
    expect(errorSpy).toHaveBeenCalledWith(
      "[newsletter] Supabase upsert failed:",
      "upsert failed",
    );

    errorSpy.mockRestore();
  });
});
