"use client";

import { useEffect, useRef, useState } from "react";
import { ARCH_NODES, type NodeSpec } from "@/components/InteractiveArchitecture";

type Tone = "blue" | "violet" | "amber" | "mint";

const TIERS: { id: NodeSpec["tier"]; label: string; labelEn: string; badge: string; tone: Tone }[] = [
  { id: "edge", label: "1. Tầng Biên mạng & Khách (Edge Plane)", labelEn: "1. Perimeter & Client Edge Plane", badge: "Edge Security", tone: "blue" },
  { id: "core", label: "2. Tầng Nghiệp vụ & Quy trình (Core Service Plane)", labelEn: "2. Core Business & Workflow Plane", badge: "Spring Boot 3 + Flowable", tone: "violet" },
  { id: "ai", label: "3. Tầng Suy luận AI & Truy hồi (AI & Retrieval Plane)", labelEn: "3. AI Inference & Retrieval Plane", badge: "FastAPI + Ollama (Local)", tone: "amber" },
  { id: "storage", label: "4. Tầng Lưu trữ & Hồ dữ liệu (Storage & Lakehouse Plane)", labelEn: "4. Storage & Lakehouse Plane", badge: "Multi-Store & DuckDB OLAP", tone: "mint" },
];

function nodeFor(id: string) {
  return ARCH_NODES.find((node) => node.id === id) ?? ARCH_NODES[0];
}

export default function ArchitectureServiceMap({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const [pinnedId, setPinnedId] = useState("spring-boot");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const vi = locale === "vi";
  const active = nodeFor(hoveredId ?? pinnedId);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasEnteredView(true);
        observer.disconnect();
      }
    }, { threshold: 0.18 });
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ov-service-map">
      <p className="ov-service-map-hint">
        {vi ? "14 dịch vụ thực tế · Rê chuột để xem trước, nhấp để ghim thông tin chi tiết." : "14 real services · Hover to preview, click to pin the details."}
      </p>
      <div ref={boardRef} data-ov-map-visible={hasEnteredView} className="ov-service-map-board">
        {TIERS.map((tier) => {
          const nodes = ARCH_NODES.filter((node) => node.tier === tier.id);
          return (
            <section key={tier.id} className={`ov-service-tier ov-service-tier--${tier.tone}`}>
              <header>
                <span>{vi ? tier.label : tier.labelEn}</span>
                <b>{tier.badge}</b>
              </header>
              <div className={`ov-service-cards ov-service-cards--${nodes.length}`}>
                {nodes.map((node) => {
                  const isActive = active.id === node.id;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      className={`ov-service-card ${isActive ? "is-active" : ""}`}
                      onClick={() => setPinnedId(node.id)}
                      onMouseEnter={() => setHoveredId(node.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(node.id)}
                      onBlur={() => setHoveredId(null)}
                      aria-pressed={isActive}
                    >
                      <b>{node.name}</b>
                      <code>{node.port ?? (vi ? "Nhúng nội bộ" : "Embedded")}</code>
                      <span>{node.protocol}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <section className="ov-service-inspector" aria-live="polite">
        <div className="ov-service-inspector-title"><div><h3>{active.name}</h3><p>{vi ? "Giao thức:" : "Protocol:"} <b>{active.protocol}</b>{active.port ? ` · ${active.port}` : ""}</p></div></div>
        <div className="ov-service-inspector-content">
          <div><b>{vi ? "Nhiệm vụ trong hệ thống" : "System responsibility"}</b><p>{vi ? active.duty : active.dutyEn}</p></div>
          <div><b>{vi ? "Phân định sở hữu dữ liệu" : "Data ownership boundary"}</b><p className="ov-service-accent">{vi ? active.stateOwnership : active.stateOwnershipEn}</p></div>
        </div>
      </section>
    </div>
  );
}
