import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/atoms/json-ld";
import { SectionContainer } from "@/components/atoms/section-container";
import { PageHero } from "@/components/molecules/page-hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface TechStackItem {
  name: string;
  rationale: string;
}

export interface ServicePageTemplateProps {
  title: string;
  description: string;
  problem: string;
  solution: string;
  features: string[];
  processSteps: ProcessStep[];
  faqItems: FaqItem[];
  techStack?: TechStackItem[];
  jsonLd?: Record<string, unknown>;
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
          <h2 className="mb-4 font-display text-2xl">The challenge</h2>
          <p className="text-muted-foreground">{problem}</p>
        </div>
        <div>
          <h2 className="mb-4 font-display text-2xl">How we help</h2>
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
      <h2 className="mb-8 text-center font-display text-3xl tracking-tight">
        What you get
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="rounded-xl border-2 border-border bg-card p-4 text-card-foreground shadow-md"
          >
            {feature}
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}

function TechStackSection({ items }: { items?: TechStackItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <SectionContainer variant="muted">
      <h2 className="mb-8 text-center font-display text-3xl tracking-tight">
        Technologies we use
      </h2>
      <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.name}
            className="rounded-xl border-2 border-border bg-card p-5 shadow-md"
          >
            <h3 className="font-display text-xl">{item.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.rationale}
            </p>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}

function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  if (steps.length === 0) return null;

  return (
    <SectionContainer>
      <h2 className="mb-8 text-center font-display text-3xl tracking-tight">
        Our process
      </h2>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative rounded-xl border-2 border-border bg-card p-6 shadow-md"
          >
            <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
              {index + 1}
            </span>
            <h3 className="mb-2 font-display text-lg">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </SectionContainer>
  );
}

function FaqSection({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  const faqJsonLd = {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <SectionContainer variant="muted">
      <JsonLd data={faqJsonLd} />
      <h2 className="mb-8 text-center font-display text-3xl tracking-tight">
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

function CtaSection() {
  return (
    <SectionContainer className="text-center">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
        Next step
      </p>
      <h2 className="mt-3 mb-4 font-display text-3xl tracking-tight">
        Ready to start?
      </h2>
      <p className="mb-6 text-muted-foreground">
        Book a free scoping call — we reply within one business day.
      </p>
      <Button
        asChild
        size="lg"
        className="shadow-[0_10px_40px_-12px_hsl(var(--primary)/0.55)]"
      >
        <Link href={routes.contact}>Book a free scoping call</Link>
      </Button>
    </SectionContainer>
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
  techStack,
  jsonLd,
}: ServicePageTemplateProps) {
  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <PageHero kicker="Service" title={title} description={description} />
      <SectionContainer className="py-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-border">
          <Image
            src="/og/default.png"
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
        </div>
      </SectionContainer>
      <ProblemSolutionSection problem={problem} solution={solution} />
      <FeaturesSection features={features} />
      <TechStackSection items={techStack} />
      <ProcessSection steps={processSteps} />
      <FaqSection items={faqItems} />
      <CtaSection />
    </>
  );
}
