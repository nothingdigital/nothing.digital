import { z } from "zod";

// ponytail: empty Vercel env values arrive as ""; treat as unset.
function emptyToUndefined(value: unknown): unknown {
  if (value === "") return undefined;
  return value;
}

const opt = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(emptyToUndefined, schema.optional());

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

export const env = {
  public: {
    NEXT_PUBLIC_SITE_URL: parseField(
      "NEXT_PUBLIC_SITE_URL",
      opt(z.string().url()),
      process.env.NEXT_PUBLIC_SITE_URL,
    ),
    NEXT_PUBLIC_SUPABASE_URL: parseField(
      "NEXT_PUBLIC_SUPABASE_URL",
      opt(z.string().url()),
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: parseField(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      opt(z.string().min(1)),
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: parseField(
      "NEXT_PUBLIC_UMAMI_WEBSITE_ID",
      opt(z.string().min(1)),
      process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    ),
    NEXT_PUBLIC_UMAMI_SCRIPT_URL: parseField(
      "NEXT_PUBLIC_UMAMI_SCRIPT_URL",
      opt(z.string().url()),
      process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
    ),
  },
  private: {
    SUPABASE_SERVICE_ROLE_KEY: parseField(
      "SUPABASE_SERVICE_ROLE_KEY",
      opt(z.string().min(1)),
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    ),
    RESEND_API_KEY: parseField(
      "RESEND_API_KEY",
      opt(z.string().min(1)),
      process.env.RESEND_API_KEY,
    ),
    CONTACT_NOTIFY_EMAIL: parseField(
      "CONTACT_NOTIFY_EMAIL",
      opt(z.string().email()),
      process.env.CONTACT_NOTIFY_EMAIL,
    ),
    ADMIN_EMAILS: parseField(
      "ADMIN_EMAILS",
      opt(z.string()),
      process.env.ADMIN_EMAILS,
    ),
    SENTRY_DSN: parseField(
      "SENTRY_DSN",
      opt(z.string().url()),
      process.env.SENTRY_DSN,
    ),
    CALENDLY_URL: parseField(
      "CALENDLY_URL",
      opt(z.string().url()),
      process.env.CALENDLY_URL,
    ),
    UMAMI_DASHBOARD_URL: parseField(
      "UMAMI_DASHBOARD_URL",
      opt(z.string().url()),
      process.env.UMAMI_DASHBOARD_URL,
    ),
    LISTMONK_URL: parseField(
      "LISTMONK_URL",
      opt(z.string().url()),
      process.env.LISTMONK_URL,
    ),
    LISTMONK_LIST_UUID: parseField(
      "LISTMONK_LIST_UUID",
      opt(z.string().uuid()),
      process.env.LISTMONK_LIST_UUID,
    ),
    LISTMONK_DASHBOARD_URL: parseField(
      "LISTMONK_DASHBOARD_URL",
      opt(z.string().url()),
      process.env.LISTMONK_DASHBOARD_URL,
    ),
    N8N_WEBHOOK_URL: parseField(
      "N8N_WEBHOOK_URL",
      opt(z.string().url()),
      process.env.N8N_WEBHOOK_URL,
    ),
    N8N_WEBHOOK_SECRET: parseField(
      "N8N_WEBHOOK_SECRET",
      opt(z.string().min(1)),
      process.env.N8N_WEBHOOK_SECRET,
    ),
    N8N_DASHBOARD_URL: parseField(
      "N8N_DASHBOARD_URL",
      opt(z.string().url()),
      process.env.N8N_DASHBOARD_URL,
    ),
    KUMA_DASHBOARD_URL: parseField(
      "KUMA_DASHBOARD_URL",
      opt(z.string().url()),
      process.env.KUMA_DASHBOARD_URL,
    ),
    UPTIMEROBOT_DASHBOARD_URL: parseField(
      "UPTIMEROBOT_DASHBOARD_URL",
      opt(z.string().url()),
      process.env.UPTIMEROBOT_DASHBOARD_URL,
    ),
    AI_GATEWAY_API_KEY: parseField(
      "AI_GATEWAY_API_KEY",
      opt(z.string().min(1)),
      process.env.AI_GATEWAY_API_KEY,
    ),
    AI_MODEL: parseField(
      "AI_MODEL",
      opt(z.string().min(1)),
      process.env.AI_MODEL,
    ),
    AI_ENABLED: parseField(
      "AI_ENABLED",
      opt(z.string().min(1)),
      process.env.AI_ENABLED,
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
