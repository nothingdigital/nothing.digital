import type { Metadata } from "next";

import { SectionContainer } from "@/components/atoms/section-container";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Learn how Nothing.Digital approaches web accessibility and ongoing improvements.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <>
      <SectionContainer>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Accessibility Statement
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
              Our commitment
            </h2>
            <p>
              Nothing.Digital is committed to making our website and services
              accessible to everyone, including people with disabilities. We aim
              to conform to the Web Content Accessibility Guidelines (WCAG) 2.1
              Level AA.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              What we do
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Use semantic HTML and meaningful heading structures.</li>
              <li>
                Ensure keyboard navigability and visible focus indicators.
              </li>
              <li>
                Maintain sufficient color contrast for text and interactive
                elements.
              </li>
              <li>Provide text alternatives for images and icons.</li>
              <li>
                Test with screen readers and automated accessibility tools.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Third-party content
            </h2>
            <p>
              Some pages may include third-party embeds or integrations. We
              review these for accessibility and provide alternatives where
              possible.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">
              Feedback
            </h2>
            <p>
              If you encounter an accessibility barrier or have suggestions,
              please contact us at{" "}
              <a
                href="mailto:hello@nothing.digital"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                hello@nothing.digital
              </a>
              . We welcome feedback and will do our best to address issues
              promptly.
            </p>
          </section>
        </div>
      </SectionContainer>
    </>
  );
}
