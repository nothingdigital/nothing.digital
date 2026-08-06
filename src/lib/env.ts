import { z } from "zod";

// ponytail: empty Vercel env values arrive as ""; treat as unset so one bad
// optional field cannot wipe the whole parse.
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

// ponytail: public env is optional at build time so `next build` succeeds without live secrets.
// Modules that need these values must check for presence or provide sensible fallbacks.
const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalNonEmpty,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: optionalNonEmpty,
  NEXT_PUBLIC_UMAMI_SCRIPT_URL: optionalUrl,
  SUPABASE_SERVICE_ROLE_KEY: optionalNonEmpty,
  RESEND_API_KEY: optionalNonEmpty,
  CONTACT_NOTIFY_EMAIL: optionalEmail,
  ADMIN_EMAILS: optionalString,
  SENTRY_DSN: optionalUrl,
  CALENDLY_URL: optionalUrl,
  UMAMI_DASHBOARD_URL: optionalUrl,
  // PikaPods sidecars — optional; helpers no-op / fallback when unset.
  LISTMONK_URL: optionalUrl,
  LISTMONK_LIST_UUID: optionalUuid,
  LISTMONK_DASHBOARD_URL: optionalUrl,
  N8N_WEBHOOK_URL: optionalUrl,
  N8N_WEBHOOK_SECRET: optionalNonEmpty,
  N8N_DASHBOARD_URL: optionalUrl,
  KUMA_DASHBOARD_URL: optionalUrl,
});

const result = envSchema.safeParse({
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
});

if (!result.success) {
  console.warn(`[env] validation warnings:\n${z.prettifyError(result.error)}`);
}

const parsed = result.success ? result.data : {};

export const env = {
  public: {
    NEXT_PUBLIC_SITE_URL: parsed.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: parsed.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: parsed.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    NEXT_PUBLIC_UMAMI_SCRIPT_URL: parsed.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
  },
  private: {
    SUPABASE_SERVICE_ROLE_KEY: parsed.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: parsed.RESEND_API_KEY,
    CONTACT_NOTIFY_EMAIL: parsed.CONTACT_NOTIFY_EMAIL,
    ADMIN_EMAILS: parsed.ADMIN_EMAILS,
    SENTRY_DSN: parsed.SENTRY_DSN,
    CALENDLY_URL: parsed.CALENDLY_URL,
    UMAMI_DASHBOARD_URL: parsed.UMAMI_DASHBOARD_URL,
    LISTMONK_URL: parsed.LISTMONK_URL,
    LISTMONK_LIST_UUID: parsed.LISTMONK_LIST_UUID,
    LISTMONK_DASHBOARD_URL: parsed.LISTMONK_DASHBOARD_URL,
    N8N_WEBHOOK_URL: parsed.N8N_WEBHOOK_URL,
    N8N_WEBHOOK_SECRET: parsed.N8N_WEBHOOK_SECRET,
    N8N_DASHBOARD_URL: parsed.N8N_DASHBOARD_URL,
    KUMA_DASHBOARD_URL: parsed.KUMA_DASHBOARD_URL,
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
