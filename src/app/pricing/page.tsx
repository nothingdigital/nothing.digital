import type { Metadata } from "next";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/section-container";
import { PageHero } from "@/components/molecules/page-hero";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent project ranges for websites, custom software, apps, and email marketing. Fixed quotes after a free scoping call.",
  alternates: { canonical: routes.pricing },
};

const tiers = [
  {
    name: "Marketing websites",
    range: "$5K–$15K",
    detail:
      "Brochure and conversion-focused sites. Typical timeline: 4–6 weeks.",
    href: routes.services.websiteDevelopment,
  },
  {
    name: "Custom software",
    range: "$15K–$60K",
    detail:
      "Internal tools, automations, and integrations. Scoped after discovery.",
    href: routes.services.softwareSolutions,
  },
  {
    name: "Web & mobile apps",
    range: "$20K–$80K",
    detail: "Product builds with auth, APIs, and ongoing iteration.",
    href: routes.services.applications,
  },
  {
    name: "Email marketing",
    range: "$1.5K–$5K/mo",
    detail: "Strategy, templates, automations, and reporting retainers.",
    href: routes.services.emailMarketing,
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        kicker="Investment"
        title="Pricing"
        description="Honest ranges so you can qualify fit before we talk. Every project gets a fixed quote after a free scoping call — no hourly billing, no surprise invoices."
      />

      <SectionContainer variant="muted">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {tiers.map((tier) => (
            <Link
              key={tier.name}
              href={tier.href}
              className="group rounded-xl border-2 border-border bg-card p-6 shadow-md transition-colors hover:border-primary hover:shadow-xl"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                {tier.range}
              </p>
              <h2 className="mt-3 font-display text-2xl group-hover:text-primary">
                {tier.name}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {tier.detail}
              </p>
            </Link>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
          Free scoping call
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
          Not sure where you land?
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
