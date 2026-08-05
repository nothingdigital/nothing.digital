import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/templates/service-page";
import { MarketingLayout } from "@/components/templates/marketing-layout";

export const metadata: Metadata = {
  title: "Software Solutions — Nothing.Digital",
  description:
    "Bespoke software and automation tools that streamline operations and unlock growth.",
  openGraph: {
    title: "Software Solutions — Nothing.Digital",
    description:
      "Bespoke software and automation tools that streamline operations and unlock growth.",
    url: "https://nothing.digital/services/software-solutions",
    type: "website",
  },
};

const features = [
  "Custom internal tools and dashboards",
  "Workflow automation",
  "Third-party API integrations",
  "Data pipelines and reporting",
  "Scalable cloud architecture",
  "Ongoing support and maintenance",
];

const processSteps = [
  {
    title: "Discover",
    description: "Map your current workflow and identify bottlenecks.",
  },
  {
    title: "Design",
    description: "Architect the simplest system that solves the problem.",
  },
  {
    title: "Develop",
    description: "Build iteratively with clean code and automated tests.",
  },
  {
    title: "Deliver",
    description: "Deploy, train your team, and measure impact.",
  },
];

const faqItems = [
  {
    question: "Do you build on top of existing platforms?",
    answer:
      "Absolutely. We integrate with the tools you already use rather than rebuilding what already works.",
  },
  {
    question: "How do you handle ongoing changes?",
    answer:
      "We ship in small, reversible increments and offer maintenance retainers for continuous improvement.",
  },
];

const jsonLd = {
  "@type": "Service",
  name: "Software Solutions",
  description:
    "Bespoke software and automation tools that streamline operations and unlock growth.",
  provider: {
    "@type": "Organization",
    name: "Nothing.Digital",
    url: "https://nothing.digital",
  },
};

export default function SoftwareSolutionsPage() {
  return (
    <MarketingLayout>
      <ServicePageTemplate
        title="Software Solutions"
        description="Bespoke software and automation tools that streamline operations and unlock growth."
        problem="Off-the-shelf tools force your team into rigid workflows, creating manual work and missed opportunities."
        solution="We build custom software and automations that fit your exact process, saving time and reducing errors."
        features={features}
        processSteps={processSteps}
        faqItems={faqItems}
        jsonLd={jsonLd}
      />
    </MarketingLayout>
  );
}
