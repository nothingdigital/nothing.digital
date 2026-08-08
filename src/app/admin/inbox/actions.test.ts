import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdmin = vi.fn();
const getContactSubmission = vi.fn();
const updateContactStatus = vi.fn();
const createClient = vi.fn();
const revalidatePath = vi.fn();
const redirect = vi.fn();

vi.mock("@/lib/admin/auth", () => ({
  requireAdmin: (...args: unknown[]) => requireAdmin(...args),
}));

vi.mock("@/lib/admin/queries", () => ({
  getContactSubmission: (...args: unknown[]) => getContactSubmission(...args),
  updateContactStatus: (...args: unknown[]) => updateContactStatus(...args),
}));

vi.mock("@/lib/admin/client-ops-queries", () => ({
  createClient: (...args: unknown[]) => createClient(...args),
}));

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => redirect(...args),
}));

const submission = {
  id: "sub-1",
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  service: "web",
  budget: "$5k",
  message: "Need a site",
  status: "new",
  created_at: "2026-08-01T00:00:00Z",
  updated_at: "2026-08-01T00:00:00Z",
};

function formData(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    data.set(key, value);
  }
  return data;
}

describe("createClientFromInboxAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue({ email: "owner@nothing.digital" });
    getContactSubmission.mockResolvedValue({ row: submission, error: null });
    createClient.mockResolvedValue({
      row: { id: "client-9" },
      error: null,
    });
    updateContactStatus.mockResolvedValue({ ok: true });
    redirect.mockImplementation((url: string) => {
      throw new Error(`NEXT_REDIRECT:${url}`);
    });
  });

  it("creates client, marks replied, and redirects", async () => {
    const { createClientFromInboxAction } = await import("./actions");

    await expect(
      createClientFromInboxAction(
        formData({ submission_id: "sub-1", mark_status: "replied" }),
      ),
    ).rejects.toThrow("NEXT_REDIRECT:/admin/clients/client-9");

    expect(requireAdmin).toHaveBeenCalledOnce();
    expect(createClient).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Ada Lovelace",
        primary_email: "ada@example.com",
        company: "Analytical Engines",
        status: "lead",
        billing_model: "none",
        payment_terms: "net_15",
        notes: expect.stringContaining("Inbox lead sub-1"),
      }),
    );
    expect(updateContactStatus).toHaveBeenCalledWith("sub-1", "replied");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/inbox");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/clients");
    expect(redirect).toHaveBeenCalledWith("/admin/clients/client-9");
  });

  it("skips status update when mark_status is empty", async () => {
    const { createClientFromInboxAction } = await import("./actions");

    await expect(
      createClientFromInboxAction(
        formData({ submission_id: "sub-1", mark_status: "" }),
      ),
    ).rejects.toThrow("NEXT_REDIRECT:/admin/clients/client-9");

    expect(updateContactStatus).not.toHaveBeenCalled();
  });

  it("throws when submission is missing", async () => {
    getContactSubmission.mockResolvedValue({ row: null, error: null });
    const { createClientFromInboxAction } = await import("./actions");

    await expect(
      createClientFromInboxAction(formData({ submission_id: "missing" })),
    ).rejects.toThrow("Submission not found.");

    expect(createClient).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
