"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

interface CalendlyEmbedProps {
  url: string;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        resize?: boolean;
      }) => void;
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

// ponytail: initInlineWidget({ resize: true }) grows with content; plain iframes stay fixed and double-scroll.
export function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedUrl = buildEmbedUrl(url);

  function mountWidget() {
    const parent = containerRef.current;
    if (!parent || !window.Calendly) return;

    parent.innerHTML = "";
    window.Calendly.initInlineWidget({
      url: embedUrl,
      parentElement: parent,
      resize: true,
    });
  }

  useEffect(mountWidget, [embedUrl]);

  return (
    <div className="w-full min-w-[320px] rounded-xl border-2 border-border bg-card shadow-md">
      <div
        ref={containerRef}
        className="w-full"
        style={{ minWidth: 320, height: 700 }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={mountWidget}
      />
    </div>
  );
}
