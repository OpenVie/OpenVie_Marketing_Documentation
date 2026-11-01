import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { SITE_BASE_URL, SITE_ROUTES } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = SITE_ROUTES.map((route) => ({
    url: `${SITE_BASE_URL}${route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.path === "/" ? "monthly" : "weekly",
    priority: route.path === "/" ? 1 : 0.8,
  }));

  const posts: MetadataRoute.Sitemap = [
    ...blogPosts("vi").map((post) => ({
      url: `${SITE_BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...blogPosts("en").map((post) => ({
      url: `${SITE_BASE_URL}/en/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];

  return [...pages, ...posts];
}
