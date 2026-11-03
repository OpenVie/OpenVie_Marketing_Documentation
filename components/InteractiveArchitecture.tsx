"use client";

import { useState } from "react";

interface NodeSpec {
  id: string;
  name: string;
  tier: "edge" | "core" | "ai" | "storage";
  port?: string;
  protocol: string;
  duty: string;
  dutyEn: string;
  stateOwnership: string;
  stateOwnershipEn: string;
  isOptional?: boolean;
}

const ARCH_NODES: NodeSpec[] = [
  // Edge Plane
  {
    id: "apisix",
    name: "Apache APISIX",
    tier: "edge",
    port: ":8088",
    protocol: "HTTP/2, Reverse Proxy",
    duty: "Cổng biên duy nhất lộ diện ra ngoài mạng; áp dụng rate-limit theo route (auth 5, admin 20, api 50 r/s), lọc URI và chèn security headers (HSTS, CSP).",
    dutyEn: "Single external edge gateway; applies route-based rate limits (auth 5, admin 20, api 50 r/s), URI filtering, and security headers (HSTS, CSP).",
    stateOwnership: "Stateless (Được cấu hình khai báo qua config.yaml)",
    stateOwnershipEn: "Stateless (Declaratively configured via config.yaml)",
  },
  {
    id: "clamav",
    name: "ClamAV Scanner",
    tier: "edge",
    port: "Internal daemon",
    protocol: "TCP INSTREAM socket",
    duty: "Kiểm dịch luồng byte tệp tải lên (PDF, DOCX, XLSX...) ngay tại biên trước khi chuyển vào hàng đợi xử lý; tự động cách ly tệp độc hại.",
    dutyEn: "Perimeter malware quarantine; scans uploaded byte streams (PDF, DOCX, XLSX...) INSTREAM before queueing, isolating infected files.",
    stateOwnership: "Chữ ký virus cập nhật tự động",
    stateOwnershipEn: "Automated virus signature updates",
  },
  {
    id: "web-console",
    name: "Web Console",
    tier: "edge",
    port: ":3000",
    protocol: "Next.js App Router (React 19)",
    duty: "Giao diện quản trị tham chiếu: Chat hỏi đáp trích dẫn, hộp thư phê duyệt BPMN e-Office, quản trị kho tài liệu và tích hợp API keys.",
    dutyEn: "Reference management console: Cited document chat, BPMN e-Office approval inbox, workspace document management, and API keys.",
    stateOwnership: "Client tham chiếu Headless (không lưu trạng thái nghiệp vụ)",
    stateOwnershipEn: "Headless reference client (holds no business state)",
  },

  // Core Service Plane
  {
    id: "spring-boot",
    name: "Spring Boot 3 API",
    tier: "core",
    port: ":8080",
    protocol: "RESTful HTTP JSON, SSE Streaming",
    duty: "Lõi quản trị trạng thái nghiệp vụ, phân quyền đa tenant 3 vai trò, phiên chat bảo mật, quản lý API key M2M ovk_ và phát Webhook ký số HMAC.",
    dutyEn: "Core business state manager, 3-role multi-tenant RBAC, secure chat sessions, M2M ovk_ API keys, and HMAC-signed Webhook emitter.",
    stateOwnership: "Sở hữu toàn quyền PostgreSQL OLTP",
    stateOwnershipEn: "Authoritative owner of PostgreSQL OLTP",
  },
  {
    id: "flowable-bpmn",
    name: "Flowable BPMN 3.0",
    tier: "core",
    port: "Embedded in API",
    protocol: "Java Engine Service",
    duty: "Engine quy trình phê duyệt tài liệu 2 cấp nhúng trong API runtime; thực thi SLA tự động (24h/48h), chống tự duyệt và ghi vết audit bất biến.",
    dutyEn: "Embedded 2-stage document approval workflow engine; enforces automated SLAs (24h/48h), anti-self-approval, and immutable audit logs.",
    stateOwnership: "Bảng dữ liệu Flowable ACT_* nằm cùng PostgreSQL",
    stateOwnershipEn: "Flowable ACT_* tables co-located in PostgreSQL",
  },
  {
    id: "rabbitmq",
    name: "RabbitMQ Broker",
    tier: "core",
    port: ":5672",
    protocol: "AMQP 0-9-1",
    duty: "Hàng đợi xử lý bất đồng bộ cho tác vụ hấp thụ tài liệu (ingestion) và phân phối luồng CDC streaming sang Lakehouse Parquet.",
    dutyEn: "Asynchronous task queue for document ingestion workers and CDC event streaming broker to Lakehouse Parquet.",
    stateOwnership: "Hàng đợi đệm có cơ chế xác nhận (Ack) tin cậy",
    stateOwnershipEn: "Reliable buffered queues with message acknowledgment",
  },

  // AI & Retrieval Plane
  {
    id: "fastapi-ai",
    name: "FastAPI AI Engine",
    tier: "ai",
    port: ":50051",
    protocol: "gRPC mTLS (Prod), Python 3.11",
    duty: "Bộ điều phối truy hồi đa tầng (Dense Vector + BM25 + Graph), hợp nhất thứ hạng RRF, kiểm định abstention và tương tác với Ollama.",
    dutyEn: "Multi-stage retrieval coordinator (Dense Vector + BM25 + Graph), RRF rank fusion, abstention validator, and Ollama adapter.",
    stateOwnership: "Không lưu trạng thái nghiệp vụ (Stateless AI coordinator)",
    stateOwnershipEn: "Stateless AI coordinator (no business state)",
  },
  {
    id: "ollama-vylinh",
    name: "Ollama Local LLM",
    tier: "ai",
    port: ":11434",
    protocol: "Local HTTP API",
    duty: "Chạy mô hình ngôn ngữ tiếng Việt Vylinh ~3B (GGUF) và embedding BGE-M3 hoàn toàn cục bộ trên GPU/CPU máy chủ của bạn; zero data leakage.",
    dutyEn: "Runs Vietnamese Vylinh ~3B LLM (GGUF) and BGE-M3 embeddings 100% locally on your host GPU/CPU; zero data leakage.",
    stateOwnership: "Trọng số mô hình nạp vào VRAM/RAM cục bộ",
    stateOwnershipEn: "Model weights loaded into local host VRAM/RAM",
  },
  {
    id: "tei-reranker",
    name: "TEI Vietnamese Reranker",
    tier: "ai",
    port: ":8081",
    protocol: "HuggingFace TEI Cross-Encoder",
    duty: "Mô-đun tái xếp hạng cross-encoder tối ưu tiếng Việt; tự động fail-open (bỏ qua an toàn) nếu xảy ra lỗi để không gián đoạn luồng trả lời.",
    dutyEn: "Vietnamese cross-encoder reranking module; auto fail-open policy ensures queries continue smoothly even if temporarily unavailable.",
    stateOwnership: "Mô-đun tùy chọn — Tắt theo mặc định",
    stateOwnershipEn: "Optional modular component — Off by default",
    isOptional: true,
  },

  // Storage & Lakehouse Plane
  {
    id: "postgres",
    name: "PostgreSQL 16",
    tier: "storage",
    port: ":5432",
    protocol: "PostgreSQL Native Wire",
    duty: "Cơ sở dữ liệu giao dịch chính: Lưu trữ tài khoản, tổ chức, workspace, phiên hội thoại, lịch sử phê duyệt và phân quyền RBAC.",
    dutyEn: "Primary transactional database: stores accounts, organizations, workspaces, chat sessions, approval history, and RBAC policies.",
    stateOwnership: "Trạng thái giao dịch lõi (OLTP)",
    stateOwnershipEn: "Core transactional business state (OLTP)",
  },
  {
    id: "qdrant",
    name: "Qdrant Vector DB",
    tier: "storage",
    port: ":6333",
    protocol: "gRPC & HTTP REST",
    duty: "Lưu trữ và tìm kiếm vector nhúng ngữ nghĩa (Dense Embeddings BGE-M3) với bộ lọc cứng tenant_id và workspace_id trên từng payload.",
    dutyEn: "Stores and indexes BGE-M3 dense vector embeddings with strict tenant_id and workspace_id payload filtering.",
    stateOwnership: "Chỉ mục phái sinh vector (tái sinh được từ tệp gốc)",
    stateOwnershipEn: "Derived vector index (re-indexable from source files)",
  },
  {
    id: "kuzu",
    name: "Kùzu Graph DB",
    tier: "storage",
    port: "Embedded in FastAPI",
    protocol: "Cypher Query Language",
    duty: "Lưu trữ đồ thị thực thể và mối quan hệ tri thức giữa các tài liệu; cung cấp năng lực Graph RAG vượt trội so với tìm kiếm vector đơn thuần.",
    dutyEn: "Stores entity relationship graphs across documents; delivers Graph RAG capabilities superior to vector-only search.",
    stateOwnership: "Chỉ mục phái sinh đồ thị quan hệ",
    stateOwnershipEn: "Derived knowledge relationship graph index",
  },
  {
    id: "seaweedfs",
    name: "SeaweedFS S3",
    tier: "storage",
    port: ":8333",
    protocol: "S3 API, Snappy Parquet",
    duty: "Lưu trữ tệp gốc an toàn và đóng gói Lakehouse Parquet nén Snappy theo phân vùng tenant/năm/tháng phục vụ phân tích dữ liệu lớn.",
    dutyEn: "Secure raw file storage and Snappy Parquet Lakehouse partition repository (tenant/year/month) for big data analytics.",
    stateOwnership: "Kho tệp nhị phân gốc & Hồ dữ liệu Parquet",
    stateOwnershipEn: "Original binary files & Parquet Lakehouse partitions",
  },
  {
    id: "duckdb",
    name: "DuckDB Nhúng (OLAP)",
    tier: "storage",
    port: "Embedded Analytics",
    protocol: "SQL OLAP Engine",
    duty: "Thực thi truy vấn phân tích SQL trực tiếp trên các tệp Parquet trong SeaweedFS với tốc độ hàng triệu bản ghi/giây mà không gây nghẽn PostgreSQL.",
    dutyEn: "Executes blazing-fast analytical SQL directly on SeaweedFS Parquet files without database contention or locking PostgreSQL.",
    stateOwnership: "Engine phân tích in-process trên tệp Parquet",
    stateOwnershipEn: "In-process analytical engine reading Parquet files",
  },
];

