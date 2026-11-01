/**
 * Static mock engine.
 *
 * Generates realistic response bodies directly from the OpenAPI document in
 * `api-docs.json` (the single source committed to the repo). The site never
 * calls the backend:
 * "sending" a request in the playground resolves a synthetic response with
 * simulated latency. Output is deterministic for a given operation so repeated
 * requests show stable data.
 */

import {
  chooseHappyPathStatus,
  type ApiEndpoint,
  type OpenApiOperation,
} from "@/lib/openapi";

interface SchemaLike {
  $ref?: string;
  type?: string;
  format?: string;
  enum?: unknown[];
  const?: unknown;
  default?: unknown;
  example?: unknown;
  examples?: unknown;
  properties?: Record<string, SchemaLike>;
  additionalProperties?: SchemaLike | true;
  required?: string[];
  items?: SchemaLike;
  minItems?: number;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  description?: string;
}

type ResolvedSchemas = Record<string, unknown>;
interface SchemasInput {
  schemas?: ResolvedSchemas | null;
}

function hashSeed(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: T[], rand: () => number): T {
  return items[Math.floor(rand() * items.length) % items.length];
}

function hex(size: number, rand: () => number): string {
  let output = "";
  for (let index = 0; index < size; index += 1) {
    output += Math.floor(rand() * 16).toString(16);
  }
  return output;
}

function pseudoUuid(rand: () => number): string {
  return `${hex(8, rand)}-${hex(4, rand)}-4${hex(3, rand)}-a${hex(3, rand)}-${hex(12, rand)}`;
}

function isoDateTime(rand: () => number): string {
  const base = Date.parse("2026-10-31T02:00:00.000Z");
  const drift = Math.floor(rand() * 1000 * 60 * 60 * 72); // up to 72h recent
  return new Date(base - drift).toISOString();
}

const VIETNAMESE_FULL_NAMES = [
  "Nguyễn Hải Đăng",
  "Lê Thu Hà",
  "Trần Quốc Bảo",
  "Phạm Minh Anh",
  "Đỗ Gia Khánh",
];

const DOCUMENT_FILE_NAMES = [
  "onboarding-policy.pdf",
  "chinh-sach-nhan-su.docx",
  "bao-cao-tai-chinh-q3.xlsx",
  "quy-trinh-phong-van.pdf",
];

const SUMMARIES = [
  "Tóm tắt: quy định áp dụng từ kỳ cuối, có các điều khoản về thời hạn phê duyệt và kèm trích dẫn nguồn.",
  "Theo chính sách hiện hành, mức phê duyệt cấp 2 chỉ áp dụng cho tài liệu nhạy cảm.",
  "Tài liệu mô tả quy trình onboarding gồm 4 bước, kèm bảng phân quyền chi tiết.",
];

const REQUEST_BODIES: Record<string, string> = {
  content: "Tóm tắt giúp tôi chính sách ngày nghỉ phép năm nay.",
  query: "Ai được phép phê duyệt tài liệu mức 2?",
  name: "DMS Bridge",
  url: "https://dms.example.com/openvie/hooks",
  email: "owner@example.com",
  fullName: "Nguyễn Hải Đăng",
  password: "OpenVie#2026!",
  currentPassword: "OpenVie#2026!",
  newPassword: "OpenVie#2027!",
};

const SHORT_MESSAGES = [
  "Authentication required",
  "Resource not found",
  "Validation failed",
  "Permission denied",
];

const STRING_BY_NAME: Record<string, string> = {
  path: "/api/v1/documents/d7c4a2e0",
  error: "Unauthorized",
  tokentype: "Bearer",
  locale: "vi",
  version: "0.0.1-SNAPSHOT",
  policyversion: "policy-2026-v1",
  slug: "chinh-sach-ngay-nghi-2026",
  method: "GET",
  filetype: "PDF",
  textsource: "ocr",
  status: "OK",
  type: "smtp",
  fromname: "OpenVie Mail",
  host: "smtp.example.com",
  username: "openvie-mailer",
};

