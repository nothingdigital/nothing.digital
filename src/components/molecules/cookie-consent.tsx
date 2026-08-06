"use client";

import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { UmamiScript } from "@/components/atoms/umami-script";

type Consent = "accepted" | "declined" | null;

const STORAGE_KEY = "nd-cookie-consent";

// ponytail: consent gates analytics; banner renders client-only after mount.
export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "declined") setConsent(stored);
  }, []);

  const choose = (value: Exclude<Consent, null>) => {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  };

  if (!mounted) return null;

  return (
    <>
      {consent === "accepted" && (
        <>
          <UmamiScript />
          <SpeedInsights />
        </>
      )}

      {consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-muted-foreground">
              We use privacy-friendly analytics to improve the site. No ad
              trackers, no data selling. See our{" "}
              <a
                href="/privacy"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Privacy Policy
              </a>
              .
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => choose("declined")}
                className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
