"use client";

import Script from "next/script";
import { useEffect, useMemo } from "react";

interface CalendlyEmbedProps {
  url: string;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidgets: () => void;
    };
  }
}

function buildEmbedUrl(url: string): string {
  const parsed = new URL(url);
  // Shorter chrome → less nested scroll before the calendar.
  parsed.searchParams.set("hide_event_type_details", "1");
  parsed.searchParams.set("hide_gdpr_banner", "1");
  return parsed.toString();
}

// ponytail: official widget + data-resize grows with content; plain iframes stay fixed-height and double-scroll.
export function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  const embedUrl = useMemo(() => buildEmbedUrl(url), [url]);

  useEffect(() => {
    window.Calendly?.initInlineWidgets();
  }, [embedUrl]);

  return (
    <div className="w-full min-w-[320px] overflow-hidden rounded-xl border-2 border-border bg-card shadow-md">
      <div
        className="calendly-inline-widget w-full"
        data-url={embedUrl}
        data-resize="true"
        style={{ minWidth: 320, height: 700 }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.Calendly?.initInlineWidgets();
        }}
      />
    </div>
  );
}
