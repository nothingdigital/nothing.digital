import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { resolveViewToken } from "@/lib/pdf/resolve-view";

export const metadata: Metadata = {
  title: "Document",
  robots: { index: false, follow: false },
};

export default async function ViewDocumentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const { doc, error } = await resolveViewToken(token);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      </main>
    );
  }

  if (!doc) {
    notFound();
  }

  const fileHref = doc.storagePath
    ? `/v/${token}/file`
    : (doc.externalUrl ?? `/v/${token}/file`);

  return (
    <main className="mx-auto max-w-lg space-y-6 px-4 py-16">
      <div>
        <p className="text-sm text-muted-foreground">Nothing.Digital</p>
        <h1 className="font-display text-3xl tracking-tight">{doc.title}</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <a href={fileHref} target="_blank" rel="noreferrer">
            Open PDF
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a href={`/v/${token}/file?download=1`}>Download</a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </main>
  );
}
