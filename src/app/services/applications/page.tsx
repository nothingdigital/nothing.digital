import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/templates/service-page";
import { MarketingLayout } from "@/components/templates/marketing-layout";

export const metadata: Metadata = {
  title: "Applications — Nothing.Digital",
  description:
    "Mobile and web applications built for scale, engagement, and long-term maintainability.",
  openGraph: {
    title: "Applications — Nothing.Digital",
    description:
      "Mobile and web applications built for scale, engagement, and long-term maintainability.",
    url: "https://nothing.digital/services/applications",
    type: "website",
  },
};

const features = [
  "Cross-platform mobile apps",
  "Progressive web applications",
  "Real-time data and collaboration",
  "Authentication and user management",
  "Offline support and sync",
  "App store publishing assistance",
];

const processSteps = [
  {
    title: "Discover",
    description: "Define user personas, journeys, and core features.",
  },
  {
    title: "Design",
    description: "Prototype intuitive interfaces and interactions.",
  },
  {
    title: "Develop",
    description: "Engineer robust frontends, backends, and APIs.",
  },
  {
    title: "Deliver",
    description: "Release, monitor, and refine based on usage data.",
  },
];

const faqItems = [
  {
    question: "Do you build native mobile apps?",
    answer:
      "We typically use cross-platform frameworks to ship iOS and Android from a single codebase, reducing cost and time to market.",
  },
  {
    question: "Can you take over an existing app?",
    answer:
      "Yes. We audit the codebase, stabilize critical issues, and recommend a roadmap before making changes.",
  },
];

const jsonLd = {
  "@type": "Service",
  name: "Applications",
  description:
    "Mobile and web applications built for scale, engagement, and long-term maintainability.",
  provider: {
    "@type": "Organization",
    name: "Nothing.Digital",
    url: "https://nothing.digital",
  },
};

export default function ApplicationsPage() {
  return (
    <MarketingLayout>
      <ServicePageTemplate
        title="Applications"
        description="Mobile and web applications built for scale, engagement, and long-term maintainability."
        problem="Users expect fast, reliable apps. A poor mobile experience loses engagement and market share."
        solution="We design and build web and mobile applications that keep users engaged and your engineering team sane."
        features={features}
        processSteps={processSteps}
        faqItems={faqItems}
        jsonLd={jsonLd}
      />
    </MarketingLayout>
  );
}
