import type { Metadata } from "next";
import MarketingLanding from "@/components/MarketingLanding";
import { landingContentFor, landingJsonLd } from "@/lib/landing";
import { SITE_BASE_URL, SITE_ROUTES } from "@/lib/routes";

const route = SITE_ROUTES[1]; // "/en"

export const metadata: Metadata = {
  title: { absolute: route.title },
  description: route.description,
  alternates: {
    canonical: route.path,
    languages: { vi: "/", en: route.path, "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: "OpenVie",
    title: route.title,
    description: route.description,
    url: route.path,
    locale: "en_US",
    alternateLocale: ["vi_VN"],
  },
  twitter: {
    card: "summary_large_image",
    title: route.title,
    description: route.description,
  },
};

export default function LandingPageEn() {
  const content = landingContentFor("en");
  const jsonLd = landingJsonLd("en");
  const organization = { ...jsonLd.organization, url: `${SITE_BASE_URL}/en` };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.software) }}
      />

      <MarketingLanding content={content} />
    </>
  );
}
