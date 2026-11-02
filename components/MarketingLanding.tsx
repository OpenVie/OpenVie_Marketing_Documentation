"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LandingContent, StatusKey } from "@/lib/landing";
import CodeBlock from "@/components/CodeBlock";
import HeroCanvas from "@/components/HeroCanvas";
import InteractiveRagDemo from "@/components/InteractiveRagDemo";
import InteractiveArchitecture from "@/components/InteractiveArchitecture";
import InteractiveWorkflow from "@/components/InteractiveWorkflow";
import { FacebookIcon } from "@/components/BlogChrome";
type ChipStatus = StatusKey | "no";

const STATUS_LABELS: Record<LandingContent["locale"], Record<ChipStatus, string>> = {
  vi: {
    daco: "Sẵn sàng sản xuất",
    option: "Mô-đun tùy chọn",
    op: "Vận hành tự cấu hình",
    no: "Kiến trúc mở",
  },
  en: {
    daco: "Production Ready",
    option: "Modular Extension",
    op: "Operator Configured",
    no: "Open Architecture",
  },
};

const FRAMES: Record<
  LandingContent["locale"],
  {
    issues: { eyebrow: string; title: string; sub: string };
    cap: { eyebrow: string; title: string; sub: string };
    sec: { eyebrow: string; title: string };
    api: { eyebrow: string; title: string };
    deploy: { eyebrow: string; title: string };
    optionalText: string;
    archEyebrow: string;
    boundEyebrow: string;
    boundIntro: string;
    roadEyebrow: string;
    licEyebrow: string;
  }
> = {
  vi: {
    issues: {
      eyebrow: "Giải pháp Cốt lõi",
      title: "Ba Thách thức Lớn của Doanh nghiệp — Lời giải từ OpenVie",
      sub: "Không quảng cáo mơ hồ: Đây là các cơ chế kỹ thuật thực tế vận hành trong repo, mỗi phát biểu đều được kiểm chứng trong tài liệu kiến trúc.",
    },
    cap: {
      eyebrow: "Năng lực Nền tảng",
      title: "Các Năng lực Cấp Doanh nghiệp Tích hợp Sẵn",
      sub: "Toàn bộ tính năng được tối ưu cho ngôn ngữ tiếng Việt và tuân thủ các tiêu chuẩn lưu trữ nội bộ khắt khe.",
    },
    sec: { eyebrow: "Bảo mật & Chủ quyền", title: "Dữ liệu Nội bộ, Hạ tầng Tự sở hữu Tuyệt đối" },
    api: { eyebrow: "API & Tích hợp", title: "Lõi Headless — 100% Năng lực qua Chuẩn HTTP JSON" },
    deploy: { eyebrow: "Khởi động Nhanh", title: "Ba Bước để Triển khai Stack trên Máy chủ của Bạn" },
    optionalText: "Mô-đun",
    archEyebrow: "Kiến trúc & Luồng Dữ liệu",
    boundEyebrow: "Tiêu chuẩn & Cam kết",
    boundIntro:
      "Kiến trúc mở, minh bạch và trao toàn quyền tự chủ công nghệ vào tay đội ngũ kỹ sư của bạn.",
    roadEyebrow: "Cột mốc Phát triển",
    licEyebrow: "Mã nguồn Mở & Giấy phép",
  },
  en: {
    issues: {
      eyebrow: "Core Solutions",
      title: "Three Critical Enterprise Challenges — Solved by OpenVie",
      sub: "No vague claims: Concrete technical mechanisms running in the repo, fully verifiable in architectural docs.",
    },
    cap: {
      eyebrow: "Platform Capabilities",
      title: "Integrated Enterprise-Grade Capabilities",
      sub: "Optimized specifically for Vietnamese and engineered to satisfy strict private infrastructure requirements.",
    },
    sec: { eyebrow: "Security & Sovereignty", title: "Internal Data, Your Own Private Infrastructure" },
    api: { eyebrow: "API & Integration", title: "Headless Core — 100% Exposed via HTTP JSON" },
    deploy: { eyebrow: "Quick Deployment", title: "Three Steps to Launch on Your Own Servers" },
    optionalText: "Module",
    archEyebrow: "Architecture & Data Plane",
    boundEyebrow: "Standards & Guarantees",
    boundIntro:
      "Open, transparent architecture delivering complete technological sovereignty to your engineering team.",
    roadEyebrow: "Release Milestones",
    licEyebrow: "Open Source & License",
  },
};

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.34-.012 2.42-.012 2.749 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z"
      />
    </svg>
  );
}

