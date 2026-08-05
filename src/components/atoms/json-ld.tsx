// ponytail: minimal JSON-LD wrapper; schemas injected per page.

export interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          Array.isArray(data)
            ? data.map((item) => ({
                "@context": "https://schema.org",
                ...item,
              }))
            : { "@context": "https://schema.org", ...data },
        ),
      }}
    />
  );
}
