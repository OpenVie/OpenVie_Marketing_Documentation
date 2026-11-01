/** Public URL map shared by sitemap, robots, per-page metadata and tests. */

export const SITE_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export interface SiteRoute {
  path: string;
  label: string;
  title: string;
  description: string;
  lastModified: string;
}

/**
 * Copy pinned to the claim matrix (MARKETING_GUIDE.md M1):
 * title ≤ 60 chars, description ≤ 155 chars, no improvised superlatives.
 */
export const SITE_ROUTES: SiteRoute[] = [
  {
    path: "/",
    label: "Trang chủ (VI)",
    title: "OpenVie — RAG tự lưu trữ cho tài liệu nội bộ",
    description:
      "RAG tự lưu trữ ưu tiên tiếng Việt cho tài liệu nội bộ, Apache-2.0. Trả lời có trích dẫn, từ chối khi thiếu bằng chứng, phê duyệt e-Office 2 cấp.",
    lastModified: "2026-10-31",
  },
  {
    path: "/en",
    label: "Home (EN)",
    title: "OpenVie — Self-hosted RAG for internal documents",
    description:
      "Self-hosted Vietnamese-first RAG for internal documents, Apache-2.0. Cited answers, abstention without evidence, two-level approval, DuckDB OLAP.",
    lastModified: "2026-10-31",
  },
  {
    path: "/docs",
    label: "API Documentation (VI)",
    title: "Tài liệu API — OpenVie",
    description:
      "Tài liệu API lõi headless của OpenVie: OpenAPI 3.1 render tĩnh, mock playground không gọi server, tham chiếu từng schema.",
    lastModified: "2026-10-31",
  },
  // Appended (never inserted): earlier entries are addressed by index elsewhere.
  {
    path: "/blog",
    label: "Blog (VI)",
    title: "Blog — ghi chép kỹ thuật về RAG tự lưu trữ",
    description:
      "Bài viết kỹ thuật về truy hồi hybrid, từ chối khi thiếu bằng chứng, Lakehouse Parquet + DuckDB, BPMN 2 cấp, bảo mật cổng biên.",
    lastModified: "2026-10-31",
  },
  {
    path: "/en/blog",
    label: "Blog (EN)",
    title: "Blog — engineering notes on self-hosted RAG",
    description:
      "Technical posts on hybrid retrieval, abstention without evidence, Parquet + DuckDB lakehouse, two-level BPMN approval, edge security.",
    lastModified: "2026-10-31",
  },
  {
    path: "/en/docs",
    label: "API Documentation (EN)",
    title: "API Documentation — OpenVie",
    description:
      "OpenVie headless core API documentation: static OpenAPI 3.1 reference, offline mock playground, interactive schemas and parameters.",
    lastModified: "2026-10-31",
  },
];

export function routeFor(path: string): SiteRoute | undefined {
  return SITE_ROUTES.find((route) => route.path === path);
}
