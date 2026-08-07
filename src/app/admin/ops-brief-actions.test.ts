import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdmin = vi.fn();
const draftOpsBrief = vi.fn();
const isOpsBriefEnabled = vi.fn();

vi.mock("@/lib/admin/auth", () => ({
  requireAdmin: (...args: unknown[]) => requireAdmin(...args),
}));

vi.mock("@/lib/ai", () => ({
  draftOpsBrief: (...args: unknown[]) => draftOpsBrief(...args),
  isOpsBriefEnabled: (...args: unknown[]) => isOpsBriefEnabled(...args),
}));

describe("draftOpsBriefAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue(undefined);
    isOpsBriefEnabled.mockReturnValue(true);
  });

  it("refuses when ops brief disabled", async () => {
    isOpsBriefEnabled.mockReturnValue(false);
    const { draftOpsBriefAction } = await import("./ops-brief-actions");
    const result = await draftOpsBriefAction({
      open: [],
      later: [],
      recentlyClosed: [],
    });
    expect(result).toEqual({
      ok: false,
      error: "Ops brief AI is disabled.",
    });
    expect(draftOpsBrief).not.toHaveBeenCalled();
  });

  it("returns a draft when enabled", async () => {
    draftOpsBrief.mockResolvedValue({
      headline: "Two loops need you",
      bullets: ["Triage inbox"],
      focusHint: "Inbox first.",
    });
    const { draftOpsBriefAction } = await import("./ops-brief-actions");
    const result = await draftOpsBriefAction({
      open: [],
      later: [],
      recentlyClosed: [],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.brief.headline).toBe("Two loops need you");
    }
  });
});