function descriptionDrivenString(schema: SchemaLike, name: string, rand: () => number): string {
  const lower = name.toLowerCase().replace(/[_-]/g, "");
  const hint = schema.description?.slice(0, 60) ?? "";

  if (/file/.test(lower)) return pick(DOCUMENT_FILE_NAMES, rand);
  if (STRING_BY_NAME[lower] !== undefined) return STRING_BY_NAME[lower];
  if (/assignee|fullname|actorname|ownername|displayname/.test(lower)) {
    return pick(VIETNAMESE_FULL_NAMES, rand);
  }
  if (/^message$|errormessage|deliveryerror|lasterror|lastdeliveryerror/.test(lower)) {
    return pick(SHORT_MESSAGES, rand);
  }
  if (/summar|answer/.test(lower) && !hint.startsWith("User question")) {
    return pick(SUMMARIES, rand);
  }
  if (/email/.test(lower)) return pick(["no-reply@openvie.vn", "owner@example.com"], rand);
  if (REQUEST_BODIES[name] !== undefined) return REQUEST_BODIES[name];
  return `Giá trị ${name}`;
}

const FORMAT_SAMPLERS: Record<string, (rand: () => number) => string> = {
  uuid: pseudoUuid,
  "date-time": isoDateTime,
  email: (rand) => `${pick(["owner", "trnhb", "haidang", "qa-team"], rand)}@example.com`,
  uri: (rand) => `https://dms.example.com/${hex(6, rand)}`,
  hostname: () => "api.example.com",
  ipv4: () => "10.0.1.23",
  password: () => "••••••••",
};

interface SampleContext {
  rand: () => number;
  operationId: string;
  schemas: ResolvedSchemas;
  depth: number;
}

function sampleMap(valueSchema: SchemaLike, context: SampleContext): Record<string, unknown> {
  const map: Record<string, unknown> = {};
  const keys = ["alpha", "beta"];
  for (const key of keys.slice(0, 2)) {
    map[key] = sampleValue(valueSchema, { ...context, depth: context.depth + 1 });
  }
  return map;
}

function sampleString(schema: SchemaLike, name: string, context: SampleContext): string {
  if (schema.format && FORMAT_SAMPLERS[schema.format]) {
    return FORMAT_SAMPLERS[schema.format](context.rand);
  }

  const base = descriptionDrivenString(schema, name, context.rand);
  if (schema.minLength && base.length < schema.minLength) {
    return base.padEnd(schema.minLength, "•");
  }
  if (schema.maxLength && base.length > schema.maxLength) {
    return base.slice(0, schema.maxLength);
  }
  return base;
}

function sampleNumber(schema: SchemaLike, name: string, context: SampleContext): number {
  const lower = name.toLowerCase();
  // Status-like integers deserve HTTP-shaped values.
  if (schema.minimum === undefined && schema.maximum === undefined && /status/.test(lower)) {
    return pick([200, 201, 204, 400, 401, 403, 404, 409, 422, 500], context.rand);
  }
  if (schema.minimum === undefined && schema.maximum === undefined && /minutes/.test(lower)) {
    return pick([30, 120, 1440, 4320], context.rand);
  }
  if (schema.minimum === undefined && schema.maximum === undefined && /^port$/.test(lower)) {
    return pick([25, 465, 587, 993], context.rand);
  }
  const minimum = schema.minimum ?? 0;
  const maximum = schema.maximum ?? Math.max(minimum + 100, 100);
  const raw = minimum + context.rand() * (maximum - minimum);
  const value = schema.type === "integer" ? Math.round(raw) : Number(raw.toFixed(2));
  return value;
}

/**
 * Produce one instance of the described schema. `example` / `examples` /
 * `default` / `enum` win when present; otherwise a schema-driven synthetic
 * value is created. `$ref` cycles degrade to a minimal safe value.
 */
