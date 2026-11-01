
export const HTTP_METHODS = [
  "get", "post", "put", "patch", "delete",
  "head", "options", "trace",
] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

export interface OpenApiOperation {
  summary?: string;
  description?: string;
  tags?: string[];
  operationId?: string;
  parameters?: unknown[];
  requestBody?: unknown;
  responses?: Record<string, unknown>;
  security?: Array<Record<string, string[]>>;
}

export interface OpenApiDocument {
  openapi: string;
  info: {
    title: string;
    version?: string;
    description?: string;
  };
  paths: Record<string, Record<string, unknown>>;
  tags?: Array<{
    name: string;
    description?: string;
  }>;
  servers?: Array<{
    url: string;
  }>;
  components?: {
    schemas?: Record<string, unknown>;
  };
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  operation: OpenApiOperation;
}

export function endpointAnchorId(endpoint: Pick<ApiEndpoint, "id">): string {
  return `endpoint-${endpoint.id.replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "")}`;
}

export function extractEndpoints(
  document: OpenApiDocument
): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = [];

  for (const [path, pathItem] of Object.entries(document.paths)) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];

      if (!operation || typeof operation !== "object") {
        continue;
      }

      endpoints.push({
        id: `${method}:${path}`,
        method,
        path,
        operation: operation as OpenApiOperation,
      });
    }
  }

  return endpoints;
}

/** Order of operations whether a status is preferable as the happy-path mock. */
export function statusPriority(status: string): number {
  const numeric = Number(status);
  if (Number.isNaN(numeric)) return 900;
  if (numeric < 300) return numeric === 200 ? 0 : numeric; // 201/202/204 keep their order
  return 500 + numeric;
}

export function chooseHappyPathStatus(
  responses: Record<string, unknown> | undefined
): string | null {
  if (!responses) return null;

  const statuses = Object.keys(responses)
    .filter((status) => Number.isFinite(Number(status)))
    .sort((first, second) => statusPriority(first) - statusPriority(second));

  const success = statuses.find((status) => Number(status) < 300);
  return success ?? statuses[0] ?? null;
}

/** `GET /api/v1/documents/…` → `/documents/…` for compact navigation labels. */
export function shortPath(path: string): string {
  return path.replace(/^\/api\/v1\//, "/");
}

export interface TagGroup {
  tag: string;
  description?: string;
  endpoints: ApiEndpoint[];
}

/**
 * Group endpoints by their first tag, preserving the tag order declared in the
 * document. Endpoints without a recognized tag fall into an "Other" group.
 */
export function groupEndpointsByTag(
  endpoints: ApiEndpoint[],
  document: OpenApiDocument
): TagGroup[] {
  const declaredOrder = [
    ...(document.tags?.map((tag) => tag.name) ?? []),
  ];
  const seen = new Set(declaredOrder);
  const groups = new Map<string, TagGroup>(
    declaredOrder.map((tag) => [
      tag,
      {
        tag,
        description: document.tags?.find((entry) => entry.name === tag)?.description,
        endpoints: [],
      },
    ]),
  );

  for (const endpoint of endpoints) {
    const tag = endpoint.operation.tags?.[0];
    if (tag && !groups.has(tag)) {
      groups.set(tag, { tag, endpoints: [] });
    }
    const group = groups.get(tag ?? "") ?? null;
    if (group) {
      group.endpoints.push(endpoint);
    } else {
      let other = groups.get("__other__");
      if (!other) {
        other = { tag: "__other__", endpoints: [] };
        groups.set("__other__", other);
        seen.add("__other__");
      }
      other.endpoints.push(endpoint);
    }
  }

  return Array.from(groups.values()).filter(
    (group) => group.endpoints.length > 0
  );
}

export function documentedServers(document: OpenApiDocument): string[] {
  const https = document.servers?.map((server) => server.url).filter(
    (url) => /^https?:\/\//.test(url)
  ) ?? [];
  return https.length > 0 ? https : [document.servers?.[0]?.url ?? "http://localhost:8080"];
}

/** Diacritics-safe slug for group anchors (`Chatbot & Trò chuyện` → `chatbot-tro-chuyen`). */
export function tagSlug(tag: string): string {
  return tag
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "group";
}
