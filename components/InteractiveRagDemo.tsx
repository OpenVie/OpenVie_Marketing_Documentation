"use client";

import { useState } from "react";

interface Citation {
  id: string;
  sourceDoc: string;
  page: number;
  confidence: number;
  excerpt: string;
}

interface DemoScenario {
  id: string;
  category: string;
  question: string;
  questionEn: string;
  pipelineStages: { name: string; detail: string; status: "success" | "warning" }[];
  answerVi: string;
  answerEn: string;
  citations: Citation[];
  isAbstention?: boolean;
}

const SCENARIOS: DemoScenario[] = [
  {
    id: "bpmn-approval",
    category: "Quy trình e-Office",
    question: "Quy trình xin phê duyệt tài liệu nội bộ cấp 2 được thực hiện như thế nào?",
    questionEn: "How is the 2-stage internal document approval workflow executed?",
    pipelineStages: [
      { name: "Truy hồi hỗn hợp (Dense + BM25 + Đồ thị Kùzu)", detail: "Tìm thấy 3 đoạn tài liệu đối sánh", status: "success" },
      { name: "Kiểm tra quyền hạn & Dung hợp RRF", detail: "Tenant lọc ORG_OWNER / WORKSPACE_ADMIN", status: "success" },
      { name: "Suy luận Ollama Vylinh 3B", detail: "Đính kèm trích dẫn kiểm chứng", status: "success" },
    ],
    answerVi:
      "Tài liệu nội bộ sau khi soạn thảo được gửi vào quy trình phê duyệt 2 cấp [S1] chạy trên engine Flowable BPMN nhúng. Cấp 1 do WORKSPACE_ADMIN thẩm định sơ bộ; sau khi được duyệt, hệ thống tự động leo thang lên Cấp 2 do ORG_OWNER phê duyệt quyết định cuối [S2]. Quy định áp dụng chống tự phê duyệt (văn bản của chính mình phải do người khác duyệt) và có SLA mặc định nhắc nhở 24h / leo thang 48h.",
    answerEn:
      "Internal documents follow a 2-stage approval workflow [S1] powered by an embedded Flowable BPMN engine. Stage 1 requires review by the WORKSPACE_ADMIN; upon approval, it escalates to Stage 2 for final decision by the ORG_OWNER [S2]. Anti-self-approval rules prevent authors from approving their own documents, governed by a default 24h reminder / 48h escalation SLA.",
    citations: [
      {
        id: "S1",
        sourceDoc: "Quy-che-phe-duyet-tai-lieu-v2.pdf",
        page: 8,
        confidence: 98.7,
        excerpt:
          "Điều 4.2: Toàn bộ văn bản quy chuẩn trước khi xuất bản vào kho tri thức chung phải trải qua quy trình thẩm định 2 cấp trên hệ sinh thái BPMN nhúng...",
      },
      {
        id: "S2",
        sourceDoc: "So-tay-van-hanh-eOffice-2026.docx",
        page: 15,
        confidence: 97.4,
        excerpt:
          "Cấp 1 do Quản trị Không gian làm việc (WORKSPACE_ADMIN) xét duyệt, Cấp 2 do Chủ quản Tổ chức (ORG_OWNER) phê chuẩn cuối cùng trước khi cấp quyền truy xuất RAG...",
      },
    ],
  },
  {
    id: "data-privacy",
    category: "Bảo mật & Chủ quyền",
    question: "Chính sách lưu trữ và cách ly dữ liệu giữa các workspace ra sao?",
    questionEn: "What is the workspace isolation and data residency policy?",
    pipelineStages: [
      { name: "Lọc Multi-tenant trên Qdrant & Kùzu", detail: "Áp dụng tenant_id bắt buộc trên truy vấn", status: "success" },
      { name: "Xác thực danh tính Keycloak OIDC", detail: "Suy luận quyền hạn từ membership sống", status: "success" },
      { name: "Mã hóa luồng dữ liệu mTLS", detail: "Kết nối an toàn giữa Spring và FastAPI", status: "success" },
    ],
    answerVi:
      "OpenVie thực thi nguyên tắc cách ly dữ liệu đa tầng tuyệt đối [S1]. Mọi truy vấn Vector trên Qdrant và Đồ thị tri thức Kùzu đều bắt buộc lọc theo tenant_id và workspace_id được suy ra từ membership sống của phiên xác thực Keycloak OIDC [S2]. Toàn bộ dữ liệu tệp gốc và Lakehouse Parquet lưu trữ trên cụm SeaweedFS S3 nội bộ của bạn, không gửi bất kỳ byte dữ liệu nào ra mạng bên ngoài.",
    answerEn:
      "OpenVie enforces strict multi-tenant data isolation [S1]. All vector searches in Qdrant and knowledge graph queries in Kùzu are rigidly filtered by tenant_id and workspace_id derived from live Keycloak OIDC memberships [S2]. Raw files and Snappy Parquet partitions remain on your private SeaweedFS S3 cluster with zero external network leakage.",
    citations: [
      {
        id: "S1",
        sourceDoc: "Architecture-Security-Whitepaper.pdf",
        page: 12,
        confidence: 99.1,
        excerpt:
          "Mục 5.1 Phân lập Tenant: Các chỉ mục Vector Qdrant và Kùzu Graph luôn được phân vùng cứng theo định danh tổ chức và không gian làm việc...",
      },
      {
        id: "S2",
        sourceDoc: "Keycloak-OIDC-Specification.md",
        page: 4,
        confidence: 96.8,
        excerpt:
          "Phiên làm việc sử dụng JWT xoay vòng kèm PKCE S256, vai trò IdP ánh xạ trực tiếp vào 3 cấp RBAC mà không tin cậy client headers...",
      },
    ],
  },
  {
    id: "lakehouse-olap",
    category: "Lakehouse & DuckDB",
    question: "Cách hệ thống chạy báo cáo phân tích mà không làm nghẽn database chính?",
    questionEn: "How does the platform execute analytical reports without blocking OLTP?",
    pipelineStages: [
      { name: "CDC Streaming qua RabbitMQ", detail: "Đồng bộ thay đổi sang SeaweedFS S3", status: "success" },
      { name: "Nén Snappy Parquet theo phân vùng", detail: "Tổ chức tenant/năm/tháng", status: "success" },
      { name: "DuckDB OLAP Engine nhúng", detail: "Truy vấn phân tích độc lập với PostgreSQL", status: "success" },
    ],
    answerVi:
      "Hệ thống ứng dụng kiến trúc Lakehouse hiện đại [S1]: Mọi sự kiện nghiệp vụ được thu thập liên tục (CDC) qua RabbitMQ và ghi thành các tệp Parquet nén Snappy trên SeaweedFS S3. Khi người dùng hoặc hệ thống chạy báo cáo phân tích, engine DuckDB nhúng sẽ thực thi trực tiếp trên Parquet [S2], tách biệt 100% tài nguyên và không gây ảnh hưởng đến hiệu năng ghi chép của PostgreSQL OLTP.",
    answerEn:
      "The platform implements an open Lakehouse architecture [S1]: Business events stream via RabbitMQ CDC and are serialized into Snappy Parquet on SeaweedFS S3. Analytical queries are handled by an embedded DuckDB OLAP engine directly on Parquet files [S2], keeping the transactional PostgreSQL database completely free from contention.",
    citations: [
      {
        id: "S1",
        sourceDoc: "Lakehouse-Analytics-Architecture.md",
        page: 3,
        confidence: 98.2,
        excerpt:
          "Kiến trúc CDC tách luồng ghi chép OLTP và truy vấn OLAP; RabbitMQ làm buffer chuyển đổi trạng thái sang Parquet...",
      },
      {
        id: "S2",
        sourceDoc: "DuckDB-Integration-Guide.pdf",
        page: 7,
        confidence: 97.9,
        excerpt:
          "DuckDB nhúng phân tích trực tiếp trên bộ nhớ đệm Parquet, cho tốc độ xử lý hàng triệu bản ghi trong mili-giây mà không lock table PostgreSQL...",
      },
    ],
  },
  {
    id: "abstention-demo",
    category: "Cơ chế Từ chối (Abstention)",
    question: "Dự báo thời tiết và giá vàng ngày mai tại Hà Nội như thế nào?",
    questionEn: "What is the weather forecast and gold price in Hanoi tomorrow?",
    pipelineStages: [
      { name: "Truy hồi không gian tri thức nội bộ", detail: "Điểm tương đồng < ngưỡng tin cậy 0.65", status: "warning" },
      { name: "Kích hoạt bộ kiểm định Abstention", detail: "Phát hiện thiếu chứng cứ thực tế", status: "warning" },
      { name: "Ngăn chặn Hallucination", detail: "Từ chối suy đoán và thông báo minh bạch", status: "success" },
    ],
    answerVi:
      "⚠️ [Cơ chế Từ chối Thông minh — Abstention]: Hệ thống không tìm thấy bất kỳ tài liệu nào trong kho tri thức nội bộ của tổ chức có chứa thông tin về dự báo thời tiết hoặc giá vàng. Theo nguyên tắc an toàn dữ liệu của OpenVie, hệ thống từ chối đưa ra suy đoán để đảm bảo tính chính xác và loại bỏ hoàn toàn hiện tượng ảo giác (hallucination).",
    answerEn:
      "⚠️ [Intelligent Abstention Triggered]: No relevant documents were found in your organization's internal knowledge base regarding weather forecasts or market prices. Under OpenVie's enterprise reliability policy, the system explicitly abstains from answering rather than hallucinating speculative answers.",
    citations: [],
    isAbstention: true,
  },
];

