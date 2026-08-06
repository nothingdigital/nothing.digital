import type { Metadata } from "next";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/section-container";
import { JsonLd } from "@/components/atoms/json-ld";
import { PageHero } from "@/components/molecules/page-hero";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { sameAs, siteConfig } from "@/lib/site";
import { Seal } from "@/components/atoms/seal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Nothing.Digital: our story, values, and why brands choose a senior-only studio that ships on time.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Purpose-first",
    description:
      "We start with the outcome you need and work backwards, avoiding features that do not move the needle.",
  },
  {
    title: "Human-centered",
    description:
      "Great software is built for real people. We design around user needs, accessibility, and clarity.",
  },
  {
    title: "Pragmatic innovation",
    description:
      "We use proven tools and introduce new technology only when it solves a real problem.",
  },
  {
    title: "Long-term ownership",
    description:
      "We build systems that are easy to maintain, scale, and hand off when the time comes.",
  },
];

const reasons = [
  "Senior team with deep product and engineering experience",
  "Transparent communication and fixed-scope proposals",
  "Code quality, testing, and performance from day one",
  "Support after launch with monitoring and iteration",
];

const organizationJsonLd = {
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/og/default.png`,
  sameAs,
  contactPoint: {
    "@type": "ContactPoint",
    email: siteConfig.contactEmail ?? siteConfig.email,
    telephone: siteConfig.phone,
    contactType: "sales",
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />

      <PageHero
        kicker="Who we are"
        title="About Nothing.Digital"
        description="A small studio of builders, designers, and strategists helping ambitious companies ship great digital products."
      />

      <SectionContainer variant="muted">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-display text-3xl tracking-tight">
            Our story
          </h2>
          <div className="space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Nothing.Digital was founded on a simple idea: most digital work is
              unnecessarily complicated. We wanted to build a studio that cuts
              through the noise and ships work that actually performs.
            </p>
            <p>
              From marketing sites to full product builds, we help startups,
              agencies, and enterprise teams turn ideas into reliable, scalable
              software. Our process is lean, our communication is direct, and
              our work is built to last.
            </p>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center font-display text-3xl tracking-tight">
            Our values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border-2 border-border bg-card p-6 shadow-md transition hover:-translate-y-0.5 hover:border-primary hover:shadow-xl"
              >
                <h3 className="mb-2 font-display text-xl">{value.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer variant="muted" className="text-center">
        <Seal className="mx-auto text-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">
          The Business of Nothing LLC · Established 2026 · Northport, Alabama
        </p>
      </SectionContainer>

      <SectionContainer variant="muted">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-3xl tracking-tight">
            Why choose us
          </h2>
          <ul className="space-y-4">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                <span className="leading-relaxed text-muted-foreground">
                  {reason}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href={routes.contact}>Book a free scoping call</Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
