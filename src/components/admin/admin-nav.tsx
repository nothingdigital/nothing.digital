"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Home", exact: true },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/outbound", label: "Outbound" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/billing", label: "Billing" },
  { href: "/admin/work", label: "Work" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/health", label: "Health" },
  { href: "/admin/system-map", label: "System map" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b border-border pb-3">
      {links.map((link) => {
        const exact = "exact" in link && link.exact;
        const active = exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
