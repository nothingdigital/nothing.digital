import type { Metadata } from "next";
import { Code, Globe, Mail, Smartphone } from "lucide-react";
import Link from "next/link";

import { SectionContainer } from "@/components/atoms/section-container";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/molecules/service-card";
import { MarketingLayout } from "@/components/templates/marketing-layout";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Services — Nothing.Digital",
  description:
    "Explore our digital services: website development, custom software solutions, applications, and email marketing.",
  openGraph: {
    title: "Services — Nothing.Digital",
    description:
      "Explore our digital services: website development, custom software solutions, applications, and email marketing.",
    url: "https://nothing.digital/services",
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
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            What We Do
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
        <h2 className="mb-8 text-center text-2xl font-semibold">How we work</h2>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-lg border bg-background p-6 text-center shadow-sm"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </SectionContainer>

      <SectionContainer className="text-center">
        <h2 className="mb-4 text-2xl font-semibold">Not sure what you need?</h2>
        <p className="mb-6 text-muted-foreground">
          Book a free discovery call and we will recommend the right approach.
        </p>
        <Button asChild>
          <Link href={routes.contact}>Discuss your project</Link>
        </Button>
      </SectionContainer>
    </MarketingLayout>
  );
}
