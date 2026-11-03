import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import path from "node:path";
import { SITE_ROUTES } from "@/lib/routes";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE_ROUTES[0].title;

function fontArrayBuffer(): ArrayBuffer {
  const bytes = readFileSync(
    path.join(process.cwd(), "app", "fonts", "BeVietnamPro-Bold.ttf"),
  );
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

/**
 * Text-only OG graphic (brief §4.6: no invented UI/mockups).
 * Only whitelist claims: self-hosted RAG for internal documents,
 * Apache-2.0, Vietnamese-first, released version 0.3.1.
 */
export default function OpenGraphImage() {
  const brand = fontArrayBuffer();

  const badge = (text: string): { text: string } => ({ text });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #020617 0%, #0F172A 100%)",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "#1FB6FF" }} />
          <span style={{ color: "#ffffff", fontSize: 30, fontWeight: 700 }}>OpenVie</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#ffffff", letterSpacing: -2, lineHeight: 1.15 }}>
            RAG tự lưu trữ cho
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#1FB6FF", letterSpacing: -2, lineHeight: 1.15 }}>
            tài liệu nội bộ
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {["Apache-2.0", "Tự lưu trữ", "Ưu tiên tiếng Việt", "v0.3.1"].map(badge).map((b) => (
            <div
              key={b.text}
              style={{
                display: "flex",
                border: "2px solid rgba(31, 182, 255, 0.4)",
                borderRadius: 999,
                padding: "10px 22px",
                color: "#1FB6FF",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {b.text}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "BeVietnamPro",
          data: brand,
          weight: 700,
          style: "normal" as const,
        },
      ],
    },
  );
}
