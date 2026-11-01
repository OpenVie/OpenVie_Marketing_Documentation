import { ImageResponse } from "next/og";
import { blogPost, blogSlugs } from "@/lib/blog";
import { blogOgElement, blogOgFont, blogOgSize } from "@/lib/blog/og";

export const size = blogOgSize;
export const contentType = "image/png";
export const alt = "Blog OpenVie";

export function generateStaticParams() {
  return blogSlugs().map((slug) => ({ slug }));
}

export default async function BlogPostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPost("vi", slug);

  return new ImageResponse(
    blogOgElement({
      eyebrow: "Blog",
      title: post?.title ?? "Blog OpenVie",
      footer: "RAG tự lưu trữ · Apache-2.0",
    }),
    {
      ...size,
      fonts: [{ name: "BeVietnamPro", data: blogOgFont(), weight: 700, style: "normal" as const }],
    },
  );
}
