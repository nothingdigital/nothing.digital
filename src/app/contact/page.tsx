import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { SectionContainer } from "@/components/atoms/section-container";
import { JsonLd } from "@/components/atoms/json-ld";
import { PageHero } from "@/components/molecules/page-hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContactForm } from "./components/contact-form";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free scoping call with Nothing.Digital. We reply within one business day.",
  alternates: { canonical: routes.contact },
};

const faqs: {
  question: string;
  answer: React.ReactNode;
  answerText: string;
}[] = [
  {
    question: "What services do you offer?",
    answer:
      "We build custom websites, software solutions, web and mobile applications, and data-driven email marketing campaigns.",
    answerText:
      "We build custom websites, software solutions, web and mobile applications, and data-driven email marketing campaigns.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines depend on scope. A simple marketing site can ship in 4–6 weeks, while larger products may take several months.",
    answerText:
      "Timelines depend on scope. A simple marketing site can ship in 4–6 weeks, while larger products may take several months.",
  },
  {
    question: "Do you work with startups and enterprises?",
    answer:
      "Yes — we partner with early-stage startups, scale-ups, and established companies looking for high-quality digital work.",
    answerText:
      "Yes — we partner with early-stage startups, scale-ups, and established companies looking for high-quality digital work.",
  },
  {
    question: "What does your process look like?",
    answer:
      "We start with discovery, move into design and prototyping, then build, test, launch, and support.",
    answerText:
      "We start with discovery, move into design and prototyping, then build, test, launch, and support.",
  },
  {
    question: "What does a project typically cost?",
    answer: (
      <>
        See our{" "}
        <Link
          href={routes.pricing}
          className="text-primary underline underline-offset-4"
        >
          pricing page
        </Link>{" "}
        for current ranges. Every project gets a fixed quote after a free
        scoping call — no hourly billing, no surprise invoices.
      </>
    ),
    answerText:
      "See our pricing page for current ranges. Every project gets a fixed quote after a free scoping call — no hourly billing, no surprise invoices.",
  },
];

const faqJsonLd = {
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answerText,
    },
  })),
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />

      <PageHero
        kicker="Free scoping call"
        title="Let's build something"
        description="Tell us what you are building. We reply within one business day."
      />

      <SectionContainer variant="muted">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest">
                  Email
                </p>
                <a
                  href="mailto:hello@nothing.digital"
                  className="text-muted-foreground hover:text-foreground"
                >
                  hello@nothing.digital
                </a>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Looking for ballpark ranges?{" "}
              <Link
                href={routes.pricing}
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                See pricing
              </Link>
              .
            </p>
          </div>

          <div className="rounded-xl border-2 border-border bg-background p-6 shadow-md md:p-8">
            <ContactForm />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-3xl tracking-tight">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SectionContainer>
    </>
  );
}
