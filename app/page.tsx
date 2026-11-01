import type { Metadata } from "next";
import MarketingLanding from "@/components/MarketingLanding";
import { landingContentFor, landingJsonLd } from "@/lib/landing";
import { SITE_BASE_URL, SITE_ROUTES } from "@/lib/routes";

const route = SITE_ROUTES[0]; // "/"

export const metadata: Metadata = {
  title: { absolute: route.title },
  description: route.description,
  alternates: {
    canonical: route.path,
    languages: { vi: route.path, en: "/en", "x-default": route.path },
  },
  openGraph: {
    type: "website",
    siteName: "OpenVie",
    title: route.title,
    description: route.description,
    url: route.path,
    locale: "vi_VN",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: route.title,
    description: route.description,
  },
};

export default function LandingPage() {
  const content = landingContentFor("vi");
  const jsonLd = landingJsonLd("vi");
  const organization = { ...jsonLd.organization, url: SITE_BASE_URL };

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
