import ApiReference from "@/components/ApiReference";
import DocumentationFooter from "@/components/DocumentationFooter";
import DocumentationHeader from "@/components/DocumentationHeader";
import DocumentationSidebar from "@/components/DocumentationSidebar";

const landingSections = [
  { href: "#getting-started", number: "01", title: "Getting Started", description: "Tìm hiểu cấu hình và các bước bắt đầu tích hợp API." },
  { href: "#authentication", number: "02", title: "Authentication", description: "Tìm hiểu cơ chế xác thực trước khi gọi API." },
  { href: "#reference", number: "03", title: "API Reference", description: "Tra cứu endpoint, tham số và dữ liệu trả về." },
];

export default function Home() {
  return (
    <main className="ov-docs-shell h-dvh overflow-hidden bg-slate-950 text-slate-100">
      <a className="ov-skip-link" href="#main-content">Bỏ qua điều hướng</a>
      <DocumentationHeader />

      <div className="mx-auto grid h-[calc(100dvh-69px)] max-w-[1440px] lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 lg:px-6">
        <DocumentationSidebar />
        <div id="main-content" className="ov-docs-content h-full min-w-0 overflow-y-auto overscroll-contain" tabIndex={-1}>
          <section className="px-6 py-16 sm:py-20 lg:px-0">
            <div className="max-w-none">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-lime-300">Developer Documentation</p>
              <h1 className="text-4xl font-bold leading-tight md:whitespace-nowrap md:text-[clamp(2rem,3vw,3.75rem)]">
                Tích hợp OpenVie API <span className="text-lime-300">dễ dàng hơn.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                Tài liệu dành cho lập trình viên: tìm hiểu API, cách xác thực, cấu trúc request và response, cùng các ví dụ tích hợp.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#getting-started" className="rounded-lg bg-lime-300 px-5 py-3 font-semibold text-slate-950 hover:bg-lime-200">Bắt đầu ngay</a>
              </div>
            </div>
          </section>

          <section className="grid gap-4 px-6 pb-16 md:grid-cols-3 lg:px-0">
            {landingSections.map((item) => (
              <a key={item.number} href={item.href} className="ov-landing-card rounded-xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm font-semibold text-lime-300">{item.number}</p>
                <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 leading-7 text-slate-400">{item.description}</p>
              </a>
            ))}
          </section>

          <section id="getting-started" className="ov-docs-section mx-6 scroll-mt-24 rounded-xl border border-slate-800 p-6 lg:mx-0">
            <p className="text-sm font-semibold text-lime-300">GETTING STARTED</p>
            <h2 className="mt-2 text-2xl font-bold">Bắt đầu tích hợp</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-400">
              <li>Chọn endpoint phù hợp trong API Reference.</li>
              <li>Chuẩn bị thông tin xác thực cho mỗi request.</li>
              <li>Gửi request và đối chiếu response mẫu.</li>
            </ol>
          </section>

          <section id="authentication" className="ov-docs-section mx-6 mt-6 scroll-mt-24 rounded-xl border border-slate-800 p-6 lg:mx-0">
            <p className="text-sm font-semibold text-lime-300">AUTHENTICATION</p>
            <h2 className="mt-2 text-2xl font-bold">Xác thực request</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-400">
              Thêm thông tin xác thực theo cấu hình của môi trường trước khi gọi endpoint. Kiểm tra phần request và response của từng API để biết dữ liệu cần gửi.
            </p>
          </section>

          <section id="reference" className="scroll-mt-24 px-6 py-16 lg:px-0">
            <ApiReference />
          </section>
          <DocumentationFooter />
        </div>
      </div>
    </main>
  );
}
