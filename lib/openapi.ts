
export interface OpenApiOperation {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
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
  servers?: Array<{ url: string }>;
  tags?: Array<{ name: string; description?: string }>;
  paths: Record<
    string,
    Record<string, unknown>
  >;
  components?: {
    schemas?: Record<string, unknown>;
  };
}

export async function getOpenApiDocument(): Promise<OpenApiDocument> {
  const response = await fetch("/api/openapi");

  if (!response.ok) {
    throw new Error("Không thể tải tài liệu OpenAPI.");
  }

  return response.json();
}
