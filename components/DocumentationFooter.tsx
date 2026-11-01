type Props = {
  version: string;
  actions: number;
  locale?: "vi" | "en";
};

export default function DocumentationFooter({ version, actions, locale = "vi" }: Props) {
  const isEn = locale === "en";
  return (
    <footer className="ov-docs-footer">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-7 text-sm sm:px-6">
        <p>
          <span className="ov-brand-name">OpenVie<em>API</em></span> · Documentation
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span>OpenAPI snapshot · v{version}</span>
          <span>{actions} {isEn ? "endpoints" : "endpoint"}</span>
          <a href="/api/openapi" aria-label={isEn ? "Download OpenAPI snapshot JSON" : "Tải OpenAPI snapshot JSON"}>openapi.json ⭳</a>
        </div>
      </div>
    </footer>
  );
}
