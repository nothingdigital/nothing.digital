import { env } from "@/lib/env";

/** Inbox triage statuses from Phase F plan. */
export const INBOX_STATUSES = ["new", "read", "replied", "archived"] as const;

export type InboxStatus = (typeof INBOX_STATUSES)[number];

export function isInboxStatus(value: string): value is InboxStatus {
  return (INBOX_STATUSES as readonly string[]).includes(value);
}

export function parseAdminEmails(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminEmails(): string[] {
  return parseAdminEmails(env.private.ADMIN_EMAILS);
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

export function getAdminToolLinks() {
  return {
    site: env.public.NEXT_PUBLIC_SITE_URL ?? "https://nothing.digital",
    calendly: env.private.CALENDLY_URL,
    umami: env.private.UMAMI_DASHBOARD_URL,
    vercel: "https://vercel.com/dashboard",
    sentry: "https://sentry.io",
  };
}
