import type { Metadata } from "next";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/section-container";
import { PageHero } from "@/components/molecules/page-hero";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Every project is scoped and quoted individually. Book a free scoping call to get a fixed quote for your website, software, app, or email marketing project.",
  alternates: { canonical: routes.pricing },
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        kicker="Investment"
        title="Pricing"
        description="No two projects are alike, so we don't publish one-size-fits-all prices. Tell us what you're building and we'll come back with a fixed quote — no hourly billing, no surprise invoices."
      />

      <SectionContainer variant="muted" className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
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
          <Button asChild size="lg" className="shadow-lg">
            <Link href={routes.contact}>Book a free scoping call</Link>
          </Button>
        </div>
      </SectionContainer>
    </>
  );
}
