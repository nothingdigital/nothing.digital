import Script from "next/script";

import { env } from "@/lib/env";

// ponytail: no-op without env — pod can come later; no analytics wrapper tree.

export function UmamiScript() {
  const websiteId = env.public.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const scriptUrl = env.public.NEXT_PUBLIC_UMAMI_SCRIPT_URL;

  if (!websiteId || !scriptUrl) {
    return null;
  }

  return (
    <Script
      src={scriptUrl}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
