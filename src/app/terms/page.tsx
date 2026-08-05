import type { Metadata } from "next";

import { MarketingLayout } from "@/components/templates/marketing-layout";
import { SectionContainer } from "@/components/atoms/section-container";

export const metadata: Metadata = {
  title: "Terms of Service — Nothing.Digital",
  description:
    "Review the Nothing.Digital terms of service governing the use of our website and services.",
};

export default function TermsPage() {
  return (
    <MarketingLayout>
      <SectionContainer>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: August 4, 2026
          </p>
        </div>
      </SectionContainer>

      <SectionContainer variant="muted">
        <div className="mx-auto max-w-3xl space-y-8 text-muted-foreground">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              1. Agreement to terms
            </h2>
            <p>
              By accessing or using the Nothing.Digital website and services,
              you agree to be bound by these Terms of Service. If you do not
              agree, please do not use our site or services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              2. Services
            </h2>
            <p>
              Nothing.Digital provides digital design and engineering services,
              including but not limited to website development, software
              solutions, applications, and email marketing. Project scope,
              deliverables, and fees are defined in a separate proposal or
              agreement.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              3. Intellectual property
            </h2>
            <p>
              Upon full payment, client-specific deliverables are transferred to
              the client. Nothing.Digital retains rights to pre-existing tools,
              frameworks, and general know-how used across projects.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              4. Payment and refunds
            </h2>
            <p>
              Payment terms are outlined in individual proposals. Deposits are
              generally non-refundable once work has commenced, unless otherwise
              agreed in writing.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              5. Limitation of liability
            </h2>
            <p>
              Nothing.Digital is not liable for indirect, incidental, or
              consequential damages arising from the use of our services or
              website. Our total liability is limited to the amount paid for the
              relevant services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              6. Changes to terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of the
              site after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              7. Contact us
            </h2>
            <p>
              Questions about these terms can be directed to{" "}
              <a
                href="mailto:hello@nothing.digital"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                hello@nothing.digital
              </a>
              .
            </p>
          </section>
        </div>
      </SectionContainer>
    </MarketingLayout>
  );
}
