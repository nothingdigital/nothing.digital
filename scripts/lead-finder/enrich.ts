export type EnrichResult = {
  email: string | null;
  source: "hunter" | "mailto" | "none";
};

function extractMailto(html: string): string | null {
  const match = html.match(
    /mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
  );
  return match?.[1]?.toLowerCase() ?? null;
}

function domainFromWebsite(website: string | null): string | null {
  if (!website) return null;
  try {
    const url = new URL(
      website.startsWith("http") ? website : `https://${website}`,
    );
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

/** Extract first business-looking mailto from fetched HTML. */
export function enrichFromHtml(html: string | null): EnrichResult {
  if (!html) return { email: null, source: "none" };
  const email = extractMailto(html);
  if (!email) return { email: null, source: "none" };
  if (/example\.com|sentry\.io|wixpress|godaddy/i.test(email)) {
    return { email: null, source: "none" };
  }
  return { email, source: "mailto" };
}

type HunterResponse = {
  data?: {
    emails?: Array<{ value?: string; type?: string; confidence?: number }>;
  };
};

export async function enrichWithHunter(
  domain: string,
  apiKey: string,
): Promise<EnrichResult> {
  const url = new URL("https://api.hunter.io/v2/domain-search");
  url.searchParams.set("domain", domain);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("limit", "3");

  const response = await fetch(url);
  if (!response.ok) {
    return { email: null, source: "none" };
  }

  const data = (await response.json()) as HunterResponse;
  const emails = data.data?.emails ?? [];
  const preferred =
    emails.find((row) => row.type === "personal" && row.value) ??
    emails.find((row) => row.value);

  if (!preferred?.value) return { email: null, source: "none" };
  return { email: preferred.value.toLowerCase(), source: "hunter" };
}

export async function enrichLead(options: {
  website: string | null;
  html: string | null;
  hunterApiKey?: string;
}): Promise<EnrichResult> {
  const fromHtml = enrichFromHtml(options.html);
  if (fromHtml.email) return fromHtml;

  const domain = domainFromWebsite(options.website);
  if (domain && options.hunterApiKey) {
    return enrichWithHunter(domain, options.hunterApiKey);
  }

  return { email: null, source: "none" };
}
