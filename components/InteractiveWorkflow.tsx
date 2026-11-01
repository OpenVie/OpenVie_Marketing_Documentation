"use client";

import { useState } from "react";

interface WorkflowStep {
  title: string;
  role: string;
  sla: string;
  description: string;
}

export default function InteractiveWorkflow({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const [simulationState, setSimulationState] = useState<"pending" | "approved" | "rejected" | "escalated">("approved");
  const isVi = locale === "vi";

  const steps: WorkflowStep[] = [
    {
      title: isVi ? "1. Khởi tạo & Tải lên" : "1. Draft & Upload",
      role: "MEMBER / ADMIN",
      sla: isVi ? "Kiểm tra SHA-256" : "SHA-256 Check",
      description: isVi
        ? "Văn bản (PDF, DOCX...) được kiểm tra mã độc ClamAV và gắn trạng thái PENDING_STAGE1."
        : "Document scanned by ClamAV malware quarantine and assigned PENDING_STAGE1 status.",
    },
    {
      title: isVi ? "2. Thẩm định Cấp 1" : "2. Stage 1 Review",
      role: "WORKSPACE_ADMIN",
      sla: isVi ? "SLA 24h nhắc nhở" : "24h Reminder SLA",
      description: isVi
        ? "Quản trị viên workspace rà soát nội dung. Luật chống tự phê duyệt ngăn người tải lên tự duyệt."
        : "Workspace Admin vets document content. Anti-self-approval rule prevents author from self-approving.",
    },
    {
      title: isVi ? "3. Phê duyệt Cấp 2" : "3. Stage 2 Approval",
      role: "ORG_OWNER",
      sla: isVi ? "SLA 48h leo thang" : "48h Escalation SLA",
      description: isVi
        ? "Chủ quản tổ chức ra quyết định cuối cùng. Bản ghi phê duyệt được ký số vào audit log."
        : "Organization Owner issues the final verdict. Decision is signed into an immutable audit log.",
    },
    {
      title: isVi ? "4. Xuất bản & Hấp thụ RAG" : "4. Published & Ingested",
      role: "Flowable Engine",
      sla: isVi ? "Thời gian thực" : "Real-time",
      description: isVi
        ? "Trạng thái đổi thành APPROVED, RabbitMQ bắn sự kiện CDC sang Lakehouse và kích hoạt tạo Vector/Graph."
        : "Status changes to APPROVED, RabbitMQ triggers CDC to Lakehouse, activating vector & graph indexing.",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#080d09]/90 backdrop-blur-xl p-5 md:p-6 shadow-2xl ring-1 ring-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#c8f03a]">
            {isVi ? "Quy trình e-Office chuẩn BPMN nhúng" : "Embedded BPMN e-Office Workflow"}
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            {isVi ? "Kiểm soát Vòng đời Văn bản Nội bộ 2 Cấp Nghiêm ngặt" : "Strict 2-Stage Internal Document Lifecycle Control"}
          </h3>
        </div>

        {/* Interactive state switches */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setSimulationState("approved")}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              simulationState === "approved"
                ? "bg-[#c8f03a] text-[#0b1a0f] shadow-md shadow-[#c8f03a]/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isVi ? "Mô phỏng Phê duyệt ✓" : "Simulate Approval ✓"}
          </button>
          <button
            type="button"
            onClick={() => setSimulationState("rejected")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              simulationState === "rejected"
                ? "bg-red-500 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isVi ? "Mô phỏng Từ chối ✕" : "Simulate Reject ✕"}
          </button>
          <button
            type="button"
            onClick={() => setSimulationState("escalated")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              simulationState === "escalated"
                ? "bg-amber-400 text-slate-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isVi ? "Mô phỏng Leo thang SLA ⏱" : "Simulate SLA Escalation ⏱"}
          </button>
        </div>
      </div>

      {/* 4 Steps Visual Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
              idx === 3 && simulationState === "rejected"
                ? "bg-red-950/20 border-red-500/30"
                : idx === 2 && simulationState === "escalated"
                ? "bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/10"
                : "bg-[#0b140d]/80 border-white/10 hover:border-[#c8f03a]/40"
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                <span className="text-xs font-mono font-bold text-[#c8f03a] bg-[#c8f03a]/15 border border-[#c8f03a]/30 px-2 py-0.5 rounded">
                  {step.role}
                </span>
                <span className="text-[11px] text-slate-400">{step.sla}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Trạng thái:</span>
              {idx === 0 && <span className="text-[#c8f03a] font-mono font-bold">INIT_DONE</span>}
              {idx === 1 && <span className="text-[#c8f03a] font-mono font-bold">VETTED</span>}
              {idx === 2 && (
                <span
                  className={`font-mono font-bold ${
                    simulationState === "escalated"
                      ? "text-amber-400"
                      : simulationState === "rejected"
                      ? "text-red-400"
                      : "text-[#c8f03a]"
                  }`}
                >
                  {simulationState === "escalated"
                    ? "ESCALATED (48h)"
                    : simulationState === "rejected"
                    ? "REJECTED"
                    : "APPROVED"}
                </span>
              )}
              {idx === 3 && (
                <span
                  className={`font-mono font-bold ${
                    simulationState === "rejected" ? "text-red-400" : "text-[#c8f03a]"
                  }`}
                >
                  {simulationState === "rejected" ? "ARCHIVED_REJECTED" : "KNOWLEDGE_ACTIVE"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log & Webhook Banner */}
      <div className="mt-5 p-3.5 rounded-xl bg-black/50 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-[#c8f03a] font-mono font-bold">✓ Audit Trail:</span>
          <span>
            {isVi
              ? "Mọi hành động phê duyệt ghi nhận: Người duyệt, thời gian, IP, chữ ký số và phát sự kiện webhook.approved."
              : "All actions recorded: Reviewer ID, timestamp, IP, cryptographic hash, and webhook.approved dispatch."}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#c8f03a] bg-[#c8f03a]/15 px-2.5 py-0.5 rounded border border-[#c8f03a]/30 font-bold">
          X-OpenVie-Signature: HMAC-SHA256
        </span>
      </div>
    </div>
  );
}
