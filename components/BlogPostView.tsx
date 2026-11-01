import Link from "next/link";
import { blogPosts, type BlogLocale, type BlogPost } from "@/lib/blog";
import { blogIndexPath, blogPostPath, formatBlogDate, postSections, readingLabel } from "@/lib/blog/format";
import BlogBlocks from "@/components/BlogBlocks";
import BlogSubnav from "@/components/BlogSubnav";
import { GithubIcon } from "@/components/BlogChrome";

const POST_COPY = {
  vi: {
    breadcrumb: "Blog",
    sources: "Nguồn tham khảo",
    keepReading: "Đọc tiếp",
    discuss: "Thảo luận hoặc báo lỗi trên GitHub",
    back: "Về trang blog",
    onThisPage: "Trong bài này",
  },
  en: {
    breadcrumb: "Blog",
    sources: "Sources",
    keepReading: "Keep reading",
    discuss: "Discuss or report an issue on GitHub",
    back: "Back to the blog",
    onThisPage: "In this post",
  },
} as const;

export default function BlogPostView({
  post,
  locale,
  copiedLabel,
}: {
  post: BlogPost;
  locale: BlogLocale;
  copiedLabel: string;
}) {
  const copy = POST_COPY[locale];
  const index = blogIndexPath(locale);
  const all = blogPosts(locale);
  const position = all.findIndex((entry) => entry.slug === post.slug);
  const next = all[(position + 1) % all.length];
  const sections = postSections(post);

  return (
    <main id="blog-main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="lg:grid lg:grid-cols-[224px_minmax(0,46rem)] lg:gap-14">
        <aside className="hidden lg:block">
          <BlogSubnav items={sections} heading={copy.onThisPage} />
        </aside>

        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold ov-blog-faint">
            <Link href={index} className="transition-colors hover:text-[var(--blog-accent)]">
              {copy.breadcrumb}
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="ov-blog-muted">{post.tags[0]}</span>
          </nav>

          <article className="mt-6">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold ov-blog-tag"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mt-4 text-3xl font-black leading-[1.15] tracking-tight ov-blog-title sm:text-[2.6rem]">
              {post.title}
            </h1>

            <p className="mt-4 font-mono text-[0.72rem] font-medium uppercase tracking-wide ov-blog-faint">
              <time dateTime={post.date}>{formatBlogDate(post.date, locale)}</time>
              <span aria-hidden="true"> · </span>
              {readingLabel(post.readingMinutes, locale)}
              <span aria-hidden="true"> · </span>
              {sections.length} {locale === "vi" ? "phần" : "sections"}
            </p>

            <p className="mt-7 border-l-2 border-[var(--blog-quote-border)] pl-5 text-base font-medium leading-relaxed ov-blog-body">
              {post.lede}
            </p>

            <div className="lg:hidden">
              <div className="mt-8">
                <BlogSubnav items={sections} heading={copy.onThisPage} />
              </div>
            </div>

            <div className="mt-9">
              <BlogBlocks blocks={post.blocks} copiedLabel={copiedLabel} />
            </div>

            {post.sources.length > 0 ? (
              <section
                aria-labelledby="post-sources"
                className="mt-12 rounded-2xl p-5 ov-blog-box"
              >
                <h2 id="post-sources" className="mb-3 text-sm font-bold uppercase tracking-wider ov-blog-title">
                  {copy.sources}
                </h2>
                <ul className="space-y-2">
                  {post.sources.map((source) => (
                    <li key={source.href} className="flex items-start gap-2.5 text-sm leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--blog-accent)]" aria-hidden="true" />
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="ov-blog-body underline decoration-[var(--blog-accent)]/40 underline-offset-2 transition-colors hover:text-[var(--blog-accent)] hover:decoration-[var(--blog-accent)]"
                      >
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={index}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--blog-accent)] hover:underline"
              >
                <span aria-hidden="true">←</span>
                {copy.back}
              </Link>
              <a
                href="https://github.com/OpenVie/OpenVie"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--blog-box-bg)] px-4 py-2 text-xs font-bold ov-blog-title transition-colors hover:border-[var(--blog-accent)]"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                {copy.discuss}
              </a>
            </div>
          </article>

          {next && next.slug !== post.slug ? (
            <aside className="mt-14 border-t border-[var(--border-subtle)] pt-8">
              <b className="mb-3 block text-xs font-bold uppercase tracking-wider ov-blog-faint">
                {copy.keepReading}
              </b>
              <Link
                href={blogPostPath(locale, next.slug)}
                className="ov-blog-card group block rounded-2xl p-5"
              >
                <h2 className="text-base font-bold leading-snug tracking-tight ov-blog-title group-hover:text-[var(--blog-accent)] sm:text-lg transition-colors">
                  {next.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed ov-blog-muted">{next.lede}</p>
              </Link>
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}
