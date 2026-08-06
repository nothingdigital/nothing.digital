import type { Metadata } from "next";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/section-container";
import { PageHero } from "@/components/molecules/page-hero";
import { Button } from "@/components/ui/button";
import { pricingBallparks } from "@/lib/pricing";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Ballpark ranges for websites ($5K–$15K), software ($15K–$60K), apps ($20K–$80K), email marketing ($1.5K–$5K/mo), AI ($8K–$35K), tech literacy ($75–$150/hr), and coding & SQL ($40–$80/session). Fixed quote after a free scoping call.",
  alternates: { canonical: routes.pricing },
  openGraph: {
    title: "Pricing",
    description:
      "Ballpark ranges for websites, software, apps, email, AI, tech literacy, and coding & SQL. Fixed quote after scoping.",
    url: routes.pricing,
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        kicker="Investment"
        title="Pricing"
        description="Starting ranges so you can self-qualify. Every project still gets a fixed quote after scoping — no hourly billing, no surprise invoices."
      />

      <SectionContainer>
        <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.35em] text-primary">
          Ballpark ranges
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {pricingBallparks.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="rounded-xl border-2 border-border bg-card p-6 shadow-md transition hover:-translate-y-0.5 hover:border-primary hover:shadow-xl"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl">{item.title}</h2>
                <p className="font-mono text-lg text-primary">{item.range}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          Ranges are starting points. Scope, timeline, and budget are confirmed
          on a free scoping call before you commit.
        </p>
      </SectionContainer>

      <SectionContainer variant="muted" className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-foreground">
          Free scoping call
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
          Get your fixed quote
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          We map scope, timeline, and budget before you commit. Reply within one
          business day.
        </p>
        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="w-full shadow-[0_10px_40px_-12px_hsl(var(--primary)/0.55)] sm:w-auto"
          >
            <Link href={routes.contact}>Book a free scoping call</Link>
          </Button>
        </div>
      </SectionContainer>
    </>
  );
}
