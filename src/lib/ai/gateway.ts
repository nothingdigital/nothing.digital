import { createGateway } from "ai";

export const DEFAULT_AI_MODEL = "openai/gpt-4.1-mini";

/** Shared Gateway model for app + lead-finder CLI. */
export function getGatewayModel(
  apiKey: string | undefined,
  model?: string | null,
) {
  if (!apiKey?.trim()) {
    throw new Error("AI_GATEWAY_API_KEY is not configured.");
  }
  return createGateway({ apiKey })(model?.trim() || DEFAULT_AI_MODEL);
}
