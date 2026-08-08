import { z } from "zod";

// ponytail: empty Vercel env values arrive as ""; treat as unset.
function emptyToUndefined(value: unknown): unknown {
  if (value === "") return undefined;
  return value;
}

const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalEmail = z.preprocess(
  emptyToUndefined,
  z.string().email().optional(),
);
const optionalUuid = z.preprocess(
  emptyToUndefined,
  z.string().uuid().optional(),
);
const optionalNonEmpty = z.preprocess(
  emptyToUndefined,
  z.string().min(1).optional(),
);
const optionalString = z.preprocess(emptyToUndefined, z.string().optional());

type FieldSchema = z.ZodType<string | undefined>;

// ponytail: parse each key alone — one invalid optional must not wipe the rest.
function parseField(
  name: string,
  schema: FieldSchema,
  value: string | undefined,
): string | undefined {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  console.warn(`[env] ignoring invalid ${name}: ${result.error.message}`);
  return undefined;
}

const raw = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  NEXT_PUBLIC_UMAMI_SCRIPT_URL: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_NOTIFY_EMAIL: process.env.CONTACT_NOTIFY_EMAIL,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS,
  SENTRY_DSN: process.env.SENTRY_DSN,
  CALENDLY_URL: process.env.CALENDLY_URL,
  UMAMI_DASHBOARD_URL: process.env.UMAMI_DASHBOARD_URL,
  LISTMONK_URL: process.env.LISTMONK_URL,
  LISTMONK_LIST_UUID: process.env.LISTMONK_LIST_UUID,
  LISTMONK_DASHBOARD_URL: process.env.LISTMONK_DASHBOARD_URL,
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
  N8N_WEBHOOK_SECRET: process.env.N8N_WEBHOOK_SECRET,
  N8N_DASHBOARD_URL: process.env.N8N_DASHBOARD_URL,
  KUMA_DASHBOARD_URL: process.env.KUMA_DASHBOARD_URL,
  UPTIMEROBOT_DASHBOARD_URL: process.env.UPTIMEROBOT_DASHBOARD_URL,
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
  AI_MODEL: process.env.AI_MODEL,
  AI_INBOX_DRAFTS_ENABLED: process.env.AI_INBOX_DRAFTS_ENABLED,
  AI_OPS_BRIEF_ENABLED: process.env.AI_OPS_BRIEF_ENABLED,
  AI_INVOICE_COVER_ENABLED: process.env.AI_INVOICE_COVER_ENABLED,
  AI_OUTBOUND_PERSONALIZATION_ENABLED:
    process.env.AI_OUTBOUND_PERSONALIZATION_ENABLED,
};

