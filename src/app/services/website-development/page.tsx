import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/templates/service-page";
import { MarketingLayout } from "@/components/templates/marketing-layout";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Website Development",
  description:
    "Custom, responsive websites built for performance, accessibility, and conversion.",
  alternates: { canonical: routes.services.websiteDevelopment },
  openGraph: {
    title: "Website Development",
    description:
      "Custom, responsive websites built for performance, accessibility, and conversion.",
    url: routes.services.websiteDevelopment,
    type: "website",
  },
};

const features = [
  "Responsive design for every device",
  "Accessibility-first markup",
  "Performance-optimized builds",
  "SEO-ready structure and metadata",
  "CMS integration when you need it",
  "Analytics and conversion tracking",
];

const techStack = [
  {
    name: "Next.js",
    rationale:
      "Static HTML by default so Core Web Vitals stay strong without a fight.",
  },
  {
    name: "React",
    rationale:
      "Component model that keeps complex UIs maintainable as you grow.",
  },
  {
    name: "TypeScript",
    rationale:
      "Catches regressions early and makes handoffs safer for your team.",
  },
  {
    name: "Tailwind CSS",
    rationale: "Fast iteration on design systems without CSS debt.",
  },
];

const processSteps = [
  {
    title: "Discover",
    description: "Understand your audience, brand, and business goals.",
  },
  {
    title: "Design",
    description: "Wireframes and visual design tuned for conversion.",
  },
  {
    title: "Develop",
    description: "Clean, maintainable code with modern frameworks.",
  },
  {
    title: "Deliver",
    description: "Launch, monitor, and iterate based on real data.",
  },
];

const faqItems = [
  {
    question: "How long does a typical website take?",
    answer:
      "Most brochure sites launch in 4–6 weeks. Larger builds with custom CMS or e-commerce features take 8–12 weeks.",
  },
  {
    question: "Do you work with existing designs?",
    answer:
      "Yes. We can build from your Figma files or design the experience from scratch.",
  },
];

const jsonLd = {
  "@type": "Service",
  name: "Website Development",
  description:
    "Custom, responsive websites built for performance, accessibility, and conversion.",
  provider: {
    "@type": "Organization",
    name: "Nothing.Digital",
    url: "https://nothing.digital",
  },
};

export default function WebsiteDevelopmentPage() {
  return (
    <MarketingLayout>
      <ServicePageTemplate
        title="Website Development"
        description="Custom, responsive websites built for performance, accessibility, and conversion."
        problem="A slow, outdated, or hard-to-manage website quietly costs you leads and credibility."
        solution="We design and build fast, accessible websites that communicate your value and turn visitors into customers."
        features={features}
        techStack={techStack}
        processSteps={processSteps}
        faqItems={faqItems}
        jsonLd={jsonLd}
      />
    </MarketingLayout>
  );
}