export default function InteractiveArchitecture({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("spring-boot");
  const isVi = locale === "vi";

  const selectedNode = ARCH_NODES.find((n) => n.id === selectedNodeId) || ARCH_NODES[3];

  const tiers = [
    {
      id: "edge",
      label: isVi ? "1. Tầng Biên mạng & Khách (Edge Plane)" : "1. Perimeter & Client Edge Plane",
      badge: "Edge Security",
      nodes: ARCH_NODES.filter((n) => n.tier === "edge"),
    },
    {
      id: "core",
      label: isVi ? "2. Tầng Nghiệp vụ & Quy trình (Core Service Plane)" : "2. Core Business & Workflow Plane",
      badge: "Spring Boot 3 + Flowable",
      nodes: ARCH_NODES.filter((n) => n.tier === "core"),
    },
    {
      id: "ai",
      label: isVi ? "3. Tầng Suy luận AI & Truy hồi (AI & Retrieval Plane)" : "3. AI Inference & Retrieval Plane",
      badge: "FastAPI + Ollama (Local)",
      nodes: ARCH_NODES.filter((n) => n.tier === "ai"),
    },
    {
      id: "storage",
      label: isVi ? "4. Tầng Lưu trữ & Hồ dữ liệu (Storage & Lakehouse Plane)" : "4. Storage & Lakehouse Plane",
      badge: "Multi-Store & DuckDB OLAP",
      nodes: ARCH_NODES.filter((n) => n.tier === "storage"),
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Visual Blueprint Matrix */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl p-5 md:p-6 shadow-2xl ring-1 ring-white/5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1FB6FF]">
              {isVi ? "Sơ đồ Kiến trúc Phân tầng" : "Tiered Architecture Blueprint"}
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {isVi ? "Các khối dịch vụ độc lập, minh bạch & chuẩn microservices" : "Decoupled, Transparent Microservice Architecture"}
            </h3>
          </div>
          <span className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full font-medium">
            {isVi ? "💡 Nhấp vào từng khối để xem chi tiết trách nhiệm" : "💡 Click any component to inspect specifications"}
          </span>
        </div>

        {/* 4 Tiers Container */}
        <div className="space-y-4">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className="rounded-xl border border-white/5 bg-[#0F172A]/60 p-4 transition-all hover:border-white/15"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#1FB6FF] shadow-[0_0_6px_#1FB6FF]" />
                  {tier.label}
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-black/40 px-2.5 py-0.5 rounded border border-white/5 font-semibold">
                  {tier.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {tier.nodes.map((node) => {
                  const isSelected = node.id === selectedNodeId;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`relative text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#1FB6FF]/15 border-[#1FB6FF] text-white shadow-lg shadow-[#1FB6FF]/15 ring-1 ring-[#1FB6FF]"
                          : "bg-black/40 border-white/10 text-slate-300 hover:border-[#1FB6FF]/50 hover:bg-white/5"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <b className="text-xs font-bold text-white tracking-tight">{node.name}</b>
                          {node.isOptional && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 rounded font-bold">
                              {isVi ? "Tùy chọn" : "Optional"}
                            </span>
                          )}
                        </div>
                        {node.port && (
                          <span className="font-mono text-[11px] text-[#1FB6FF] block mb-1 font-bold">
                            {node.port}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-2 border-t border-white/5 pt-1.5">
                        {node.protocol}
                      </span>
                    </button>
                  );
                })}
              </div>

              {tierIdx < tiers.length - 1 && (
                <div className="flex justify-center my-1 pt-2 opacity-50">
                  <span className="text-xs text-[#1FB6FF]/80 font-mono">↓ luồng dữ liệu & xác thực mTLS / SSE ↓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Node Inspector Drawer */}
      <div className="rounded-2xl border border-[#1FB6FF]/40 bg-[#0F172A]/95 backdrop-blur-xl p-5 md:p-6 shadow-xl ring-1 ring-[#1FB6FF]/20">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1FB6FF]/20 text-[#1FB6FF] font-black border border-[#1FB6FF]/40 text-base shadow-[0_0_12px_rgba(31,182,255,0.2)]">
              ⚙️
            </span>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>{selectedNode.name}</span>
                {selectedNode.port && (
                  <span className="text-xs font-mono font-bold text-[#1FB6FF] bg-[#1FB6FF]/15 border border-[#1FB6FF]/30 px-2 py-0.5 rounded">
                    {selectedNode.port}
                  </span>
                )}
                {selectedNode.isOptional && (
                  <span className="text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                    {isVi ? "Mô-đun Tùy chọn (Off by default)" : "Optional Module (Off by default)"}
                  </span>
                )}
              </h4>
              <span className="text-xs text-slate-400">
                Giao thức: <code className="text-[#1FB6FF] font-mono">{selectedNode.protocol}</code>
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-[#1FB6FF] bg-[#1FB6FF]/10 border border-[#1FB6FF]/30 px-3 py-1 rounded-md font-bold">
            docs/ARCHITECTURE.md §1 §3
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-[#0F172A]/80 border border-white/5 rounded-xl p-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
              {isVi ? "Nhiệm vụ & Chức năng trong hệ thống:" : "Core Responsibilities & Capabilities:"}
            </span>
            <p className="text-sm text-slate-200 leading-relaxed">
              {isVi ? selectedNode.duty : selectedNode.dutyEn}
            </p>
          </div>

          <div className="bg-[#0F172A]/80 border border-white/5 rounded-xl p-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
              {isVi ? "Phân định Sở hữu Dữ liệu (Data Ownership):" : "Data Ownership & State Boundary:"}
            </span>
            <p className="text-sm text-[#1FB6FF] leading-relaxed font-bold">
              {isVi ? selectedNode.stateOwnership : selectedNode.stateOwnershipEn}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              ✓ {isVi ? "Tuân thủ nghiêm ngặt nguyên tắc Single Source of Truth, không xảy ra xung đột trạng thái." : "Strictly follows Single Source of Truth principles, preventing state contention."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