export function sampleValue(
  schema: unknown,
  context: SampleContext & { seedName?: string },
): unknown {
  if (typeof schema !== "object" || schema === null) return {};

  const schemaLike = schema as SchemaLike;
  const name = context.seedName ?? "";

  if (schemaLike.$ref) {
    const refName = schemaLike.$ref.replace(/^#\/components\/schemas\//, "");
    const refSchema = context.schemas[refName];
    if (typeof refSchema !== "object" || refSchema === null) return {};
    if (context.depth >= 6) return pseudoUuid(context.rand); // cycle guard
    return sampleValue(refSchema, {
      ...context,
      seedName: refName,
      depth: context.depth + 1,
    });
  }

  if (schemaLike.example !== undefined) return clone(schemaLike.example);
  if (schemaLike.examples !== undefined) return clone(schemaLike.examples);
  if (schemaLike.const !== undefined) return clone(schemaLike.const);
  if (schemaLike.default !== undefined) return clone(schemaLike.default);
  if (schemaLike.enum && schemaLike.enum.length > 0) return clone(pick(schemaLike.enum, context.rand));

  switch (schemaLike.type) {
    case "object": {
      const output: Record<string, unknown> = {};
      const properties = schemaLike.properties ?? {};
      const required = new Set(schemaLike.required ?? []);

      for (const [property, propertySchema] of Object.entries(properties)) {
        const isScalar = ["string", "number", "integer", "boolean"].includes(
          (propertySchema as SchemaLike).type ?? "",
        );
        // Keep responses readable: always include required properties, dive into
        // nesting only while the object stays shallow.
        if (!required.has(property) && context.depth >= 2 && !isScalar) continue;

        output[property] = sampleValue(propertySchema, {
          ...context,
          seedName: property,
          depth: context.depth + 1,
        });
      }

      if (schemaLike.additionalProperties && Object.keys(output).length === 0) {
        const valueSchema =
          schemaLike.additionalProperties === true ? {} : schemaLike.additionalProperties;
        return sampleMap(valueSchema, context);
      }
      return output;
    }
    case "array": {
      const count = Math.max(schemaLike.minItems ?? 1, 1);
      const limit = Math.min(count, 3);
      const itemSchema = schemaLike.items ?? {};
      return Array.from({ length: limit }, () =>
        sampleValue(itemSchema, { ...context, seedName: `${name}_item`, depth: context.depth + 1 })
      );
    }
    case "number":
    case "integer":
      return sampleNumber(schemaLike, name, context);
    case "boolean":
      return true;
    case "string":
      return sampleString(schemaLike, name, context);
    default: {
      if (schemaLike.properties) return sampleValue({ ...schemaLike, type: "object" }, context);
      if (schemaLike.items) return sampleValue({ type: "array", ...schemaLike }, context);
      return sampleString(schemaLike, name, context);
    }
  }
}

function clone(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value));
}

/** "200" → "OK", "422" → "Unprocessable Content" similar to the live backend. */
export function statusText(status: number): string {
  const text: Record<number, string> = {
    200: "OK", 201: "Created", 202: "Accepted", 204: "No Content",
    400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found",
    409: "Conflict", 422: "Unprocessable Content", 429: "Too Many Requests",
    500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable",
  };
  return text[status] ?? "OK";
}

export interface MockResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  statusOptions: string[];
}

interface MediaContentLike {
  schema?: unknown;
  example?: unknown;
  examples?: Record<string, { value?: unknown }>;
}

/** Pick the schema-bearing media entry of a response/request (OpenAPI documents it as `*`/`*`). */
function pickMedia(media: Record<string, MediaContentLike> | undefined): MediaContentLike | null {
  if (!media) return null;
  const preferred = media["*/*"] ?? media["application/json"] ?? null;
  if (preferred && (preferred.schema || preferred.example || preferred.examples)) return preferred;
  const first = Object.values(media).find(
    (entry) => entry && (entry.schema || entry.example || entry.examples),
  );
  return first ?? null;
}

export interface MockOptions {
  /** Parameter values the visitor typed, echoed into the body where sensible. */
  parameterValues?: Record<string, string>;
}

/**
 * Build the mock response for one documented status of an endpoint.
 * `status` must exist in `operation.responses`; falling back to the happy path
 * happens in the playground before calling this.
 */
