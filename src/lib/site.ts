export const siteConfig = {
  name: "Nothing.Digital",
  tagline: "Built on time. Built to last.",
  description:
    "Senior web and software development studio. Custom websites, software, apps, and email marketing — delivered on fixed timelines.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nothing.digital",
  email: "hello@nothing.digital",
} as const;

export interface SocialLink {
  label: string;
  href: string;
}

/** Populate only with verified accounts. Empty = no footer icons, empty sameAs. */
export const socialLinks: SocialLink[] = [];

export const sameAs = socialLinks.map((link) => link.href);
