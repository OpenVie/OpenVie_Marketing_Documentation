import Link from "next/link";

const endpoints = [
  {
    method: "GET",
    path: "/api/health",
    description: "Kiểm tra trạng thái hoạt động của API.",
  },
  {
    method: "POST",
    path: "/api/auth/login",
    description: "Xác thực người dùng và lấy thông tin đăng nhập.",
  },
  {
    method: "GET",
    path: "/api/users",
    description: "Lấy danh sách người dùng.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold tracking-tight">
            OpenVie <span className="text-cyan-400">API</span>
          </Link>

          <nav className="flex gap-6 text-sm text-slate-300">
            <a href="#getting-started" className="hover:text-cyan-400">
              Bắt đầu
            </a>
            <a href="#reference" className="hover:text-cyan-400">
              API Reference
            </a>
            <a
              href="https://swaggerapi.qtitpc.dev/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-400"
            >
              Swagger UI ↗
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Developer Documentation
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Tích hợp OpenVie API
            <span className="text-cyan-400"> dễ dàng hơn.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Tài liệu dành cho lập trình viên: tìm hiểu API, cách xác thực,
            cấu trúc request và response, cùng các ví dụ tích hợp.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#getting-started"
              className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Bắt đầu ngay
            </a>

            <a
              href="https://swaggerapi.qtitpc.dev/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:border-cyan-400"
            >
              Mở Swagger UI
            </a>
          </div>
        </div>
      </section>

      <section
        id="getting-started"
        className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 md:grid-cols-3"
      >
        {[
          {
            number: "01",
            title: "Getting Started",
            description: "Tìm hiểu cấu hình và các bước bắt đầu tích hợp API.",
          },
          {
            number: "02",
            title: "Authentication",
            description: "Tìm hiểu cơ chế xác thực trước khi gọi API.",
          },
          {
            number: "03",
            title: "API Reference",
            description: "Tra cứu endpoint, tham số và dữ liệu trả về.",
          },
        ].map((item) => (
          <article
            key={item.number}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <p className="text-sm font-semibold text-cyan-400">
              {item.number}
            </p>
            <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
            <p className="mt-3 leading-7 text-slate-400">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section
        id="reference"
        className="mx-auto max-w-7xl px-6 pb-20"
      >
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Explore endpoints
          </p>
          <h2 className="mt-2 text-3xl font-bold">API Reference</h2>
          <p className="mt-3 text-slate-400">
            Một số endpoint minh họa cho bố cục tài liệu.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800">
          {endpoints.map((endpoint) => (
            <article
              key={endpoint.path}
              className="flex flex-col gap-3 border-b border-slate-800 bg-slate-900 p-5 last:border-b-0 md:flex-row md:items-center"
            >
              <span
                className={`w-fit rounded-md px-3 py-1 text-xs font-bold ${
                  endpoint.method === "GET"
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-blue-400/10 text-blue-400"
                }`}
              >
                {endpoint.method}
              </span>

              <code className="text-sm font-semibold text-slate-100 md:w-56">
                {endpoint.path}
              </code>

              <p className="text-sm leading-6 text-slate-400">
                {endpoint.description}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-4 text-sm text-amber-300">
          Lưu ý: Các endpoint ở trên chỉ là dữ liệu minh họa giao diện,
          chưa được xác minh là endpoint thực tế của OpenVie.
        </p>
      </section>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        OpenVie API Documentation · Developer Resources
      </footer>
    </main>
  );
}
