import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    private: {
      LISTMONK_URL: undefined as string | undefined,
      LISTMONK_LIST_UUID: undefined as string | undefined,
    },
  },
  isListmonkConfigured: vi.fn(() => false),
}));

import { env, isListmonkConfigured } from "@/lib/env";
import { subscribeToListmonk } from "@/lib/listmonk";

describe("subscribeToListmonk", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(isListmonkConfigured).mockReturnValue(false);
    env.private.LISTMONK_URL = undefined;
    env.private.LISTMONK_LIST_UUID = undefined;
  });

  it("returns unconfigured when env missing", async () => {
    await expect(subscribeToListmonk("a@b.com")).resolves.toEqual({
      ok: false,
      reason: "unconfigured",
    });
  });

  it("POSTs to public subscription API when configured", async () => {
    vi.mocked(isListmonkConfigured).mockReturnValue(true);
    env.private.LISTMONK_URL = "https://newsletter.example.com";
    env.private.LISTMONK_LIST_UUID = "eb420c55-4cfb-4972-92ba-c93c34ba475d";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "",
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(subscribeToListmonk("a@b.com", "Ada")).resolves.toEqual({
      ok: true,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://newsletter.example.com/api/public/subscription",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "a@b.com",
          name: "Ada",
          list_uuids: ["eb420c55-4cfb-4972-92ba-c93c34ba475d"],
        }),
      }),
    );
  });
});
