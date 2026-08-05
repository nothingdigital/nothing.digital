import { Resend } from "resend";

import { env } from "@/lib/env";

export function getResendClient(): Resend | null {
  const key = env.private.RESEND_API_KEY;

  if (!key) {
    console.warn("[resend] RESEND_API_KEY missing; email client disabled.");
    return null;
  }

  return new Resend(key);
}
