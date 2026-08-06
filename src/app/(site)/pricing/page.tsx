import type { Metadata } from "next";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/section-container";
import { PageHero } from "@/components/molecules/page-hero";
import { Button } from "@/components/ui/button";
import { pricingServices } from "@/lib/pricing";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Custom digital work priced by scope — fixed quote after a free scoping call. No published rates, no surprise invoices.",
  alternates: { canonical: routes.pricing },
  openGraph: {
    title: "Pricing",
    description:
      "Custom digital work priced by scope. Fixed quote after a free scoping call.",
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
        description="Serious custom work, scoped to your goals. Every engagement gets a fixed quote after a free scoping call — no published rates, no surprise invoices."
      />

      <SectionContainer>
        <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.35em] text-primary">
          What we build
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {pricingServices.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="rounded-xl border-2 border-border bg-card p-6 shadow-md transition hover:-translate-y-0.5 hover:border-primary hover:shadow-xl"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h2 className="font-display text-2xl">{item.title}</h2>
                <p className="shrink-0 font-mono text-sm text-primary sm:text-right">
                  {item.fit}
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
          Pricing is available by quote. Scope, timeline, and budget are
          confirmed on a free scoping call before you commit.
        </p>
      </SectionContainer>

      <SectionContainer variant="muted" className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-foreground">
          Free scoping call
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
          Schedule a quote
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
