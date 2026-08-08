export type BrandAssets = {
  wordmarkLight: string;
  wordmarkDark: string;
  seal: string;
  ogDefault: string;
};

export type BrandConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  contactEmail: string;
  phone: string;
  fromEmail: string;
  assets: BrandAssets;
};

export const brandConfig: BrandConfig = {
  name: "Nothing.Digital",
  tagline: "Ship premium digital products on time—every time.",
  description:
    "Senior web, software, and AI development studio. Custom websites, software, apps, email marketing, AI solutions, tech literacy, and coding & SQL — delivered on fixed timelines.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nothing.digital",
  email: "hello@nothing.digital",
  contactEmail: "alexander@nothing.digital",
  phone: "205-561-7049",
  fromEmail: "Nothing.Digital <hello@nothing.digital>",
  assets: {
    wordmarkLight: "/images/brand/wordmark-light.png",
    wordmarkDark: "/images/brand/wordmark-dark.png",
    seal: "/images/brand/seal.png",
    ogDefault: "/og/default.png",
  },
};
