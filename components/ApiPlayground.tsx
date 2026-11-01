"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { ApiEndpoint } from "@/lib/openapi";
import {
  happyPathStatus,
  mockForEndpoint,
  sampleRequestBody,
} from "@/lib/mock";

type Parameter = {
  name?: string;
  in?: "query" | "path" | "header" | "cookie";
  description?: string;
  required?: boolean;
};

type Props = {
  endpoint: ApiEndpoint;
  servers: string[];
  schemas: Record<string, unknown>;
};

function hasJsonRequestBody(requestBody: unknown) {
  if (!requestBody || typeof requestBody !== "object") return false;
  const content = (requestBody as { content?: unknown }).content;
  return Boolean(content && typeof content === "object" && "application/json" in content);
}

function formatResponseBody(body: string) {
  if (!body) return "(no content)";
  return body;
}

export default function ApiPlayground({ endpoint, servers, schemas }: Props) {
  const parameters = ((endpoint.operation.parameters ?? []) as Parameter[]).filter(
    (parameter) =>
      Boolean(parameter?.name) &&
      ["query", "path", "header"].includes(parameter.in ?? ""),
  );
  const hasBody = hasJsonRequestBody(endpoint.operation.requestBody);
  const defaultStatus = happyPathStatus(endpoint.operation);
  const statusOptions = useMemo(
    () => Object.keys(endpoint.operation.responses ?? {}).filter(
      (status) => Number.isFinite(Number(status)),
    ),
    [endpoint.operation.responses],
  );

  const [statusChoice, setStatusChoice] = useState(defaultStatus ?? "200");
  const [parameterValues, setParameterValues] = useState<Record<string, string>>({});
  const [body, setBody] = useState(hasBody ? sampleRequestBody(endpoint.operation, { schemas }) ?? "{}" : "");
  const [response, setResponse] = useState<ReturnType<typeof mockForEndpoint> | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const serverBase = servers[0] ?? "http://localhost:8080";

  function sendRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResponse(null);

    const missingPathParameter = parameters.find(
      (parameter) => parameter.in === "path" && !parameterValues[parameter.name ?? ""],
    );
    if (missingPathParameter) {
      setError(`Hãy nhập path parameter “${missingPathParameter.name}” — playground mock cần đủ tham số để sinh payload mẫu.`);
      return;
    }

    if (hasBody && body.trim()) {
      try {
        JSON.parse(body);
      } catch {
        setError("Request body phải là JSON hợp lệ (hoặc để trống).");
        return;
      }
    }

    // Static mock — no network call ever happens.
    setPending(true);
    window.setTimeout(() => {
      try {
        const mock = mockForEndpoint(endpoint, { schemas }, statusChoice, {
          parameterValues,
        });
        setResponse(mock);
      } catch (mockError) {
        setError(
          mockError instanceof Error ? mockError.message : "Không sinh được mock.",
        );
      } finally {
        setPending(false);
      }
    }, 420);
  }

  async function copyResponse() {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response.body || "");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="ov-api-playground" aria-labelledby={`playground-${endpoint.id}`}>
      <div className="ov-api-playground-header">
        <div>
          <p className="ov-api-eyebrow">Try it out · mock tĩnh</p>
          <h3 id={`playground-${endpoint.id}`} className="font-semibold">
            Mock playground — không gọi server
          </h3>
        </div>
        <span className={`ov-method-chip ov-method-${endpoint.method}`}>
          {endpoint.method.toUpperCase()}
        </span>
      </div>

      <form className="ov-api-playground-form" onSubmit={sendRequest}>
        <label className="ov-api-playground-field">
          <span>Target</span>
          <code className="ov-playground-target w-full text-left min-h-[40px]">
            {`${serverBase}${endpoint.path}`}
          </code>
        </label>

        <label className="ov-api-playground-field">
          <span>Response code</span>
          <select
            value={statusChoice}
            onChange={(event) => {
              setResponse(null);
              setStatusChoice(event.target.value);
            }}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === defaultStatus ? `${status} — happy path` : status}
              </option>
            ))}
          </select>
        </label>

        {parameters.map((parameter) => {
          const name = parameter.name ?? "";
          return (
            <label key={`${parameter.in}-${name}`} className="ov-api-playground-field">
              <span>
                {name} <em>{parameter.in}{parameter.required ? " · required" : ""}</em>
              </span>
              <input
                name={`mock-${parameter.in}-${name}`}
                autoComplete="off"
                value={parameterValues[name] ?? ""}
                required={parameter.in === "path" || parameter.required}
                onChange={(event) => setParameterValues(
                  (values) => ({ ...values, [name]: event.target.value }),
                )}
                placeholder={parameter.description ?? `Giá trị ${name}…`}
              />
            </label>
          );
        })}

        {hasBody && (
          <label className="ov-api-playground-field">
            <span>JSON request body <em>mẫu sinh từ schema</em></span>
            <textarea value={body} spellCheck={false} onChange={(event) => setBody(event.target.value)} />
          </label>
        )}

        <div className="ov-api-playground-actions">
          <button
            type="submit"
            disabled={pending || statusOptions.length === 0}
          >
            {pending ? "Đang sinh mock…" : "Gửi mock tới response này"}
          </button>
          <p>
            Playground là mock tĩnh: response sinh từ chính schema OpenAPI đã
            snapshot, không có request mạng. Token METHOD/Bearer cũng không cần.
          </p>
        </div>
      </form>

      {error && (
        <p className="ov-api-playground-error" role="alert">{error}</p>
      )}

      {response && (
        <div className="ov-api-playground-response" aria-live="polite">
          <div className="ov-api-playground-response-header">
            <h4>Response</h4>
            <span className={response.status < 400 ? "is-success" : "is-error"}>
              {response.status} {response.statusText}
            </span>
          </div>
          <details>
            <summary>Response headers</summary>
            <pre>{JSON.stringify(response.headers, null, 2)}</pre>
          </details>
          <pre>{formatResponseBody(response.body)}</pre>
          <button type="button" className="ov-code-copy" onClick={copyResponse}>
            {copied ? "Đã copy" : "Copy body"}
          </button>
        </div>
      )}

      {response && response.status < 400 && (
        <p className="ov-api-playground-note">
          Kết quả mock OK — đây là dữ liệu sinh tại chỗ.
        </p>
      )}
    </section>
  );
}
