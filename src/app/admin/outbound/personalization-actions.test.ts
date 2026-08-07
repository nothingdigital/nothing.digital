import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdmin = vi.fn();
const getLeadCandidate = vi.fn();
const updateLeadCandidate = vi.fn();
const draftOutboundPersonalization = vi.fn();
const isOutboundPersonalizationEnabled = vi.fn();
const revalidatePath = vi.fn();

vi.mock("@/lib/admin/auth", () => ({
  requireAdmin: (...args: unknown[]) => requireAdmin(...args),
}));

vi.mock("@/lib/admin/outbound/queries", () => ({
  getLeadCandidate: (...args: unknown[]) => getLeadCandidate(...args),
  updateLeadCandidate: (...args: unknown[]) => updateLeadCandidate(...args),
  addDoNotContact: vi.fn(),
  importLeadCandidates: vi.fn(),
}));

vi.mock("@/lib/admin/outbound/parse-csv", () => ({
  parseLeadFinderCsv: vi.fn(),
}));

vi.mock("@/lib/ai", () => ({
  draftOutboundPersonalization: (...args: unknown[]) =>
    draftOutboundPersonalization(...args),
  isOutboundPersonalizationEnabled: (...args: unknown[]) =>
    isOutboundPersonalizationEnabled(...args),
}));

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

const lead = {
  id: "lead-1",
  name: "Acme Plumbing",
  website: "https://acmeplumbing.com",
  city: "Northport, AL",
  vertical: "trades",
  reasons: ["thin-site"],
  email: "owner@acmeplumbing.com",
  status: "approved",
  personalization: null,
};

describe("draftOutboundPersonalizationAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue(undefined);
    isOutboundPersonalizationEnabled.mockReturnValue(true);
  });

  it("refuses when disabled", async () => {
    isOutboundPersonalizationEnabled.mockReturnValue(false);
    const { draftOutboundPersonalizationAction } = await import("./actions");
    const result = await draftOutboundPersonalizationAction("lead-1");
    expect(result).toEqual({
      ok: false,
      error: "Outbound personalization AI is disabled.",
    });
    expect(draftOutboundPersonalization).not.toHaveBeenCalled();
  });

  it("returns a draft for a known lead", async () => {
    getLeadCandidate.mockResolvedValue({ row: lead, error: null });
    draftOutboundPersonalization.mockResolvedValue({
      line: "Noticed your Northport plumbing site could clarify services.",
    });

    const { draftOutboundPersonalizationAction } = await import("./actions");
    const result = await draftOutboundPersonalizationAction("lead-1");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.draft.line).toContain("Northport");
    }
  });
});

describe("saveOutboundPersonalizationAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue(undefined);
  });

  it("persists an approved line", async () => {
    updateLeadCandidate.mockResolvedValue({ error: null });
    const { saveOutboundPersonalizationAction } = await import("./actions");
    const result = await saveOutboundPersonalizationAction(
      "lead-1",
      "Noticed your Northport plumbing site could clarify services.",
    );
    expect(result).toEqual({ ok: true });
    expect(updateLeadCandidate).toHaveBeenCalledWith({
      id: "lead-1",
      personalization:
        "Noticed your Northport plumbing site could clarify services.",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/outbound");
  });

  it("refuses a line that is too short", async () => {
    const { saveOutboundPersonalizationAction } = await import("./actions");
    const result = await saveOutboundPersonalizationAction("lead-1", "Hi");
    expect(result.ok).toBe(false);
    expect(updateLeadCandidate).not.toHaveBeenCalled();
  });
});
