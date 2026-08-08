"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isModuleEnabled, type ModuleId } from "@/brand";
import { cn } from "@/lib/utils";

const links: {
  href: string;
  label: string;
  exact?: boolean;
  module?: ModuleId;
}[] = [
  { href: "/admin", label: "Home", exact: true },
  { href: "/admin/inbox", label: "Inbox", module: "inbox" },
  { href: "/admin/outbound", label: "Outbound", module: "outbound" },
  { href: "/admin/clients", label: "Clients", module: "clients" },
  { href: "/admin/billing", label: "Billing", module: "billing" },
  { href: "/admin/work", label: "Work", module: "work" },
  { href: "/admin/newsletter", label: "Newsletter", module: "newsletter" },
  { href: "/admin/health", label: "Health", module: "health" },
  { href: "/admin/docs", label: "Docs", module: "docs" },
  { href: "/admin/system-map", label: "System map" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b border-border pb-3">
      {links
        .filter((link) => !link.module || isModuleEnabled(link.module))
        .map((link) => {
          const exact = Boolean(link.exact);
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
