/**
 * Spotify-style request/response rendering: JSON example blocks instead of
 * schema tables, with compact status rows.
 */

import SchemaViewer from "@/components/SchemaViewer";
import { sampleRequestBody } from "@/lib/mock";

type MediaContent = {
  schema?: unknown;
  example?: unknown;
  examples?: Record<string, { value?: unknown }>;
};

type RequestBodyType = {
  description?: string;
  required?: boolean;
  content?: Record<string, MediaContent>;
  $ref?: string;
};

type ApiResponse = {
  description?: string;
  content?: Record<string, MediaContent>;
  $ref?: string;
};

type Props = {
  requestBody?: unknown;
  responses?: Record<string, unknown>;
  schemas: Record<string, unknown>;
};

const REF_PREFIX = "#/components/schemas/";

function jsonify(value: unknown): string {
  if (value === undefined) return "";
  return JSON.stringify(value, null, 2);
}

function JsonBlock({
  title,
  note,
  code,
}: {
  title: string;
  note?: string;
  code: string;
}) {
  if (!code || code === "{}" || code === "null") {
    return (
      <div className="ov-json-block">
        <div className="ov-json-head">
          <span>{title}</span>
          {note ? <span className="ov-json-note">{note}</span> : null}
        </div>
        <pre className="ov-json-code ov-json-empty"><code>Body không có nội dung (no content)</code></pre>
      </div>
    );
  }

  return (
    <div className="ov-json-block">
      <div className="ov-json-head">
        <span>{title}</span>
        {note ? <span className="ov-json-note">{note}</span> : null}
      </div>
      <pre className="ov-json-code"><code>{code}</code></pre>
    </div>
  );
}

function statusKind(status: string): "success" | "warn" | "error" {
  if (status.startsWith("2")) return "success";
  if (status.startsWith("4")) return "warn";
  return "error";
}

export default function RequestResponseViewer({
  requestBody,
  responses,
  schemas,
}: Props) {
  const body = requestBody as RequestBodyType | undefined;
  const sample = body && !body.$ref ? sampleRequestBody(body, { schemas }) : null;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="ov-viewer-title">Request body</h3>

        {!body ? (
          <p className="ov-viewer-empty">Endpoint không có request body.</p>
        ) : body.$ref ? (
          <p className="ov-viewer-empty">
            Tham chiếu: <code>{body.$ref.replace(REF_PREFIX, "Schema ")}</code>
          </p>
        ) : (
          <>
            {body.description && (
              <p className="ov-viewer-note">{body.description}</p>
            )}
            <JsonBlock
              title="Request body"
              note={body.required
                ? "required"
                : Object.keys(body.content ?? {})[0] ?? undefined}
              code={sample ?? "{}"}
            />
          </>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="ov-viewer-title">Responses</h3>

        {Object.entries(responses ?? {}).map(([status, value]) => {
          const response = value as ApiResponse;

          if (response.$ref) {
            return (
              <div key={status} className="ov-status-row">
                <span className={`ov-status-chip ov-status-${statusKind(status)}`}>{status}</span>
                <span className="ov-spine-description">
                  Tham chiếu: <code>{response.$ref.replace(REF_PREFIX, "Schema ")}</code>
                </span>
              </div>
            );
          }

          return (
            <details key={status} className="ov-response-details">
              <summary className="ov-status-row ov-status-summary">
                <span className={`ov-status-chip ov-status-${statusKind(status)}`}>{status}</span>
                <span className="ov-spine-description">{response.description ?? "—"}</span>
                <span className="ov-status-caret" aria-hidden="true">›</span>
              </summary>
              <div className="ov-response-body">
                <MediaOrSample
                  content={response.content}
                  schemas={schemas}
                  status={status}
                />
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}

function MediaOrSample({
  content,
  schemas,
  status,
}: {
  content?: Record<string, MediaContent>;
  schemas: Record<string, unknown>;
  status: string;
}) {
  if (!content || Object.keys(content).length === 0) {
    return <p className="ov-viewer-empty">Response không có nội dung.</p>;
  }

  const media = Object.entries(content)[0][1];

  // Documented examples win (spec-curated mocks); otherwise generate one.
  if (media.examples && Object.keys(media.examples).length > 0) {
    const first = Object.values(media.examples)[0];
    return (
      <JsonBlock
        title={`Example ${status}`}
        note="mock tĩnh từ spec"
        code={jsonify(first?.value)}
      />
    );
  }

  if (media.example !== undefined) {
    return <JsonBlock title={`Example ${status}`} note="mock tĩnh từ spec" code={jsonify(media.example)} />;
  }

  if (media.schema) {
    return <SchemaViewer name={`Response ${status}`} schema={media.schema} schemas={schemas} />;
  }

  return <JsonBlock title={`Body ${status}`} code="{ /* schema không khai báo */ }" />;
}
