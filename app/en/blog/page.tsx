import type { Metadata } from "next";
import { BlogShell } from "@/components/BlogChrome";
import BlogIndex from "@/components/BlogIndex";
import { blogPosts } from "@/lib/blog";
import { SITE_BASE_URL } from "@/lib/routes";

const PATH = "/en/blog";

export const metadata: Metadata = {
  title: "Blog — engineering notes on self-hosted RAG",
  description:
    "Technical posts on the stack behind OpenVie: hybrid retrieval, abstention without evidence, Parquet + DuckDB lakehouse, two-level BPMN approval, edge security.",
  alternates: {
    canonical: PATH,
    languages: { vi: "/blog", en: PATH, "x-default": "/blog" },
  },
  openGraph: {
    type: "website",
    siteName: "OpenVie",
    title: "The OpenVie blog",
    description: "Engineering notes on the foundational technologies of a self-hosted RAG system.",
    url: PATH,
    locale: "en_US",
    alternateLocale: ["vi_VN"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The OpenVie blog",
    description: "Engineering notes on self-hosted RAG.",
  },
};

export default function BlogPageEn() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "The OpenVie blog",
    url: `${SITE_BASE_URL}${PATH}`,
    inLanguage: "en-US",
    blogPost: blogPosts("en").map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `${SITE_BASE_URL}${PATH}/${post.slug}`,
    })),
  };

  return (
    <BlogShell locale="en">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogIndex locale="en" />
    </BlogShell>
  );
}
