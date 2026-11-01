import type { Metadata } from "next";
import { BlogShell } from "@/components/BlogChrome";
import BlogIndex from "@/components/BlogIndex";
import { blogPosts } from "@/lib/blog";
import { SITE_BASE_URL } from "@/lib/routes";

const PATH = "/blog";

export const metadata: Metadata = {
  title: "Blog — ghi chép kỹ thuật về RAG tự lưu trữ",
  description:
    "Bài viết kỹ thuật về các công nghệ OpenVie dùng: truy hồi hybrid, từ chối khi thiếu bằng chứng, Lakehouse Parquet + DuckDB, BPMN 2 cấp, bảo mật biên.",
  alternates: {
    canonical: PATH,
    languages: { vi: PATH, en: "/en/blog", "x-default": PATH },
  },
  openGraph: {
    type: "website",
    siteName: "OpenVie",
    title: "Blog OpenVie",
    description: "Ghi chép kỹ thuật về các công nghệ ở tầng nền của một hệ RAG tự lưu trữ.",
    url: PATH,
    locale: "vi_VN",
    alternateLocale: ["en_US"],
  },
  twitter: { card: "summary_large_image", title: "Blog OpenVie", description: "Ghi chép kỹ thuật về RAG tự lưu trữ." },
};

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog OpenVie",
    url: `${SITE_BASE_URL}${PATH}`,
    inLanguage: "vi-VN",
    blogPost: blogPosts("vi").map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `${SITE_BASE_URL}${PATH}/${post.slug}`,
    })),
  };

  return (
    <BlogShell locale="vi">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogIndex locale="vi" />
    </BlogShell>
  );
}
