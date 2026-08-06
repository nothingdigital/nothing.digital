import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    private: {
      CONTACT_NOTIFY_EMAIL: "team@example.com",
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

vi.mock("@/lib/n8n", () => ({
  notifyN8n: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "./route";
import { getRateLimiter } from "@/lib/rate-limit";
import { getResendClient } from "@/lib/resend";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { notifyN8n } from "@/lib/n8n";
import type { SupabaseClient } from "@supabase/supabase-js";

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;
}

function makeSupabaseClient(
  submissionId = "sub-1",
  error: { message: string } | null = null,
) {
  const client = {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: submissionId }, error }),
  };
  return client as unknown as SupabaseClient;
}

describe("POST /api/contact", () => {
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

    vi.mocked(notifyN8n).mockClear();
  });

  it("returns 400 for invalid JSON", async () => {
    const request = new Request("http://localhost/api/contact", {
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

  it("returns 400 with validation details for missing fields", async () => {
    const response = await POST(makeRequest({ email: "a@b.com" }));

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe("Validation failed");
    expect(json.details).toEqual(expect.any(Array));
  });

  it("returns 201 for honeypot submissions without side effects", async () => {
    const response = await POST(
      makeRequest({
        name: "Bot",
        email: "bot@example.com",
        message: "spam text here",
        website: "https://spam.example",
      }),
    );

    expect(response.status).toBe(201);
    expect(getServiceRoleClient).not.toHaveBeenCalled();
    expect(getResendClient).not.toHaveBeenCalled();
  });

  it("returns 429 when rate limiter rejects", async () => {
    vi.mocked(getRateLimiter().limit).mockResolvedValue({
      success: false,
      limit: 5,
      remaining: 0,
      reset: Date.now() + 60 * 60 * 1000,
    });

    const response = await POST(
      makeRequest({
        name: "Jane",
        email: "jane@example.com",
        message: "I need a new website.",
      }),
    );

    expect(response.status).toBe(429);
    expect(getServiceRoleClient).not.toHaveBeenCalled();
  });

  it("returns 500 when Supabase insert fails", async () => {
    vi.mocked(getServiceRoleClient).mockReturnValue(
      makeSupabaseClient("sub-1", { message: "insert failed" }),
    );

    const response = await POST(
      makeRequest({
        name: "Jane",
        email: "jane@example.com",
        message: "I need a new website.",
      }),
    );

    expect(response.status).toBe(500);
  });

  it("returns 500 when Resend client is unavailable", async () => {
    vi.mocked(getResendClient).mockReturnValue(null);

    const response = await POST(
      makeRequest({
        name: "Jane",
        email: "jane@example.com",
        message: "I need a new website.",
      }),
    );

    expect(response.status).toBe(500);
  });

  it("returns 500 when email delivery fails", async () => {
    vi.mocked(getResendClient).mockReturnValue({
      emails: { send: vi.fn().mockRejectedValue(new Error("SMTP down")) },
    } as never);

    const response = await POST(
      makeRequest({
        name: "Jane",
        email: "jane@example.com",
        message: "I need a new website.",
      }),
    );

    expect(response.status).toBe(500);
  });

  it("returns 201 and stores submission, sends emails, and fans out", async () => {
    const response = await POST(
      makeRequest({
        name: "Jane",
        email: "jane@example.com",
        company: "Acme",
        service: "website-development",
        budget: "5k-15k",
        message: "I need a new website.",
      }),
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: "Submission received",
    });

    expect(getServiceRoleClient).toHaveBeenCalled();

    const resend = vi.mocked(getResendClient).mock.results[0].value as {
      emails: { send: ReturnType<typeof vi.fn> };
    };
    expect(resend.emails.send).toHaveBeenCalledTimes(2);

    await vi.waitFor(() => expect(notifyN8n).toHaveBeenCalledOnce());
    expect(vi.mocked(notifyN8n)).toHaveBeenCalledWith(
      "contact",
      expect.objectContaining({
        name: "Jane",
        email: "jane@example.com",
        company: "Acme",
        service: "website-development",
      }),
    );
  });
});
