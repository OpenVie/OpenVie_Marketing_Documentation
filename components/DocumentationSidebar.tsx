"use client";

import { useState } from "react";
import openApiDocument from "@/data/openapi.json";
import {
  endpointAnchorId,
  extractEndpoints,
  type ApiEndpoint,
  type OpenApiDocument,
} from "@/lib/openapi";

const guideLinks = [
  { href: "#main-content", label: "Overview" },
  { href: "#getting-started", label: "Getting started" },
  { href: "#authentication", label: "Authentication" },
];

const document = openApiDocument as unknown as OpenApiDocument;
const endpoints = extractEndpoints(document);
const tagOrder = document.tags?.map((tag) => tag.name) ?? [];

function endpointsForTag(tag: string) {
  return endpoints.filter((endpoint) => endpoint.operation.tags?.includes(tag));
}

function EndpointLink({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <a
      className="ov-api-nav-endpoint"
      href={`#${endpointAnchorId(endpoint)}`}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("openvie:endpoint-selected", { detail: endpoint.id }),
        );
      }}
    >
      <span className="ov-api-nav-copy">
        <span className="ov-api-nav-summary">{endpoint.operation.summary ?? "API endpoint"}</span>
        <span className="ov-api-nav-path"><b>{endpoint.method}</b> {endpoint.path.replace("/api/v1/", "/")}</span>
      </span>
    </a>
  );
}

export default function DocumentationSidebar() {
  const [openTag, setOpenTag] = useState<string | null>(tagOrder[0] ?? null);

  return (
    <aside className="ov-docs-sidebar hidden lg:block">
      <nav aria-label="Documentation navigation">
        <p className="ov-sidebar-label">Guides</p>
        <ul className="space-y-1">
          {guideLinks.map((item) => (
            <li key={item.href}><a href={item.href}>{item.label}</a></li>
          ))}
        </ul>

        <p className="ov-sidebar-label mt-10">Reference</p>
        <div className="space-y-1">
          {tagOrder.map((tag) => {
            const taggedEndpoints = endpointsForTag(tag);
            if (taggedEndpoints.length === 0) return null;
            const isOpen = openTag === tag;

            return (
              <section key={tag} className="ov-api-nav-group">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  className="ov-api-nav-trigger"
                  onClick={() => setOpenTag(isOpen ? null : tag)}
                >
                  <span>{tag}</span>
                </button>
                {isOpen && (
                  <div className="ov-api-nav-list">
                    {taggedEndpoints.map((endpoint) => <EndpointLink key={endpoint.id} endpoint={endpoint} />)}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
