import { brandConfig } from "@/brand";

export const siteConfig = {
  name: brandConfig.name,
  tagline: brandConfig.tagline,
  description: brandConfig.description,
  url: brandConfig.url,
  email: brandConfig.email,
  contactEmail: brandConfig.contactEmail,
  phone: brandConfig.phone,
} as const;

export interface SocialLink {
  label: string;
  href: string;
}

/** Populate only with verified accounts. Empty = no footer icons, empty sameAs. */
export const socialLinks: SocialLink[] = [];

export const sameAs = socialLinks.map((link) => link.href);
