import type { ScoreResult } from "./types";

const SOCIAL_HOSTS = new Set([
  "facebook.com",
  "fb.com",
  "instagram.com",
  "linktr.ee",
  "yelp.com",
]);

const PARK_PAGE_PATTERNS = [
  /coming soon/i,
  /under construction/i,
  /website parked/i,
  /domain for sale/i,
  /this site is currently unavailable/i,
  /godaddy\.com\/parked/i,
  /hugedomains/i,
];

const BUILDER_FINGERPRINTS = [
  /cdn\.duda\.co/i,
  /wixsite\.com/i,
  /sites\.google\.com/i,
];

export type FetchSnapshot = {
  ok: boolean;
  status: number | null;
  finalUrl: string | null;
  html: string | null;
  timedOut: boolean;
  https: boolean;
};

export function classifyWebsiteUrl(
  website: string | null,
): "none" | "social" | "site" {
  if (!website?.trim()) return "none";
  try {
    const url = new URL(
      website.startsWith("http") ? website : `https://${website}`,
    );
    const host = url.hostname.toLowerCase().replace(/^(www|m)\./, "");
    if (SOCIAL_HOSTS.has(host) || host.endsWith(".facebook.com")) {
      return "social";
    }
    return "site";
  } catch {
    return "none";
  }
}

export function scoreWebsite(
  website: string | null,
  snapshot: FetchSnapshot | null,
): ScoreResult {
  const reasons: string[] = [];
  let score = 0;
  const kind = classifyWebsiteUrl(website);

  if (kind === "none") {
    reasons.push("no-website");
    score += 45;
  } else if (kind === "social") {
    reasons.push("social-only");
    score += 40;
  }

  if (kind === "site" && snapshot) {
    if (snapshot.timedOut) {
      reasons.push("timeout");
      score += 35;
    } else if (!snapshot.ok) {
      reasons.push(`http-${snapshot.status ?? "error"}`);
      score += 35;
    }

    if (!snapshot.https) {
      reasons.push("no-https");
      score += 15;
    }

    const html = snapshot.html ?? "";
    if (html) {
      if (!/<meta[^>]+name=["']viewport["']/i.test(html)) {
        reasons.push("no-mobile-viewport");
        score += 12;
      }
      if (PARK_PAGE_PATTERNS.some((pattern) => pattern.test(html))) {
        reasons.push("park-or-coming-soon");
        score += 30;
      }
      if (BUILDER_FINGERPRINTS.some((pattern) => pattern.test(html))) {
        reasons.push("thin-builder-site");
        score += 10;
      }
      const yearMatch = html.match(/©\s*(20[0-2]\d)/);
      if (yearMatch && Number(yearMatch[1]) <= 2018) {
        reasons.push(`stale-copyright-${yearMatch[1]}`);
        score += 8;
      }
    }
  }

  if (kind === "site" && !snapshot) {
    reasons.push("unscored-fetch-skipped");
  }

  return { score: Math.min(100, score), reasons };
}

export async function fetchWebsiteSnapshot(
  website: string,
  timeoutMs = 8_000,
): Promise<FetchSnapshot> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const url = website.startsWith("http") ? website : `https://${website}`;

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "NothingDigitalLeadFinder/1.0 (+https://nothing.digital; research)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    const html = (await response.text()).slice(0, 200_000);
    const finalUrl = response.url;
    return {
      ok: response.ok,
      status: response.status,
      finalUrl,
      html,
      timedOut: false,
      https: finalUrl.startsWith("https://"),
    };
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "AbortError" || /aborted/i.test(error.message));
    return {
      ok: false,
      status: null,
      finalUrl: null,
      html: null,
      timedOut,
      https: url.startsWith("https://"),
    };
  } finally {
    clearTimeout(timer);
  }
}
