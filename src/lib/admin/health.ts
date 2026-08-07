export const HEALTH_INTEGRATION_KEYS = [
  "supabase",
  "resend",
  "sentry",
  "umami",
  "calendly",
  "listmonk",
  "ai",
] as const;

export type HealthIntegrationKey = (typeof HEALTH_INTEGRATION_KEYS)[number];

export type HealthIntegrations = Record<HealthIntegrationKey, boolean>;

export type ParsedHealthPayload = {
  ok: boolean;
  integrations: HealthIntegrations;
};

const LABELS: Record<HealthIntegrationKey, string> = {
  supabase: "Supabase",
  resend: "Resend",
  sentry: "Sentry",
  umami: "Umami",
  calendly: "Calendly",
  listmonk: "Listmonk",
  ai: "AI Gateway",
};

const EMPTY_INTEGRATIONS: HealthIntegrations = {
  supabase: false,
  resend: false,
  sentry: false,
  umami: false,
  calendly: false,
  listmonk: false,
  ai: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseHealthPayload(raw: unknown): ParsedHealthPayload {
  if (!isRecord(raw) || !isRecord(raw.integrations)) {
    return { ok: false, integrations: { ...EMPTY_INTEGRATIONS } };
  }

  const integrations = { ...EMPTY_INTEGRATIONS };
  for (const key of HEALTH_INTEGRATION_KEYS) {
    integrations[key] = Boolean(raw.integrations[key]);
  }

  return { ok: true, integrations };
}

export function labelForIntegration(key: HealthIntegrationKey): string {
  return LABELS[key];
}

export type ChipTone = "ok" | "missing";

export function chipToneForConfigured(configured: boolean): ChipTone {
  return configured ? "ok" : "missing";
}
