import type { Metadata } from "next";

import { SectionContainer } from "@/components/atoms/section-container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Nothing.Digital privacy policy to understand how we collect, use, and protect your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SectionContainer>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-muted-foreground">
            Last updated: August 5, 2026
          </p>
        </div>
      </SectionContainer>

      <SectionContainer variant="muted">
        <div className="mx-auto max-w-3xl space-y-8 text-muted-foreground">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              1. Information we collect
            </h2>
            <p>
              We collect information you provide directly, such as your name,
              email address, phone number, company, and project details when you
              fill out our contact form or subscribe to our newsletter.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              2. How we use your information
            </h2>
            <p>
              We use your information to respond to inquiries, deliver services,
              send updates you have requested, and improve our website and
              offerings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              3. Sharing your information
            </h2>
            <p>
              We do not sell your personal information. We share data only with
              trusted service providers necessary to operate our business, such
              as email delivery and hosting platforms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              4. Cookies and analytics
            </h2>
            <p>
              This site uses privacy-friendly analytics (Umami when configured,
              otherwise Vercel Analytics) plus Vercel Speed Insights for Core
              Web Vitals. Analytics load only after you accept the consent
              banner. Umami is cookieless and does not store personal
              identifiers on your device.
            </p>
            <p className="mt-3">
              Essential cookies may still be set by your browser or our hosting
              platform for security and basic site operation. You can change or
              clear your choice by clearing site data in your browser.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              5. Your rights
            </h2>
            <p>
              You may request access to, correction of, or deletion of your
              personal information by contacting us at hello@nothing.digital.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              6. Contact us
            </h2>
            <p>
              If you have questions about this Privacy Policy, email us at{" "}
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
    </>
  );
}
