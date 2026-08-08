import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    private: {
      N8N_WEBHOOK_URL: undefined as string | undefined,
      N8N_WEBHOOK_SECRET: undefined as string | undefined,
    },
  },
  isN8nConfigured: vi.fn(() => false),
}));

import { env, isN8nConfigured } from "@/lib/env";
import { notifyN8n } from "@/lib/n8n";

describe("notifyN8n", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(isN8nConfigured).mockReturnValue(false);
    env.private.N8N_WEBHOOK_URL = undefined;
    env.private.N8N_WEBHOOK_SECRET = undefined;
  });

  it("no-ops when unconfigured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await notifyN8n("contact", { email: "a@b.com" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("POSTs with secret header when configured", async () => {
    vi.mocked(isN8nConfigured).mockReturnValue(true);
    env.private.N8N_WEBHOOK_URL = "https://automation.example.com/webhook/x";
    env.private.N8N_WEBHOOK_SECRET = "s3cret";

    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await notifyN8n("contact", { email: "a@b.com", id: "1" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://automation.example.com/webhook/x",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-N8N-Secret": "s3cret",
        },
        body: JSON.stringify({
          event: "contact",
          email: "a@b.com",
          id: "1",
        }),
      },
    );
  });

  it("swallows upstream failures", async () => {
    vi.mocked(isN8nConfigured).mockReturnValue(true);
    env.private.N8N_WEBHOOK_URL = "https://automation.example.com/webhook/x";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));

    await expect(
      notifyN8n("newsletter", { email: "a@b.com" }),
    ).resolves.toBeUndefined();
  });
});
