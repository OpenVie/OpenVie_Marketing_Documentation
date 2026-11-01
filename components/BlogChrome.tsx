import Image from "next/image";
import Link from "next/link";
import DocumentLang from "@/components/DocumentLang";
import ThemeToggle from "@/components/ThemeToggle";
import type { BlogLocale } from "@/lib/blog";

/**
 * Blog chrome — header and footer shared by the index and post pages.
 * Server components only: the mobile menu is a native <details> disclosure,
 * so navigation works before hydration.
 */

const CHROME = {
  vi: {
    home: "Trang chủ",
    blog: "Blog",
    docs: "Tài liệu API",
    github: "Mã nguồn",
    menu: "Menu",
    nav: "Điều hướng blog",
    lang: "Ngôn ngữ",
    tagline: "Ghi chép kỹ thuật về các công nghệ OpenVie dùng ở tầng nền.",
    sectionProduct: "Sản phẩm",
    sectionDocs: "Tài liệu",
    sectionLicense: "Giấy phép",
    links: {
      solutions: "Giải pháp",
      architecture: "Kiến trúc",
      capabilities: "Năng lực",
      deploy: "Triển khai",
      roadmap: "Lộ trình",
      api: "API Reference & Playground",
    },
    licenseLine: "Apache License 2.0 · Bản quyền 2026 LinkedNodeDigital",
    skip: "Bỏ qua điều hướng",
  },
  en: {
    home: "Home",
    blog: "Blog",
    docs: "API docs",
    github: "Source",
    menu: "Menu",
    nav: "Blog navigation",
    lang: "Language",
    tagline: "Engineering notes on the technologies OpenVie is built on.",
    sectionProduct: "Product",
    sectionDocs: "Docs",
    sectionLicense: "License",
    links: {
      solutions: "Solutions",
      architecture: "Architecture",
      capabilities: "Capabilities",
      deploy: "Deployment",
      roadmap: "Roadmap",
      api: "API Reference & Playground",
    },
    licenseLine: "Apache License 2.0 · Copyright 2026 LinkedNodeDigital",
    skip: "Skip navigation",
  },
} as const;

export const GITHUB_URL = "https://github.com/OpenVie/OpenVie";
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61595728591443";

export function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.34-.012 2.42-.012 2.749 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z"
      />
    </svg>
  );
}

