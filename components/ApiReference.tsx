"use client";

import { useEffect, useState } from "react";
import SchemaViewer from "@/components/SchemaViewer";
import ParametersViewer from "@/components/ParametersViewer";
import RequestResponseViewer from "@/components/RequestResponseViewer";
import CodeExamples from "@/components/CodeExamples";
import ApiPlayground from "@/components/ApiPlayground";

import {
  endpointAnchorId,
  tagSlug,
  type ApiEndpoint,
  type HttpMethod,
  type TagGroup,
} from "@/lib/openapi";

type MethodFilter = "all" | HttpMethod;

type Props = {
  endpoints: ApiEndpoint[];
  groups: TagGroup[];
  schemas: Record<string, unknown>;
  servers: string[];
  baseUrl: string;
};

export default function ApiReference({
  endpoints,
  groups,
  schemas,
  servers,
  baseUrl,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("all");
  const [tagFilter, setTagFilter] = useState("all");

  useEffect(() => {
    const expandEndpointFromHash = () => {
      const anchor = window.location.hash.slice(1);
      const endpoint = endpoints.find(
        (item) => endpointAnchorId(item) === anchor,
      );

      if (endpoint) setSelectedId(endpoint.id);
    };

    const expandEndpointFromNavigation = (event: Event) => {
      const endpointId = (event as CustomEvent<string>).detail;
      if (endpointId) setSelectedId(endpointId);
    };

    expandEndpointFromHash();
    window.addEventListener("hashchange", expandEndpointFromHash);
    window.addEventListener("openvie:endpoint-selected", expandEndpointFromNavigation);

    return () => {
      window.removeEventListener("hashchange", expandEndpointFromHash);
      window.removeEventListener("openvie:endpoint-selected", expandEndpointFromNavigation);
    };
  }, [endpoints]);

  const tags = Array.from(new Set(groups.map((group) => group.tag)));
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

  const matches = (endpoint: ApiEndpoint): boolean => {
    const operation = endpoint.operation;
    const matchingQuery = !normalizedQuery || [
      endpoint.path,
      endpoint.method,
      operation.summary,
      operation.description,
    ].filter(Boolean).join(" ").toLocaleLowerCase().includes(normalizedQuery);
    const matchingMethod = methodFilter === "all" || endpoint.method === methodFilter;

    return matchingQuery && matchingMethod;
  };

  const filteredGroups: TagGroup[] = groups
    .map((group) => ({
      ...group,
      endpoints: group.endpoints.filter((endpoint) => matches(endpoint)),
    }))
    .filter(
      (group) => group.endpoints.length > 0 &&
        (tagFilter === "all" || group.tag === tagFilter),
    );

  const filteredCount = filteredGroups.reduce(
    (count, group) => count + group.endpoints.length,
    0,
  );
  const hasActiveFilters = searchQuery.length > 0 || methodFilter !== "all" || tagFilter !== "all";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">API Reference</h2>
        <p className="ov-reference-meta">
          {endpoints.length} endpoint · {Object.keys(schemas).length} schema ·
          nguồn api-docs.json trong repo
        </p>
      </div>

      <section className="ov-api-filters" aria-label="Filter API endpoints">
        <div className="ov-api-filter-field ov-api-filter-search">
          <label htmlFor="endpoint-search">Tìm kiếm endpoint</label>
          <input
            id="endpoint-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Path, method, hoặc mô tả"
          />
        </div>

        <div className="ov-api-filter-field">
          <label htmlFor="endpoint-method">Method</label>
          <select
            id="endpoint-method"
            value={methodFilter}
            onChange={(event) => setMethodFilter(event.target.value as MethodFilter)}
          >
            <option value="all">All methods</option>
            {(["get", "post", "put", "patch", "delete"] as HttpMethod[]).map((method) => (
              <option key={method} value={method}>{method.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="ov-api-filter-field">
          <label htmlFor="endpoint-tag">Nhóm</label>
          <select
            id="endpoint-tag"
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
          >
            <option value="all">Tất cả nhóm</option>
            {tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </div>

        <button
          type="button"
          className="ov-api-filter-clear"
          onClick={() => {
            setSearchQuery("");
            setMethodFilter("all");
            setTagFilter("all");
          }}
          disabled={!hasActiveFilters}
        >
          Xoá lọc
        </button>
      </section>

      <p className="ov-reference-count" role="status">
        Hiển thị {filteredCount} / {endpoints.length} endpoint{hasActiveFilters ? " (lọc đang bật)" : ""}
      </p>

      {filteredGroups.map((group) => {
        const groupAnchor = `group-${tagSlug(group.tag)}`;
        return (
        <section key={group.tag} className="ov-api-group" aria-labelledby={groupAnchor}>
          <h2 id={groupAnchor} className="ov-api-group-title">
            {group.tag}
            <span className="ov-api-group-count">{group.endpoints.length}</span>
          </h2>

          <div className="space-y-3">
            {group.endpoints.map((endpoint: ApiEndpoint) => {
              const expanded = selectedId === endpoint.id;
              const operation = endpoint.operation;

              return (
                <article
                  key={endpoint.id}
                  id={endpointAnchorId(endpoint)}
                  className="ov-api-card"
                >
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setSelectedId(expanded ? null : endpoint.id)}
                    className="ov-api-card-head"
                  >
                    <span className={`ov-method-chip ov-method-${endpoint.method}`}>
                      {endpoint.method.toUpperCase()}
                    </span>

                    <code className="ov-api-card-path">{endpoint.path}</code>
                    <span className="ov-api-card-summary">
                      {operation.summary ?? "—"}
                    </span>

                    <span className="ov-api-expand-icon" aria-hidden="true">
                      {expanded ? "−" : "+"}
                    </span>
                  </button>

                  {expanded && (
                    <div className="ov-api-expand space-y-5 p-5 border-t ov-op-border">
                      <p className="ov-operation-description">
                        {operation.description ?? operation.summary ?? "Không có mô tả."}
                      </p>

                      {operation.tags?.length ? (
                        <p className="ov-reference-count">
                          {`Nhóm: ${operation.tags.join(" · ")}`}
                        </p>
                      ) : null}

                      <CodeExamples endpoint={endpoint} baseUrl={baseUrl} schemas={schemas} />

                      <ApiPlayground endpoint={endpoint} servers={servers} schemas={schemas} />

                      <section>
                        <h3 className="ov-viewer-title">Params</h3>
                        <ParametersViewer parameters={operation.parameters ?? []} />
                      </section>

                      <RequestResponseViewer
                        requestBody={operation.requestBody}
                        responses={operation.responses}
                        schemas={schemas}
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
        );
      })}

      {filteredCount === 0 && (
        <div className="ov-api-empty-state" role="status">
          <p className="font-semibold">Không tìm thấy endpoint</p>
          <p className="ov-viewer-note">Thử từ khoá, method, hoặc nhóm khác.</p>
          <button type="button" onClick={() => {
            setSearchQuery("");
            setMethodFilter("all");
            setTagFilter("all");
          }}>
            Xoá lọc
          </button>
        </div>
      )}

      <section>
        <h2 className="text-2xl font-bold tracking-tight">Schemas</h2>
        <p className="ov-reference-meta">
          Cấu trúc dữ liệu được định nghĩa trong OpenAPI — mỗi schema có JSON
          mẫu sinh tự động.
        </p>

        <div className="mt-4 space-y-3">
          {Object.entries(schemas).map(([name, schema]) => (
            <details key={name} className="ov-api-card px-4 py-3">
              <summary className="cursor-pointer font-medium ov-reference-link">
                {name}
              </summary>
              <div className="mt-3">
                <SchemaViewer name={name} schema={schema} schemas={schemas} />
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
