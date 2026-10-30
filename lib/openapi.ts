
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