export function BlogHeader({
  locale,
  viHref,
  enHref,
}: {
  locale: BlogLocale;
  viHref: string;
  enHref: string;
}) {
  const copy = CHROME[locale];
  const home = locale === "vi" ? "/" : "/en";
  const blogHref = locale === "vi" ? "/blog" : "/en/blog";
  const docsHref = "/docs";

  const links = [
    { label: copy.home, href: home },
    { label: copy.blog, href: blogHref, current: true },
    { label: copy.docs, href: docsHref },
  ];

  return (
    <header className="sticky top-0 z-40 ov-blog-header backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={home} className="flex items-center gap-2.5 group" aria-label="OpenVie">
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-[10px] shadow-sm shadow-[#c8f03a]/25 group-hover:scale-105 transition-transform"
          />
          <span className="text-base font-black tracking-tight ov-blog-title">OpenVie</span>
          <span className="hidden text-xs font-bold uppercase tracking-widest ov-blog-eyebrow sm:inline">
            {copy.blog}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label={copy.nav}>
          {links
            .filter((link) => !link.current)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold ov-blog-muted transition-colors hover:text-[var(--blog-text-title)]"
              >
                {link.label}
              </Link>
            ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ov-blog-muted transition-colors hover:text-[var(--blog-text-title)]"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            {copy.github}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <nav
            className="inline-flex rounded-full border border-[var(--blog-box-border)] bg-[var(--blog-box-bg)] p-0.5 text-xs font-bold"
            aria-label={copy.lang}
          >
            <Link
              href={viHref}
              aria-current={locale === "vi" ? "true" : undefined}
              className={`rounded-full px-2.5 py-1 transition ${
                locale === "vi"
                  ? "bg-[var(--blog-accent)] text-[var(--blog-accent-ink)] font-bold shadow-sm"
                  : "ov-blog-muted hover:text-[var(--blog-text-title)]"
              }`}
            >
              VI
            </Link>
            <Link
              href={enHref}
              aria-current={locale === "en" ? "true" : undefined}
              className={`rounded-full px-2.5 py-1 transition ${
                locale === "en"
                  ? "bg-[var(--blog-accent)] text-[var(--blog-accent-ink)] font-bold shadow-sm"
                  : "ov-blog-muted hover:text-[var(--blog-text-title)]"
              }`}
            >
              EN
            </Link>
          </nav>

          <div className="hidden sm:inline-flex">
            <ThemeToggle />
          </div>

          <details className="relative md:hidden">
            <summary
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-[var(--blog-card-border)] bg-[var(--blog-box-bg)] ov-blog-muted marker:content-none"
              aria-label={copy.menu}
            >
              <span aria-hidden="true">☰</span>
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl p-2 shadow-2xl ov-blog-card">
              {[...links.filter((link) => !link.current), { label: copy.github, href: GITHUB_URL }].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="block rounded-lg px-3 py-2 text-sm font-medium ov-blog-title hover:bg-black/5"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between px-2">
                <span className="text-xs ov-blog-muted">Giao diện</span>
                <ThemeToggle />
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function BlogFooter({ locale }: { locale: BlogLocale }) {
  const copy = CHROME[locale];
  const home = locale === "vi" ? "/" : "/en";
  const blogHref = locale === "vi" ? "/blog" : "/en/blog";

  const columns = [
    {
      title: copy.sectionProduct,
      links: [
        { label: copy.links.solutions, href: `${home}#co-che` },
        { label: copy.links.architecture, href: `${home}#kien-truc` },
        { label: copy.links.capabilities, href: `${home}#nang-luc` },
        { label: copy.links.deploy, href: `${home}#trien-khai` },
        { label: copy.links.roadmap, href: `${home}#lo-trinh` },
      ],
    },
    {
      title: copy.sectionDocs,
      links: [
        { label: copy.links.api, href: "/docs" },
        { label: copy.blog, href: blogHref },
        { label: "docs/ARCHITECTURE.md", href: `${home}#kien-truc` },
        { label: "docs/INTEGRATION.md", href: `${home}#api` },
      ],
    },
  ];

  return (
    <footer className="ov-blog-footer py-14">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Enterprise Deployment Support Banner */}
        <div className="mb-10 p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--blog-box-bg)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <b className="ov-blog-title font-bold text-xs uppercase tracking-wider block">
              {locale === "vi" ? "Hỗ trợ Triển khai Doanh nghiệp" : "Enterprise Deployment Support"}
            </b>
            <p className="text-xs ov-blog-muted leading-relaxed">
              {locale === "vi"
                ? "Chúng tôi đồng hành hỗ trợ doanh nghiệp và cơ quan nhà nước tự lưu trữ và triển khai hạ tầng RAG an toàn trên on-premise & private cloud. Hãy nhắn tin trực tiếp với chúng tôi qua Facebook."
                : "We assist enterprises and public institutions with sovereign on-premise & private cloud RAG deployment. Contact our engineering team directly on Facebook."}
            </p>
          </div>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold shrink-0 transition-colors shadow-md shadow-[#1877f2]/20"
          >
            <FacebookIcon className="h-3.5 w-3.5 fill-white" />
            <span>{locale === "vi" ? "Liên hệ Facebook" : "Contact Facebook"}</span>
          </a>
        </div>

        <div className="grid gap-8 pb-10 sm:grid-cols-3">
          <div className="space-y-3">
            <Link href={home} className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-lg"
              />
              <span className="text-base font-bold tracking-tight ov-blog-title">OpenVie</span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed ov-blog-muted">{copy.tagline}</p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider ov-blog-title">{column.title}</h2>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs ov-blog-muted transition-colors hover:text-[var(--blog-accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 text-xs ov-blog-faint">
          <p>{copy.licenseLine}</p>
          <div className="flex items-center gap-4">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--blog-accent)]"
            >
              <FacebookIcon className="h-3.5 w-3.5 fill-current" />
              Facebook
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--blog-accent)]"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              github.com/OpenVie/OpenVie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Page frame shared by the blog index and post routes. */
export function BlogShell({
  locale,
  slug,
  children,
}: {
  locale: BlogLocale;
  /** When set, the language switch keeps the reader on the same post. */
  slug?: string;
  children: React.ReactNode;
}) {
  const suffix = slug ? `/${slug}` : "";
  const viHref = `/blog${suffix}`;
  const enHref = `/en/blog${suffix}`;

  return (
    <div className="ov-blog-shell min-h-screen font-sans selection:bg-[#c8f03a] selection:text-slate-950">
      <DocumentLang locale={locale} />
      <BlogSkipLink locale={locale} />
      <BlogHeader locale={locale} viHref={viHref} enHref={enHref} />
      {children}
      <BlogFooter locale={locale} />
    </div>
  );
}

export function BlogSkipLink({ locale }: { locale: BlogLocale }) {
  return (
    <a
      href="#blog-main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#c8f03a] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#0b1a0f]"
    >
      {CHROME[locale].skip}
    </a>
  );
}
