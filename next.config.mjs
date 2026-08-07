/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ponytail: lock Next.js workspace root to this project; parent dir has stray package-lock.json.
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: ["@react-pdf/renderer"],
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    remotePatterns: [
      { protocol: "https", hostname: "images.nothing.digital" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // ponytail: static CSP fallback; Cloudflare Transform Rules are the source of truth
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://analytics.nothing.digital https://*.vercel-scripts.com https://vercel.live https://assets.calendly.com; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https:; " +
              "font-src 'self'; " +
              "connect-src 'self' https://*.supabase.co https://*.sentry.io https://analytics.nothing.digital https://*.vercel-scripts.com https://vitals.vercel-insights.com; " +
              "frame-src 'self' https://calendly.com https://*.calendly.com; " +
              "frame-ancestors 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
