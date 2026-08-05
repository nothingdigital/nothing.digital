import type { Metadata } from "next";

import { ServicePageTemplate } from "@/components/templates/service-page";
import { MarketingLayout } from "@/components/templates/marketing-layout";

export const metadata: Metadata = {
  title: "Email Marketing — Nothing.Digital",
  description:
    "Data-driven email campaigns that nurture leads, retain customers, and drive revenue.",
  openGraph: {
    title: "Email Marketing — Nothing.Digital",
    description:
      "Data-driven email campaigns that nurture leads, retain customers, and drive revenue.",
    url: "https://nothing.digital/services/email-marketing",
    type: "website",
  },
};

const features = [
  "Strategy and segmentation",
  "Template design and development",
  "Automated drip and lifecycle flows",
  "A/B testing and optimization",
  "Deliverability and compliance",
  "Performance reporting",
];

const processSteps = [
  {
    title: "Discover",
    description: "Audit your list, goals, and current performance.",
  },
  { title: "Design", description: "Create templates and a content calendar." },
  {
    title: "Develop",
    description: "Build automations, segments, and tracking.",
  },
  {
    title: "Deliver",
    description: "Send, measure, and iterate for higher ROI.",
  },
];

const faqItems = [
  {
    question: "Which email platforms do you work with?",
    answer:
      "We work with Mailchimp, Klaviyo, HubSpot, ConvertKit, and most major ESPs.",
  },
  {
    question: "How do you measure success?",
    answer:
      "We track opens, clicks, conversions, and revenue attribution, then optimize based on what moves the needle.",
  },
];

const jsonLd = {
  "@type": "Service",
  name: "Email Marketing",
  description:
    "Data-driven email campaigns that nurture leads, retain customers, and drive revenue.",
  provider: {
    "@type": "Organization",
    name: "Nothing.Digital",
    url: "https://nothing.digital",
  },
};

export default function EmailMarketingPage() {
  return (
    <MarketingLayout>
      <ServicePageTemplate
        title="Email Marketing"
        description="Data-driven email campaigns that nurture leads, retain customers, and drive revenue."
        problem="Email lists are valuable, but generic blasts burn trust and leave revenue on the table."
        solution="We create targeted, automated email programs that turn subscribers into loyal customers."
        features={features}
        processSteps={processSteps}
        faqItems={faqItems}
        jsonLd={jsonLd}
      />
    </MarketingLayout>
  );
}
