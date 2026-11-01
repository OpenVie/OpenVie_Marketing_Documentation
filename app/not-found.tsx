import Link from "next/link";

export default function NotFound() {
  return (
    <main className="ov-docs-shell grid min-h-dvh place-items-center px-6 text-slate-100">
      <div className="text-center">
        <p className="ov-hero-eyebrow">404</p>
        <h1 className="text-4xl font-bold tracking-tight">Không tìm thấy trang</h1>
        <p className="mt-4 text-slate-400">
          Đường dẫn này không tồn tại — hoặc tài liệu API đã dời sang một URL
          chuẩn hoá.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link className="ov-cta" href="/">Về trang chủ</Link>
          <Link className="ov-cta-secondary" href="/docs">Mở API docs</Link>
        </div>
      </div>
    </main>
  );
}
