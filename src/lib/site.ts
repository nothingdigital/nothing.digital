import { brandConfig } from "@/brand";

export const siteConfig = brandConfig;

export interface SocialLink {
  label: string;
  href: string;
}

/** Populate only with verified accounts. Empty = no footer icons, empty sameAs. */
export const socialLinks: SocialLink[] = [];

export const sameAs = socialLinks.map((link) => link.href);
