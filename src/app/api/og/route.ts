import { NextRequest, NextResponse } from "next/server";

// ponytail: simple SVG OG image route; replaces @vercel/og dependency.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nothing.digital";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSvg(title: string, description: string): string {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0f172a"/>
  <text x="600" y="280" text-anchor="middle" font-family="system-ui, sans-serif" font-size="64" font-weight="bold" fill="#f8fafc">${escapeXml(title)}</text>
  <text x="600" y="360" text-anchor="middle" font-family="system-ui, sans-serif" font-size="32" fill="#94a3b8">${escapeXml(description)}</text>
</svg>`;
}

export function GET(request: NextRequest): NextResponse {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get("title") ?? "Nothing.Digital";
  const description =
    searchParams.get("description") ?? "Premium digital services";

  const svg = buildSvg(title, description);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, immutable",
      Link: `<${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}>; rel="canonical"`,
    },
  });
}
