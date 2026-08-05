import { render } from "@testing-library/react";

import { JsonLd } from "./json-ld";

describe("JsonLd", () => {
  it("renders a single schema object", () => {
    render(
      <JsonLd data={{ "@type": "Organization", name: "Nothing.Digital" }} />,
    );

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const parsed = JSON.parse(script?.textContent ?? "{}");
    expect(parsed).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Nothing.Digital",
    });
  });

  it("renders an array of schema objects", () => {
    render(
      <JsonLd
        data={[
          { "@type": "Organization", name: "Nothing.Digital" },
          { "@type": "WebPage", name: "Home" },
        ]}
      />,
    );

    const script = document.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script?.textContent ?? "[]");

    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Nothing.Digital",
    });
  });
});
