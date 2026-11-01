import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Shared Open Graph graphic for blog posts. Kept to flexbox plus a handful of
 * inline styles because the renderer only supports that subset.
 */

export const blogOgSize = { width: 1200, height: 630 } as const;

export function blogOgFont() {
  const bytes = readFileSync(path.join(process.cwd(), "app", "fonts", "BeVietnamPro-Bold.ttf"));
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export function blogOgElement({
  eyebrow,
  title,
  footer,
}: {
  eyebrow: string;
  title: string;
  footer: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #07100a 0%, #101d12 100%)",
        padding: "72px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: "#c8f03a" }} />
        <span style={{ color: "#ffffff", fontSize: 30, fontWeight: 700 }}>OpenVie</span>
        <span style={{ color: "#93a89a", fontSize: 26 }}>{eyebrow}</span>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 56,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: -1.5,
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            display: "flex",
            border: "2px solid rgba(200, 240, 58, 0.4)",
            borderRadius: 999,
            padding: "10px 22px",
            color: "#c8f03a",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          {footer}
        </span>
      </div>
    </div>
  );
}