export function buildMockResponse(
  operation: OpenApiOperation,
  schemasInput: SchemasInput,
  status: string,
  options: MockOptions = {},
): MockResponse | null {
  const schemas = schemasInput.schemas ?? {};
  const response = operation.responses?.[status];
  if (!response || typeof response !== "object") return null;

  const media = pickMedia((response as { content?: Record<string, MediaContentLike> }).content);
  const operationId = operation.operationId ?? `${status}:mock`;
  const context: SampleContext = {
    rand: mulberry32(hashSeed(`${status}#${operationId}`)),
    operationId,
    schemas,
    depth: 0,
  };

  let bodyValue: unknown;
  if (media?.examples && Object.keys(media.examples).length > 0) {
    bodyValue = clone(Object.values(media.examples)[0]?.value ?? {});
  } else if (media?.example !== undefined) {
    bodyValue = clone(media.example);
  } else if (media?.schema) {
    bodyValue = sampleValue(media.schema, context);
  }

  // Echo documented path/query parameter values so the mock reflects what the
  // visitor typed, similar to a real echo endpoint.
  if (bodyValue && typeof bodyValue === "object" && options.parameterValues) {
    for (const [name, value] of Object.entries(options.parameterValues)) {
      if ((options.parameterValues[name] ?? "") === "") continue;
      if (name in (bodyValue as Record<string, unknown>) && name !== "content" && name !== "password") {
        (bodyValue as Record<string, unknown>)[name] = value;
      }
    }
  }

  const number = Number(status) || 200;
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-request-id": pseudoUuid(mulberry32(hashSeed(operationId))),
    "x-openvie-mock": "static",
    "cache-control": "no-store",
  };

  return {
    status: number,
    statusText: statusText(number),
    headers,
    body: bodyValue === undefined || number === 204
      ? ""
      : JSON.stringify(bodyValue, null, 2),
    statusOptions: Object.keys(operation.responses ?? {}).filter((key) =>
      Number.isFinite(Number(key)),
    ),
  };
}

/** Resolve which status the playground defaults to (prefer 2xx). */
export function happyPathStatus(operation: OpenApiOperation): string | null {
  return chooseHappyPathStatus(operation.responses);
}

/**
 * Deterministic, dependency-free sample instance for a schema — used by the
 * JSON example blocks and request-body samples. Stable for a given seed name.
 */
export function generateSample(
  schema: unknown,
  schemas: ResolvedSchemas,
  seedName: string,
): unknown {
  return sampleValue(schema, {
    rand: mulberry32(hashSeed(seedName)),
    operationId: seedName,
    schemas,
    depth: 1,
  });
}

/** Sample JSON body for request examples in the docs. */
export function sampleRequestBody(
  requestBody: unknown,
  schemasInput: SchemasInput,
): string | null {
  const requestBodyObject = requestBody as
    | { content?: Record<string, MediaContentLike> }
    | undefined;
  const media = pickMedia(requestBodyObject?.content);
  if (!media) return null;

  if (media.examples && Object.keys(media.examples).length > 0) {
    const value = clone(Object.values(media.examples)[0]?.value ?? {});
    return JSON.stringify(value, null, 2);
  }
  if (media.example !== undefined) return JSON.stringify(clone(media.example), null, 2);

  const schemas = schemasInput.schemas ?? {};
  return JSON.stringify(
    generateSample(media.schema ?? {}, schemas, "request-body"),
    null,
    2,
  );
}

export interface MinimalEndpointLike {
  id: string;
  method: string;
  path: string;
  operation: OpenApiOperation;
}

/** Convenience wrapper used by playground components. */
export function mockForEndpoint(
  endpoint: MinimalEndpointLike,
  schemasInput: SchemasInput,
  status: string | null,
  options: MockOptions = {},
): MockResponse | null {
  const target = status ?? happyPathStatus(endpoint.operation);
  return target ? buildMockResponse(endpoint.operation, schemasInput, target, options) : null;
}

export type { ApiEndpoint };
