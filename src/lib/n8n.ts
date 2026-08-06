import { env, isN8nConfigured } from "@/lib/env";

export type N8nEvent = "contact" | "newsletter";

/**
 * Fire-and-forget webhook to n8n after critical path succeeds.
 * Never throws — missing env or upstream failure must not break the form.
 */
export async function notifyN8n(
  event: N8nEvent,
  payload: Record<string, unknown>,
): Promise<void> {
  if (!isN8nConfigured()) return;

  const url = env.private.N8N_WEBHOOK_URL!;
  const secret = env.private.N8N_WEBHOOK_SECRET;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (secret) headers["X-N8N-Secret"] = secret;

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ event, ...payload }),
    });

    if (!response.ok) {
      console.error("[n8n] webhook failed:", response.status);
    }
  } catch (error) {
    console.error("[n8n] webhook error:", error);
  }
}
