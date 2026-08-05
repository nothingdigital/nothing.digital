import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code, Globe, Mail, Smartphone } from "lucide-react";

import { MarketingLayout } from "@/components/templates/marketing-layout";
import { SectionContainer } from "@/components/atoms/section-container";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

import { ServiceCard } from "@/components/molecules/service-card";
import { HeroClock } from "@/components/atoms/hero-clock";
import { routes } from "@/lib/routes";

// ponytail: lazy-load newsletter form because it sits below the fold and bundles react-hook-form.
const NewsletterForm = dynamic(() =>
  import("@/components/organisms/newsletter-form").then(
    (m) => m.NewsletterForm,
  ),
);

// ponytail: static service placeholders; replace with CMS/config-driven data when content is ready.
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

// ponytail: hard-coded featured slugs match content/portfolio/*.mdx.
const caseStudies = [
  {
    slug: "acme-launch",
    title: "Acme Launch Campaign",
    description:
      "A full-funnel website and email launch for a direct-to-consumer brand breaking into a crowded market.",
    metric: "+42% conversion",
  },
  {
    slug: "saas-onboarding",
    title: "SaaS Onboarding Flow",
    description:
      "Redesigning activation for a B2B SaaS product to shorten time-to-value and reduce churn.",
    metric: "+55% activation",
  },
];

interface CaseStudyCardProps {
  slug: string;
  title: string;
  description: string;
  metric: string;
}

function CaseStudyCard({
  slug,
  title,
  description,
  metric,
}: CaseStudyCardProps) {
  return (
    <Link
      href={routes.portfolio.detail(slug)}
      className="group block overflow-hidden rounded-lg border bg-card shadow-sm transition-colors hover:border-primary/50"
    >
      <div className="relative aspect-video">
        <Image
          src="/og/default.svg"
          alt=""
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="mb-2 text-sm font-semibold text-primary">{metric}</div>
        <h3 className="text-lg font-semibold group-hover:text-primary">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <MarketingLayout>
      <SectionContainer className="pb-12 pt-16 md:pt-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Built on time.{" "}
              <span className="text-primary">Built to last.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Nothing.Digital ships premium websites, custom software,
              applications, and email marketing — delivered precisely when you
              need it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              <Button asChild size="lg">
                <Link href={routes.services.index}>
                  Explore services <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={routes.contact}>Get in touch</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <HeroClock />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer variant="muted" id="services">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="mt-3 text-muted-foreground">
            End-to-end digital expertise.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.href} {...service} />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer id="portfolio">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Featured case studies
          </h2>
          <p className="mt-3 text-muted-foreground">
            Real results from recent work.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.slug} {...study} />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer variant="primary" id="newsletter">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Stay in the loop
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            One email a month. No spam, just insights.
          </p>
          <div className="mt-6 inline-block text-left">
            <NewsletterForm />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to build?</h2>
          <p className="mt-3 text-muted-foreground">
            Tell us what you are making and we will help you ship it.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href={routes.contact}>Start a project</Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
    </MarketingLayout>
  );
}
