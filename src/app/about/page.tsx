import type { Metadata } from "next";
import {
  Target,
  Users,
  Lightbulb,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

import { MarketingLayout } from "@/components/templates/marketing-layout";
import { SectionContainer } from "@/components/atoms/section-container";
import { JsonLd } from "@/components/atoms/json-ld";

export const metadata: Metadata = {
  title: "About — Nothing.Digital",
  description:
    "Learn about Nothing.Digital: our story, values, team, and why brands choose us.",
};

const values = [
  {
    title: "Purpose-first",
    description:
      "We start with the outcome you need and work backwards, avoiding features that do not move the needle.",
    icon: <Target className="h-6 w-6" />,
  },
  {
    title: "Human-centered",
    description:
      "Great software is built for real people. We design around user needs, accessibility, and clarity.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Pragmatic innovation",
    description:
      "We use proven tools and introduce new technology only when it solves a real problem.",
    icon: <Lightbulb className="h-6 w-6" />,
  },
  {
    title: "Long-term ownership",
    description:
      "We build systems that are easy to maintain, scale, and hand off when the time comes.",
    icon: <ShieldCheck className="h-6 w-6" />,
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
  name: "Nothing.Digital",
  url: "https://nothing.digital",
  logo: "https://nothing.digital/og/default.svg",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@nothing.digital",
    contactType: "sales",
  },
};

export default function AboutPage() {
  return (
    <MarketingLayout>
      <JsonLd data={organizationJsonLd} />

      <SectionContainer>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            About Nothing.Digital
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We are a small team of builders, designers, and strategists helping
            ambitious companies ship great digital products.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer variant="muted">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">Our story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Nothing.Digital was founded on a simple idea: most digital work is
              unnecessarily complicated. We wanted to build a studio that cuts
              through the noise and ships work that actually performs.
            </p>
            <p>
              From marketing sites to full product builds, we have helped
              startups, agencies, and enterprise teams turn ideas into reliable,
              scalable software. Our process is lean, our communication is
              direct, and our work is built to last.
            </p>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
            Our values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary/50"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {value.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer variant="muted">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">
            Meet the team
          </h2>
          <p className="text-muted-foreground">Team profiles coming soon.</p>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Why choose us
          </h2>
          <ul className="space-y-4">
            {reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionContainer>
    </MarketingLayout>
  );
}
