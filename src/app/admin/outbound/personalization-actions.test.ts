import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdmin = vi.fn();
const updateLeadCandidate = vi.fn();
const revalidatePath = vi.fn();

vi.mock("@/lib/admin/auth", () => ({
  requireAdmin: (...args: unknown[]) => requireAdmin(...args),
}));

vi.mock("@/lib/admin/outbound/queries", () => ({
  updateLeadCandidate: (...args: unknown[]) => updateLeadCandidate(...args),
  addDoNotContact: vi.fn(),
  importLeadCandidates: vi.fn(),
}));

vi.mock("@/lib/admin/outbound/parse-csv", () => ({
  parseLeadFinderCsv: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

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
