import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdmin = vi.fn();
const getInvoice = vi.fn();
const updateInvoiceStatus = vi.fn();
const updateInvoiceSentEmailedAt = vi.fn();
const draftInvoiceCoverNote = vi.fn();
const isInvoiceCoverEnabled = vi.fn();
const buildInvoiceEmailContext = vi.fn();
const sendInvoiceSentEmail = vi.fn();
const revalidatePath = vi.fn();
const guardAdminAiDraft = vi.fn();
const aiDraftError = vi.fn();

vi.mock("@/lib/admin/auth", () => ({
  requireAdmin: (...args: unknown[]) => requireAdmin(...args),
}));

vi.mock("@/lib/admin/client-ops-queries", () => ({
  getInvoice: (...args: unknown[]) => getInvoice(...args),
  updateInvoiceStatus: (...args: unknown[]) => updateInvoiceStatus(...args),
  updateInvoiceSentEmailedAt: (...args: unknown[]) =>
    updateInvoiceSentEmailedAt(...args),
  createClient: vi.fn(),
  createInvoice: vi.fn(),
  updateInvoice: vi.fn(),
  createClientAsset: vi.fn(),
  updateClient: vi.fn(),
  updateClientAsset: vi.fn(),
  updateClientAssetStatus: vi.fn(),
  createWorkItem: vi.fn(),
  updateWorkItem: vi.fn(),
  updateWorkItemStatus: vi.fn(),
  deleteWorkItem: vi.fn(),
}));

vi.mock("@/lib/ai", () => ({
  draftInvoiceCoverNote: (...args: unknown[]) => draftInvoiceCoverNote(...args),
  isInvoiceCoverEnabled: (...args: unknown[]) => isInvoiceCoverEnabled(...args),
}));

vi.mock("@/lib/ai/admin-guard", () => ({
  guardAdminAiDraft: (...args: unknown[]) => guardAdminAiDraft(...args),
  aiDraftError: (...args: unknown[]) => aiDraftError(...args),
}));

vi.mock("@/lib/invoices/invoice-email-context", () => ({
  buildInvoiceEmailContext: (...args: unknown[]) =>
    buildInvoiceEmailContext(...args),
}));

vi.mock("@/lib/invoices/send-invoice-email", () => ({
  sendInvoiceSentEmail: (...args: unknown[]) => sendInvoiceSentEmail(...args),
}));

vi.mock("@/lib/pdf/resolve-view", () => ({
  ensureInvoicePdf: vi.fn(),
}));

vi.mock("@/lib/documents/queries", () => ({
  createDocumentWithUpload: vi.fn(),
  isDocumentKind: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

const invoiceRow = {
  id: "inv-1",
  client_id: "client-1",
  number: "INV-104",
  title: "Website",
  amount_cents: 450000,
  currency: "USD",
  status: "draft",
  issued_at: null,
  due_at: null,
  paid_at: null,
  external_url: null,
  storage_path: null,
  view_token: null,
  sent_emailed_at: null,
  notes: null,
  created_at: "2026-08-01T00:00:00Z",
  updated_at: "2026-08-01T00:00:00Z",
};

const emailContext = {
  invoiceId: "inv-1",
  to: "ada@example.com",
  clientName: "Ada",
  number: "INV-104",
  title: "Website",
  amount_cents: 450000,
  currency: "USD",
  due_at: null,
  notes: null,
  viewUrl: "https://nothing.digital/v/token",
  status: "sent",
  sentEmailedAt: null,
  coverFacts: {
    clientName: "Ada",
    number: "INV-104",
    title: "Website",
    amountLabel: "$4,500.00",
    dueLabel: null,
    notes: null,
  },
};

describe("updateInvoiceStatusAction invoice email gating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue(undefined);
    getInvoice.mockResolvedValue({ row: invoiceRow, error: null });
    updateInvoiceStatus.mockResolvedValue({ ok: true });
  });

  it("auto-sends when cover flag is off", async () => {
    isInvoiceCoverEnabled.mockReturnValue(false);
    buildInvoiceEmailContext.mockResolvedValue({
      ok: true,
      context: emailContext,
    });
    sendInvoiceSentEmail.mockResolvedValue({ ok: true });
    updateInvoiceSentEmailedAt.mockResolvedValue({ ok: true });

    const { updateInvoiceStatusAction } = await import("./actions");
    await updateInvoiceStatusAction("inv-1", "sent", "client-1");

    expect(sendInvoiceSentEmail).toHaveBeenCalledOnce();
  });

  it("does not auto-send when cover flag is on", async () => {
    isInvoiceCoverEnabled.mockReturnValue(true);

    const { updateInvoiceStatusAction } = await import("./actions");
    await updateInvoiceStatusAction("inv-1", "sent", "client-1");

    expect(sendInvoiceSentEmail).not.toHaveBeenCalled();
    expect(buildInvoiceEmailContext).not.toHaveBeenCalled();
  });
});

