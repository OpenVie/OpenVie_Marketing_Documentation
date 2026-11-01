"use client";

import { useState } from "react";

const SNIPPETS = {
  curl: {
    label: "cURL",
    code: `# 1) Đăng nhập — nhận access token
curl --request POST \\
  --url "$OPENVIE/api/v1/auth/login" \\
  --header "Content-Type: application/json" \\
  --data '{"email":"owner@example.com","password":"OpenVie#2026!"}'

# 2) Gọi API với Bearer token
curl --request GET \\
  --url "$OPENVIE/api/v1/documents" \\
  --header "Authorization: Bearer $ACCESS_TOKEN"`,
  },
  node: {
    label: "Node.js",
    code: `const base = process.env.OPENVIE; // http://localhost:8080

const { accessToken } = await fetch(base + "/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "owner@example.com",
    password: "OpenVie#2026!",
  }),
}).then((r) => r.json());

const documents = await fetch(base + "/api/v1/documents", {
  headers: { Authorization: "Bearer " + accessToken },
}).then((r) => r.json());`,
  },
  python: {
    label: "Python",
    code: `import os, requests

base = os.environ.get("OPENVIE", "http://localhost:8080")

login = requests.post(
    base + "/api/v1/auth/login",
    json={"email": "owner@example.com", "password": "OpenVie#2026!"},
)
token = login.json()["accessToken"]

documents = requests.get(
    base + "/api/v1/documents",
    headers={"Authorization": f"Bearer {token}"},
).json()`,
  },
} as const;

type Language = keyof typeof SNIPPETS;

export default function QuickstartTabs({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const isEn = locale === "en";
  const [language, setLanguage] = useState<Language>("curl");
  const [copied, setCopied] = useState(false);
  const rawSnippet = SNIPPETS[language];
  const code = isEn
    ? rawSnippet.code
        .replace("# 1) Đăng nhập — nhận access token", "# 1) Log in — receive access token")
        .replace("# 2) Gọi API với Bearer token", "# 2) Call API with Bearer token")
    : rawSnippet.code;

  async function copySnippet() {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <div className="ls-quickstart">
      <div className="ls-quickstart-tabs" role="tablist" aria-label={isEn ? "Example language" : "Ngôn ngữ ví dụ"}>
        {(Object.keys(SNIPPETS) as Language[]).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            id={`quickstart-tab-${item}`}
            aria-selected={language === item}
            aria-controls="quickstart-panel"
            className={language === item ? "is-active" : ""}
            onClick={() => {
              setLanguage(item);
              setCopied(false);
            }}
          >
            {SNIPPETS[item].label}
          </button>
        ))}
        <button type="button" className="ls-quickstart-copy" onClick={copySnippet}>
          {copied ? (isEn ? "Copied ✓" : "Đã copy ✓") : "Copy"}
        </button>
      </div>
      <div
        id="quickstart-panel"
        role="tabpanel"
        aria-labelledby={`quickstart-tab-${language}`}
        className="ls-quickstart-code"
        tabIndex={0}
        aria-label={isEn ? "Quickstart example" : "Ví dụ bắt đầu nhanh"}
      >
        <pre><code>{code}</code></pre>
      </div>
      <p className="ls-quickstart-note">
        {isEn ? (
          <>
            Set <code>$OPENVIE</code> to your server base URL (defaults to{" "}
            <code>http://localhost:8080</code> in dev). Full responses for each
            endpoint are documented in the{" "}
            <a href="/en/docs#reference">API Reference</a>.
          </>
        ) : (
          <>
            Đặt <code>$OPENVIE</code> là base URL server của bạn (mặc định dev là{" "}
            <code>http://localhost:8080</code>). Response đầy đủ của từng endpoint
            xem trong <a href="/docs#reference">API Reference</a>.
          </>
        )}
      </p>
    </div>
  );
}
