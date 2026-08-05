import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { MarketingLayout } from "@/components/templates/marketing-layout";
import { SectionContainer } from "@/components/atoms/section-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContactForm } from "./components/contact-form";

export const metadata: Metadata = {
  title: "Contact — Nothing.Digital",
  description:
    "Get in touch with Nothing.Digital. Let's build something meaningful together.",
};

const contactInfo = [
  {
    icon: <Mail className="h-5 w-5" />,
    label: "Email",
    value: "hello@nothing.digital",
    href: "mailto:hello@nothing.digital",
  },
];

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "We build custom websites, software solutions, web and mobile applications, and data-driven email marketing campaigns.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines depend on scope. A simple marketing site can ship in 4–6 weeks, while larger products may take several months.",
  },
  {
    question: "Do you work with startups and enterprises?",
    answer:
      "Yes — we partner with early-stage startups, scale-ups, and established companies looking for high-quality digital work.",
  },
  {
    question: "What does your process look like?",
    answer:
      "We start with discovery, move into design and prototyping, then build, test, launch, and support.",
  },
  {
    question: "What does a project typically cost?",
    answer:
      "Ballparks: marketing websites $5K–$15K, custom software $15K–$60K, web/mobile apps $20K–$80K, ongoing email marketing $1.5K–$5K/month. Every project gets a fixed quote after a free scoping call — no hourly billing, no surprise invoices.",
  },
];

export default function ContactPage() {
  return (
    <MarketingLayout>
      <SectionContainer>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Let&apos;s Build Something
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us what you are building. We reply within one business day.
          </p>
        </div>
      </SectionContainer>

      <SectionContainer variant="muted">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-background p-6 shadow-sm md:p-8">
            <ContactForm />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
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
    </MarketingLayout>
  );
}
