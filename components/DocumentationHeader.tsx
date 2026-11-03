"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export interface GuideLink {
  href: string;
  label: string;
}

export default function DocumentationHeader({
  guides,
  locale = "vi",
}: {
  guides: GuideLink[];
  locale?: "vi" | "en";
}) {
  const isEn = locale === "en";
  const homeHref = isEn ? "/en" : "/";
  const blogHref = isEn ? "/en/blog" : "/blog";
  const staticLinks = [
    { href: homeHref, label: isEn ? "Home" : "Trang chủ" },
    { href: blogHref, label: "Blog" },
  ];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="ov-docs-header sticky top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href={homeHref} className="ov-docs-brand" aria-label={isEn ? "OpenVie — home" : "OpenVie — về trang chủ"}>
          <Image
            src="/openvie-logo.svg"
            alt="OpenVie logo"
            width={22}
            height={22}
            className="h-[22px] w-[22px] rounded-[6px]"
          />
          <span className="ov-brand-name">OpenVie<em>API</em></span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {guides.map((item) => (
              <a key={item.href} href={item.href} className="ov-docs-navlink">{item.label}</a>
            ))}
            {staticLinks.map((link) => (
              <Link key={link.href} href={link.href} className="ov-docs-navlink">{link.label}</Link>
            ))}
          </nav>
          <nav
            className="inline-flex rounded-full border border-[var(--ov-docs-border)] bg-[var(--ov-docs-surface)] p-0.5 text-xs font-bold"
            aria-label={isEn ? "Language" : "Ngôn ngữ"}
          >
            <Link
              href="/docs"
              aria-current={locale === "vi" ? "true" : undefined}
              className={`rounded-full px-2.5 py-1 transition ${
                locale === "vi"
                  ? "bg-[var(--ov-docs-accent)] text-[var(--ov-docs-accent-ink)] font-bold shadow-sm"
                  : "text-[var(--ov-docs-muted)] hover:text-[var(--ov-docs-text)]"
              }`}
            >
              VI
            </Link>
            <Link
              href="/en/docs"
              aria-current={locale === "en" ? "true" : undefined}
              className={`rounded-full px-2.5 py-1 transition ${
                locale === "en"
                  ? "bg-[var(--ov-docs-accent)] text-[var(--ov-docs-accent-ink)] font-bold shadow-sm"
                  : "text-[var(--ov-docs-muted)] hover:text-[var(--ov-docs-text)]"
              }`}
            >
              EN
            </Link>
          </nav>
          <ThemeToggle />
          <button
            type="button"
            className="ov-menu-button md:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="ov-mobile-navigation md:hidden" aria-label="Mobile navigation">
          <section className="ov-mobile-nav-section">
            <p className="ov-mobile-nav-label">{isEn ? "Guides" : "Hướng dẫn"}</p>
            {guides.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
            ))}
            {staticLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>
            ))}
            <div className="pt-3 mt-3 border-t border-[var(--ov-docs-border)] flex items-center justify-between">
              <span className="text-xs text-[var(--ov-docs-muted)] font-medium">{isEn ? "Language" : "Ngôn ngữ"}</span>
              <div className="inline-flex rounded-full border border-[var(--ov-docs-border)] bg-[var(--ov-docs-surface)] p-0.5 text-xs font-bold">
                <Link href="/docs" className={`rounded-full px-2.5 py-1 ${locale === "vi" ? "bg-[var(--ov-docs-accent)] text-[var(--ov-docs-accent-ink)] font-bold" : "text-[var(--ov-docs-muted)]"}`}>VI</Link>
                <Link href="/en/docs" className={`rounded-full px-2.5 py-1 ${locale === "en" ? "bg-[var(--ov-docs-accent)] text-[var(--ov-docs-accent-ink)] font-bold" : "text-[var(--ov-docs-muted)]"}`}>EN</Link>
              </div>
            </div>
          </section>
        </nav>
      )}
    </header>
  );
}
