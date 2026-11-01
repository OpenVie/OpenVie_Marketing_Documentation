import type { BlogLocale, BlogPost, BlogPostPair } from "./types";
import { post as stackVi } from "./posts/stack-tieng-viet-cuc-bo.vi";
import { post as stackEn } from "./posts/stack-tieng-viet-cuc-bo.en";
import { post as hybridVi } from "./posts/truy-hoi-hybrid.vi";
import { post as hybridEn } from "./posts/truy-hoi-hybrid.en";
import { post as abstainVi } from "./posts/tu-choi-khi-thieu-bang-chung.vi";
import { post as abstainEn } from "./posts/tu-choi-khi-thieu-bang-chung.en";
import { post as lakehouseVi } from "./posts/lakehouse-parquet-duckdb.vi";
import { post as lakehouseEn } from "./posts/lakehouse-parquet-duckdb.en";
import { post as bpmnVi } from "./posts/phe-duyet-bpmn-2-cap.vi";
import { post as bpmnEn } from "./posts/phe-duyet-bpmn-2-cap.en";
import { post as securityVi } from "./posts/bao-mat-dinh-danh-bien-mang.vi";
import { post as securityEn } from "./posts/bao-mat-dinh-danh-bien-mang.en";

export type { BlogBlock, BlogLocale, BlogPost, BlogPostPair, BlogSource } from "./types";

/** Newest first — the index renders in this order. */
const PAIRS: BlogPostPair[] = [
  { vi: stackVi, en: stackEn },
  { vi: hybridVi, en: hybridEn },
  { vi: abstainVi, en: abstainEn },
  { vi: lakehouseVi, en: lakehouseEn },
  { vi: bpmnVi, en: bpmnEn },
  { vi: securityVi, en: securityEn },
];

export function blogPosts(locale: BlogLocale): BlogPost[] {
  return PAIRS.map((pair) => pair[locale]);
}

export function blogPost(locale: BlogLocale, slug: string): BlogPost | undefined {
  const pair = PAIRS.find((entry) => entry.vi.slug === slug);
  return pair?.[locale];
}

/** Slugs are shared across locales, so the VI list defines the route set. */
export function blogSlugs(): string[] {
  return PAIRS.map((pair) => pair.vi.slug);
}
