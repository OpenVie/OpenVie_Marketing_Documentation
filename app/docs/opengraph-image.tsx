import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "OpenVie API Documentation";

function fontArrayBuffer(): ArrayBuffer {
  const bytes = readFileSync(
    path.join(process.cwd(), "app", "fonts", "BeVietnamPro-Bold.ttf"),
  );
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export default function DocsOpenGraphImage() {
  const brand = fontArrayBuffer();

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
          <span style={{ color: "#ffffff", fontSize: 30, fontWeight: 700 }}>OpenVie API</span>
          <span style={{ color: "#94A3B8", fontSize: 26 }}>Reference</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 70, fontWeight: 700, color: "#ffffff", letterSpacing: -2 }}>
            API Documentation
          </div>
          <div style={{ fontSize: 30, color: "#94A3B8" }}>
            OpenAPI 3.1 · mock playground tĩnh · không cần backend
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          <span style={{ border: "1px solid #1FB6FF66", borderRadius: 999, padding: "10px 26px", color: "#1FB6FF", fontSize: 26 }}>
            Bearer JWT
          </span>
          <span style={{ border: "1px solid #ffffff22", borderRadius: 999, padding: "10px 26px", color: "#E0F2FE", fontSize: 26 }}>
            OpenAPI snapshot
          </span>
          <span style={{ border: "1px solid #ffffff22", borderRadius: 999, padding: "10px 26px", color: "#E0F2FE", fontSize: 26 }}>
            BPMN
          </span>
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
