import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LandingContent } from "@/lib/landing";
import LandingMotion from "@/components/LandingMotion";
import ArchitectureBaseMap from "@/components/ArchitectureBaseMap";
import ApiCodeShowcase from "@/components/ApiCodeShowcase";
import TypingHeadline from "@/components/TypingHeadline";

function ArrowUpRight() {
  return <span aria-hidden="true" className="text-lg leading-none">↗</span>;
}

function Check() {
  return <span aria-hidden="true" className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1fb6ff] text-xs font-black text-[#08203d]">✓</span>;
}

function SectionHeading({
  eyebrow,
  title,
  body,
  light = false,
  className,
  bodyClassName,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: string;
  light?: boolean;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div data-ov-reveal className={`max-w-3xl ${className ?? ""}`}>
      <p className={`mb-4 text-xs font-extrabold uppercase tracking-[0.18em] ${light ? "text-sky-300" : "text-[#0785c5]"}`}>
        {eyebrow}
      </p>
      <h2 className={`text-balance text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl ${light ? "text-white" : "text-[#0b1f3a]"}`}>
        {title}
      </h2>
      {body && <p className={`mt-5 max-w-2xl text-base leading-8 sm:text-lg ${light ? "text-slate-300" : "text-slate-600"} ${bodyClassName ?? ""}`}>{body}</p>}
    </div>
  );
}

