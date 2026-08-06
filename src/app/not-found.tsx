import Link from "next/link";

import { ErrorLayout } from "@/components/templates/error-layout";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <ErrorLayout>
      <section className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-24 text-center md:px-6 lg:px-8">
        <h1 className="text-6xl font-bold tracking-tight">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Page not found. Nothing to see here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href={routes.home}>Back home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={routes.contact}>Contact us</Link>
          </Button>
        </div>
      </section>
    </ErrorLayout>
  );
}
