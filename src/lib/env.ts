import { z } from "zod";

const nodeEnvSchema = z.enum(["development", "test", "production"]);

// ponytail: public env is optional at build time so `next build` succeeds without live secrets.
// Modules that need these values must check for presence or provide sensible fallbacks.
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

const privateEnvSchema = z.object({
  NODE_ENV: nodeEnvSchema.default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_NOTIFY_EMAIL: z.string().email().optional(),
  SENTRY_DSN: z.string().url().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

type SafeParseResult<T> =
  { success: true; data: T } | { success: false; error: z.ZodError };

function warn<T>(label: string, result: SafeParseResult<T>): void {
  if (result.success) return;
  const messages = result.error.issues.map(
    (issue) => `${issue.path.join(".")}: ${issue.message}`,
  );
  console.warn(
    `[env] ${label} validation warnings:\n${messages.map((m) => `  - ${m}`).join("\n")}`,
  );
}

function parsePublicEnv(): z.infer<typeof publicEnvSchema> {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  warn("public", result);
  return result.success ? result.data : {};
}

function parsePrivateEnv(): z.infer<typeof privateEnvSchema> {
  const result = privateEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_NOTIFY_EMAIL: process.env.CONTACT_NOTIFY_EMAIL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  warn("private", result);
  return result.success ? result.data : { NODE_ENV: "development" as const };
}

export const env = {
  public: parsePublicEnv(),
  private: parsePrivateEnv(),
};

export type Env = typeof env;
