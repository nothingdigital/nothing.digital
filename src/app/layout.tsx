import type { Metadata } from "next";
import { DM_Serif_Display, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { JsonLd } from "@/components/atoms/json-ld";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nothing.digital";

export const metadata: Metadata = {
  title: {
    default: "Nothing.Digital — Premium Digital Services",
    template: "%s — Nothing.Digital",
  },
  description:
    "Nothing.Digital builds websites, custom software, applications, and email marketing strategies.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nothing.Digital",
    images: [`${SITE_URL}/og/default.svg`],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE_URL}/og/default.svg`],
  },
};

const organizationJsonLd = {
  "@type": "Organization",
  name: "Nothing.Digital",
  url: SITE_URL,
  logo: `${SITE_URL}/og/default.svg`,
  sameAs: [
    "https://twitter.com/nothingdigital",
    "https://linkedin.com/company/nothingdigital",
    "https://github.com/nothingdigital",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${dmSerifDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  );
}
