
"use client";

import { useEffect, useState } from "react";
import SchemaViewer from "@/components/SchemaViewer";
import ParametersViewer from "@/components/ParametersViewer";
import RequestResponseViewer from "@/components/RequestResponseViewer";

import {
  extractEndpoints,
  endpointAnchorId,
  HTTP_METHODS,
  type ApiEndpoint,
  type HttpMethod,
  type OpenApiDocument,
} from "@/lib/openapi";

type MethodFilter = "all" | HttpMethod;

export default function ApiReference() {
  const [document, setDocument] =
    useState<OpenApiDocument | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<MethodFilter>("all");
  const [tagFilter, setTagFilter] = useState("all");

  useEffect(() => {
    const controller = new AbortController();

    async function loadOpenApi() {
      try {
        const response = await fetch("/api/openapi", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Không thể tải OpenAPI.");
        }

        const data: OpenApiDocument = await response.json();

        if (!data.paths || typeof data.paths !== "object") {
          throw new Error("Tài liệu OpenAPI không hợp lệ.");
        }

        setDocument(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : "Đã xảy ra lỗi."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadOpenApi();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <p className="text-slate-400">Đang tải API Reference...</p>;
  }

  if (error || !document) {
    return (
      <p role="alert" className="text-red-400">
        {error || "Không có dữ liệu OpenAPI."}
      </p>
    );
  }

  const endpoints = extractEndpoints(document);
  const schemas = document.components?.schemas ?? {};
  const tags = Array.from(new Set([
    ...(document.tags?.map((tag) => tag.name) ?? []),
    ...endpoints.flatMap((endpoint) => endpoint.operation.tags ?? []),
  ])).sort((first, second) => first.localeCompare(second));
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredEndpoints = endpoints.filter((endpoint) => {
    const operation = endpoint.operation;
    const matchesQuery = !normalizedQuery || [
      endpoint.path,
      endpoint.method,
      operation.summary,
      operation.description,
    ].filter(Boolean).join(" ").toLocaleLowerCase().includes(normalizedQuery);
    const matchesMethod = methodFilter === "all" || endpoint.method === methodFilter;
    const matchesTag = tagFilter === "all" || operation.tags?.includes(tagFilter);

    return matchesQuery && matchesMethod && matchesTag;
  });
  const hasActiveFilters = searchQuery.length > 0 || methodFilter !== "all" || tagFilter !== "all";

  function clearFilters() {
    setSearchQuery("");
    setMethodFilter("all");
    setTagFilter("all");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">API Reference</h2>
        <p className="mt-2 text-slate-400">
          {document.info.title} · OpenAPI {document.openapi}
        </p>
        <p className="mt-2 text-sm text-cyan-400">
          {endpoints.length} endpoints ·{" "}
          {Object.keys(schemas).length} schemas
        </p>
      </div>

      <section className="ov-api-filters" aria-label="Filter API endpoints">
        <div className="ov-api-filter-field ov-api-filter-search">
          <label htmlFor="endpoint-search">Search endpoints</label>
          <input
            id="endpoint-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Path, method, or description"
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
            {HTTP_METHODS.map((method) => (
              <option key={method} value={method}>{method.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="ov-api-filter-field">
          <label htmlFor="endpoint-tag">Tag</label>
          <select
            id="endpoint-tag"
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
          >
            <option value="all">All tags</option>
            {tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
        </div>

        <button
          type="button"
          className="ov-api-filter-clear"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
        >
          Clear filters
        </button>
      </section>

      <p className="text-sm text-slate-400" role="status">
        Showing {filteredEndpoints.length} of {endpoints.length} endpoints
      </p>

      <div className="space-y-3">
        {filteredEndpoints.map((endpoint: ApiEndpoint) => {
          const expanded = selectedId === endpoint.id;
          const operation = endpoint.operation;

          return (
            <article
              key={endpoint.id}
              id={endpointAnchorId(endpoint)}
              className="ov-api-card scroll-mt-24 overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
            >
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() =>
                  setSelectedId(expanded ? null : endpoint.id)
                }
                className="flex w-full flex-wrap items-center gap-3 p-5 text-left hover:bg-slate-800"
              >
                <span className="rounded bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase text-cyan-400">
                  {endpoint.method}
                </span>

                <code className="break-all text-sm">
                  {endpoint.path}
                </code>

                <span className="text-sm text-slate-400">
                  {operation.summary ?? "No summary"}
                </span>

                <span className="ov-api-expand-icon ml-auto text-slate-400" aria-hidden="true">
                  {expanded ? "−" : "+"}
                </span>
              </button>

              {expanded && (
                <div className="ov-api-expand space-y-5 border-t border-slate-800 p-5">
                  <p className="text-slate-300">
                    {operation.description ??
                      operation.summary ??
                      "Không có mô tả."}
                  </p>

                  <p className="text-sm text-slate-400">
                    Nhóm: {operation.tags?.join(", ") ?? "Không xác định"}
                  </p>

                  <section>
                    <h3 className="font-semibold">Parameters</h3>
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

        {filteredEndpoints.length === 0 && (
          <div className="ov-api-empty-state" role="status">
            <p className="font-semibold">No endpoints found</p>
            <p className="mt-1 text-sm text-slate-400">Try another keyword, HTTP method, or tag.</p>
            <button type="button" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </div>

      <section>
        <h2 className="text-2xl font-bold">Schemas</h2>
        <p className="mt-2 text-slate-400">
          Các cấu trúc dữ liệu được định nghĩa trong OpenAPI.
        </p>

        <div className="mt-4 space-y-3">
          {Object.entries(schemas).map(([name, schema]) => (
            <details
              key={name}
              className="ov-api-card rounded-lg border border-slate-800 bg-slate-900 p-4"
            >
              <summary className="cursor-pointer font-medium text-cyan-400">
                {name}
              </summary>
              <SchemaViewer
                name={name}
                schema={schema}
                schemas={schemas}
              />
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
