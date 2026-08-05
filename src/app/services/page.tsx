import type { Metadata } from "next";
import { Code, Globe, Mail, Smartphone } from "lucide-react";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/section-container";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/molecules/service-card";
import { MarketingLayout } from "@/components/templates/marketing-layout";
import { routes } from "@/lib/routes";

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

const services = [
  {
    title: "Website Development",
    description:
      "Custom, responsive websites built for performance and conversion.",
    icon: <Globe className="h-6 w-6" />,
    href: routes.services.websiteDevelopment,
  },
  {
    title: "Software Solutions",
    description:
      "Bespoke software and automation tools tailored to your workflow.",
    icon: <Code className="h-6 w-6" />,
    href: routes.services.softwareSolutions,
  },
  {
    title: "Applications",
    description: "Mobile and web apps designed for scale and user engagement.",
    icon: <Smartphone className="h-6 w-6" />,
    href: routes.services.applications,
  },
  {
    title: "Email Marketing",
    description: "Data-driven campaigns that nurture leads and drive revenue.",
    icon: <Mail className="h-6 w-6" />,
    href: routes.services.emailMarketing,
  },
];

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
    <MarketingLayout>
      <SectionContainer className="pt-24 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
            What we do
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
            Services
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            End-to-end digital services for brands that want to move fast and
            look good doing it.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.href} {...service} />
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
        <Button asChild size="lg" className="shadow-lg">
          <Link href={routes.contact}>Book a free scoping call</Link>
        </Button>
      </SectionContainer>
    </MarketingLayout>
  );
}
