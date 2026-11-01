import type { Metadata } from "next";
import ApiReference from "@/components/ApiReference";
import DocumentationFooter from "@/components/DocumentationFooter";
import DocumentationHeader from "@/components/DocumentationHeader";
import DocumentationSidebar from "@/components/DocumentationSidebar";
import QuickstartTabs from "@/components/QuickstartTabs";
import DocumentLang from "@/components/DocumentLang";
import openApiDocument from "@/api-docs.json";
import {
  documentedServers,
  extractEndpoints,
  groupEndpointsByTag,
  type OpenApiDocument,
} from "@/lib/openapi";
import { SITE_BASE_URL } from "@/lib/routes";

const document = openApiDocument as unknown as OpenApiDocument;
const guides = [
  { href: "#getting-started", label: "Getting Started" },
  { href: "#authentication", label: "Authentication" },
  { href: "#reference", label: "API Reference" },
];

export const metadata: Metadata = {
  title: "API Documentation — OpenVie",
  description:
    "OpenVie headless core API documentation: static OpenAPI 3.1 reference, offline mock playground, interactive schemas and parameters.",
  alternates: {
    canonical: `${SITE_BASE_URL}/en/docs`,
    languages: { vi: "/docs", en: "/en/docs", "x-default": "/docs" },
  },
  openGraph: {
    type: "website",
    title: `${document.info.title} — API Documentation`,
    description:
      "OpenVie headless core API documentation: static OpenAPI 3.1 reference, offline mock playground, interactive schemas and parameters.",
    url: `${SITE_BASE_URL}/en/docs`,
    siteName: "OpenVie",
  },
};

export default function DocsPageEn() {
  const endpoints = extractEndpoints(document);
  const groups = groupEndpointsByTag(endpoints, document);
  const schemas = document.components?.schemas ?? {};
  const servers = documentedServers(document);
  const baseUrl = servers[0] ?? "http://localhost:8080";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_BASE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "API Documentation", item: `${SITE_BASE_URL}/en/docs` },
    ],
  };

  return (
    <main className="ov-docs-shell h-dvh overflow-hidden">
      <DocumentLang locale="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <a className="ov-skip-link" href="#main-content">Skip to content</a>
      <DocumentationHeader guides={guides} locale="en" />

      <div className="mx-auto grid h-[calc(100dvh-60px)] max-w-[1440px] lg:grid-cols-[260px_minmax(0,1fr)]">
        <DocumentationSidebar guides={guides} groups={groups} locale="en" />
        <div id="main-content" className="ov-docs-content h-full min-w-0 overflow-y-auto overscroll-contain" tabIndex={-1}>
          <section className="ov-docs-hero px-6 py-14 lg:px-12">
            <p className="ov-hero-eyebrow">Developer Documentation</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">API Reference</h1>
            <p className="mt-5 max-w-2xl leading-7 text-slate-400 text-lg">
              OpenVie API Reference — rendered directly from <code>api-docs.json</code> (OpenAPI {document.openapi})
              in the repository. All responses in the <em>mock playground</em> are generated statically from schemas
              with no live backend required.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="ov-badge">OpenAPI {document.openapi}</span>
              <span className="ov-badge">{endpoints.length} endpoints</span>
              <span className="ov-badge">{Object.keys(schemas).length} schemas</span>
              <span className="ov-badge ov-badge-accent">Bearer JWT</span>
            </div>

            <div className="mt-8 max-w-3xl">
              <QuickstartTabs locale="en" />
            </div>
          </section>

          <section id="getting-started" className="ov-docs-section-header px-6 py-12 lg:px-12">
            <p className="ov-hero-eyebrow">Getting started</p>
            <h2 className="text-2xl font-bold tracking-tight">Start Integrating</h2>
            <ol className="ov-steps mt-5">
              <li>
                <strong>Log in</strong> via <code>POST /api/v1/auth/login</code>
                (or SSO/refresh) to receive your <code>access_token</code>.
              </li>
              <li>
                <strong>Call endpoints</strong> with the <code>Authorization: Bearer …</code> header.
                Current workspace, user identity, and RBAC roles are derived from the token
                — no tenant header needed.
              </li>
              <li>
                <strong>Explore mocks</strong> for each endpoint in the API Reference below:
                select response codes, fill parameters, and receive static mock payloads instantly.
              </li>
            </ol>
          </section>

          <section id="authentication" className="ov-docs-section-header px-6 py-12 lg:px-12">
            <p className="ov-hero-eyebrow">Authentication</p>
            <h2 className="text-2xl font-bold tracking-tight">Request Authentication</h2>
            <p className="mt-5 max-w-2xl leading-7 text-slate-400">
              All endpoints marked with a lock require a Bearer JWT. Expired tokens can be
              renewed via <code>/api/v1/auth/refresh</code>; SSO login passes through
              <code> /api/v1/auth/sso/exchange</code>. Authentication errors return standard
              JSON: <code>{"{ timestamp, status, path, error, message }"}</code>.
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
            locale="en"
          />
        </div>
      </div>
    </main>
  );
}
