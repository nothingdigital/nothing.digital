import Link from "next/link";

type InvoicePdfLinksProps = {
  externalUrl?: string | null;
  viewToken?: string | null;
  storagePath?: string | null;
};

export function InvoicePdfLinks({
  externalUrl,
  viewToken,
  storagePath,
}: InvoicePdfLinksProps) {
  const generated = Boolean(storagePath && viewToken);

  if (!generated && !externalUrl) return null;

  return (
    <>
      {generated ? (
        <>
          {" · "}
          <Link
            href={`/v/${viewToken}`}
            className="text-primary underline-offset-4 hover:underline"
          >
            View PDF
          </Link>
        </>
      ) : null}
      {externalUrl ? (
        <>
          {" · "}
          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            External link
          </a>
        </>
      ) : null}
    </>
  );
}
