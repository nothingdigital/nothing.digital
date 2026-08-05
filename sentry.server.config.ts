import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;
if (!dsn) {
  // ponytail: skip Sentry init in local dev when DSN absent
  console.info("Sentry server disabled: SENTRY_DSN not set");
} else {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
  });
}