export default function InteractiveRagDemo({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);
  const [activeCitationId, setActiveCitationId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"visual" | "json">("visual");
  const [copied, setCopied] = useState(false);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];
  const isVi = locale === "vi";

  const handleCopy = () => {
    const textToCopy = isVi ? scenario.answerVi : scenario.answerEn;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedAnswer = (text: string) => {
    const parts = text.split(/(\[S\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(S\d+)\]/);
      if (match) {
        const citationId = match[1];
        const isSelected = activeCitationId === citationId;
        return (
          <button
            key={index}
            type="button"
            onClick={() => setActiveCitationId(isSelected ? null : citationId)}
            className={`inline-flex items-center px-2 py-0.5 mx-1 rounded text-xs font-black transition-all duration-200 ${
              isSelected
                ? "bg-[#1FB6FF] text-[#082F49] shadow-[0_0_14px_rgba(31,182,255,0.6)] scale-105 ring-2 ring-[#1FB6FF]"
                : "bg-[#1FB6FF]/15 text-[#1FB6FF] border border-[#1FB6FF]/40 hover:bg-[#1FB6FF]/30"
            }`}
            title={isVi ? `Xem trích dẫn nguồn ${citationId}` : `View citation ${citationId}`}
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const selectedCitation = scenario.citations.find((c) => c.id === activeCitationId);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0F172A]/90 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/5">
      {/* Header Bar with Mac style window dots */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0F172A]/80 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-[#1FB6FF] inline-block shadow-[0_0_8px_rgba(31,182,255,0.5)]" />
          </div>
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#1FB6FF] animate-pulse" />
            {isVi ? "Trải nghiệm Tương tác RAG — Luồng Truy hồi & Trích dẫn Thực tế" : "Interactive RAG Showcase — Live Retrieval & Citation Flow"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-black/40 p-0.5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("visual")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                viewMode === "visual"
                  ? "bg-[#1FB6FF] text-[#082F49] font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isVi ? "Giao diện" : "Visual"}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("json")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                viewMode === "json"
                  ? "bg-[#1FB6FF] text-[#082F49] font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              SSE JSON
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition"
          >
            {copied ? (isVi ? "Đã chép ✓" : "Copied ✓") : (isVi ? "Sao chép" : "Copy")}
          </button>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="border-b border-white/10 bg-[#0F172A]/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          {isVi ? "Chọn kịch bản nghiệp vụ để kiểm tra:" : "Select a business scenario to inspect:"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SCENARIOS.map((item) => {
            const isSelected = item.id === activeScenarioId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveScenarioId(item.id);
                  setActiveCitationId(null);
                }}
                className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#1FB6FF]/15 border-[#1FB6FF]/70 text-white shadow-lg shadow-[#1FB6FF]/10 ring-1 ring-[#1FB6FF]/40"
                    : "bg-black/30 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`font-semibold text-[11px] uppercase tracking-wide px-1.5 py-0.5 rounded ${
                      item.isAbstention
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-[#1FB6FF]/20 text-[#1FB6FF]"
                    }`}
                  >
                    {item.category}
                  </span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#1FB6FF] shadow-[0_0_6px_#1FB6FF]" />}
                </div>
                <p className="line-clamp-2 font-medium mt-1 text-slate-200">
                  {isVi ? item.question : item.questionEn}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pipeline Status Indicator */}
      <div className="bg-[#0F172A]/70 border-b border-white/5 px-5 py-3">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-slate-300">
            {isVi ? "Các tầng xử lý thời gian thực:" : "Real-time Processing Stages:"}
          </span>
          <span className="text-[11px] text-[#1FB6FF] font-mono font-bold">TTFT &lt; 45ms • 100% On-Premise Sovereign</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {scenario.pipelineStages.map((stage, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs ${
                stage.status === "warning"
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-200"
                  : "bg-black/30 border-white/5 text-slate-300"
              }`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  stage.status === "warning" ? "bg-amber-500/20 text-amber-300" : "bg-[#1FB6FF]/20 text-[#1FB6FF]"
                }`}
              >
                {stage.status === "warning" ? "!" : "✓"}
              </span>
              <div>
                <b className="block text-slate-100 font-medium">{stage.name}</b>
                <span className="text-[11px] text-slate-400">{stage.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Question & Answer (8 cols) */}
        <div className={scenario.citations.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {isVi ? "Câu hỏi của người dùng:" : "User Query:"}
            </span>
            <div className="bg-[#0F172A] border border-white/10 rounded-xl p-3.5 text-sm font-semibold text-white flex items-center gap-2">
              <span className="text-[#1FB6FF] font-mono font-bold">Q:</span>
              <span>{isVi ? scenario.question : scenario.questionEn}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {isVi ? "Phản hồi có kiểm chứng từ OpenVie:" : "Verified Response from OpenVie:"}
              </span>
              {scenario.citations.length > 0 && (
                <span className="text-[11px] text-[#1FB6FF]">
                  {isVi ? "Nhấp vào [S1], [S2] để xem nguồn tài liệu" : "Click [S1], [S2] to inspect sources"}
                </span>
              )}
            </div>

            {viewMode === "visual" ? (
              <div
                className={`rounded-xl border p-4 text-sm leading-relaxed ${
                  scenario.isAbstention
                    ? "bg-amber-950/20 border-amber-500/30 text-amber-100"
                    : "bg-[#0F172A]/80 border-white/10 text-slate-200"
                }`}
              >
                {renderFormattedAnswer(isVi ? scenario.answerVi : scenario.answerEn)}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/90 p-3.5 font-mono text-xs text-[#1FB6FF] overflow-x-auto max-h-56 custom-scrollbar">
                <pre>{JSON.stringify(
                  {
                    event: "message.completed",
                    sessionId: "demo-sess-2026",
                    content: isVi ? scenario.answerVi : scenario.answerEn,
                    isAbstention: Boolean(scenario.isAbstention),
                    citations: scenario.citations.map(c => ({
                      tag: c.id,
                      document: c.sourceDoc,
                      page: c.page,
                      confidence: c.confidence
                    })),
                    runtime: {
                      engine: "Spring Boot + FastAPI",
                      model: "Ollama/Vylinh-3B",
                      retrieval: "Qdrant + BM25 + Kuzu"
                    }
                  },
                  null,
                  2
                )}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Citation Inspector (4 cols) */}
        {scenario.citations.length > 0 && (
          <div className="lg:col-span-4 flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
              <span>{isVi ? "Xác minh Trích dẫn" : "Citation Inspector"}</span>
              <span className="text-slate-500 font-mono text-[10px]">{scenario.citations.length} nguồn</span>
            </span>

            <div className="flex-1 bg-[#0F172A]/80 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between">
              {selectedCitation ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1FB6FF] text-[#082F49] text-xs font-black shadow-sm">
                      [{selectedCitation.id}]
                    </span>
                    <span className="text-[11px] font-mono text-[#1FB6FF] font-bold">
                      {selectedCitation.confidence}% khớp
                    </span>
                  </div>

                  <div>
                    <b className="text-xs text-white block truncate" title={selectedCitation.sourceDoc}>
                      📄 {selectedCitation.sourceDoc}
                    </b>
                    <span className="text-[11px] text-slate-400">Trang: {selectedCitation.page} • Định dạng: PDF/DOCX</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300 italic border-l-2 border-l-[#1FB6FF]">
                    &ldquo;{selectedCitation.excerpt}&rdquo;
                  </div>

                  <p className="text-[10px] text-slate-500">
                    ✓ {isVi ? "Đã đối chiếu SHA-256 và kiểm tra quyền truy cập" : "SHA-256 verified with workspace tenant policy"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 h-full text-slate-400">
                  <span className="text-2xl mb-1.5 opacity-60">🔍</span>
                  <p className="text-xs font-medium text-slate-300">
                    {isVi ? "Chưa chọn trích dẫn" : "No citation selected"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {isVi
                      ? "Nhấp vào nhãn [S1] hoặc [S2] ở câu trả lời bên cạnh để xem trích đoạn và độ tin cậy."
                      : "Click on [S1] or [S2] inside the answer to view source excerpt and confidence."}
                  </p>
                  <div className="mt-3 flex gap-2">
                    {scenario.citations.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveCitationId(c.id)}
                        className="px-2.5 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-[#1FB6FF] border border-[#1FB6FF]/30 font-bold"
                      >
                        Mở [{c.id}]
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
