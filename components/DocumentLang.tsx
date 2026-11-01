"use client";

import { useEffect } from "react";
import type { BlogLocale } from "@/lib/blog";

/**
 * The root layout renders `<html lang="vi">` for the whole site. The English
 * mirror pages need `lang="en"`, and a nested layout cannot set an attribute on
 * the root element, so the blog syncs it on mount — the same approach the
 * landing page uses for /en.
 */
export default function DocumentLang({ locale }: { locale: BlogLocale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