export const env = {
  public: {
    NEXT_PUBLIC_SITE_URL: parseField(
      "NEXT_PUBLIC_SITE_URL",
      optionalUrl,
      raw.NEXT_PUBLIC_SITE_URL,
    ),
    NEXT_PUBLIC_SUPABASE_URL: parseField(
      "NEXT_PUBLIC_SUPABASE_URL",
      optionalUrl,
      raw.NEXT_PUBLIC_SUPABASE_URL,
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: parseField(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      optionalNonEmpty,
      raw.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: parseField(
      "NEXT_PUBLIC_UMAMI_WEBSITE_ID",
      optionalNonEmpty,
      raw.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    ),
    NEXT_PUBLIC_UMAMI_SCRIPT_URL: parseField(
      "NEXT_PUBLIC_UMAMI_SCRIPT_URL",
      optionalUrl,
      raw.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
    ),
  },
  private: {
    SUPABASE_SERVICE_ROLE_KEY: parseField(
      "SUPABASE_SERVICE_ROLE_KEY",
      optionalNonEmpty,
      raw.SUPABASE_SERVICE_ROLE_KEY,
    ),
    RESEND_API_KEY: parseField(
      "RESEND_API_KEY",
      optionalNonEmpty,
      raw.RESEND_API_KEY,
    ),
    CONTACT_NOTIFY_EMAIL: parseField(
      "CONTACT_NOTIFY_EMAIL",
      optionalEmail,
      raw.CONTACT_NOTIFY_EMAIL,
    ),
    ADMIN_EMAILS: parseField("ADMIN_EMAILS", optionalString, raw.ADMIN_EMAILS),
    SENTRY_DSN: parseField("SENTRY_DSN", optionalUrl, raw.SENTRY_DSN),
    CALENDLY_URL: parseField("CALENDLY_URL", optionalUrl, raw.CALENDLY_URL),
    UMAMI_DASHBOARD_URL: parseField(
      "UMAMI_DASHBOARD_URL",
      optionalUrl,
      raw.UMAMI_DASHBOARD_URL,
    ),
    LISTMONK_URL: parseField("LISTMONK_URL", optionalUrl, raw.LISTMONK_URL),
    LISTMONK_LIST_UUID: parseField(
      "LISTMONK_LIST_UUID",
      optionalUuid,
      raw.LISTMONK_LIST_UUID,
    ),
    LISTMONK_DASHBOARD_URL: parseField(
      "LISTMONK_DASHBOARD_URL",
      optionalUrl,
      raw.LISTMONK_DASHBOARD_URL,
    ),
    N8N_WEBHOOK_URL: parseField(
      "N8N_WEBHOOK_URL",
      optionalUrl,
      raw.N8N_WEBHOOK_URL,
    ),
    N8N_WEBHOOK_SECRET: parseField(
      "N8N_WEBHOOK_SECRET",
      optionalNonEmpty,
      raw.N8N_WEBHOOK_SECRET,
    ),
    N8N_DASHBOARD_URL: parseField(
      "N8N_DASHBOARD_URL",
      optionalUrl,
      raw.N8N_DASHBOARD_URL,
    ),
    KUMA_DASHBOARD_URL: parseField(
      "KUMA_DASHBOARD_URL",
      optionalUrl,
      raw.KUMA_DASHBOARD_URL,
    ),
    UPTIMEROBOT_DASHBOARD_URL: parseField(
      "UPTIMEROBOT_DASHBOARD_URL",
      optionalUrl,
      raw.UPTIMEROBOT_DASHBOARD_URL,
    ),
    AI_GATEWAY_API_KEY: parseField(
      "AI_GATEWAY_API_KEY",
      optionalNonEmpty,
      raw.AI_GATEWAY_API_KEY,
    ),
    AI_MODEL: parseField("AI_MODEL", optionalNonEmpty, raw.AI_MODEL),
    AI_INBOX_DRAFTS_ENABLED: parseField(
      "AI_INBOX_DRAFTS_ENABLED",
      optionalNonEmpty,
      raw.AI_INBOX_DRAFTS_ENABLED,
    ),
    AI_OPS_BRIEF_ENABLED: parseField(
      "AI_OPS_BRIEF_ENABLED",
      optionalNonEmpty,
      raw.AI_OPS_BRIEF_ENABLED,
    ),
    AI_INVOICE_COVER_ENABLED: parseField(
      "AI_INVOICE_COVER_ENABLED",
      optionalNonEmpty,
      raw.AI_INVOICE_COVER_ENABLED,
    ),
    AI_OUTBOUND_PERSONALIZATION_ENABLED: parseField(
      "AI_OUTBOUND_PERSONALIZATION_ENABLED",
      optionalNonEmpty,
      raw.AI_OUTBOUND_PERSONALIZATION_ENABLED,
    ),
  },
};

/** True when Listmonk public subscribe env is fully set. */
export function isListmonkConfigured(): boolean {
  return Boolean(env.private.LISTMONK_URL && env.private.LISTMONK_LIST_UUID);
}

/** True when n8n webhook URL is set (secret optional but recommended). */
export function isN8nConfigured(): boolean {
  return Boolean(env.private.N8N_WEBHOOK_URL);
}
