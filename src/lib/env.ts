import { z } from "zod";

// ponytail: public env is optional at build time so `next build` succeeds without live secrets.
// Modules that need these values must check for presence or provide sensible fallbacks.
const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_UMAMI_SCRIPT_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_NOTIFY_EMAIL: z.string().email().optional(),
  ADMIN_EMAILS: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  CALENDLY_URL: z.string().url().optional(),
  UMAMI_DASHBOARD_URL: z.string().url().optional(),
  // PikaPods sidecars — optional; helpers no-op / fallback when unset.
  LISTMONK_URL: z.string().url().optional(),
  LISTMONK_LIST_UUID: z.string().uuid().optional(),
  LISTMONK_DASHBOARD_URL: z.string().url().optional(),
  N8N_WEBHOOK_URL: z.string().url().optional(),
  N8N_WEBHOOK_SECRET: z.string().min(1).optional(),
  N8N_DASHBOARD_URL: z.string().url().optional(),
  KUMA_DASHBOARD_URL: z.string().url().optional(),
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
