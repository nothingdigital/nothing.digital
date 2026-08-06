import type { Metadata } from "next";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/section-container";
import { PageHero } from "@/components/molecules/page-hero";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/molecules/service-card";
import { routes } from "@/lib/routes";
import { serviceSummaries } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Senior web and software development: websites, custom software, applications, and email marketing.",
  alternates: { canonical: routes.services.index },
  openGraph: {
    title: "Services",
    description:
      "Senior web and software development: websites, custom software, applications, and email marketing.",
    url: routes.services.index,
    type: "website",
  },
};

const processSteps = [
  {
    title: "Discover",
    description: "We learn your goals, users, and constraints.",
  },
  {
    title: "Design",
    description: "We craft experiences that align with your brand.",
  },
  {
    title: "Develop",
    description: "We build with clean code and modern tooling.",
  },
  {
    title: "Deliver",
    description: "We launch, measure, and iterate for growth.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        kicker="What we do"
        title="Services"
        description="End-to-end digital services for brands that want to move fast and look good doing it."
      />

      <SectionContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {serviceSummaries.map((service) => (
            <ServiceCard
              key={service.href}
              title={service.title}
              description={service.description}
              icon={<service.icon className="h-6 w-6" />}
              href={service.href}
            />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer variant="muted">
        <h2 className="mb-8 text-center font-display text-3xl tracking-tight">
          How we work
        </h2>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-xl border-2 border-border bg-card p-6 text-center shadow-md"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary font-mono text-base font-bold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mb-2 font-display text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </SectionContainer>

      <SectionContainer className="text-center">
        <h2 className="mb-4 font-display text-3xl tracking-tight">
          Not sure what you need?
        </h2>
        <p className="mb-6 text-muted-foreground">
          Book a free scoping call and we will recommend the right approach.
        </p>
        <Button
          asChild
          size="lg"
          className="shadow-[0_10px_40px_-12px_hsl(var(--primary)/0.55)]"
        >
          <Link href={routes.contact}>Book a free scoping call</Link>
        </Button>
      </SectionContainer>
    </>
  );
}
