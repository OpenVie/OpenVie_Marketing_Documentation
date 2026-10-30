"use client";

import { type FormEvent, useState } from "react";
import type { ApiEndpoint } from "@/lib/openapi";

type Parameter = {
  name?: string;
  in?: "query" | "path" | "header" | "cookie";
  description?: string;
  required?: boolean;
};

type PlaygroundResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
};

function hasJsonRequestBody(requestBody: unknown) {
  if (!requestBody || typeof requestBody !== "object") return false;
  const content = (requestBody as { content?: unknown }).content;
  return Boolean(content && typeof content === "object" && "application/json" in content);
}

function getParameters(parameters: unknown[] | undefined) {
  return (parameters ?? []).filter((parameter): parameter is Parameter => (
    Boolean(parameter) &&
    typeof parameter === "object" &&
    typeof (parameter as Parameter).name === "string" &&
    ["query", "path", "header"].includes((parameter as Parameter).in ?? "")
  ));
}

function formatResponseBody(body: string) {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body || "(empty response)";
  }
}

export default function ApiPlayground({
  endpoint,
  servers,
}: {
  endpoint: ApiEndpoint;
  servers: string[];
}) {
  const parameters = getParameters(endpoint.operation.parameters);
  const hasBody = hasJsonRequestBody(endpoint.operation.requestBody);
  const needsAuth = Boolean(endpoint.operation.security?.length);
  const [server, setServer] = useState(servers[0] ?? "");
  const [parameterValues, setParameterValues] = useState<Record<string, string>>({});
  const [token, setToken] = useState("");
  const [body, setBody] = useState(hasBody ? "{}" : "");
  const [response, setResponse] = useState<PlaygroundResponse | null>(null);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function sendRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResponse(null);

    const missingPathParameter = parameters.find((parameter) => (
      parameter.in === "path" && !parameterValues[parameter.name ?? ""]
    ));
    if (missingPathParameter) {
      setError(`Enter a value for path parameter “${missingPathParameter.name}”.`);
      return;
    }

    if (hasBody) {
      try {
        JSON.parse(body);
      } catch {
        setError("Request body must be valid JSON.");
        return;
      }
    }

    let path = endpoint.path;
    const url = new URL(server);
    for (const parameter of parameters) {
      const name = parameter.name ?? "";
      const value = parameterValues[name]?.trim();
      if (!value) continue;

      if (parameter.in === "path") {
        path = path.replace(`{${name}}`, encodeURIComponent(value));
      }
      if (parameter.in === "query") {
        url.searchParams.set(name, value);
      }
    }
    url.pathname = `${url.pathname.replace(/\/$/, "")}${path}`;

    const headers = new Headers({ Accept: "application/json" });
    for (const parameter of parameters) {
      const name = parameter.name ?? "";
      const value = parameterValues[name]?.trim();
      if (parameter.in === "header" && value) headers.set(name, value);
    }
    if (needsAuth && token.trim()) headers.set("Authorization", `Bearer ${token.trim()}`);
    if (hasBody) headers.set("Content-Type", "application/json");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    setIsSending(true);

    try {
      const result = await fetch(url, {
        method: endpoint.method.toUpperCase(),
        headers,
        body: hasBody ? body : undefined,
        credentials: "omit",
        signal: controller.signal,
      });

      const responseBody = await result.text();
      setResponse({
        status: result.status,
        statusText: result.statusText,
        headers: Object.fromEntries(result.headers.entries()),
        body: formatResponseBody(responseBody),
      });
    } catch (requestError) {
      const isTimeout = requestError instanceof DOMException && requestError.name === "AbortError";
      setError(
        isTimeout
          ? "Request timed out after 20 seconds."
          : "Request could not be completed. Confirm that the API server is reachable and allows this origin through CORS.",
      );
    } finally {
      window.clearTimeout(timeout);
      setIsSending(false);
    }
  }

  return (
    <section className="ov-api-playground" aria-labelledby={`playground-${endpoint.id}`}>
      <div className="ov-api-playground-header">
        <div>
          <p className="ov-api-eyebrow">Try it out</p>
          <h3 id={`playground-${endpoint.id}`} className="font-semibold">Interactive API playground</h3>
        </div>
        <span className="ov-api-playground-method">{endpoint.method}</span>
      </div>

      <form className="ov-api-playground-form" onSubmit={sendRequest}>
        <label className="ov-api-playground-field">
          <span>Verified server</span>
          <select value={server} onChange={(event) => setServer(event.target.value)}>
            {servers.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        {needsAuth && (
          <label className="ov-api-playground-field">
            <span>Bearer token <em>not stored</em></span>
            <input
              type="password"
              value={token}
              autoComplete="off"
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste an access token"
            />
          </label>
        )}

        {parameters.map((parameter) => {
          const name = parameter.name ?? "";
          return (
            <label key={`${parameter.in}-${name}`} className="ov-api-playground-field">
              <span>{name} <em>{parameter.in}{parameter.required ? " · required" : ""}</em></span>
              <input
                value={parameterValues[name] ?? ""}
                required={parameter.in === "path" || parameter.required}
                onChange={(event) => setParameterValues((values) => ({ ...values, [name]: event.target.value }))}
                placeholder={parameter.description ?? `Enter ${name}`}
              />
            </label>
          );
        })}

        {hasBody && (
          <label className="ov-api-playground-field">
            <span>JSON request body</span>
            <textarea value={body} spellCheck={false} onChange={(event) => setBody(event.target.value)} />
          </label>
        )}

        <div className="ov-api-playground-actions">
          <button type="submit" disabled={isSending || !server}>
            {isSending ? "Sending request…" : "Send request"}
          </button>
          <p>Requests go only to servers declared in this OpenAPI document. Tokens are never saved or logged.</p>
        </div>
      </form>

      {error && <p className="ov-api-playground-error" role="alert">{error}</p>}

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
          <pre>{response.body}</pre>
        </div>
      )}

      <p className="ov-api-playground-note">Browser requests require the selected API server to allow this documentation site through CORS.</p>
    </section>
  );
}
