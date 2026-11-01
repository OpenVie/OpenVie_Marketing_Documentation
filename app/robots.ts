import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/lib/routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/openapi"],
    },
    sitemap: `${SITE_BASE_URL}/sitemap.xml`,
  };
}