function StatusChip({ status, text }: { status: ChipStatus; text: string }) {
  let badgeColor = "bg-[#1FB6FF]/15 text-[#38BDF8] border-[#1FB6FF]/30";
  if (status === "option") {
    badgeColor = "bg-amber-500/15 text-amber-300 border-amber-500/30";
  } else if (status === "op") {
    badgeColor = "bg-white/10 text-slate-200 border-white/20";
  } else if (status === "no") {
    badgeColor = "bg-[#149FE3]/15 text-[#38BDF8] border-[#149FE3]/30";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
      {text}
    </span>
  );
}

export default function MarketingLanding({ content }: { content: LandingContent }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const vi = content.locale === "vi";
  const frames = FRAMES[content.locale];
  const statusText = STATUS_LABELS[content.locale];
  const copiedLabel = vi ? "Đã sao chép ✓" : "Copied ✓";

  const [h1Lead, h1Tail] = content.hero.h1.split("—");
  const hasTail = Boolean(h1Tail);
  useEffect(() => {
    document.documentElement.lang = content.htmlLang;
  }, [content.htmlLang]);


  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-[#1FB6FF] selection:text-slate-950">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1FB6FF] focus:text-slate-950 focus:font-bold focus:rounded-lg focus:shadow-xl"
      >
        {vi ? "Bỏ qua điều hướng đến nội dung chính" : "Skip to main content"}
      </a>

      {/* S0 — Sticky Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="OpenVie Homepage">
            <Image
              src="/openvie-logo.svg"
              alt="OpenVie logo"
              width={36}
              height={36}
              priority
              className="h-9 w-9 rounded-[10px] shadow-md shadow-[#1FB6FF]/25 group-hover:scale-105 transition-transform"
            />
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              OpenVie
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#1FB6FF]/20 text-[#1FB6FF] border border-[#1FB6FF]/30">
                v0.3.1
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" aria-label={vi ? "Điều hướng chính" : "Main navigation"}>
            {content.nav.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Nav Actions (Lang switch + Deploy CTA) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <nav className="inline-flex rounded-full bg-slate-900 border border-white/10 p-0.5 text-xs font-bold shrink-0" aria-label="Language selection">
              <Link
                href="/"
                className={`px-2.5 py-1 rounded-full transition ${
                  content.locale === "vi"
                    ? "bg-[#1FB6FF] text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                VI
              </Link>
              <Link
                href="/en"
                className={`px-2.5 py-1 rounded-full transition ${
                  content.locale === "en"
                    ? "bg-[#1FB6FF] text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </Link>
            </nav>

            <a
              href={content.ctaPrimary.href}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden sm:inline-flex h-9 items-center gap-2 rounded-full bg-gradient-to-r from-[#1FB6FF] to-[#38BDF8] px-4 text-xs font-extrabold text-[#082F49] shadow-md shadow-[#1FB6FF]/20 hover:shadow-[#1FB6FF]/40 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 leading-none"
            >
              <GithubIcon className="h-4 w-4 shrink-0" />
              <span>{content.ctaPrimary.label}</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-slate-300 hover:text-white"
              aria-label={content.menuLabel}
              aria-expanded={mobileMenuOpen}
            >
              <span className="text-base">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-slate-950/95 px-4 py-4 space-y-2 backdrop-blur-2xl">
            {content.nav.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/5 rounded-lg"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-white/10">
              <a
                href={content.ctaPrimary.href}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full h-10 items-center justify-center gap-2 rounded-xl bg-[#1FB6FF] text-[#082F49] font-bold text-sm whitespace-nowrap"
              >
                <GithubIcon className="h-4 w-4 shrink-0" />
                <span>{content.ctaPrimary.label}</span>
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="main" tabIndex={-1} className="focus:outline-none">
        {/* S1 — Hero Section with Dynamic Canvas */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-white/10">
          <HeroCanvas />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badges strip */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {content.hero.badges.map((badge, idx) => (
                  <span
                    key={badge}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
                      idx === 0
                        ? "bg-[#1FB6FF]/15 border-[#1FB6FF]/40 text-[#38BDF8]"
                        : "bg-slate-900/60 border-white/10 text-slate-300"
                    }`}
                  >
                    {idx === 0 && <span className="h-2 w-2 rounded-full bg-[#1FB6FF] animate-pulse" />}
                    {badge}
                  </span>
                ))}
              </div>

              {/* H1 Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {h1Lead}
                </span>
                {hasTail && (
                  <span className="block mt-2 bg-gradient-to-r from-[#1FB6FF] via-[#38BDF8] to-[#38BDF8] bg-clip-text text-transparent">
                    {h1Tail}
                  </span>
                )}
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                {content.hero.sub}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href={content.hero.ctaPrimary.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#1FB6FF] to-[#38BDF8] px-7 py-3.5 text-sm font-extrabold text-[#082F49] shadow-xl shadow-[#1FB6FF]/25 hover:shadow-[#1FB6FF]/45 hover:scale-105 active:scale-95 transition-all"
                >
                  <GithubIcon className="h-4 w-4" />
                  {content.hero.ctaPrimary.label}
                </a>
                <a
                  href={content.hero.ctaSecondary.href}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/15 px-6 py-3.5 text-sm font-bold text-white hover:border-[#1FB6FF]/40 transition-all"
                >
                  <span>📖</span>
                  {content.hero.ctaSecondary.label}
                </a>
              </div>
            </div>

            {/* LIVE INTERACTIVE RAG DEMO SHOWCASE */}
            <div className="mt-14 max-w-5xl mx-auto">
              <InteractiveRagDemo locale={content.locale} />
            </div>

            {/* Production Quickstart Snippet */}
            <div className="mt-8 max-w-3xl mx-auto">
              <CodeBlock
                chrome
                label={content.hero.kickerLabel}
                lines={content.hero.kicker}
                copiedLabel={copiedLabel}
              />
            </div>
          </div>
        </section>

        {/* S2 — High Impact Stats & Proof Bar */}
        <section className="border-b border-white/10 bg-slate-950/60 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              {content.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 backdrop-blur-sm hover:border-[#1FB6FF]/30 transition-colors"
                >
                  <dt className="text-2xl lg:text-3xl font-black tracking-tight text-white bg-gradient-to-tr from-[#1FB6FF] to-[#38BDF8] bg-clip-text text-transparent">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs font-medium text-slate-400 leading-snug">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Proof links row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 pt-6 border-t border-white/5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
                {vi ? "Hệ sinh thái công nghệ:" : "Core Technology Stack:"}
              </span>
              {content.proof.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-semibold text-slate-300 hover:text-[#38BDF8] hover:border-[#1FB6FF]/40 transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1FB6FF]" />
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* S3 — Business Challenges & Mechanisms */}
        <section id="co-che" className="py-20 border-b border-white/10 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1FB6FF] mb-2">
                {frames.issues.eyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {frames.issues.title}
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                {frames.issues.sub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.issues.map((issue, index) => (
                <article
                  key={issue.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#1FB6FF]/40 hover:shadow-xl hover:shadow-[#1FB6FF]/5 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-3xl font-black text-slate-700 group-hover:text-[#1FB6FF]/80 transition-colors">
                        0{index + 1}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1FB6FF]/15 text-[#38BDF8] border border-[#1FB6FF]/30">
                        {vi ? "Cơ chế kiểm chứng" : "Verified Mechanism"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
                      {issue.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                      {issue.body}
                    </p>
                  </div>

                  {issue.note && (
                    <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-[#1FB6FF] shrink-0 mt-0.5">💡</span>
                      <span>{issue.note}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* S4 — Transparent System Architecture */}
        <section id="kien-truc" className="py-20 border-b border-white/10 bg-slate-950/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1FB6FF] mb-2">
                {frames.archEyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {content.arch.title}
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                {content.arch.intro}
              </p>
            </div>

            {/* Interactive Architecture Blueprint */}
            <InteractiveArchitecture locale={content.locale} />

            {/* Data Ownership Grid */}
            <div className="mt-14 pt-10 border-t border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>🛡️</span>
                {content.arch.ownershipTitle}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {content.arch.ownership.map((row) => (
                  <div
                    key={row.owner}
                    className="rounded-xl border border-white/10 bg-slate-900/60 p-4 flex flex-col justify-between"
                  >
                    <div>
                      <b className="text-sm font-bold text-[#38BDF8] block mb-2">{row.owner}</b>
                      <p className="text-xs text-slate-300 leading-relaxed">{row.duties}</p>
                    </div>
                    <span className="mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                      Single Source of Truth
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-right text-xs text-slate-500 font-mono">{content.arch.footnote}</p>
            </div>
          </div>
        </section>

        {/* S5 — Core Capabilities (Modern Bento Grid) */}
        <section id="nang-luc" className="py-20 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1FB6FF] mb-2">
                {frames.cap.eyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {frames.cap.title}
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                {frames.cap.sub}
              </p>

              {/* Status Legend */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <StatusChip status="daco" text={statusText.daco} />
                <StatusChip status="option" text={statusText.option} />
                <StatusChip status="op" text={statusText.op} />
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {content.capabilities.map((cap, idx) => (
                <article
                  key={cap.title}
                  className={`rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#1FB6FF]/40 hover:shadow-lg transition-all ${
                    idx === 0 || idx === 1 ? "md:col-span-1 lg:col-span-2 bg-gradient-to-b from-slate-900/60 to-slate-950/80" : ""
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        #{String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <StatusChip status={cap.status} text={statusText[cap.status]} />
                        {cap.secondaryStatus && cap.secondaryLabel && (
                          <StatusChip status={cap.secondaryStatus} text={statusText[cap.secondaryStatus]} />
                        )}
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                      {cap.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {cap.body}
                    </p>
                  </div>

                  {cap.secondaryLabel && (
                    <div className="mt-4 pt-3 border-t border-white/5 text-xs text-amber-300/90 font-medium">
                      💡 {cap.secondaryLabel}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* S6 — Enterprise Security, Operations & Workflow */}
        <section id="bao-mat" className="py-20 border-b border-white/10 bg-slate-950/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1FB6FF] mb-2">
                {frames.sec.eyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {frames.sec.title}
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                {content.enterprise.intro}
              </p>
            </div>

            {/* Interactive BPMN Workflow Simulator */}
            <div className="mb-14">
              <InteractiveWorkflow locale={content.locale} />
            </div>

            {/* 6 Security Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {content.enterprise.items.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-[#1FB6FF]/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <b className="text-sm font-bold text-white">{item.label}</b>
                      {item.status && <StatusChip status={item.status} text={statusText[item.status]} />}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.body}</p>
                  </div>
                  <div className="mt-3 pt-2 text-[11px] text-[#1FB6FF] font-mono">
                    ✓ {vi ? "Tiêu chuẩn doanh nghiệp" : "Enterprise Grade"}
                  </div>
                </div>
              ))}
            </div>

            {/* Sovereign Callout */}
            <div className="mt-8 rounded-2xl border border-[#1FB6FF]/30 bg-[#0F172A]/20 p-5 md:p-6 text-sm text-slate-200 flex flex-col sm:flex-row items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1FB6FF]/20 text-[#38BDF8] font-bold border border-[#1FB6FF]/30 text-lg">
                🔒
              </span>
              <div>
                <b className="text-white block font-bold text-base mb-1">{content.enterprise.calloutTitle}</b>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">{content.enterprise.calloutBody}</p>
              </div>
            </div>
          </div>
        </section>

        {/* S7 — Headless API & Developer Integration */}
        <section id="api" className="py-20 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1FB6FF] mb-2">
                {frames.api.eyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {frames.api.title}
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                {content.api.intro}
              </p>
            </div>

            {/* Code Blocks Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {content.api.codeBlocks.map((block) => (
                <div key={block.label} className="flex flex-col">
                  <CodeBlock label={block.label} lines={block.lines} copiedLabel={copiedLabel} chrome />
                </div>
              ))}
            </div>

            {/* Webhook Events Band */}
            <div className="mt-12 rounded-2xl border border-white/10 bg-slate-950/70 p-6">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <span>⚡</span>
                {content.api.eventsTitle}
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {content.api.events.map((event) => (
                  <code
                    key={event}
                    className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-white/10 text-[#38BDF8]"
                  >
                    {event}
                  </code>
                ))}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{content.api.eventsNote}</p>
            </div>

            {/* Link to Interactive OpenAPI Playground */}
            <div className="mt-8">
              <Link
                href={content.api.docsHref}
                className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#1FB6FF]/30 bg-gradient-to-r from-[#0F172A]/30 via-slate-900/60 to-slate-950 p-6 hover:border-[#1FB6FF] transition-all shadow-lg hover:shadow-[#1FB6FF]/10"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1FB6FF] font-bold text-xs uppercase tracking-wider">
                      OpenAPI 3.1 Spec
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1FB6FF]" />
                  </div>
                  <h4 className="text-lg font-bold text-white mt-1 group-hover:text-[#38BDF8] transition-colors">
                    {content.api.docsLabel}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">{content.api.docsNote}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1FB6FF] text-slate-950 font-black text-lg group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* S8 — Enterprise Standards & Data Sovereignty */}
        <section id="ranh-gioi" className="py-20 border-b border-white/10 bg-slate-950/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1FB6FF] mb-2">
                {frames.boundEyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {content.boundaries.title}
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                {frames.boundIntro}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ready Capabilities */}
              <div className="rounded-2xl border border-[#1FB6FF]/30 bg-[#0F172A]/10 p-6 sm:p-7 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-[#1FB6FF]/20">
                  <span className="text-[#1FB6FF] font-bold">✓</span>
                  {content.boundaries.haveTitle}
                </h3>
                <ul className="space-y-3">
                  {content.boundaries.have.map((item) => (
                    <li key={item} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2.5 leading-relaxed">
                      <span className="text-[#1FB6FF] font-bold mt-0.5 shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Architectural Freedom */}
              <div className="rounded-2xl border border-[#38BDF8]/30 bg-[#1FB6FF]/5 p-6 sm:p-7 backdrop-blur-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-[#38BDF8]/20">
                  <span className="text-[#1FB6FF] font-bold">⚡</span>
                  {content.boundaries.notTitle}
                </h3>
                <ul className="space-y-3">
                  {content.boundaries.not.map((item) => (
                    <li key={item} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2.5 leading-relaxed">
                      <span className="text-[#1FB6FF] font-bold mt-0.5 shrink-0">⚡</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Trust Quote */}
            {content.boundaries.quotes.map((quote) => (
              <blockquote
                key={quote.text}
                className="mt-8 rounded-2xl border-l-4 border-[#1FB6FF] bg-slate-900/80 p-5 sm:p-6 text-sm sm:text-base font-medium text-slate-200 italic shadow-xl"
              >
                &ldquo;{quote.text}&rdquo;
              </blockquote>
            ))}

            <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/40 p-4 text-xs text-slate-400">
              <b className="text-slate-200 block mb-1 font-bold">{content.boundaries.optionalCalloutTitle}</b>
              <p>{content.boundaries.optionalCalloutBody}</p>
            </div>
          </div>
        </section>

        {/* S9 — 3-Step Production Deployment */}
        <section id="trien-khai" className="py-20 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1FB6FF] mb-2">
                {frames.deploy.eyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {frames.deploy.title}
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                {vi
                  ? "Sẵn sàng chạy trên máy chủ vật lý, VPS hoặc cụm private cloud với một câu lệnh Docker Compose duy nhất."
                  : "Ready for on-premise hardware, private VPS, or VPC clusters with a single Docker Compose command."}
              </p>
            </div>

            {/* 3 Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.steps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                    {step.body && <p className="text-xs text-slate-300 leading-relaxed mb-4">{step.body}</p>}
                  </div>
                  <CodeBlock lines={step.code} copiedLabel={copiedLabel} chrome />
                </div>
              ))}
            </div>

            {/* Extra Code Block (Ollama Pull) */}
            {content.extraCode && (
              <div className="mt-8 max-w-3xl mx-auto">
                <CodeBlock
                  chrome
                  label={content.extraCode.label}
                  lines={content.extraCode.lines}
                  copiedLabel={copiedLabel}
                />
              </div>
            )}

            {/* GitHub repository entry point */}
            <div className="mt-8 max-w-3xl mx-auto">
              <a
                href={content.ctaPrimary.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#1FB6FF]/30 bg-gradient-to-r from-[#0F172A]/60 via-slate-900/60 to-slate-950 p-6 hover:border-[#1FB6FF] transition-all shadow-lg hover:shadow-[#1FB6FF]/10"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1FB6FF] text-[#082F49] shadow-md shadow-[#1FB6FF]/25">
                    <GithubIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                      {vi ? "Mã nguồn trên GitHub — OpenVie/OpenVie" : "Source on GitHub — OpenVie/OpenVie"}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      {vi
                        ? "Clone kho mã nguồn, đọc hướng dẫn triển khai và theo dõi tiến độ phát hành."
                        : "Clone the repository, read the deployment guide, and follow release progress."}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-2 text-xs font-bold text-[#1FB6FF]">
                  github.com/OpenVie/OpenVie
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1FB6FF]/15 border border-[#1FB6FF]/30 font-black text-base group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              </a>
            </div>

            {/* Enterprise Deployment Support Banner */}
            <div className="mt-4 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1FB6FF]">
                      {vi ? "Hỗ trợ Triển khai Doanh nghiệp" : "Enterprise Deployment Support"}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1FB6FF]" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {vi
                      ? "Cần tư vấn kiến trúc hoặc hỗ trợ kỹ thuật triển khai?"
                      : "Need architectural guidance or on-premise deployment assistance?"}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {vi
                      ? "Chúng tôi đồng hành hỗ trợ doanh nghiệp và cơ quan nhà nước triển khai hệ thống RAG an toàn trên hạ tầng on-premise & private cloud. Hãy nhắn tin trực tiếp với chúng tôi qua Facebook."
                      : "We assist enterprises and public institutions with sovereign on-premise & private cloud RAG deployment. Contact our engineering team directly on Facebook."}
                  </p>
                </div>
                <a
                  href="https://www.facebook.com/profile.php?id=61595728591443"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white px-4 py-2.5 text-xs font-bold shrink-0 transition-colors shadow-md shadow-[#1877f2]/20"
                >
                  <FacebookIcon className="h-4 w-4 fill-white" />
                  <span>{vi ? "Nhắn tin Facebook" : "Contact Facebook"}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* S10 — Roadmap & Release Milestones */}
        <section id="lo-trinh" className="py-20 border-b border-white/10 bg-slate-950/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1FB6FF] mb-2">
                {frames.roadEyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {content.roadmap.title}
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                {content.roadmap.intro}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.roadmap.rows.map((row) => (
                <div
                  key={row.version}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm font-bold text-[#1FB6FF] bg-[#0F172A]/50 border border-[#1FB6FF]/30 px-2 py-0.5 rounded">
                        {row.version}
                      </span>
                      <span className="text-[11px] font-semibold text-[#38BDF8] bg-[#1FB6FF]/10 px-2 py-0.5 rounded-full border border-[#1FB6FF]/20">
                        {row.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{row.scope}</p>
                  </div>
                  <span className="mt-4 pt-2 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                    ✓ Verified in Repository
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href="https://github.com/OpenVie/OpenVie/blob/main/CHANGELOG.md"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1FB6FF] hover:underline"
              >
                <span>📋</span>
                <span>{vi ? "Xem chi tiết các thay đổi trong CHANGELOG.md →" : "View detailed release notes in CHANGELOG.md →"}</span>
              </a>
            </div>
          </div>
        </section>

        {/* S11 — Open Source Community & License */}
        <section id="giay-phep" className="py-20 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-xs font-bold uppercase tracking-widest text-[#1FB6FF] mb-2">
                  {frames.licEyebrow}
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {content.license.title}
                </h2>
                <p className="mt-4 text-base text-slate-400 leading-relaxed">
                  {content.license.intro}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 sm:p-8 space-y-4">
                <ul className="space-y-3">
                  {content.license.items.map((item) => (
                    <li key={item} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2.5 leading-relaxed">
                      <span className="text-[#1FB6FF] font-bold shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-white/10">
                  <b className="text-sm font-bold text-white block mb-1">{content.license.calloutTitle}</b>
                  <p className="text-xs text-slate-400 leading-relaxed">{content.license.calloutBody}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-slate-950 to-[#020617]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {content.finalCta.title}
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {content.finalCta.body}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={content.finalCta.primary.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#1FB6FF] to-[#38BDF8] px-7 py-3.5 text-sm font-extrabold text-[#082F49] shadow-xl shadow-[#1FB6FF]/25 hover:shadow-[#1FB6FF]/45 hover:scale-105 active:scale-95 transition-all"
              >
                <GithubIcon className="h-4 w-4" />
                {content.finalCta.primary.label}
              </a>
              <Link
                href={content.finalCta.secondary.href}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-white/15 px-6 py-3.5 text-sm font-bold text-white hover:border-[#1FB6FF]/40 transition-all"
              >
                <span>📖</span>
                {content.finalCta.secondary.label}
              </Link>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto pt-1">
              {vi
                ? "Tổ chức cần hỗ trợ kỹ thuật & tư vấn triển khai? "
                : "Need technical guidance & deployment consultation? "}
              <a
                href="https://www.facebook.com/profile.php?id=61595728591443"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#1FB6FF] font-bold hover:underline"
              >
                {vi ? "Liên hệ Facebook →" : "Contact on Facebook →"}
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* S12 — Elevated Footer */}
      <footer className="border-t border-white/10 bg-[#020617] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            {/* Brand column */}
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/openvie-logo.svg"
                  alt="OpenVie logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-lg shadow-sm shadow-[#1FB6FF]/20"
                />
                <span className="text-lg font-bold text-white tracking-tight">OpenVie</span>
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                {content.footer.pathNote}
              </p>
            </div>

            {/* Links columns */}
            {content.footer.columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("#") ? (
                        <a href={link.href} className="text-xs text-slate-400 hover:text-[#1FB6FF] transition-colors">
                          {link.label}
                        </a>
                      ) : link.href.startsWith("http") ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#1FB6FF] transition-colors"
                        >
                          {link.href.includes("facebook.com") ? (
                            <FacebookIcon className="h-3.5 w-3.5 fill-current" />
                          ) : (
                            <GithubIcon className="h-3.5 w-3.5" />
                          )}
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className="text-xs text-slate-400 hover:text-[#1FB6FF] transition-colors">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <p>{content.footer.licenseLine}</p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61595728591443"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 hover:text-[#1FB6FF] transition-colors"
              >
                <FacebookIcon className="h-3.5 w-3.5 fill-current" />
                Facebook
              </a>
              <span aria-hidden="true">·</span>
              <p className="font-mono">OpenVie • Vietnamese-First Sovereign RAG</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
