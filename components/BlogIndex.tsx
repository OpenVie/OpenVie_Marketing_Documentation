import Link from "next/link";
import { blogPosts, type BlogLocale } from "@/lib/blog";
import { blogPostPath, formatBlogDate, postSections, readingLabel } from "@/lib/blog/format";

const INDEX_COPY = {
  vi: {
    eyebrow: "Ghi chép kỹ thuật",
    title: "Blog OpenVie",
    intro:
      "Các bài viết đi vào những chỗ khó của một hệ RAG tự lưu trữ: hợp nhất kết quả truy hồi, từ chối khi thiếu bằng chứng, tách OLTP khỏi OLAP, quy trình phê duyệt, và bảo mật theo tầng. Mỗi bài dẫn nguồn đọc được để bạn tự kiểm chứng.",
    featured: "Bài mới nhất",
    all: "Tất cả bài viết",
    read: "Đọc bài",
    sourceNote: "Nguồn tham khảo ở cuối mỗi bài",
    parts: "phần",
    outline: "Các phần trong bài",
  },
  en: {
    eyebrow: "Engineering notes",
    title: "The OpenVie blog",
    intro:
      "Posts that go into the hard parts of a self-hosted RAG system: fusing retrieval results, abstaining when evidence is missing, splitting OLTP from OLAP, approval workflow, and layered security. Every post links the sources it read so you can check them yourself.",
    featured: "Latest post",
    all: "All posts",
    read: "Read post",
    sourceNote: "Sources are listed at the end of each post",
    parts: "sections",
    outline: "Sections in this post",
  },
} as const;

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold ov-blog-tag"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function Meta({
  date,
  minutes,
  parts,
  locale,
}: {
  date: string;
  minutes: number;
  parts: number;
  locale: BlogLocale;
}) {
  return (
    <p className="font-mono text-[0.7rem] font-medium uppercase tracking-wide ov-blog-faint">
      <time dateTime={date}>{formatBlogDate(date, locale)}</time>
      <span aria-hidden="true"> · </span>
      {readingLabel(minutes, locale)}
      <span aria-hidden="true"> · </span>
      {parts} {INDEX_COPY[locale].parts}
    </p>
  );
}

export default function BlogIndex({ locale }: { locale: BlogLocale }) {
  const copy = INDEX_COPY[locale];
  const posts = blogPosts(locale);
  const [featured, ...rest] = posts;
  return (
    <main id="blog-main" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] ov-blog-eyebrow">{copy.eyebrow}</p>
      <h1 className="text-3xl font-black tracking-tight ov-blog-title sm:text-5xl">{copy.title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed ov-blog-muted">{copy.intro}</p>

      {featured ? (
        <section aria-labelledby="featured-post" className="mt-12">
          <h2 id="featured-post" className="sr-only">
            {copy.featured}
          </h2>
          <Link
            href={blogPostPath(locale, featured.slug)}
            className="group block rounded-3xl p-6 transition-all sm:p-8 ov-blog-card-featured"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider ov-blog-tag">
                {copy.featured}
              </span>
              <TagList tags={featured.tags} />
            </div>
            <h3 className="mt-4 text-xl font-extrabold leading-snug tracking-tight ov-blog-title group-hover:text-[var(--blog-accent)] sm:text-2xl transition-colors">
              {featured.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed ov-blog-muted sm:text-base">{featured.lede}</p>

            <div className="mt-5 rounded-2xl p-4 ov-blog-box">
              <b className="mb-2 block text-[0.68rem] font-bold uppercase tracking-wider ov-blog-faint">
                {copy.outline}
              </b>
              <ol className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {postSections(featured)
                  .slice(0, 6)
                  .map((section, index) => (
                    <li key={section.id} className="flex gap-2 text-xs leading-snug ov-blog-muted">
                      <span className="font-mono text-[0.65rem] text-[var(--blog-text-faint)]" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{section.label}</span>
                    </li>
                  ))}
              </ol>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Meta
                date={featured.date}
                minutes={featured.readingMinutes}
                parts={postSections(featured).length}
                locale={locale}
              />
              <span className="inline-flex items-center gap-1.5 text-sm font-bold ov-blog-accent group-hover:underline">
                {copy.read}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>
        </section>
      ) : null}

      <section aria-labelledby="all-posts" className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
          <h2 id="all-posts" className="text-lg font-bold tracking-tight ov-blog-title">
            {copy.all}
          </h2>
          <span className="text-[0.7rem] ov-blog-faint">{copy.sourceNote}</span>
        </div>

        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {rest.map((post) => (
            <li key={post.slug}>
              <Link
                href={blogPostPath(locale, post.slug)}
                className="group flex h-full flex-col justify-between rounded-2xl p-5 transition-all ov-blog-card"
              >
                <div>
                  <TagList tags={post.tags} />
                  <h3 className="mt-3 text-base font-bold leading-snug tracking-tight ov-blog-title group-hover:text-[var(--blog-accent)] sm:text-lg transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed ov-blog-muted">{post.lede}</p>
                </div>
                <div className="mt-4">
                  <Meta
                    date={post.date}
                    minutes={post.readingMinutes}
                    parts={postSections(post).length}
                    locale={locale}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
