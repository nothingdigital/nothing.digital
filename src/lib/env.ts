import { z } from "zod";

// ponytail: public env is optional at build time so `next build` succeeds without live secrets.
// Modules that need these values must check for presence or provide sensible fallbacks.
const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_NOTIFY_EMAIL: z.string().email().optional(),
});

const result = envSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_NOTIFY_EMAIL: process.env.CONTACT_NOTIFY_EMAIL,
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
  },
  private: {
    SUPABASE_SERVICE_ROLE_KEY: parsed.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: parsed.RESEND_API_KEY,
    CONTACT_NOTIFY_EMAIL: parsed.CONTACT_NOTIFY_EMAIL,
  },
};
