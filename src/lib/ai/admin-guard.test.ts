import { describe, expect, it, vi } from "vitest";

import {
  AI_DRAFT_FAILED_ERROR,
  AI_DRAFT_RATE_LIMIT_ERROR,
  aiDraftError,
  guardAdminAiDraft,
} from "./admin-guard";

const limit = vi.fn();

vi.mock("@/lib/rate-limit", () => ({
  getRateLimiter: () => ({ limit }),
}));

describe("guardAdminAiDraft", () => {
  it("allows drafts under the limit", async () => {
    limit.mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: 0,
    });
    const result = await guardAdminAiDraft("inbox", {
      email: "Owner@Nothing.Digital",
    } as never);
    expect(result).toEqual({ ok: true });
    expect(limit).toHaveBeenCalledWith("ai-admin:owner@nothing.digital:inbox");
  });

  it("blocks when limited", async () => {
    limit.mockResolvedValue({
      success: false,
      limit: 5,
      remaining: 0,
      reset: 0,
    });
    const result = await guardAdminAiDraft("ops-brief", {
      email: "owner@nothing.digital",
    } as never);
    expect(result).toEqual({ ok: false, error: AI_DRAFT_RATE_LIMIT_ERROR });
  });
});

describe("aiDraftError", () => {
  it("returns a stable message", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(aiDraftError(new Error("secret"))).toBe(AI_DRAFT_FAILED_ERROR);
    spy.mockRestore();
  });
});
