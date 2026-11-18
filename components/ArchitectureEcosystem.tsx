"use client";

import { useState, type CSSProperties } from "react";
import { ARCH_NODES } from "@/components/InteractiveArchitecture";

type Tile = { label: string; nodeId: string; glyph: string; column: number; row: number; tone: "blue" | "violet" | "amber" | "mint" };
type Cluster = { id: string; label: string; nodeIds: string[]; column: number; row: number; tone: "blue" | "violet" | "amber" | "mint" };

const CLUSTERS: Cluster[] = [
  { id: "edge", label: "Perimeter", nodeIds: ["web-console", "apisix", "clamav"], column: 4, row: 2, tone: "blue" },
  { id: "core", label: "Operations", nodeIds: ["spring-boot", "flowable-bpmn", "rabbitmq"], column: 6, row: 2, tone: "violet" },
  { id: "ai", label: "AI Retrieval", nodeIds: ["fastapi-ai", "ollama-vylinh", "tei-reranker"], column: 4, row: 4, tone: "amber" },
  { id: "data", label: "Data Lakehouse", nodeIds: ["postgres", "qdrant", "kuzu", "seaweedfs", "duckdb"], column: 6, row: 4, tone: "mint" },
];

const TILES: Tile[] = [
  { label: "Web Console", nodeId: "web-console", glyph: "WC", column: 1, row: 1, tone: "blue" },
  { label: "Apache APISIX", nodeId: "apisix", glyph: "AA", column: 2, row: 1, tone: "blue" },
  { label: "ClamAV Scanner", nodeId: "clamav", glyph: "CS", column: 3, row: 1, tone: "blue" },
  { label: "Spring Boot 3 API", nodeId: "spring-boot", glyph: "SB", column: 8, row: 1, tone: "violet" },
  { label: "Flowable BPMN 3.0", nodeId: "flowable-bpmn", glyph: "FB", column: 9, row: 1, tone: "violet" },
  { label: "RabbitMQ Broker", nodeId: "rabbitmq", glyph: "RB", column: 10, row: 1, tone: "violet" },
  { label: "FastAPI AI Engine", nodeId: "fastapi-ai", glyph: "FA", column: 1, row: 3, tone: "amber" },
  { label: "Ollama Local LLM", nodeId: "ollama-vylinh", glyph: "OL", column: 2, row: 3, tone: "amber" },
  { label: "TEI Vietnamese Reranker", nodeId: "tei-reranker", glyph: "TE", column: 3, row: 3, tone: "amber" },
  { label: "PostgreSQL 16", nodeId: "postgres", glyph: "PG", column: 1, row: 6, tone: "mint" },
  { label: "Qdrant Vector DB", nodeId: "qdrant", glyph: "QV", column: 2, row: 6, tone: "mint" },
  { label: "Kùzu Graph DB", nodeId: "kuzu", glyph: "KG", column: 3, row: 6, tone: "mint" },
  { label: "SeaweedFS S3", nodeId: "seaweedfs", glyph: "SS", column: 4, row: 6, tone: "mint" },
  { label: "DuckDB Nhúng (OLAP)", nodeId: "duckdb", glyph: "DN", column: 5, row: 6, tone: "mint" },
];

function nodeById(id: string) { return ARCH_NODES.find((node) => node.id === id) ?? ARCH_NODES[3]; }

export default function ArchitectureEcosystem({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const [pinnedId, setPinnedId] = useState("spring-boot");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const vi = locale === "vi";
  const active = nodeById(hoveredId ?? pinnedId);
  const select = (id: string) => setPinnedId(id);

  return <div className="ov-ecosystem">
    <p className="ov-ecosystem-hint">{vi ? "14 dịch vụ thực tế trong 4 vùng nền tảng. Rê chuột để xem trước · nhấp để ghim chi tiết." : "14 real services across four platform planes. Hover to preview · click to pin details."}</p>
    <div className="ov-ecosystem-board">
      {TILES.map((tile) => <button key={`${tile.label}-${tile.column}`} type="button" style={{ gridColumn: tile.column, gridRow: tile.row } as CSSProperties} onClick={() => select(tile.nodeId)} onMouseEnter={() => setHoveredId(tile.nodeId)} onMouseLeave={() => setHoveredId(null)} onFocus={() => setHoveredId(tile.nodeId)} onBlur={() => setHoveredId(null)} className={`ov-ecosystem-tile ov-ecosystem-tile--${tile.tone} ${active.id === tile.nodeId ? "is-active" : ""}`}><span>{tile.glyph}</span><b>{tile.label}</b></button>)}
      {CLUSTERS.map((cluster) => <button key={cluster.id} type="button" style={{ gridColumn: `${cluster.column} / span 2`, gridRow: `${cluster.row} / span 2` } as CSSProperties} onClick={() => select(cluster.nodeIds[0])} onMouseEnter={() => setHoveredId(cluster.nodeIds[0])} onMouseLeave={() => setHoveredId(null)} onFocus={() => setHoveredId(cluster.nodeIds[0])} onBlur={() => setHoveredId(null)} className={`ov-ecosystem-cluster ov-ecosystem-cluster--${cluster.tone} ${cluster.nodeIds.includes(active.id) ? "is-active" : ""}`}><div className="ov-ecosystem-preview"><i /><i /><i /><em /><em /><em /></div><span>{cluster.label}</span><small>{vi ? `${cluster.nodeIds.length} dịch vụ thực tế` : `${cluster.nodeIds.length} real services`}</small></button>)}
    </div>
    <section className="ov-ecosystem-inspector" aria-live="polite"><div className="ov-ecosystem-inspector-title"><span>{active.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span><div><h3>{active.name}</h3><p>{vi ? "Giao thức:" : "Protocol:"} <b>{active.protocol}</b>{active.port ? ` · ${active.port}` : ""}</p></div></div><div className="ov-ecosystem-inspector-content"><div><b>{vi ? "Nhiệm vụ trong hệ thống" : "System responsibility"}</b><p>{vi ? active.duty : active.dutyEn}</p></div><div><b>{vi ? "Phân định sở hữu dữ liệu" : "Data ownership boundary"}</b><p className="ov-ecosystem-accent">{vi ? active.stateOwnership : active.stateOwnershipEn}</p></div></div></section>
  </div>;
}
