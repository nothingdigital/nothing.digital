import { beforeEach, describe, expect, it, vi } from "vitest";

const isBriefAssistantEnabled = vi.fn();
const draftProjectBrief = vi.fn();
const getRateLimiter = vi.fn();
const getClientIp = vi.fn();

vi.mock("@/lib/ai", () => ({
  isBriefAssistantEnabled: (...args: unknown[]) =>
    isBriefAssistantEnabled(...args),
  draftProjectBrief: (...args: unknown[]) => draftProjectBrief(...args),
}));

vi.mock("@/lib/rate-limit", () => ({
  getRateLimiter: (...args: unknown[]) => getRateLimiter(...args),
}));

vi.mock("@/lib/request", () => ({
  getClientIp: (...args: unknown[]) => getClientIp(...args),
}));

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/ai/brief", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as import("next/server").NextRequest;
}

describe("POST /api/ai/brief", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isBriefAssistantEnabled.mockReturnValue(true);
    getClientIp.mockReturnValue("127.0.0.1");
    getRateLimiter.mockReturnValue({
      limit: vi.fn().mockResolvedValue({
        success: true,
        limit: 5,
        remaining: 4,
        reset: Date.now() + 1000,
      }),
    });
  });

  it("returns 403 when disabled", async () => {
    isBriefAssistantEnabled.mockReturnValue(false);
    const { POST } = await import("./route");
    const response = await POST(jsonRequest({ goal: "x" }));
    expect(response.status).toBe(403);
  });

  it("returns a crafted brief when honeypot is filled", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      jsonRequest({
        goal: "Launch",
        currentState: "None",
        mustHaves: "Site",
        timelineFeel: "Soon",
        website: "http://spam.test",
      }),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.suggestedService).toBeNull();
    expect(draftProjectBrief).not.toHaveBeenCalled();
  });

  it("returns model output on success", async () => {
    draftProjectBrief.mockResolvedValue({
      message: "I need a new website with a clear booking path.",
      suggestedService: "website-development",
      suggestedBudget: "5k-15k",
    });

    const { POST } = await import("./route");
    const response = await POST(
      jsonRequest({
        goal: "Launch",
        currentState: "None",
        mustHaves: "Site",
        timelineFeel: "Soon",
      }),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.message).toContain("website");
  });
});
