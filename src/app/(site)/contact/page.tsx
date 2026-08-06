import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Calendar, Mail, Phone } from "lucide-react";

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
import { env } from "@/lib/env";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

// ponytail: lazy-load Calendly iframe below the fold; ssr:false is not allowed in Server Components.
const CalendlyEmbed = dynamic(() =>
  import("./components/calendly-embed").then((module) => module.CalendlyEmbed),
);

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
      "We build custom websites, software solutions, web and mobile applications, email marketing, and practical AI — and we teach tech literacy plus coding & SQL for beginners, kids, and youth.",
    answerText:
      "We build custom websites, software solutions, web and mobile applications, email marketing, and practical AI — and we teach tech literacy plus coding & SQL for beginners, kids, and youth.",
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
        Every engagement gets a fixed quote after a free scoping call — no
        published rates, no surprise invoices. See how pricing works on our{" "}
        <Link
          href={routes.pricing}
          className="text-primary underline underline-offset-4"
        >
          pricing page
        </Link>
        .
      </>
    ),
    answerText:
      "Every engagement gets a fixed quote after a free scoping call — no published rates, no surprise invoices. See https://nothing.digital/pricing.",
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
  const calendlyUrl = env.private.CALENDLY_URL;

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
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent ring-1 ring-accent/20">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest">
                  Phone
                </p>
                <a
                  href={`tel:${siteConfig.phone.replace(/-/g, "")}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {siteConfig.phone}
                </a>
              </div>
            </div>

            {calendlyUrl ? (
              <div className="flex items-start gap-4">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent ring-1 ring-accent/20">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest">
                    Book a call
                  </p>
                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pick a time that works for you
                  </a>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border-2 border-border bg-background p-6 shadow-md md:p-8">
            <ContactForm />
          </div>
        </div>

        {calendlyUrl ? (
          <div className="mt-12">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Or book directly
            </p>
            <CalendlyEmbed url={calendlyUrl} />
          </div>
        ) : null}
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
