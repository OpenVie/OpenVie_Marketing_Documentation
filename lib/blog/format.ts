import type { BlogLocale, BlogPost } from "./types";

/**
 * Deterministic date formatting for prerendered pages: the locale is explicit
 * and the instant is pinned to UTC, so the build output never drifts with the
 * machine's time zone.
 */
export function formatBlogDate(date: string, locale: BlogLocale): string {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function readingLabel(minutes: number, locale: BlogLocale): string {
  return locale === "vi" ? `${minutes} phút đọc` : `${minutes} min read`;
}

export function blogIndexPath(locale: BlogLocale): string {
  return locale === "vi" ? "/blog" : "/en/blog";
}

export function blogPostPath(locale: BlogLocale, slug: string): string {
  return `${blogIndexPath(locale)}${`/${slug}`}`;
}

/**
 * Anchor for a section heading. Deterministic and shared by the table of
 * contents and the renderer so the two always agree. Diacritics are folded to
 * ASCII so the fragment stays readable in a shared link.
 */
export function headingAnchor(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, (match) => (match === "đ" ? "d" : "D"))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

/** The article's parts, in order — drives the subnav and the index cards. */
export function postSections(post: BlogPost): { id: string; label: string }[] {
  return post.blocks.flatMap((block) =>
    block.kind === "h2" ? [{ id: headingAnchor(block.text), label: block.text }] : [],
  );
}
