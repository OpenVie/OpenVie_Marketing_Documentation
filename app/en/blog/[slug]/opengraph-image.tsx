import { ImageResponse } from "next/og";
import { blogPost, blogSlugs } from "@/lib/blog";
import { blogOgElement, blogOgFont, blogOgSize } from "@/lib/blog/og";

export const size = blogOgSize;
export const contentType = "image/png";
export const alt = "The OpenVie blog";

export function generateStaticParams() {
  return blogSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostOpengraphImageEn({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPost("en", slug);

  return new ImageResponse(
    blogOgElement({
      eyebrow: "Blog",
      title: post?.title ?? "The OpenVie blog",
      footer: "Self-hosted RAG · Apache-2.0",
    }),
    {
      ...size,
      fonts: [{ name: "BeVietnamPro", data: blogOgFont(), weight: 700, style: "normal" as const }],
    },
  );
}
