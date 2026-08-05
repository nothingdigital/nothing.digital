import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/atoms/json-ld";
import { SectionContainer } from "@/components/atoms/section-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export interface CaseStudy {
  title: string;
  description: string;
  href: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ServicePageTemplateProps {
  title: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  processSteps: ProcessStep[];
  faqItems: FaqItem[];
  caseStudies?: CaseStudy[];
  ctaText?: string;
  image?: string;
  imageAlt?: string;
  jsonLd?: Record<string, unknown>;
}

function HeroSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <SectionContainer className="pt-24 md:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      </div>
    </SectionContainer>
  );
}

function ProblemSolutionSection({
  problem,
  solution,
}: {
  problem: string;
  solution: string;
}) {
  return (
    <SectionContainer variant="muted">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">The challenge</h2>
          <p className="text-muted-foreground">{problem}</p>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold">How we help</h2>
          <p className="text-muted-foreground">{solution}</p>
        </div>
      </div>
    </SectionContainer>
  );
}

function FeaturesSection({ features }: { features: string[] }) {
  if (features.length === 0) return null;

  return (
    <SectionContainer>
      <h2 className="mb-8 text-center text-2xl font-semibold">What you get</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            {feature}
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}

function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  if (steps.length === 0) return null;

  return (
    <SectionContainer variant="muted">
      <h2 className="mb-8 text-center text-2xl font-semibold">Our process</h2>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative rounded-lg border bg-background p-6 shadow-sm"
          >
            <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {index + 1}
            </span>
            <h3 className="mb-2 font-semibold">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </SectionContainer>
  );
}

function CaseStudiesSection({ caseStudies }: { caseStudies?: CaseStudy[] }) {
  if (!caseStudies || caseStudies.length === 0) return null;

  return (
    <SectionContainer>
      <h2 className="mb-8 text-center text-2xl font-semibold">Related work</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {caseStudies.map((study) => (
          <Link
            key={study.title}
            href={study.href}
            className="group rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary/50"
          >
            <h3 className="mb-2 font-semibold group-hover:text-primary">
              {study.title}
            </h3>
            <p className="text-sm text-muted-foreground">{study.description}</p>
          </Link>
        ))}
      </div>
    </SectionContainer>
  );
}

function FaqSection({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <SectionContainer variant="muted">
      <h2 className="mb-8 text-center text-2xl font-semibold">
        Frequently asked questions
      </h2>
      <Accordion type="single" collapsible className="mx-auto max-w-2xl">
        {items.map((item, index) => (
          <AccordionItem key={item.question} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionContainer>
  );
}

function CtaSection({ ctaText }: { ctaText: string }) {
  return (
    <SectionContainer className="text-center">
      <h2 className="mb-4 text-2xl font-semibold">Ready to start?</h2>
      <p className="mb-6 text-muted-foreground">
        Tell us about your project and we will get back to you within one
        business day.
      </p>
      <Button asChild>
        <Link href={routes.contact}>{ctaText}</Link>
      </Button>
    </SectionContainer>
  );
}

function PlaceholderImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
      {/* ponytail: using existing default.svg as placeholder until final assets arrive. */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 800px"
        priority
      />
    </div>
  );
}

export function ServicePageTemplate({
  title,
  description,
  problem,
  solution,
  features,
  processSteps,
  faqItems,
  caseStudies,
  ctaText = "Discuss your project",
  image = "/og/default.svg",
  imageAlt,
  jsonLd,
}: ServicePageTemplateProps) {
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <HeroSection title={title} description={description} />
      <SectionContainer className="py-0">
        <PlaceholderImage src={image} alt={imageAlt ?? title} />
      </SectionContainer>
      <ProblemSolutionSection problem={problem} solution={solution} />
      <FeaturesSection features={features} />
      <ProcessSection steps={processSteps} />
      <CaseStudiesSection caseStudies={caseStudies} />
      <FaqSection items={faqItems} />
      <CtaSection ctaText={ctaText} />
    </>
  );
}
