import type { Metadata } from "next";
import ApiReference from "@/components/ApiReference";
import DocumentationFooter from "@/components/DocumentationFooter";
import DocumentationHeader from "@/components/DocumentationHeader";
import DocumentationSidebar from "@/components/DocumentationSidebar";
import QuickstartTabs from "@/components/QuickstartTabs";
import openApiDocument from "@/api-docs.json";
import {
  documentedServers,
  extractEndpoints,
  groupEndpointsByTag,
  type OpenApiDocument,
} from "@/lib/openapi";
import { SITE_BASE_URL, SITE_ROUTES } from "@/lib/routes";

const document = openApiDocument as unknown as OpenApiDocument;
const guides = [
  { href: "#getting-started", label: "Bắt đầu" },
  { href: "#authentication", label: "Xác thực" },
  { href: "#reference", label: "API Reference" },
];

export const metadata: Metadata = {
  title: SITE_ROUTES[2].title,
  description: SITE_ROUTES[2].description,
  alternates: {
    canonical: `${SITE_BASE_URL}/docs`,
    languages: { vi: "/docs", en: "/en/docs", "x-default": "/docs" },
  },
  openGraph: {
    type: "website",
    title: `${document.info.title} — API Documentation`,
    description: SITE_ROUTES[2].description,
    url: `${SITE_BASE_URL}/docs`,
    siteName: "OpenVie",
  },
};

export default function DocsPage() {
  const endpoints = extractEndpoints(document);
  const groups = groupEndpointsByTag(endpoints, document);
  const schemas = document.components?.schemas ?? {};
  const servers = documentedServers(document);
  const baseUrl = servers[0] ?? "http://localhost:8080";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_BASE_URL },
      { "@type": "ListItem", position: 2, name: "API Documentation", item: `${SITE_BASE_URL}/docs` },
    ],
  };

  return (
    <main className="ov-docs-shell h-dvh overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <a className="ov-skip-link" href="#main-content">Bỏ qua điều hướng</a>
      <DocumentationHeader guides={guides} locale="vi" />

      <div className="mx-auto grid h-[calc(100dvh-60px)] max-w-[1440px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <DocumentationSidebar guides={guides} groups={groups} locale="vi" />
        <div id="main-content" className="ov-docs-content h-full min-w-0 overflow-y-auto overscroll-contain" tabIndex={-1}>
          <section className="ov-docs-hero px-6 py-14 lg:px-12">
            <p className="ov-hero-eyebrow">Developer Documentation</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">API Reference</h1>
            <p className="mt-5 max-w-2xl leading-7 text-slate-400 text-lg">
              Tài liệu API của OpenVie — render trực tiếp từ{" "}
              <code>api-docs.json</code> (OpenAPI {document.openapi}) đặt trong
              repo. Toàn bộ response trong <em>mock playground</em> được sinh
              từ schema, không gọi server thật.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="ov-badge">OpenAPI {document.openapi}</span>
              <span className="ov-badge">{endpoints.length} endpoints</span>
              <span className="ov-badge">{Object.keys(schemas).length} schemas</span>
              <span className="ov-badge ov-badge-accent">Bearer JWT</span>
            </div>

            <div className="mt-8 max-w-3xl">
              <QuickstartTabs locale="vi" />
            </div>
          </section>

          <section id="getting-started" className="ov-docs-section-header px-6 py-12 lg:px-12">
            <p className="ov-hero-eyebrow">Getting started</p>
            <h2 className="text-2xl font-bold tracking-tight">Bắt đầu tích hợp</h2>
            <ol className="ov-steps mt-5">
              <li>
                <strong>Đăng nhập</strong> qua <code>POST /api/v1/auth/login</code>
                (hoặc SSO/refresh) để lấy <code>access_token</code>.
              </li>
              <li>
                <strong>Gọi API</strong> kèm header <code>Authorization: Bearer …</code>.
                Workspace hiện hành, người dùng và vai trò được suy ra từ token
                — không cần tenant header.
              </li>
              <li>
                <strong>Xem mock</strong> trong từng endpoint (mục API Reference):
                chọn response code, nhập tham số, playground trả dữ liệu tĩnh.
              </li>
            </ol>
          </section>

          <section id="authentication" className="ov-docs-section-header px-6 py-12 lg:px-12">
            <p className="ov-hero-eyebrow">Authentication</p>
            <h2 className="text-2xl font-bold tracking-tight">Xác thực request</h2>
            <p className="mt-5 max-w-2xl leading-7 text-slate-400">
              Tất cả endpoint có ký hiệu khóa yêu cầu Bearer JWT. Token hết hạn
              được đổi qua <code>/api/v1/auth/refresh</code>; đăng nhập SSO đi qua
              <code> /api/v1/auth/sso/exchange</code>. Lỗi auth trả về JSON
              chuẩn <code>{"{ timestamp, status, path, error, message }"}</code>.
            </p>
          </section>

          <section id="reference" className="scroll-mt-20 px-6 py-14 lg:px-12">
            <ApiReference
              endpoints={endpoints}
              groups={groups}
              schemas={schemas}
              servers={servers}
              baseUrl={baseUrl}
            />
          </section>
          <DocumentationFooter
            version={document.info.version ?? "0.1.0"}
            actions={endpoints.length}
            locale="vi"
          />
        </div>
      </div>
    </main>
  );
}
