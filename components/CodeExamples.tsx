"use client";

import { useState } from "react";
import type { ApiEndpoint } from "@/lib/openapi";

type ExampleLanguage = "curl" | "javascript";

function SyntaxCode({ code, language }: { code: string; language: ExampleLanguage }) {
  const tokenPattern = language === "javascript"
    ? /("[^"\n]*"|'[^'\n]*'|\b(?:const|await)\b|\b(?:fetch|json)\b|\b(?:method|headers|body)\b)/g
    : /("[^"\n]*"|'[^'\n]*'|\b(?:curl|--request|--url|--header|--data)\b)/g;

  return code.split(tokenPattern).map((token, index) => {
    if (!token) return null;

    let tokenClass = "";
    if (token.startsWith('"') || token.startsWith("'")) tokenClass = "ov-code-token-string";
    if (language === "javascript" && /^(const|await)$/.test(token)) tokenClass = "ov-code-token-keyword";
    if (language === "javascript" && /^(fetch|json)$/.test(token)) tokenClass = "ov-code-token-function";
    if (language === "javascript" && /^(method|headers|body)$/.test(token)) tokenClass = "ov-code-token-property";
    if (language === "curl" && /^(curl|--request|--url|--header|--data)$/.test(token)) tokenClass = "ov-code-token-command";

    return <span className={tokenClass} key={`${token}-${index}`}>{token}</span>;
  });
}

function hasJsonRequestBody(requestBody: unknown) {
  if (!requestBody || typeof requestBody !== "object") return false;

  const content = (requestBody as { content?: unknown }).content;
  return Boolean(content && typeof content === "object" && "application/json" in content);
}

function endpointUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

function curlExample(endpoint: ApiEndpoint, baseUrl: string) {
  const url = endpointUrl(baseUrl, endpoint.path);
  const needsAuth = Boolean(endpoint.operation.security?.length);
  const hasBody = hasJsonRequestBody(endpoint.operation.requestBody);
  const lines = [
    `curl --request ${endpoint.method.toUpperCase()} \\`,
    `  --url "${url}"`,
  ];

  if (needsAuth || hasBody) lines[lines.length - 1] += " \\";
  if (needsAuth) {
    lines.push(`  --header "Authorization: Bearer <access-token>"${hasBody ? " \\" : ""}`);
  }
  if (hasBody) {
    lines.push("  --header \"Content-Type: application/json\" \\");
    lines.push("  --data '{}'");
  }

  return lines.join("\n");
}

function javascriptExample(endpoint: ApiEndpoint, baseUrl: string) {
  const url = endpointUrl(baseUrl, endpoint.path);
  const needsAuth = Boolean(endpoint.operation.security?.length);
  const hasBody = hasJsonRequestBody(endpoint.operation.requestBody);
  const headers = [
    ...(needsAuth ? ['Authorization: "Bearer <access-token>"'] : []),
    ...(hasBody ? ['"Content-Type": "application/json"'] : []),
  ];
  const options = [
    `  method: "${endpoint.method.toUpperCase()}"`,
    ...(headers.length > 0 ? [`  headers: { ${headers.join(", ")} }`] : []),
    ...(hasBody ? ["  body: JSON.stringify({})"] : []),
  ];

  return [
    `const response = await fetch("${url}", {`,
    options.join(",\n"),
    "});",
    "",
    "const data = await response.json();",
  ].join("\n");
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) throw new Error("Copy failed");
}

export default function CodeExamples({
  endpoint,
  baseUrl,
}: {
  endpoint: ApiEndpoint;
  baseUrl: string;
}) {
  const [language, setLanguage] = useState<ExampleLanguage>("curl");
  const [copied, setCopied] = useState(false);
  const examples = {
    curl: curlExample(endpoint, baseUrl),
    javascript: javascriptExample(endpoint, baseUrl),
  };
  const code = examples[language];

  async function copyExample() {
    try {
      await copyText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="ov-code-examples" aria-labelledby={`example-${endpoint.id}`}>
      <div className="ov-code-examples-header">
        <div>
          <h3 id={`example-${endpoint.id}`} className="font-semibold">Code examples</h3>
          <p className="mt-1 text-sm text-slate-400">Replace placeholder values before sending the request.</p>
        </div>
        <button type="button" className="ov-code-copy" onClick={copyExample}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="ov-code-tabs" role="tablist" aria-label="Code example language">
        {(["curl", "javascript"] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={language === item}
            className={language === item ? "is-active" : ""}
            onClick={() => {
              setLanguage(item);
              setCopied(false);
            }}
          >
            {item === "curl" ? "cURL" : "JavaScript"}
          </button>
        ))}
      </div>

      <pre className="ov-code-block"><code><SyntaxCode code={code} language={language} /></code></pre>
    </section>
  );
}
