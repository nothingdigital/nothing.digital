import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/templates/service-page";
import { MarketingLayout } from "@/components/templates/marketing-layout";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Software Solutions",
  description:
    "Bespoke software and automation tools that streamline operations and unlock growth.",
  alternates: { canonical: routes.services.softwareSolutions },
  openGraph: {
    title: "Software Solutions",
    description:
      "Bespoke software and automation tools that streamline operations and unlock growth.",
    url: routes.services.softwareSolutions,
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

const techStack = [
  {
    name: "Node.js",
    rationale: "Reliable server runtime for APIs, jobs, and integrations.",
  },
  {
    name: "PostgreSQL",
    rationale:
      "Relational data with integrity when your workflows get complex.",
  },
  {
    name: "TypeScript",
    rationale: "Shared types across client and server reduce integration bugs.",
  },
  {
    name: "Next.js",
    rationale:
      "Admin UIs and dashboards that ship with the same stack as the API.",
  },
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
        techStack={techStack}
        processSteps={processSteps}
        faqItems={faqItems}
        jsonLd={jsonLd}
      />
    </MarketingLayout>
  );
}