describe("draftInvoiceCoverAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue({ email: "owner@nothing.digital" });
    isInvoiceCoverEnabled.mockReturnValue(true);
    guardAdminAiDraft.mockResolvedValue({ ok: true });
    aiDraftError.mockReturnValue("Draft failed. Try again.");
  });

  it("refuses when disabled", async () => {
    isInvoiceCoverEnabled.mockReturnValue(false);
    const { draftInvoiceCoverAction } = await import("./actions");
    const result = await draftInvoiceCoverAction("inv-1");
    expect(result).toEqual({
      ok: false,
      error: "Invoice cover AI is disabled.",
    });
    expect(draftInvoiceCoverNote).not.toHaveBeenCalled();
  });

  it("returns a draft without sending", async () => {
    buildInvoiceEmailContext.mockResolvedValue({
      ok: true,
      context: emailContext,
    });
    draftInvoiceCoverNote.mockResolvedValue({
      subject: "Invoice INV-104 from Nothing.Digital",
      coverNote: "Your invoice is ready.",
    });

    const { draftInvoiceCoverAction } = await import("./actions");
    const result = await draftInvoiceCoverAction("inv-1");
    expect(result.ok).toBe(true);
    expect(sendInvoiceSentEmail).not.toHaveBeenCalled();
  });
});

describe("sendPendingInvoiceEmailAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue(undefined);
    isInvoiceCoverEnabled.mockReturnValue(true);
  });

  it("refuses cover path when cover flag is off", async () => {
    isInvoiceCoverEnabled.mockReturnValue(false);
    const { sendPendingInvoiceEmailAction } = await import("./actions");
    const result = await sendPendingInvoiceEmailAction("inv-1", {
      subject: "Invoice INV-104 from Nothing.Digital",
      coverNote: "Edited cover note with unique token.",
    });
    expect(result).toEqual({
      ok: false,
      error: "Invoice cover AI is disabled.",
    });
    expect(buildInvoiceEmailContext).not.toHaveBeenCalled();
    expect(sendInvoiceSentEmail).not.toHaveBeenCalled();
  });

  it("refuses when invoice status is not sent", async () => {
    buildInvoiceEmailContext.mockResolvedValue({
      ok: true,
      context: { ...emailContext, status: "draft" },
    });

    const { sendPendingInvoiceEmailAction } = await import("./actions");
    const result = await sendPendingInvoiceEmailAction("inv-1", {
      subject: "Invoice INV-104 from Nothing.Digital",
      coverNote: "Edited cover note with unique token.",
    });
    expect(result).toEqual({
      ok: false,
      error: "Invoice is not marked sent.",
    });
    expect(sendInvoiceSentEmail).not.toHaveBeenCalled();
  });

  it("sends via Resend and stamps sent_emailed_at with cover", async () => {
    buildInvoiceEmailContext.mockResolvedValue({
      ok: true,
      context: emailContext,
    });
    sendInvoiceSentEmail.mockResolvedValue({ ok: true });
    updateInvoiceSentEmailedAt.mockResolvedValue({ ok: true });
    getInvoice.mockResolvedValue({
      row: { ...invoiceRow, status: "sent" },
      error: null,
    });

    const { sendPendingInvoiceEmailAction } = await import("./actions");
    const result = await sendPendingInvoiceEmailAction("inv-1", {
      subject: "Invoice INV-104 from Nothing.Digital",
      coverNote: "Edited cover note with unique token.",
    });

    expect(result).toEqual({ ok: true });
    expect(sendInvoiceSentEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        coverNote: "Edited cover note with unique token.",
        subject: "Invoice INV-104 from Nothing.Digital",
      }),
    );
    expect(updateInvoiceSentEmailedAt).toHaveBeenCalledWith("inv-1");
  });

  it("returns stampWarning when Resend succeeds but stamp fails", async () => {
    buildInvoiceEmailContext.mockResolvedValue({
      ok: true,
      context: emailContext,
    });
    sendInvoiceSentEmail.mockResolvedValue({ ok: true });
    updateInvoiceSentEmailedAt.mockResolvedValue({
      ok: false,
      error: "stamp failed",
    });
    getInvoice.mockResolvedValue({
      row: { ...invoiceRow, status: "sent" },
      error: null,
    });

    const { sendPendingInvoiceEmailAction } = await import("./actions");
    const result = await sendPendingInvoiceEmailAction("inv-1", {
      subject: "Invoice INV-104 from Nothing.Digital",
      coverNote: "Edited cover note with unique token.",
    });

    expect(result).toEqual({ ok: true, stampWarning: "stamp failed" });
    expect(sendInvoiceSentEmail).toHaveBeenCalledOnce();
  });

  it("refuses empty cover note", async () => {
    const { sendPendingInvoiceEmailAction } = await import("./actions");
    const result = await sendPendingInvoiceEmailAction("inv-1", {
      subject: "Invoice INV-104",
      coverNote: "",
    });
    expect(result.ok).toBe(false);
    expect(sendInvoiceSentEmail).not.toHaveBeenCalled();
  });

  it("refuses when already emailed", async () => {
    buildInvoiceEmailContext.mockResolvedValue({
      ok: true,
      context: { ...emailContext, sentEmailedAt: "2026-08-01T00:00:00Z" },
    });

    const { sendPendingInvoiceEmailAction } = await import("./actions");
    const result = await sendPendingInvoiceEmailAction("inv-1", {
      subject: "Invoice INV-104 from Nothing.Digital",
      coverNote: "Another attempt.",
    });
    expect(result).toEqual({ ok: false, error: "Already emailed." });
    expect(sendInvoiceSentEmail).not.toHaveBeenCalled();
  });

  it("sends without AI cover when no cover arg", async () => {
    buildInvoiceEmailContext.mockResolvedValue({
      ok: true,
      context: emailContext,
    });
    sendInvoiceSentEmail.mockResolvedValue({ ok: true });
    updateInvoiceSentEmailedAt.mockResolvedValue({ ok: true });
    getInvoice.mockResolvedValue({
      row: { ...invoiceRow, status: "sent" },
      error: null,
    });

    const { sendPendingInvoiceEmailAction } = await import("./actions");
    const result = await sendPendingInvoiceEmailAction("inv-1");

    expect(result).toEqual({ ok: true });
    expect(sendInvoiceSentEmail).toHaveBeenCalledWith(
      expect.not.objectContaining({
        coverNote: expect.anything(),
        subject: expect.anything(),
      }),
    );
    expect(isInvoiceCoverEnabled).not.toHaveBeenCalled();
  });

  it("refuses flush when status is not sent", async () => {
    buildInvoiceEmailContext.mockResolvedValue({
      ok: true,
      context: { ...emailContext, status: "draft" },
    });

    const { sendPendingInvoiceEmailAction } = await import("./actions");
    const result = await sendPendingInvoiceEmailAction("inv-1");
    expect(result).toEqual({
      ok: false,
      error: "Invoice is not marked sent.",
    });
    expect(sendInvoiceSentEmail).not.toHaveBeenCalled();
  });
});
