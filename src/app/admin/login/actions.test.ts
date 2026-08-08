import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithPassword = vi.fn();
const signOut = vi.fn();
const createAuthServerClient = vi.fn();
const isAdminEmail = vi.fn();

vi.mock("@/lib/supabase/auth-server", () => ({
  createAuthServerClient: (...args: unknown[]) =>
    createAuthServerClient(...args),
}));

vi.mock("@/lib/admin/config", () => ({
  isAdminEmail: (...args: unknown[]) => isAdminEmail(...args),
}));

describe("signInAdminWithPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createAuthServerClient.mockResolvedValue({
      auth: { signInWithPassword, signOut },
    });
  });

  it("returns config when supabase is missing", async () => {
    createAuthServerClient.mockResolvedValue(null);
    const { signInAdminWithPassword } = await import("./actions");

    await expect(
      signInAdminWithPassword("owner@nothing.digital", "secret"),
    ).resolves.toEqual({ ok: false, error: "config" });
  });

  it("returns credentials on auth failure", async () => {
    signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });
    const { signInAdminWithPassword } = await import("./actions");

    await expect(
      signInAdminWithPassword("owner@nothing.digital", "wrong"),
    ).resolves.toEqual({
      ok: false,
      error: "credentials",
      message: "Invalid login credentials",
    });
  });

  it("signs out and forbids non-allowlisted emails", async () => {
    signInWithPassword.mockResolvedValue({
      data: { user: { email: "stranger@example.com" } },
      error: null,
    });
    isAdminEmail.mockReturnValue(false);
    const { signInAdminWithPassword } = await import("./actions");

    await expect(
      signInAdminWithPassword("stranger@example.com", "secret"),
    ).resolves.toEqual({ ok: false, error: "forbidden" });
    expect(signOut).toHaveBeenCalledOnce();
  });

  it("succeeds for allowlisted emails", async () => {
    signInWithPassword.mockResolvedValue({
      data: { user: { email: "owner@nothing.digital" } },
      error: null,
    });
    isAdminEmail.mockReturnValue(true);
    const { signInAdminWithPassword } = await import("./actions");

    await expect(
      signInAdminWithPassword("owner@nothing.digital", "secret"),
    ).resolves.toEqual({ ok: true });
    expect(signOut).not.toHaveBeenCalled();
  });
});
