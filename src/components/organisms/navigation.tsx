"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandWordmark } from "@/components/atoms/brand-wordmark";
import { ThemeToggle } from "@/components/atoms/theme-toggle";
import { trapTabKey } from "@/lib/a11y";

// ponytail: lightweight accessible mobile menu (aria + Escape + focus trap).
const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (!trapRef.current) return;
      trapTabKey(trapRef.current, event);
    }

    document.addEventListener("keydown", onKeyDown);
    const firstLink = panelRef.current?.querySelector("a");
    firstLink?.focus();

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div ref={trapRef}>
        <nav
          className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8"
          aria-label="Primary"
        >
          <Link href="/" className="shrink-0" aria-label="Nothing.Digital home">
            <BrandWordmark priority />
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm">
              <Link href="/contact">Book a call</Link>
            </Button>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              ref={toggleRef}
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls={menuId}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>

        {isOpen ? (
          <div
            id={menuId}
            ref={panelRef}
            className="border-t bg-background px-4 py-4 md:hidden"
          >
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block min-h-11 py-2 font-mono text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-4 w-full min-h-11">
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                Book a call
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
