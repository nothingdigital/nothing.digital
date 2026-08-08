import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdmin = vi.fn();
const draftOpsBrief = vi.fn();
const isAiEnabled = vi.fn();
const loadTodayLoopCollection = vi.fn();
const guardAdminAiDraft = vi.fn();
const aiDraftError = vi.fn();

vi.mock("@/lib/admin/auth", () => ({
  requireAdmin: (...args: unknown[]) => requireAdmin(...args),
}));

vi.mock("@/lib/admin/loops/load-today", () => ({
  loadTodayLoopCollection: (...args: unknown[]) =>
    loadTodayLoopCollection(...args),
}));

vi.mock("@/lib/ai", () => ({
  draftOpsBrief: (...args: unknown[]) => draftOpsBrief(...args),
  isAiEnabled: (...args: unknown[]) => isAiEnabled(...args),
}));

vi.mock("@/lib/ai/admin-guard", () => ({
  AI_DRAFT_FAILED_ERROR: "Draft failed. Try again.",
  guardAdminAiDraft: (...args: unknown[]) => guardAdminAiDraft(...args),
  aiDraftError: (...args: unknown[]) => aiDraftError(...args),
}));

const adminUser = { email: "owner@nothing.digital" };

describe("draftOpsBriefAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue(adminUser);
    isAiEnabled.mockReturnValue(true);
    guardAdminAiDraft.mockResolvedValue({ ok: true });
    loadTodayLoopCollection.mockResolvedValue({
      collection: { open: [], later: [], recentlyClosed: [] },
      dataError: null,
      glance: { inbox: 0, overdue: 0, work: 0 },
    });
    aiDraftError.mockReturnValue("Draft failed. Try again.");
  });

  it("refuses when ops brief disabled", async () => {
    isAiEnabled.mockReturnValue(false);
    const { draftOpsBriefAction } = await import("./ops-brief-actions");
    const result = await draftOpsBriefAction();
    expect(result).toEqual({
      ok: false,
      error: "Ops brief AI is disabled.",
    });
    expect(draftOpsBrief).not.toHaveBeenCalled();
    expect(loadTodayLoopCollection).not.toHaveBeenCalled();
  });

  it("refuses when rate limited", async () => {
    guardAdminAiDraft.mockResolvedValue({
      ok: false,
      error: "Too many AI drafts. Try again in an hour.",
    });
    const { draftOpsBriefAction } = await import("./ops-brief-actions");
    const result = await draftOpsBriefAction();
    expect(result).toEqual({
      ok: false,
      error: "Too many AI drafts. Try again in an hour.",
    });
    expect(draftOpsBrief).not.toHaveBeenCalled();
  });

  it("loads loops server-side and returns a draft", async () => {
    draftOpsBrief.mockResolvedValue({
      headline: "Two loops need you",
      bullets: ["Triage inbox"],
      focusHint: "Inbox first.",
    });
    const { draftOpsBriefAction } = await import("./ops-brief-actions");
    const result = await draftOpsBriefAction();
    expect(loadTodayLoopCollection).toHaveBeenCalledOnce();
    expect(draftOpsBrief).toHaveBeenCalledWith({
      open: [],
      later: [],
      recentlyClosed: [],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.brief.headline).toBe("Two loops need you");
    }
  });

  it("sanitizes provider errors", async () => {
    draftOpsBrief.mockRejectedValue(new Error("gateway secret leaked"));
    const { draftOpsBriefAction } = await import("./ops-brief-actions");
    const result = await draftOpsBriefAction();
    expect(result).toEqual({
      ok: false,
      error: "Draft failed. Try again.",
    });
    expect(aiDraftError).toHaveBeenCalled();
  });
});
