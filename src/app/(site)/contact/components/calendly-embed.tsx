"use client";

import { useMemo } from "react";

interface CalendlyEmbedProps {
  url: string;
}

// ponytail: simple iframe embed; no react-calendly dependency needed.
export function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  const src = useMemo(() => {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}embed=true`;
  }, [url]);

  return (
    <div className="overflow-hidden rounded-xl border-2 border-border bg-card shadow-md">
      <iframe
        src={src}
        title="Calendly scheduling"
        className="min-h-[650px] w-full"
        frameBorder="0"
        loading="lazy"
      />
    </div>
  );
}
