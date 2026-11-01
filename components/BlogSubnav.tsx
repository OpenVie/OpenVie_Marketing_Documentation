"use client";

import { useEffect, useState } from "react";

export interface SubnavItem {
  id: string;
  label: string;
}

/**
 * Section navigation for a long article.
 *
 * Desktop renders a sticky rail; below `lg` the same list collapses into a
 * native <details> disclosure, so exactly one form is visible per breakpoint.
 * The active section is derived from the last heading scrolled past the top
 * offset — deterministic, and it keeps working with anchor jumps.
 */
export default function BlogSubnav({
  items,
  heading,
}: {
  items: SubnavItem[];
  /** Label for both the rail heading and the collapsed disclosure. */
  heading: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const offset = 120;
      let current: string | null = items[0]?.id ?? null;

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= offset) current = item.id;
        else break;
      }

      setActiveId((previous) => (previous === current ? previous : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  if (items.length < 2) return null;

  return (
    <>
      {/* Desktop: sticky rail */}
      <nav
        aria-label={heading}
        className="hidden lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2 custom-scrollbar"
      >
        <b className="mb-3 block text-[0.68rem] font-bold uppercase tracking-wider ov-blog-faint">
          {heading}
        </b>
        <ol className="space-y-0.5 border-l border-[var(--border-subtle)]">
          {items.map((item, index) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`-ml-px flex gap-2 border-l-2 py-1.5 pl-3 text-[0.8rem] leading-snug transition-colors ${
                    isActive
                      ? "border-[var(--blog-quote-border)] font-semibold text-[var(--blog-accent)]"
                      : "border-transparent ov-blog-muted hover:border-[var(--border-subtle)] hover:text-[var(--blog-text-title)]"
                  }`}
                >
                  <span className="mt-[0.15rem] font-mono text-[0.65rem] text-slate-600" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile / tablet: disclosure */}
      <details className="group mb-8 rounded-2xl border border-[var(--border-subtle)] ov-blog-card lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:content-none">
          <b className="text-[0.68rem] font-bold uppercase tracking-wider ov-blog-title">{heading}</b>
          <span className="font-mono text-[0.7rem] font-semibold ov-blog-faint" aria-hidden="true">
            {items.length} ▾
          </span>
        </summary>
        <ol className="space-y-0.5 border-t border-[var(--border-subtle)] px-4 py-3">
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex gap-2 py-1 text-sm leading-snug ov-blog-muted hover:text-[var(--blog-accent)]"
              >
                <span className="mt-[0.15rem] font-mono text-[0.65rem] text-slate-600" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </details>
    </>
  );
}
