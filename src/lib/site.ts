export const siteConfig = {
  name: "Nothing.Digital",
  tagline: "Ship premium digital products on time—every time.",
  description:
    "Senior web, software, and AI development studio. Custom websites, software, apps, email marketing, AI solutions, tech literacy, and coding & SQL — delivered on fixed timelines.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nothing.digital",
  email: "hello@nothing.digital",
  contactEmail: "alexander@nothing.digital",
  phone: "205-561-7049",
} as const;

export interface SocialLink {
  label: string;
  href: string;
}

/** Populate only with verified accounts. Empty = no footer icons, empty sameAs. */
export const socialLinks: SocialLink[] = [];

export const sameAs = socialLinks.map((link) => link.href);