export default function MarketingLandingBase({ content }: { content: LandingContent }) {
  const vi = content.locale === "vi";
  const wordmark = vi ? "Nền tảng tri thức doanh nghiệp" : "Enterprise knowledge platform";
  const heroTitle = content.hero.h1.split("—");
  // Docs and Blog are primary destinations, not secondary links to hide in a visual refresh.
  const primaryNav = content.nav;

  return (
    <div className="ov-landing min-h-screen overflow-x-hidden bg-[#f7faff] text-[#0b1f3a] selection:bg-[#1fb6ff] selection:text-[#08203d]">
      <LandingMotion />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[100] focus:rounded-full focus:bg-[#0b1f3a] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white">
        {vi ? "Đi đến nội dung chính" : "Skip to main content"}
      </a>

      <header className="sticky top-0 z-50 border-b border-slate-900/[0.07] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-5 sm:px-8">
          <Link href={content.locale === "vi" ? "/" : "/en"} className="flex min-w-0 items-center gap-3" aria-label="OpenVie home">
            <Image src="/openvie-logo.svg" alt="" width={38} height={38} priority className="h-9 w-9 rounded-xl shadow-[0_8px_20px_rgba(31,182,255,.18)]" />
            <span className="hidden sm:block">
              <b className="block text-[15px] font-black tracking-[-0.03em] text-[#0b1f3a]">OpenVie</b>
              <span className="block text-[10px] font-semibold text-slate-500">{wordmark}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label={vi ? "Điều hướng chính" : "Main navigation"}>
            {primaryNav.map((item) => (
              <a key={item.href} href={item.href} className="whitespace-nowrap rounded-full px-2 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-[#0b1f3a] xl:px-2.5 xl:text-xs">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-bold sm:flex">
              <Link href="/" className={`rounded-full px-2.5 py-1 ${vi ? "bg-[#0b1f3a] text-white" : "text-slate-500"}`}>VI</Link>
              <Link href="/en" className={`rounded-full px-2.5 py-1 ${!vi ? "bg-[#0b1f3a] text-white" : "text-slate-500"}`}>EN</Link>
            </div>
            <a href={content.hero.ctaPrimary.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#0b1f3a] px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_8px_18px_rgba(11,31,58,.18)] transition hover:-translate-y-0.5 hover:bg-[#0785c5] sm:px-5 sm:text-sm">
              {content.ctaPrimary.label}<ArrowUpRight />
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_78%_10%,#d5ecff_0,transparent_31%),radial-gradient(circle_at_8%_88%,#e9e3ff_0,transparent_30%),linear-gradient(135deg,#fff_0%,#f4f9ff_58%,#eef4ff_100%)] pb-16 pt-16 sm:pb-24 sm:pt-24">
          <div className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(11,31,58,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(11,31,58,.055)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.03fr_.97fr] lg:gap-10">
            <div data-ov-reveal className="max-w-2xl">
              <h1 className={`whitespace-pre-line text-balance font-black leading-[1.12] tracking-[-0.065em] text-[#0b1f3a] ${vi ? "text-[2.25rem] sm:text-[2.4rem] lg:text-[2.75rem]" : "text-4xl sm:text-5xl lg:text-[4rem]"}`}>
                {heroTitle[0]}
                {heroTitle[1] && <span className={`mt-2 block bg-gradient-to-r from-[#0785c5] via-[#1fb6ff] to-[#3567d6] bg-clip-text text-transparent ${vi ? "text-[1.16em]" : ""}`}>{vi ? <TypingHeadline /> : heroTitle.slice(1).join("—")}</span>}
              </h1>
              <p className="mt-7 max-w-xl text-pretty text-base leading-8 text-slate-600 sm:text-lg">{content.hero.sub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={content.hero.ctaPrimary.href} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-[#0b1f3a] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_16px_28px_rgba(11,31,58,.2)] transition hover:-translate-y-0.5 hover:bg-[#0785c5]">
                  {content.hero.ctaPrimary.label}
                </a>
                <a href={content.hero.ctaSecondary.href} className="inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-bold text-[#0b1f3a] transition hover:border-[#1fb6ff] hover:bg-white">
                  {content.hero.ctaSecondary.label}
                </a>
              </div>
              <div className="mt-9 flex flex-wrap gap-2">
                {content.hero.badges.map((badge) => <span key={badge} className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-[11px] font-bold text-slate-600">{badge}</span>)}
              </div>
            </div>

            <div data-ov-reveal data-ov-delay className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
              <div className="ov-hero-glow absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-[#1fb6ff]/25 via-[#b9ddff]/20 to-[#7466e8]/20 blur-2xl" />
              <div className="ov-product-panel relative overflow-hidden rounded-[1.75rem] border border-slate-300 bg-white p-0 shadow-[0_30px_75px_rgba(11,31,58,.28)]">
                <div className="flex h-10 items-center gap-2 border-b border-slate-200 bg-[#f6f6f8] px-4" aria-hidden="true">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 h-5 flex-1 rounded-md bg-white/80" />
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="block aspect-video w-full object-cover"
                  aria-label="OpenVie product demonstration video"
                >
                  <source src="/Demo1.mp4" type="video/mp4" />
                </video>
                <div className="hidden flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#1fb6ff]" /><span className="text-xs font-bold text-white">OpenVie workspace</span></div>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-sky-200">Private knowledge</span>
                </div>
                <div className="hidden mt-5 grid gap-4 sm:grid-cols-[1fr_160px]">
                  <div className="rounded-2xl bg-white p-4 shadow-xl">
                    <p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#0785c5]">{vi ? "Truy vấn có căn cứ" : "Grounded query"}</p>
                    <p className="mt-3 text-sm font-bold leading-6 text-[#0b1f3a]">{vi ? "Tóm tắt các quyết định cần phê duyệt hôm nay" : "Summarize today's decisions requiring approval"}</p>
                    <div className="mt-4 rounded-xl bg-[#edf7ff] p-3 text-xs leading-5 text-slate-600">
                      <b className="text-[#0369a1]">{vi ? "Câu trả lời có nguồn" : "Cited answer"}</b>
                      <br />{vi ? "Hệ thống chỉ trả lời từ tài liệu được phê duyệt." : "Answers only use documents you have approved."}
                    </div>
                    <div className="mt-3 flex gap-2"><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">[S1]</span><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">[S2]</span></div>
                  </div>
                  <div className="space-y-3">
                    {content.stats.slice(0, 3).map((stat) => <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[.06] p-3"><b className="block text-lg font-black tracking-tight text-white">{stat.value}</b><span className="mt-1 block text-[10px] leading-4 text-slate-300">{stat.label}</span></div>)}
                  </div>
                </div>
                <div className="hidden mt-4 grid grid-cols-3 gap-2">
                  {content.proof.slice(0, 3).map((proof) => <div key={proof.label} className="rounded-xl border border-white/10 bg-white/[.045] p-2.5 text-center text-[10px] font-semibold leading-4 text-sky-100">{proof.label}</div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div data-ov-reveal className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
            {content.stats.map((stat) => <div key={stat.label} className="px-4 py-6 text-center sm:px-5"><b className="block text-xl font-black tracking-[-.04em] text-[#0b1f3a] sm:text-2xl">{stat.value}</b><span className="mt-1.5 block text-[11px] font-medium leading-4 text-slate-500">{stat.label}</span></div>)}
          </div>
        </section>

        <section id="co-che" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHeading eyebrow={vi ? "Vận hành có kiểm soát" : "Controlled operation"} title={vi ? <>Câu trả lời đáng tin cậy.<br />Dữ liệu luôn trong tầm kiểm soát.</> : <>Trustworthy answers.<br />Data always under control.</>} body={vi ? "OpenVie giúp doanh nghiệp khai thác thông tin nội bộ rõ ràng, an toàn và có trách nhiệm." : "OpenVie helps organizations use internal information clearly, safely, and responsibly."} className="max-w-none" bodyClassName="max-w-none" />
            <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
              {content.issues.map((issue, index) => <article data-ov-reveal key={issue.title} className="grid gap-4 py-7 md:grid-cols-[88px_1fr_minmax(220px,.75fr)] md:gap-8"><span className="text-4xl font-black tracking-[-.07em] text-[#b7ddf6]">0{index + 1}</span><div><h3 className="text-xl font-black tracking-[-.03em] text-[#0b1f3a]">{issue.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{issue.body}</p></div>{issue.note && <p className="border-l-2 border-[#1fb6ff] pl-4 text-sm italic leading-6 text-slate-500 md:self-center">{issue.note}</p>}</article>)}
            </div>
          </div>
        </section>

        <section id="kien-truc" className="relative overflow-hidden bg-[#071832] py-20 sm:py-28">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:46px_46px]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHeading light eyebrow={vi ? "Bản đồ hệ thống" : "System map"} title={content.arch.title} body={content.arch.intro} />
            <div data-ov-reveal data-ov-delay className="mt-12">
              <ArchitectureBaseMap locale={content.locale} />
            </div>
          </div>
        </section>

        <section id="nang-luc" className="bg-[#edf6ff] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8"><SectionHeading eyebrow={vi ? "Năng lực cốt lõi" : "Core capabilities"} title={vi ? "Mỗi năng lực có chỗ đứng rõ ràng trong một nền tảng thống nhất." : "Every capability has a clear role in one unified platform."} />
            <div className="mt-12 grid gap-4 md:grid-cols-2">{content.capabilities.map((capability, index) => { const isFeatured = index === 0 || index === 3; return <article data-ov-reveal key={capability.title} className={`group rounded-[1.35rem] border p-6 transition sm:p-7 ${isFeatured ? "bg-[#0b1f3a] text-white shadow-[0_20px_50px_rgba(11,31,58,.16)]" : "border-slate-200 bg-white hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"}`}><div className="flex items-start justify-between gap-4"><span className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-black ${isFeatured ? "bg-[#1fb6ff] text-[#08203d]" : "bg-[#e5f5ff] text-[#0785c5]"}`}>0{index + 1}</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${isFeatured ? "bg-white/10 text-sky-200" : "bg-sky-50 text-[#0785c5]"}`}>{capability.status}</span></div><h3 className={`mt-8 text-xl font-black tracking-[-.03em] ${isFeatured ? "text-white" : "text-[#0b1f3a]"}`}>{capability.title}</h3><p className={`mt-3 text-sm leading-7 ${isFeatured ? "text-slate-300" : "text-slate-600"}`}>{capability.body}</p></article>})}</div>
          </div>
        </section>

        <section id="bao-mat" className="bg-white py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.78fr_1.22fr]"><SectionHeading eyebrow={vi ? "Quyền kiểm soát thuộc về bạn" : "Control stays with you"} title={vi ? "Bảo mật không phải lớp trang trí phía sau AI." : "Security is not a decorative layer behind AI."} body={content.enterprise.intro} /><div className="grid gap-3 sm:grid-cols-2">{content.enterprise.items.map((item) => <div data-ov-reveal key={item.label} className="rounded-2xl border border-slate-200 bg-[#fbfdff] p-5"><Check /><h3 className="mt-5 text-base font-black text-[#0b1f3a]">{item.label}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p></div>)}</div></div>
        </section>

        <section id="api" className="bg-[#f7f1ff] py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 sm:px-8"><SectionHeading eyebrow={vi ? "Mở để tích hợp" : "Open for integration"} title={vi ? "Một lõi headless cho mọi trải nghiệm phía trước." : "One headless core for every experience ahead."} body={content.api.intro} /><ApiCodeShowcase blocks={content.api.codeBlocks} /><div data-ov-reveal className="mt-6 flex flex-wrap items-center gap-2">{content.api.events.slice(0, 7).map((event) => <span key={event} className="rounded-full border border-[#cabfff] bg-white/70 px-3 py-1.5 font-mono text-[11px] font-bold text-[#554c9d]">{event}</span>)}</div></div></section>

        <section id="trien-khai" className="bg-white py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 sm:px-8"><SectionHeading eyebrow={vi ? "Bắt đầu theo cách của bạn" : "Start on your terms"} title={vi ? "Từ triển khai đến vận hành, mọi bước đều minh bạch." : "From deployment to operation, every step stays transparent."} /><div className="mt-12 grid gap-5 md:grid-cols-3">{content.steps.map((step, index) => <article data-ov-reveal key={step.title} className="relative rounded-2xl border border-slate-200 bg-[#fbfdff] p-6"><span className="text-4xl font-black tracking-[-.07em] text-[#c9e9ff]">0{index + 1}</span><h3 className="mt-8 text-lg font-black text-[#0b1f3a]">{step.title}</h3>{step.body && <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>}{step.checklist && <p className="mt-4 rounded-xl bg-white p-3 text-xs font-semibold leading-5 text-slate-500">{step.checklist}</p>}</article>)}</div></div></section>

        <section id="giay-phep" className="bg-[#0b1f3a] py-20 sm:py-28"><div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_.85fr]"><SectionHeading light eyebrow={vi ? "Mở, minh bạch, tự chủ" : "Open, transparent, sovereign"} title={content.license.title} body={content.license.intro} /><div data-ov-reveal data-ov-delay className="rounded-[1.5rem] bg-white p-6 shadow-2xl sm:p-8"><ul className="space-y-4">{content.license.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><Check />{item}</li>)}</ul><div className="mt-7 rounded-xl bg-[#edf7ff] p-4"><b className="text-sm text-[#0b1f3a]">{content.license.calloutTitle}</b><p className="mt-2 text-sm leading-6 text-slate-600">{content.license.calloutBody}</p></div></div></div></section>

        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_0%,#c9eaff_0,transparent_33%),linear-gradient(135deg,#edf7ff,#f7f1ff)] py-20 sm:py-28"><div data-ov-reveal className="mx-auto max-w-4xl px-5 text-center sm:px-8"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#0785c5]">OpenVie</p><h2 className="mt-5 text-balance text-4xl font-black tracking-[-.05em] text-[#0b1f3a] sm:text-5xl">{content.finalCta.title}</h2><p className="mx-auto mt-5 max-w-none whitespace-nowrap text-sm leading-8 text-slate-600 sm:text-base">{content.finalCta.body}</p><div className="mt-8 flex flex-wrap justify-center gap-3"><a href={content.finalCta.primary.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0b1f3a] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0785c5]">{content.finalCta.primary.label}<ArrowUpRight /></a><a href={content.finalCta.secondary.href} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-[#0b1f3a] transition hover:border-[#1fb6ff]">{content.finalCta.secondary.label}</a></div></div></section>
      </main>

      <footer className="bg-[#071832] py-12 text-slate-300"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-9 sm:flex-row"><div><div className="flex items-center gap-3"><Image src="/openvie-logo.svg" alt="" width={34} height={34} className="rounded-lg" /><b className="text-lg font-black text-white">OpenVie</b></div><p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">{content.footer.pathNote}</p></div><div className="grid grid-cols-2 gap-8 sm:grid-cols-3">{content.footer.columns.map((column) => <nav key={column.title}><b className="text-xs uppercase tracking-[.14em] text-sky-200">{column.title}</b><ul className="mt-4 space-y-2">{column.links.slice(0, 4).map((link) => <li key={link.label}><a href={link.href} className="text-sm text-slate-400 transition hover:text-white">{link.label}</a></li>)}</ul></nav>)}</div></div><div className="pt-6 text-xs text-slate-500">{content.footer.licenseLine}</div></div></footer>
    </div>
  );
}
