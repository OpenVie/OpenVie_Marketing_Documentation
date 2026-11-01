"use client";

import Link from "next/link";
import { useState } from "react";
import {
  endpointAnchorId,
  shortPath,
  type ApiEndpoint,
  type TagGroup,
} from "@/lib/openapi";
import type { GuideLink } from "@/components/DocumentationHeader";

type Props = {
  guides: GuideLink[];
  groups: TagGroup[];
  locale?: "vi" | "en";
};

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
        <span className="ov-api-nav-path">
          <b>{endpoint.method}</b> {shortPath(endpoint.path)}
        </span>
      </span>
    </a>
  );
}

export default function DocumentationSidebar({ guides, groups, locale = "vi" }: Props) {
  const isEn = locale === "en";
  const [openTag, setOpenTag] = useState<string | null>(groups[0]?.tag ?? null);

  return (
    <aside className="ov-docs-sidebar hidden lg:block">
      <nav aria-label="Documentation navigation">
        <div className="ov-sidebar-product">
          <span aria-hidden="true" />
          Documentation
        </div>

        <p className="ov-sidebar-label">{isEn ? "Guides" : "Hướng dẫn"}</p>
        <ul className="space-y-0.5">
          {guides.map((item) => (
            <li key={item.href}><a href={item.href}>{item.label}</a></li>
          ))}
          <li><Link href={isEn ? "/en" : "/"}>{isEn ? "Home" : "Trang chủ"}</Link></li>
          <li><Link href={isEn ? "/en/blog" : "/blog"}>Blog</Link></li>
        </ul>

        <p className="ov-sidebar-label mt-8">API Reference</p>
        <div className="space-y-0.5">
          {groups.map((group) => {
            const isOpen = openTag === group.tag;

            return (
              <section key={group.tag} className="ov-api-nav-group">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  className="ov-api-nav-trigger"
                  onClick={() => setOpenTag(isOpen ? null : group.tag)}
                >
                  <span>{group.tag}</span>
                  <span>{group.endpoints.length}</span>
                </button>
                {isOpen && (
                  <div className="ov-api-nav-list">
                    {group.endpoints.map((endpoint) => (
                      <EndpointLink key={endpoint.id} endpoint={endpoint} />
                    ))}
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
