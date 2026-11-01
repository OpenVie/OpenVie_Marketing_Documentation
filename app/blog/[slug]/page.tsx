import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogShell } from "@/components/BlogChrome";
import BlogPostView from "@/components/BlogPostView";
import { blogPost, blogSlugs } from "@/lib/blog";
import { SITE_BASE_URL } from "@/lib/routes";

export const instant = false;

export function generateStaticParams() {
  return blogSlugs().map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPost("vi", slug);
  if (!post) return {};

  const path = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: path,
      languages: { vi: path, en: `/en/blog/${post.slug}`, "x-default": path },
    },
    openGraph: {
      type: "article",
      siteName: "OpenVie",
      title: post.title,
      description: post.description,
      url: path,
      locale: "vi_VN",
      alternateLocale: ["en_US"],
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

function BlogPostLoading({ locale }: { locale: "vi" | "en" }) {
  return (
    <BlogShell locale={locale}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl animate-pulse space-y-6">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-10 w-3/4 rounded bg-white/10" />
          <div className="h-4 w-40 rounded bg-white/5" />
          <div className="h-24 rounded bg-white/5" />
          <div className="space-y-3 pt-6">
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-4 w-5/6 rounded bg-white/5" />
            <div className="h-4 w-4/6 rounded bg-white/5" />
          </div>
        </div>
      </div>
    </BlogShell>
  );
}

async function BlogPostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPost("vi", slug);
  if (!post) notFound();

  const url = `${SITE_BASE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "vi-VN",
    url,
    mainEntityOfPage: url,
    keywords: post.tags.join(", "),
    author: { "@type": "Organization", name: "OpenVie", url: SITE_BASE_URL },
    publisher: { "@type": "Organization", name: "OpenVie", url: SITE_BASE_URL },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <BlogShell locale="vi" slug={post.slug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogPostView post={post} locale="vi" copiedLabel="Đã sao chép ✓" />
    </BlogShell>
  );
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<BlogPostLoading locale="vi" />}>
      <BlogPostContent params={params} />
    </Suspense>
  );
}
