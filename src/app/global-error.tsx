"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body className="bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="text-6xl font-bold tracking-tight">500</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Something went wrong on our end. Please try again.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href={routes.home}>Back home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
