import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdmin = vi.fn();
const getContactSubmission = vi.fn();
const updateContactStatus = vi.fn();
const draftInboxReply = vi.fn();
const isAiEnabled = vi.fn();
const getResendClient = vi.fn();
const revalidatePath = vi.fn();
const guardAdminAiDraft = vi.fn();
const aiDraftError = vi.fn();

vi.mock("@/lib/admin/auth", () => ({
  requireAdmin: (...args: unknown[]) => requireAdmin(...args),
}));

vi.mock("@/lib/admin/queries", () => ({
  getContactSubmission: (...args: unknown[]) => getContactSubmission(...args),
  updateContactStatus: (...args: unknown[]) => updateContactStatus(...args),
  listContactSubmissions: vi.fn(),
}));

vi.mock("@/lib/admin/client-ops-queries", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/ai", () => ({
  draftInboxReply: (...args: unknown[]) => draftInboxReply(...args),
  isAiEnabled: (...args: unknown[]) => isAiEnabled(...args),
}));

vi.mock("@/lib/ai/admin-guard", () => ({
  guardAdminAiDraft: (...args: unknown[]) => guardAdminAiDraft(...args),
  aiDraftError: (...args: unknown[]) => aiDraftError(...args),
}));

vi.mock("@/lib/resend", () => ({
  getResendClient: (...args: unknown[]) => getResendClient(...args),
}));

vi.mock("@/lib/env", () => ({
  env: {
    private: {
      CONTACT_NOTIFY_EMAIL: "team@nothing.digital",
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

const submission = {
  id: "sub-1",
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  service: "website-development",
  budget: "5k-15k",
  message: "Need a site",
  status: "new",
  created_at: "2026-08-01T00:00:00Z",
  updated_at: "2026-08-01T00:00:00Z",
};

describe("draftInboxReplyAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue({ email: "owner@nothing.digital" });
    isAiEnabled.mockReturnValue(true);
    guardAdminAiDraft.mockResolvedValue({ ok: true });
    aiDraftError.mockReturnValue("Draft failed. Try again.");
  });

  it("refuses when drafts are disabled", async () => {
    isAiEnabled.mockReturnValue(false);
    const { draftInboxReplyAction } = await import("./actions");
    const result = await draftInboxReplyAction("sub-1");
    expect(result).toEqual({
      ok: false,
      error: "Inbox AI drafts are disabled.",
    });
  });

  it("refuses when rate limited", async () => {
    guardAdminAiDraft.mockResolvedValue({
      ok: false,
      error: "Too many AI drafts. Try again in an hour.",
    });
    const { draftInboxReplyAction } = await import("./actions");
    const result = await draftInboxReplyAction("sub-1");
    expect(result).toEqual({
      ok: false,
      error: "Too many AI drafts. Try again in an hour.",
    });
    expect(draftInboxReply).not.toHaveBeenCalled();
  });

  it("returns a draft for a known submission", async () => {
    getContactSubmission.mockResolvedValue({ row: submission, error: null });
    draftInboxReply.mockResolvedValue({
      triage: "good-fit",
      triageReason: "Clear ask",
      subject: "Re: your site",
      body: "Thanks for writing in.",
    });

    const { draftInboxReplyAction } = await import("./actions");
    const result = await draftInboxReplyAction("sub-1");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.draft.subject).toBe("Re: your site");
    }
  });
});

describe("sendInboxReplyAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue(undefined);
    isAiEnabled.mockReturnValue(true);
  });

  it("sends via Resend and marks replied", async () => {
    getContactSubmission.mockResolvedValue({ row: submission, error: null });
    const send = vi.fn().mockResolvedValue({ id: "email-1" });
    getResendClient.mockReturnValue({ emails: { send } });
    updateContactStatus.mockResolvedValue({ ok: true });

    const { sendInboxReplyAction } = await import("./actions");
    const result = await sendInboxReplyAction({
      submissionId: "sub-1",
      subject: "Re: your site",
      body: "Thanks for writing in.",
    });

    expect(result).toEqual({ ok: true });
    expect(send).toHaveBeenCalledOnce();
    expect(updateContactStatus).toHaveBeenCalledWith("sub-1", "replied");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/inbox");
  });

  it("does not flip status when Resend is missing", async () => {
    getContactSubmission.mockResolvedValue({ row: submission, error: null });
    getResendClient.mockReturnValue(null);

    const { sendInboxReplyAction } = await import("./actions");
    const result = await sendInboxReplyAction({
      submissionId: "sub-1",
      subject: "Re: your site",
      body: "Thanks for writing in.",
    });

    expect(result.ok).toBe(false);
    expect(updateContactStatus).not.toHaveBeenCalled();
  });
});
