import { env, isListmonkConfigured } from "@/lib/env";

export type ListmonkSubscribeResult =
  { ok: true } | { ok: false; reason: "unconfigured" | "upstream" };

/**
 * Proxy subscribe to Listmonk public API.
 * ponytail: Listmonk is live; no-op only when env missing so local/test stays safe.
 */
export async function subscribeToListmonk(
  email: string,
  name?: string,
): Promise<ListmonkSubscribeResult> {
  if (!isListmonkConfigured()) {
    return { ok: false, reason: "unconfigured" };
  }

  const base = env.private.LISTMONK_URL!.replace(/\/$/, "");
  const listUuid = env.private.LISTMONK_LIST_UUID!;

  try {
    const response = await fetch(`${base}/api/public/subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        ...(name ? { name } : {}),
        list_uuids: [listUuid],
      }),
    });

    if (!response.ok) {
      console.error(
        "[listmonk] subscribe failed:",
        response.status,
        await response.text().catch(() => ""),
      );
      return { ok: false, reason: "upstream" };
    }

    return { ok: true };
  } catch (error) {
    console.error("[listmonk] subscribe error:", error);
    return { ok: false, reason: "upstream" };
  }
}
