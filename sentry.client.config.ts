import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;
if (!dsn) {
  // ponytail: skip Sentry init in local dev when DSN absent
  console.info("Sentry client disabled: SENTRY_DSN not set");
} else {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}
