# OpenVie — Documentation + Marketing

Site tĩnh **Next.js 16 (App Router)** gồm landing marketing theo khung
`MARKETING_GUIDE.md` (S0–S12) và tài liệu API phong cách Spotify.

- **Nguồn API duy nhất: `api-docs.json` tại gốc repo** (OpenAPI 3.1, xuất từ
  Swagger `/v3/api-docs` của backend). Tài liệu và playground đọc trực tiếp
  file này — không route nào gọi server khi runtime.
- Cập nhật tài liệu khi backend thay đổi: xuất JSON mới từ Swagger và **thay
  file `api-docs.json`** — mọi trang cập nhật theo ngay ở lần build sau.
- Playground "Try it out" luôn trả mock tĩnh: `lib/mock.ts` sinh JSON theo
  schema (deterministic, seeded), có mô phỏng độ trễ, không có request mạng.

## Routes

| Route              | Mục đích                                             |
| ------------------ | ----------------------------------------------------- |
| `/`                | Landing marketing VI (khối S0–S12 theo MARKETING_GUIDE) |
| `/en`              | Bản đối xứng EN 1:1 của landing (cùng component, content bank riêng) |
| `/docs`            | API Reference (Spotify-style, JSON block thay bảng)   |
| `/api/openapi`     | Export JSON của `api-docs.json` (cho Postman/codegen) |
| `/opengraph-image` | Thẻ share tự sinh (ImageResponse + BeVietnam Pro)     |
| `/sitemap.xml`     | Sitemap (file convention của Next 16)                 |
| `/robots.txt`      | robots (chặn `/api/openapi`)                          |

## Development

```bash
npm run dev       # http://localhost:3000
npm run build     # production build — toàn bộ route prerender static
```

Đặt `NEXT_PUBLIC_BASE_URL` khi build cho domain production (ảnh hưởng tới
`metadataBase`, canonical, sitemap): ví dụ
`NEXT_PUBLIC_BASE_URL=https://docs.openvie.vn npm run build`.

## Cấu trúc chính

```
api-docs.json              # NGUỒN OpenAPI duy nhất (thay file này để cập nhật docs)
app/
  page.tsx                 # landing VI — wrapper mỏng quanh MarketingLanding
  en/page.tsx              # landing EN — mirror 1:1 (cùng component)
  docs/page.tsx            # tài liệu API (server component)
  api/openapi/route.ts     # export JSON cho Postman/codegen
  opengraph-image.tsx      # OG image dạng chữ, chỉ claim trong whitelist
  sitemap.ts / robots.ts   # SEO chuẩn Next 16
components/
  MarketingLanding.tsx     # server component render S0–S12 (nav+footer internal)
  CodeBlock.tsx            # "use client" — code block tĩnh, nút copy
lib/
  landing.ts               # content bank VI/EN của landing (copy + anchor M1–M30)
  openapi.ts               # parser OpenAPI (extract, group tag, anchor, slug)
  mock.ts                  # mock engine deterministic, zero network
  routes.ts                # base URL + route map (title/description M1, sitemap, hreflang)
.opencode/skills/          # web-design-guidelines, react-best-practices, nextjs-seo
```

## Quy ước giao diện

- **Không dùng bảng trong API reference**: tham số/schema vẽ dạng dòng dựng
  đứng (`ov-spine-*`) kèm code block JSON (`ov-json-*`).
- Docs mặc định dark (`#121212`, accent `#1ED760`); sáng/tối qua
  `data-ov-theme` (ThemeToggle, lưu `localStorage`).
- Landing dùng accent thương hiệu lime `#c8f53c`; class riêng tiền tố
  `.ls-*` để không lẫn token của hai vùng.
- Landing copy: VI là nguồn, EN đối xứng 1:1; mọi phát biểu tra được về
  `MARKETING_GUIDE.md` ma trận M1–M30; lệnh code copy nguyên văn từ
  `README.md` / `docs/DEPLOYMENT.md` / `docs/INTEGRATION.md` của repo
  sản phẩm; chip trạng thái 4 mức (Đã có / Tùy chọn — tắt theo mặc
  định / Vận hành tự cấu hình / Chưa có); không link ngoài chưa xác minh.
