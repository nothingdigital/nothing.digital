import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicePageTemplate } from "@/components/templates/service-page";
import { serviceSlugs, type ServiceSlug } from "@/lib/routes";
import { serviceDetails } from "@/lib/services";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

function getService(slug: string) {
  return serviceSlugs.includes(slug as ServiceSlug)
    ? serviceDetails[slug as ServiceSlug]
    : null;
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: service.href },
    openGraph: {
      title: service.title,
      description: service.description,
      url: service.href,
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <ServicePageTemplate
      title={service.title}
      description={service.description}
      problem={service.problem}
      solution={service.solution}
      features={service.features}
      techStack={service.techStack}
      processSteps={service.processSteps}
      faqItems={service.faqItems}
      jsonLd={service.jsonLd}
    />
  );
}
