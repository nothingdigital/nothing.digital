"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { NewsletterForm } from "./newsletter-form";

const serviceLinks = [
  { label: "Website Development", href: routes.services.websiteDevelopment },
  { label: "Software Solutions", href: routes.services.softwareSolutions },
  { label: "Applications", href: routes.services.applications },
  { label: "Email Marketing", href: routes.services.emailMarketing },
];

const companyLinks = [
  { label: "Services", href: routes.services.index },
  { label: "Portfolio", href: routes.portfolio.index },
  { label: "About", href: routes.about },
  { label: "Blog", href: routes.blog.index },
  { label: "Contact", href: routes.contact },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href={routes.home}
              className="text-lg font-bold tracking-tight"
            >
              Nothing.Digital
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Premium digital services for ambitious brands.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Services</h3>
            <ul className="mt-3 space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-3 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Newsletter</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Get insights delivered to your inbox.
            </p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Nothing.Digital. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
