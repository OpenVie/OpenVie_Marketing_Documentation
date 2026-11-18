/**
 * Landing copy bank — every statement maps to an anchor in the OpenVie docs
 * (README.md, docs/*.md) per the marketing brief message matrix (M1–M30).
 * VI is the source copy; the EN tree mirrors it 1:1 block by block.
 * High-conversion marketing copy: authoritative, confident, enterprise-grade,
 * presenting OpenVie's sovereign self-hosted RAG architecture as a prime strength.
 */

export type StatusKey = "daco" | "option" | "op";

export interface CodeBlock {
  label: string;
  lines: string[];
}

export interface LandingContent {
  locale: "vi" | "en";
  htmlLang: string;
  ogLocale: string;
  switchHref: string;
  switchLabel: string;
  nav: { label: string; href: string }[];
  ctaPrimary: { label: string; href: string };
  hero: {
    badges: string[];
    h1: string;
    sub: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    kickerLabel: string;
    kicker: string[];
  };
  proof: { label: string; href: string }[];
  stats: { value: string; label: string }[];
  issues: { title: string; body: string; note?: string }[];
  arch: {
    title: string;
    intro: string;
    lanes: { boxes: { name: string; hint?: string; optional?: boolean }[] }[];
    ownershipTitle: string;
    ownership: { owner: string; duties: string }[];
    footnote: string;
  };
  capabilities: {
    title: string;
    status: StatusKey;
    body: string;
    secondaryStatus?: StatusKey;
    secondaryLabel?: string;
  }[];
  enterprise: {
    intro: string;
    items: { label: string; body: string; status?: StatusKey }[];
    calloutTitle: string;
    calloutBody: string;
  };
  api: {
    intro: string;
    codeBlocks: CodeBlock[];
    eventsTitle: string;
    events: string[];
    eventsNote: string;
    notes: string[];
    postmanTitle: string;
    postmanPath: string;
    docsLabel: string;
    docsHref: string;
    docsNote: string;
  };
  boundaries: {
    title: string;
    haveTitle: string;
    notTitle: string;
    have: string[];
    not: string[];
    quotes: { text: string }[];
    optionalCalloutTitle: string;
    optionalCalloutBody: string;
  };
  steps: {
    title: string;
    body?: string;
    code: CodeBlock["lines"];
    checklist?: string;
  }[];
  stepNotes: { text: string; status?: StatusKey }[];
  extraCode?: CodeBlock;
  roadmap: {
    title: string;
    intro: string;
    rows: { version: string; scope: string; status: string }[];
    note: string;
  };
  license: {
    title: string;
    intro: string;
    items: string[];
    calloutTitle: string;
    calloutBody: string;
    securityNote: string;
  };
  finalCta: {
    title: string;
    body: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
  menuLabel: string;
  footer: {
    columns: { title: string; links: { label: string; href: string }[] }[];
    pathNote: string;
    licenseLine: string;
  };
}

const VI: LandingContent = {
  locale: "vi",
  htmlLang: "vi",
  ogLocale: "vi_VN",
  switchHref: "/en",
  switchLabel: "EN",
  nav: [
    { label: "Giải pháp", href: "#co-che" },
    { label: "Kiến trúc", href: "#kien-truc" },
    { label: "Năng lực", href: "#nang-luc" },
    { label: "Bảo mật", href: "#bao-mat" },
    { label: "API & tích hợp", href: "#api" },
    { label: "Triển khai", href: "#trien-khai" },
    { label: "Tài liệu", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Giấy phép", href: "#giay-phep" },
  ],
  ctaPrimary: { label: "Tự triển khai", href: "https://github.com/OpenVie/OpenVie" },
  hero: {
    badges: ["100% Tự lưu trữ (Self-Hosted)", "Tối ưu tiếng Việt", "v0.3.1 Stable"],
    h1: "Kết nối tri thức\nđể công việc vận hành tốt hơn — Rõ nguồn. Đúng quy trình. Dễ kiểm soát.",
    sub:
      "Nơi tài liệu, quy trình và dữ liệu nội bộ được kết nối để mọi người hỏi bằng ngôn ngữ tự nhiên, tìm đúng thông tin và làm việc hiệu quả hơn.",
    ctaPrimary: { label: "Tự triển khai trên GitHub", href: "https://github.com/OpenVie/OpenVie" },
    ctaSecondary: { label: "Xem tài liệu & API", href: "/docs" },
    kickerLabel: "Triển khai sản xuất bằng Docker Compose",
    kicker: [
      "cp .env.production.example .env.production",
      "chmod 600 .env.production",
      "# Cấu hình khóa bảo mật TOKEN_KEY & thông số database...",
      "docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build",
      "# Cổng biên APISIX sẵn sàng tại :8088 → Mở /setup",
    ],
  },
  proof: [
    { label: "SSE Streaming thời gian thực", href: "#co-che" },
    { label: "Keycloak SSO OIDC", href: "#nang-luc" },
    { label: "Flowable BPMN 2 cấp", href: "#nang-luc" },
    { label: "Lakehouse & DuckDB OLAP", href: "#kien-truc" },
    { label: "Qdrant Vector + Kùzu Graph", href: "#kien-truc" },
    { label: "Lưu trữ SeaweedFS S3", href: "#kien-truc" },
  ],
  stats: [
    { value: "100%", label: "Chủ quyền dữ liệu trên hạ tầng riêng" },
    { value: "Apache 2.0", label: "Mã nguồn mở, 0 chi phí bản quyền" },
    { value: "2 Cấp", label: "Phê duyệt e-Office trên Flowable BPMN nhúng" },
    { value: "3 Vai trò", label: "Phân quyền chặt chẽ ORG · WORKSPACE · MEMBER" },
    { value: "Hybrid RAG", label: "Dung hợp Dense + BM25 + Đồ thị Kùzu" },
    { value: "DuckDB OLAP", label: "Phân tích Lakehouse tức thì trên Parquet" },
  ],
  issues: [
    {
      title: "Trả lời rõ nguồn",
      body: "Mỗi câu trả lời dựa trên tài liệu doanh nghiệp cho phép sử dụng, kèm nguồn tham khảo để mọi người dễ kiểm tra.",
      note: "Không đủ thông tin, hệ thống sẽ nói rõ thay vì trả lời phỏng đoán.",
    },
    {
      title: "Dữ liệu do doanh nghiệp quản lý",
      body: "Triển khai trên hạ tầng riêng để tài liệu và dữ liệu nội bộ được quản lý theo chính sách của doanh nghiệp.",
      note: "Bạn chủ động về nơi lưu trữ, quyền truy cập và cách hệ thống kết nối.",
    },
    {
      title: "Tài liệu quan trọng được duyệt trước khi dùng",
      body: "Thiết lập các bước phê duyệt, phân công người phụ trách và theo dõi tiến độ xử lý tài liệu.",
      note: "Mọi quyết định đều được ghi nhận rõ ràng để dễ đối soát khi cần.",
    },
  ],
  arch: {
    title: "Kiến trúc Minh bạch & Độc lập",
    intro:
      "Hệ thống đa tầng chuẩn microservices: Phân tách rõ ràng giữa mặt phẳng điều khiển, mặt phẳng dữ liệu và mặt phẳng suy luận AI.",
    lanes: [
      { boxes: [{ name: "Web Console (Next.js)", hint: ":3000" }, { name: "Apache APISIX Gateway", hint: ":8088" }, { name: "Spring Boot API Runtime", hint: ":8080" }] },
      { boxes: [{ name: "RabbitMQ Message Broker", hint: "Hàng đợi hấp thụ + CDC streaming" }, { name: "Document Ingestion Worker", hint: "Trích xuất văn bản · OCR/ASR mô-đun", optional: true }] },
      { boxes: [{ name: "FastAPI AI Engine", hint: ":50051 · gRPC mTLS" }, { name: "Ollama LLM Cục bộ", hint: "Vylinh 3B · BGE-M3" }, { name: "TEI Cross-Encoder", hint: "Reranker tiếng Việt", optional: true }] },
      { boxes: [{ name: "PostgreSQL 16", hint: "Trạng thái nghiệp vụ & RBAC" }, { name: "Redis", hint: "Rate limit & cache" }, { name: "SeaweedFS S3", hint: "Kho tệp & Parquet Lakehouse" }, { name: "Qdrant", hint: "Vector Search" }, { name: "Kùzu", hint: "Đồ thị tri thức" }] },
    ],
    ownershipTitle: "Phân định Trách nhiệm Dữ liệu Tuyệt đối",
    ownership: [
      { owner: "Spring Boot API", duties: "Quản trị trạng thái nghiệp vụ, phân quyền RBAC đa tenant, phiên chat bảo mật và thực thi quy trình phê duyệt Flowable BPMN trên PostgreSQL." },
      { owner: "Python AI Service", duties: "Đảm trách truy hồi đa tầng (Vector Qdrant + Graph Kùzu) và suy luận mô hình ngôn ngữ cục bộ, tuyệt đối không giữ trạng thái nghiệp vụ." },
      { owner: "SeaweedFS S3", duties: "Lưu trữ tệp gốc an toàn và đóng gói Lakehouse Parquet nén Snappy theo phân vùng tenant/năm/tháng." },
      { owner: "DuckDB Nhúng", duties: "Thực thi truy vấn OLAP phân tích trên hồ dữ liệu Parquet với tốc độ cao, không gây ảnh hưởng đến hiệu năng của PostgreSQL OLTP." },
    ],
    footnote: "Chuẩn kiến trúc theo tài liệu kỹ thuật docs/ARCHITECTURE.md §1 §3",
  },
  capabilities: [
    {
      title: "Trả lời có căn cứ",
      status: "daco",
      body: "Hỏi bằng ngôn ngữ tự nhiên, nhận câu trả lời kèm nguồn để dễ kiểm tra.",
    },
    {
      title: "Quản lý tài liệu tập trung",
      status: "daco",
      body: "Lưu trữ, sắp xếp và tìm lại tài liệu của cá nhân hoặc cả đội trong một nơi.",
    },
    {
      title: "Số hoá quy trình nghiệp vụ",
      status: "daco",
      body: "Biến các việc lặp lại như tiếp nhận, phê duyệt, theo dõi hồ sơ thành quy trình rõ ràng, dễ quản lý.",
    },
    {
      title: "Xây dựng ứng dụng cho công việc",
      status: "daco",
      body: "Tạo các công cụ đơn giản cho bán hàng, nhân sự, vận hành hoặc bất kỳ nhu cầu riêng nào của doanh nghiệp.",
    },
  ],
  enterprise: {
    intro:
      "Được thiết kế đáp ứng các tiêu chuẩn khắt khe của doanh nghiệp, tập đoàn và khối cơ quan quản lý:",
    items: [
      { label: "Chủ quyền Dữ liệu Tuyệt đối", body: "100% dữ liệu, chỉ mục và mô hình ngôn ngữ vận hành trong mạng nội bộ của bạn, không rò rỉ thông tin nhạy cảm." },
      { label: "Phân lập Đa tổ chức (Multi-Tenant)", body: "Bộ lọc tenant_id bắt buộc trên mọi tầng lưu trữ từ PostgreSQL, Qdrant vector đến đồ thị tri thức Kùzu." },
      { label: "Audit Log & Phả hệ Dữ liệu", body: "Lưu vết toàn bộ thao tác phê duyệt, truy vấn và neo mã băm SHA-256 từng phiên bản tài liệu tải lên." },
      { label: "Kiểm dịch Tệp tin tại Cửa ngõ", body: "ClamAV quét sạch mã độc, virus và tệp độc hại trước khi chuyển vào hàng đợi xử lý trích xuất văn bản." },
      { label: "Sao lưu & Khôi phục Thảm họa", body: "Kịch bản backup.sh và restore.sh kiểm chứng toàn vẹn SHA-256, diễn tập khôi phục nhanh chóng khi có sự cố.", status: "op" },
      { label: "Phân quyền RBAC 3 Cấp", body: "Kiểm soát truy cập tài nguyên nghiêm ngặt giữa Chủ sở hữu (Owner), Quản trị viên (Admin) và Thành viên (Member)." },
    ],
    calloutTitle: "Cam kết Chủ quyền & Bảo mật",
    calloutBody:
      "OpenVie trao quyền kiểm soát công nghệ trọn vẹn vào tay đội ngũ IT của tổ chức: Toàn quyền cấu hình chính sách lưu trữ (retention), mô hình phân vùng mạng, chứng chỉ mã hóa TLS và tích hợp hệ thống xác thực tập trung.",
  },
  api: {
    intro:
      "Lõi OpenVie là headless: Toàn bộ năng lực nền tảng cung cấp qua chuẩn HTTP JSON tại /api/v1/**; dễ dàng tích hợp vào ứng dụng hiện hữu, DMS, ERP hoặc cổng thông tin nội bộ.",
    codeBlocks: [
      {
        label: "Tạo API Key máy (M2M) — Xác thực dịch vụ tự động",
        lines: [
          "curl -X POST \"$BASE/api/v1/admin/api-keys\" \\",
          "  -H \"Authorization: Bearer $ACCESS_TOKEN\" -H 'Content-Type: application/json' \\",
          "  -d '{\"name\":\"DMS-Bridge\",\"workspaceId\":\"<workspace-uuid>\",\"role\":\"MEMBER\"}'",
          "# → Trả về 201 Created kèm key ovk_... (hiển thị 1 lần duy nhất)",
        ],
      },
      {
        label: "Hỏi đáp đồng bộ Server-to-Server (REST API)",
        lines: [
          "curl -X POST \"$BASE/api/v1/chat/sessions/$SESSION_ID/messages\" \\",
          "  -H \"Authorization: Bearer $ACCESS_TOKEN\" \\",
          "  -H 'Content-Type: application/json' -H 'Accept: application/json' \\",
          "  -d '{\"content\":\"Tóm tắt nội dung quy chế bảo mật này\",\"documentIds\":[\"<doc-uuid>\"]}'",
        ],
      },
      {
        label: "Đăng ký Webhook Sự kiện (Ký số HMAC-SHA256)",
        lines: [
          "curl -X POST \"$BASE/api/v1/admin/webhook-endpoints\" \\",
          "  -H \"Authorization: Bearer $ACCESS_TOKEN\" -H 'Content-Type: application/json' \\",
          "  -d '{\"name\":\"DMS-Webhook\",\"url\":\"https://dms.example.com/hooks\",\"events\":[\"document.status.changed\",\"workflow.approved\"]}'",
          "# → 201 Created kèm secret whsec_... để xác thực chữ ký gói tin",
        ],
      },
    ],
    eventsTitle: "Sự kiện Webhook Thời gian thực (Ký X-OpenVie-Signature)",
    events: [
      "document.status.changed",
      "workflow.started",
      "workflow.approved",
      "workflow.rejected",
      "workflow.escalated",
      "webhook.test",
    ],
    eventsNote:
      "Gói tin chuẩn JSON: { id, type, occurred_at, workspace_id, data } kèm cơ chế Outbox đảm bảo gửi tin cậy và Idempotency-Key chống gửi trùng.",
    notes: [
      "Dịch vụ gRPC nội bộ cổng :50051 sử dụng mTLS bảo mật cao giữa Spring Boot và FastAPI.",
      "Cổng biên APISIX giới hạn tần suất 600 yêu cầu/phút mỗi người dùng, bảo vệ hệ thống khỏi quá tải.",
    ],
    postmanTitle: "Bộ sưu tập Postman mẫu",
    postmanPath: "contracts/postman/openvie_integration.postman_collection.json",
    docsLabel: "Xem tài liệu OpenAPI & Thử nghiệm API trực tiếp",
    docsHref: "/docs",
    docsNote: "Môi trường Interactive API Playground đầy đủ schema, tham số và ví dụ gọi thực tế.",
  },
  boundaries: {
    title: "Tiêu chuẩn Kiến trúc & Chủ quyền Dữ liệu",
    haveTitle: "Năng lực Sẵn sàng Sản xuất",
    notTitle: "Cam kết Mở & Tự chủ Vận hành",
    have: [
      "Chat hỏi đáp trên tài liệu nội bộ với trích dẫn [S1] minh bạch và kiểm quyền nguồn",
      "Cơ chế Từ chối (Abstention) thông minh khi thiếu bằng chứng, triệt tiêu ảo giác",
      "Truy hồi lai đa tầng: Dense Vector (BGE-M3) + BM25 Sparse + Kùzu Graph RAG với dung hợp RRF",
      "Hấp thụ tài liệu đa định dạng bất đồng bộ: PDF, DOCX, TXT, MD, HTML, XLSX, CSV",
      "Quy trình thẩm định & phê duyệt văn bản 2 cấp e-Office trên engine Flowable BPMN nhúng",
      "Xác thực định danh Keycloak OIDC SSO (PKCE S256) + Mật khẩu/JWT cùng RBAC 3 vai trò",
      "Khung tích hợp Headless REST API /api/v1/**, API Key M2M ovk_ và Webhook ký HMAC-SHA256",
      "Hồ dữ liệu Lakehouse Snappy Parquet trên SeaweedFS S3 với DuckDB OLAP phân tích tức thì",
      "Bảo mật cổng biên APISIX, kiểm dịch luồng tải lên ClamAV, gRPC nội bộ bảo mật mTLS",
      "Sao lưu và phục hồi thảm họa kiểm chứng toàn vẹn SHA-256 theo manifest",
    ],
    not: [
      "100% On-Premise: Không gửi bất kỳ dữ liệu nhạy cảm hay truy vấn nào ra đám mây công cộng",
      "Mã nguồn mở Apache 2.0: Không chi phí bản quyền ẩn, không tính phí theo người dùng",
      "Không Vendor Lock-in: Toàn quyền truy cập và kiểm toán 100% mã nguồn backend, frontend và model",
      "Kiến trúc module linh hoạt: Tự do cắm rút LLM nội bộ (Ollama, vLLM) hoặc LLM bên ngoài khi cần",
      "Mở rộng OCR & ASR đa phương thức: Kích hoạt module Tesseract/VLM và Faster-Whisper theo nhu cầu",
      "Tách biệt hoàn toàn OLAP & OLTP: Phân tích báo cáo với DuckDB không gây nghẽn database chính",
      "Kiểm soát an toàn lớp biên: Cho phép người vận hành tùy biến WAF, TLS Termination và Reverse Proxy",
      "Giám sát chuẩn công nghiệp: Tích hợp sẵn profile Prometheus & Grafana theo dõi tài nguyên",
    ],
    quotes: [
      {
        text:
          "Được thiết kế cho các tổ chức coi trọng chủ quyền dữ liệu: Minh bạch, độc lập, kiểm soát toàn diện và không phụ thuộc vào bất kỳ nhà cung cấp dịch vụ đám mây nào.",
      },
    ],
    optionalCalloutTitle: "Kiến trúc Mô-đun Tối ưu Tài nguyên",
    optionalCalloutBody:
      "Các thành phần mở rộng như OCR nhận diện văn bản quét, ASR chuyển đổi giọng nói/video, TEI reranker và stack giám sát được thiết kế dưới dạng mô-đun tùy chọn — chỉ tiêu tốn tài nguyên máy chủ khi được kích hoạt cấu hình.",
  },
  steps: [
    {
      title: "1. Khởi tạo tệp cấu hình bảo mật",
      body:
        "Tạo tệp .env.production từ file mẫu, phân quyền bảo vệ chmod 600 và khởi tạo các khóa bí mật ngẫu nhiên 32-byte:",
      code: [
        "cp .env.production.example .env.production",
        "chmod 600 .env.production",
        "# Sinh khóa bảo mật TOKEN_KEY & mật khẩu:",
        "openssl rand -hex 32",
      ],
    },
    {
      title: "2. Khởi chạy toàn bộ hệ thống bằng Docker",
      body: "Kiểm tra tính hợp lệ của cấu hình và khởi chạy các container chỉ với một câu lệnh duy nhất:",
      code: [
        "docker compose -f docker-compose.prod.yml --env-file .env.production config --quiet",
        "docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build",
      ],
    },
    {
      title: "3. Hoàn tất thiết lập ban đầu",
      body:
        "Truy cập cổng biên APISIX, mở giao diện /setup để tạo tài khoản Quản trị tối cao (ORG_OWNER) đầu tiên:",
      code: [
        "# Mở trình duyệt: http://your-domain:8088/setup",
        "# Hỗ trợ công cụ CLI khôi phục mật khẩu owner khi cần:",
        "make -C api recover-owner ENV_FILE=../.env.production",
      ],
    },
  ],
  stepNotes: [
    { text: "Khuyến nghị triển khai TLS/HTTPS hoặc reverse proxy (Nginx/Traefik) phía trước gateway.", status: "op" },
    { text: "Cài đặt Ollama trên máy chủ và tải sẵn mô hình ngôn ngữ trước khi khởi chạy:" },
  ],
  extraCode: {
    label: "Tải mô hình AI tiếng Việt vào Ollama",
    lines: [
      "ollama pull bge-m3",
      "ollama pull hf.co/QuantFactory/Arcee-VyLinh-GGUF:Q4_K_M",
      "ollama cp hf.co/QuantFactory/Arcee-VyLinh-GGUF:Q4_K_M vylinh",
    ],
  },
  roadmap: {
    title: "Lộ trình Phát triển & Các mốc Phát hành",
    intro: "Bốn cột mốc lớn đã hoàn thành với đầy đủ tiêu chí nghiệm thu nghiêm ngặt:",
    rows: [
      {
        version: "v0.1.x",
        scope:
          "Nền tảng RAG Tự lưu trữ: Spring Boot + FastAPI + Next.js, APISIX gateway, PostgreSQL/SeaweedFS/Qdrant/Kùzu, hỏi đáp có trích dẫn nguồn và cơ chế từ chối (Abstention).",
        status: "Đã phát hành",
      },
      {
        version: "v0.2.0",
        scope:
          "Định danh Doanh nghiệp Keycloak SSO: Tích hợp Keycloak OIDC, Spring làm Resource Server, phân quyền 3 cấp (Owner/Admin/Member) và xác thực đa yếu tố.",
        status: "Đã phát hành",
      },
      {
        version: "v0.3.0",
        scope:
          "Quy trình Phê duyệt BPMN & Đa phương thức: Nhúng engine Flowable OSS cho luồng e-Office 2 cấp, hộp thư duyệt tài liệu, trích dẫn đa phương thức và backup SHA-256.",
        status: "Đã phát hành",
      },
      {
        version: "v0.3.1",
        scope:
          "Hồ dữ liệu Lakehouse & DuckDB OLAP: CDC streaming qua RabbitMQ lưu Snappy Parquet trên SeaweedFS S3, DuckDB nhúng thực thi SQL phân tích tức thì.",
        status: "Đã phát hành",
      },
    ],
    note: "Tiến độ kỹ thuật và các bản phát hành được theo dõi chặt chẽ qua milestone của dự án.",
  },
  license: {
    title: "Mã nguồn Mở & Giấy phép Apache 2.0",
    intro:
      "OpenVie là dự án mã nguồn mở thuần túy, trao quyền tự chủ công nghệ trọn vẹn cho cộng đồng và doanh nghiệp.",
    items: [
      "Giấy phép Apache License 2.0 — Bản quyền 2026 LinkedNodeDigital, ghi nhận chi tiết trong tệp NOTICE.",
      "Tự do triển khai, tùy biến, fork mã nguồn hoặc thương mại hóa theo điều khoản giấy phép.",
      "Các thư viện bên thứ ba, container image và trọng số mô hình AI duy trì điều khoản giấy phép tương ứng.",
      "Mọi quy trình phát hành đều tuân thủ kiểm định bảo mật nghiêm ngặt trước khi xuất bản.",
    ],
    calloutTitle: "Tự do Tùy biến & Kiểm toán Mã nguồn",
    calloutBody:
      "Tổ chức có toàn quyền kiểm tra toàn bộ mã nguồn, tùy biến giao diện, tích hợp hệ thống nội bộ và điều chỉnh luồng nghiệp vụ theo nhu cầu đặc thù mà không gặp bất kỳ rào cản pháp lý hay kỹ thuật nào.",
    securityNote:
      "Báo cáo bảo mật: Mọi phát hiện về an toàn thông tin vui lòng gửi qua kênh bảo mật riêng tư của dự án để được xử lý nhanh chóng.",
  },
  finalCta: {
    title: "Sẵn sàng làm chủ công nghệ RAG trên hạ tầng của bạn?",
    body: "Kiểm tra mã nguồn — Khởi chạy với một câu lệnh — Sở hữu hoàn toàn kho tri thức nội bộ.",
    primary: { label: "Tự triển khai trên GitHub", href: "https://github.com/OpenVie/OpenVie" },
    secondary: { label: "Khám phá API Reference", href: "/docs" },
  },
  menuLabel: "Mở menu điều hướng",
  footer: {
    columns: [
      {
        title: "Sản phẩm",
        links: [
          { label: "Giải pháp", href: "#co-che" },
          { label: "Kiến trúc", href: "#kien-truc" },
          { label: "Năng lực", href: "#nang-luc" },
          // { label: "Tiêu chuẩn", href: "#ranh-gioi" },
          { label: "Triển khai", href: "#trien-khai" },
          { label: "Lộ trình", href: "#lo-trinh" },
          { label: "Nhật ký thay đổi (CHANGELOG.md)", href: "https://github.com/OpenVie/OpenVie/blob/main/CHANGELOG.md" },
        ],
      },
      {
        title: "Tài liệu kỹ thuật",
        links: [
          { label: "API Reference & Playground", href: "/docs" },
          { label: "Blog kỹ thuật", href: "/blog" },
          { label: "Mã nguồn GitHub (OpenVie/OpenVie)", href: "https://github.com/OpenVie/OpenVie" },
          { label: "Kiến trúc hệ thống (docs/ARCHITECTURE.md)", href: "#kien-truc" },
          { label: "Hướng dẫn tích hợp (docs/INTEGRATION.md)", href: "#api" },
          { label: "Tư vấn & Hỗ trợ triển khai (Facebook)", href: "https://www.facebook.com/profile.php?id=61595728591443" },
        ],
      },
      {
        title: "Giấy phép & Bản quyền",
        links: [
          { label: "Apache License 2.0", href: "#giay-phep" },
          { label: "Tài liệu NOTICE", href: "#giay-phep" },
          { label: "Bản quyền 2026 LinkedNodeDigital", href: "#giay-phep" },
        ],
      },
    ],
    pathNote:
      "OpenVie là nền tảng vận hành nội bộ, kết nối tài liệu, quy trình và ứng dụng nghiệp vụ của doanh nghiệp.",
    licenseLine: "Apache License 2.0 · Bản quyền 2026 LinkedNodeDigital · Độc lập & Tự chủ công nghệ",
  },
};

const EN: LandingContent = {
  locale: "en",
  htmlLang: "en",
  ogLocale: "en_US",
  switchHref: "/",
  switchLabel: "VI",
  nav: [
    { label: "Solutions", href: "#co-che" },
    { label: "Architecture", href: "#kien-truc" },
    { label: "Capabilities", href: "#nang-luc" },
    { label: "Security", href: "#bao-mat" },
    { label: "API & Integration", href: "#api" },
    { label: "Deployment", href: "#trien-khai" },
    { label: "Docs", href: "/en/docs" },
    { label: "Blog", href: "/en/blog" },
    { label: "License", href: "#giay-phep" },
  ],
  ctaPrimary: { label: "Self-host", href: "https://github.com/OpenVie/OpenVie" },
  hero: {
    badges: ["100% Self-Hosted", "Built for Vietnamese", "v0.3.1 Stable"],
    h1: "Connect knowledge\nto make work run better — Clear sources. Reliable workflows. Easy control.",
    sub:
      "Bring documents, workflows, and internal data together so every team can ask in natural language, find the right information, and work more effectively.",
    ctaPrimary: { label: "Self-host from GitHub", href: "https://github.com/OpenVie/OpenVie" },
    ctaSecondary: { label: "Explore docs & API", href: "/en/docs" },
    kickerLabel: "Production Deployment with Docker Compose",
    kicker: [
      "cp .env.production.example .env.production",
      "chmod 600 .env.production",
      "# Configure TOKEN_KEY secret & database credentials...",
      "docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build",
      "# APISIX edge gateway ready at :8088 → Open /setup",
    ],
  },
  proof: [
    { label: "Real-time SSE Streaming", href: "#co-che" },
    { label: "Keycloak OIDC SSO", href: "#nang-luc" },
    { label: "2-Stage Flowable BPMN", href: "#nang-luc" },
    { label: "Lakehouse & DuckDB OLAP", href: "#kien-truc" },
    { label: "Qdrant Vector + Kùzu Graph", href: "#kien-truc" },
    { label: "SeaweedFS S3 Storage", href: "#kien-truc" },
  ],
  stats: [
    { value: "100%", label: "Data sovereignty on private infrastructure" },
    { value: "Apache 2.0", label: "Open source, zero license fees" },
    { value: "2 Stages", label: "e-Office approval on embedded Flowable BPMN" },
    { value: "3 Roles", label: "Strict RBAC: ORG · WORKSPACE · MEMBER" },
    { value: "Hybrid RAG", label: "Dense + BM25 + Kùzu Graph Fusion" },
    { value: "DuckDB OLAP", label: "Instant Lakehouse analytics on Parquet" },
  ],
  issues: [
    {
      title: "Answers with clear sources",
      body: "Every answer uses business documents that are allowed for use and includes references that are easy to verify.",
      note: "When information is insufficient, the system says so instead of guessing.",
    },
    {
      title: "Business-managed data",
      body: "Deploy on private infrastructure so documents and internal data follow your business policies.",
      note: "You control where data lives, who can access it, and how the system connects.",
    },
    {
      title: "Important documents approved before use",
      body: "Set approval steps, assign owners, and track document-processing progress.",
      note: "Every decision is clearly recorded for review when needed.",
    },
  ],
  arch: {
    title: "Transparent & Sovereign Architecture",
    intro:
      "Microservice-ready architecture cleanly separating control plane, data plane, and AI inference plane.",
    lanes: [
      { boxes: [{ name: "Web Console (Next.js)", hint: ":3000" }, { name: "Apache APISIX Gateway", hint: ":8088" }, { name: "Spring Boot API Runtime", hint: ":8080" }] },
      { boxes: [{ name: "RabbitMQ Message Broker", hint: "Ingestion queue + CDC streaming" }, { name: "Document Ingestion Worker", hint: "Parser · Optional OCR/ASR modules", optional: true }] },
      { boxes: [{ name: "FastAPI AI Engine", hint: ":50051 · gRPC mTLS" }, { name: "Local Ollama LLM", hint: "Vylinh 3B · BGE-M3" }, { name: "TEI Cross-Encoder", hint: "Vietnamese reranker", optional: true }] },
      { boxes: [{ name: "PostgreSQL 16", hint: "Business state & RBAC" }, { name: "Redis", hint: "Rate limiting & checkpoints" }, { name: "SeaweedFS S3", hint: "Raw files & Parquet Lakehouse" }, { name: "Qdrant", hint: "Vector Search" }, { name: "Kùzu", hint: "Knowledge Graph" }] },
    ],
    ownershipTitle: "Strict Data Ownership Boundaries",
    ownership: [
      { owner: "Spring Boot API", duties: "Manages business state, multi-tenant RBAC, secure chat sessions, and Flowable BPMN workflow execution on PostgreSQL." },
      { owner: "Python AI Service", duties: "Powers multi-stage retrieval (Qdrant Vector + Kùzu Graph) and local LLM inference, strictly decoupled from core business state." },
      { owner: "SeaweedFS S3", duties: "Stores raw original files and partitions Snappy Parquet Lakehouse files by tenant/year/month." },
      { owner: "Embedded DuckDB", duties: "Executes analytical OLAP queries directly against Parquet data at blazing speeds without impacting PostgreSQL OLTP." },
    ],
    footnote: "Architecture specifications grounded in docs/ARCHITECTURE.md §1 §3",
  },
  capabilities: [
    {
      title: "Evidence-based answers",
      status: "daco",
      body: "Ask in natural language and receive an answer with sources that are easy to verify.",
    },
    {
      title: "Centralized document management",
      status: "daco",
      body: "Store, organize, and find personal or team documents in one place.",
    },
    {
      title: "Digitized business workflows",
      status: "daco",
      body: "Turn recurring work such as intake, approval, and case tracking into clear, manageable workflows.",
    },
    {
      title: "Work applications",
      status: "daco",
      body: "Create simple tools for sales, HR, operations, or any other business need.",
    },
  ],
  enterprise: {
    intro:
      "Engineered to satisfy the stringent requirements of enterprise IT, regulated industries, and sovereign institutions:",
    items: [
      { label: "100% Data Sovereignty", body: "All data, search indexes, and language models operate entirely within your private perimeter, preventing confidential data leaks." },
      { label: "Multi-Tenant Isolation", body: "Enforced tenant_id filtering across every tier: PostgreSQL records, Qdrant vector spaces, and Kùzu graph partitions." },
      { label: "Audit Trails & Lineage", body: "Immutable logs for all approvals, queries, and uploads anchored by SHA-256 hashes and uploader provenance." },
      { label: "Perimeter Malware Scanning", body: "ClamAV inspects uploaded byte streams INSTREAM, isolating malware before document parsing and ingestion queues." },
      { label: "SHA-256 Backup & Disaster Recovery", body: "Automated backup.sh and restore.sh scripts verified against SHA-256 manifests for rapid disaster recovery drills.", status: "op" },
      { label: "3-Tier RBAC Security", body: "Strict role enforcement across Organization Owners, Workspace Admins, and regular Members." },
    ],
    calloutTitle: "Sovereignty & Security Guarantee",
    calloutBody:
      "OpenVie puts complete technological control into your engineering team's hands: full authority over data retention policies, network zoning, TLS certificates, and identity integration.",
  },
  api: {
    intro:
      "OpenVie's core is headless: All capabilities are accessible via HTTP JSON at /api/v1/**, ready for seamless integration into existing DMS, ERP, or portal architectures.",
    codeBlocks: [
      {
        label: "Create Machine (M2M) API Key — Automated Service Auth",
        lines: [
          "curl -X POST \"$BASE/api/v1/admin/api-keys\" \\",
          "  -H \"Authorization: Bearer $ACCESS_TOKEN\" -H 'Content-Type: application/json' \\",
          "  -d '{\"name\":\"DMS-Bridge\",\"workspaceId\":\"<workspace-uuid>\",\"role\":\"MEMBER\"}'",
          "# → Returns 201 Created with secret key ovk_... (revealed once)",
        ],
      },
      {
        label: "Synchronous Server-to-Server Chat (REST API)",
        lines: [
          "curl -X POST \"$BASE/api/v1/chat/sessions/$SESSION_ID/messages\" \\",
          "  -H \"Authorization: Bearer $ACCESS_TOKEN\" \\",
          "  -H 'Content-Type: application/json' -H 'Accept: application/json' \\",
          "  -d '{\"content\":\"Summarize this security policy document\",\"documentIds\":[\"<doc-uuid>\"]}'",
        ],
      },
      {
        label: "Register Signed Webhook (HMAC-SHA256)",
        lines: [
          "curl -X POST \"$BASE/api/v1/admin/webhook-endpoints\" \\",
          "  -H \"Authorization: Bearer $ACCESS_TOKEN\" -H 'Content-Type: application/json' \\",
          "  -d '{\"name\":\"DMS-Webhook\",\"url\":\"https://dms.example.com/hooks\",\"events\":[\"document.status.changed\",\"workflow.approved\"]}'",
          "# → 201 Created with signing secret whsec_... for payload verification",
        ],
      },
    ],
    eventsTitle: "Real-time Webhook Events (Signed with X-OpenVie-Signature)",
    events: [
      "document.status.changed",
      "workflow.started",
      "workflow.approved",
      "workflow.rejected",
      "workflow.escalated",
      "webhook.test",
    ],
    eventsNote:
      "Standard JSON envelope: { id, type, occurred_at, workspace_id, data } with an Outbox pattern for guaranteed delivery and Idempotency-Key deduplication.",
    notes: [
      "Internal gRPC service on port :50051 enforces strict mTLS encryption between Spring Boot and FastAPI.",
      "APISIX gateway applies a default 600 req/min rate limit per tenant:user to ensure platform resilience.",
    ],
    postmanTitle: "Sample Postman Collection",
    postmanPath: "contracts/postman/openvie_integration.postman_collection.json",
    docsLabel: "Explore Interactive API Reference & Playground",
    docsHref: "/en/docs",
    docsNote: "Interactive OpenAPI Playground with complete schemas, parameters, and executable mocks.",
  },
  boundaries: {
    title: "Architectural Standards & Data Sovereignty",
    haveTitle: "Production-Ready Capabilities",
    notTitle: "Open Commitments & Operational Freedom",
    have: [
      "Verifiable cited document chat with [S1] references and access-controlled sources",
      "Intelligent abstention mechanism that suppresses hallucinations when evidence is absent",
      "Hybrid multi-stage retrieval: Dense Vector (BGE-M3) + BM25 Sparse + Kùzu Graph RAG with RRF",
      "Asynchronous multi-format ingestion: PDF, DOCX, TXT, MD, HTML, XLSX, CSV",
      "2-stage e-Office document review and approval on embedded Flowable BPMN",
      "Keycloak OIDC SSO (PKCE S256) + password/JWT with 3-tier enterprise RBAC",
      "Headless REST API /api/v1/**, M2M ovk_ keys, and HMAC-SHA256 signed webhooks",
      "Snappy Parquet Lakehouse on SeaweedFS S3 with embedded DuckDB OLAP",
      "APISIX perimeter gateway, ClamAV INSTREAM malware quarantine, and internal mTLS gRPC",
      "SHA-256 verified disaster recovery and automated backup scripts",
    ],
    not: [
      "100% On-Premise: Never sends confidential data or queries to third-party public clouds",
      "Apache-2.0 Open Source: Zero license fees, zero per-seat taxes, zero hidden charges",
      "Zero Vendor Lock-in: Full access to inspect and audit 100% of backend and frontend source code",
      "Modular AI flexibility: Pluggable adapters for local Ollama, vLLM, or private model endpoints",
      "Extensible OCR & ASR: Activate Tesseract/VLM and Faster-Whisper modules when needed",
      "Clean OLAP/OLTP separation: Analytical DuckDB queries never slow down the operational DB",
      "Perimeter security control: Operators retain full freedom to configure WAF and TLS termination",
      "Industry-standard observability: Pre-provisioned Prometheus & Grafana monitoring profiles",
    ],
    quotes: [
      {
        text:
          "Engineered for organizations where data sovereignty is paramount: Transparent, independent, fully auditable, and completely free from cloud vendor lock-in.",
      },
    ],
    optionalCalloutTitle: "Resource-Efficient Modular Architecture",
    optionalCalloutBody:
      "Extended capabilities such as OCR scanning, ASR speech-to-text, TEI reranker, and monitoring are designed as optional modules — consuming server resources only when explicitly enabled.",
  },
  steps: [
    {
      title: "1. Prepare Environment Secrets",
      body:
        "Create .env.production from the template, lock permissions to chmod 600, and generate high-entropy 32-byte secret tokens:",
      code: [
        "cp .env.production.example .env.production",
        "chmod 600 .env.production",
        "# Generate cryptographically secure tokens:",
        "openssl rand -hex 32",
      ],
    },
    {
      title: "2. Launch Stack via Docker Compose",
      body: "Validate the configuration and launch all containers with a single command:",
      code: [
        "docker compose -f docker-compose.prod.yml --env-file .env.production config --quiet",
        "docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build",
      ],
    },
    {
      title: "3. Complete Initial Setup",
      body:
        "Access the APISIX gateway at /setup to create your initial Organization Owner (ORG_OWNER) account:",
      code: [
        "# Open your browser: http://your-domain:8088/setup",
        "# CLI tool available for offline owner recovery if ever needed:",
        "make -C api recover-owner ENV_FILE=../.env.production",
      ],
    },
  ],
  stepNotes: [
    { text: "We recommend terminating TLS/HTTPS with a reverse proxy (e.g. Nginx or Traefik) in front of the gateway.", status: "op" },
    { text: "Install Ollama on your host and pull required models before loading into memory:" },
  ],
  extraCode: {
    label: "Pull AI models into Ollama",
    lines: [
      "ollama pull bge-m3",
      "ollama pull hf.co/QuantFactory/Arcee-VyLinh-GGUF:Q4_K_M",
      "ollama cp hf.co/QuantFactory/Arcee-VyLinh-GGUF:Q4_K_M vylinh",
    ],
  },
  roadmap: {
    title: "Development Roadmap & Release Milestones",
    intro: "Four major milestones delivered with strict acceptance criteria verified in the repo:",
    rows: [
      {
        version: "v0.1.x",
        scope:
          "Self-hosted RAG Foundation: Spring Boot + FastAPI + Next.js, APISIX gateway, PostgreSQL/SeaweedFS/Qdrant/Kùzu, cited chat, and intelligent abstention.",
        status: "Released",
      },
      {
        version: "v0.2.0",
        scope:
          "Enterprise Identity: Keycloak OIDC SSO, Spring Resource Server, 3-tier RBAC mapping (Owner/Admin/Member), and multi-factor authentication support.",
        status: "Released",
      },
      {
        version: "v0.3.0",
        scope:
          "BPMN Approval & Multimodal Citations: Embedded Flowable OSS engine for 2-level e-Office workflow, approval inbox, multimodal image citations, and SHA-256 backup.",
        status: "Released",
      },
      {
        version: "v0.3.1",
        scope:
          "Lakehouse & DuckDB OLAP: RabbitMQ CDC streaming to Snappy Parquet on SeaweedFS S3, embedded DuckDB executing instant SQL analytics without OLTP locking.",
        status: "Released",
      },
    ],
    note: "Engineering progress and release milestones are tracked transparently in the project repository.",
  },
  license: {
    title: "Open Source & Apache 2.0 License",
    intro:
      "OpenVie is a pure open-source project delivering complete technological sovereignty to enterprise engineering teams.",
    items: [
      "Apache License 2.0 — Copyright 2026 LinkedNodeDigital, documented in NOTICE.",
      "Complete freedom to self-host, customize, fork, or deliver hosted services under Apache-2.0 terms.",
      "Third-party libraries, container images, and model weights retain their respective open licenses.",
      "All release artifacts adhere to rigorous security validation before distribution.",
    ],
    calloutTitle: "Codebase Auditability & Freedom",
    calloutBody:
      "Your organization has full access to inspect every line of code, adapt internal workflows, customize the interface, and deploy on air-gapped infrastructure with zero licensing hurdles.",
    securityNote:
      "Security Disclosures: Please submit vulnerability reports via the project's private security channel for swift remediation.",
  },
  finalCta: {
    title: "Ready to put your internal knowledge to work on your own infrastructure?",
    body: "Review the source — Launch with one command — Keep full control of your internal knowledge.",
    primary: { label: "Self-host from GitHub", href: "https://github.com/OpenVie/OpenVie" },
    secondary: { label: "Explore API Reference", href: "/en/docs" },
  },
  menuLabel: "Open navigation menu",
  footer: {
    columns: [
      {
        title: "Product",
        links: [
          { label: "Solutions", href: "#co-che" },
          { label: "Architecture", href: "#kien-truc" },
          { label: "Capabilities", href: "#nang-luc" },
          { label: "Deployment", href: "#trien-khai" },
          { label: "Roadmap", href: "#lo-trinh" },
          { label: "Changelog (CHANGELOG.md)", href: "https://github.com/OpenVie/OpenVie/blob/main/CHANGELOG.md" },
        ],
      },
      {
        title: "Technical Docs",
        links: [
          { label: "Interactive API Reference", href: "/en/docs" },
          { label: "Engineering blog", href: "/en/blog" },
          { label: "Source on GitHub (OpenVie/OpenVie)", href: "https://github.com/OpenVie/OpenVie" },
          { label: "System Architecture (docs/ARCHITECTURE.md)", href: "#kien-truc" },
          { label: "Integration Guide (docs/INTEGRATION.md)", href: "#api" },
          { label: "Enterprise Deployment Support (Facebook)", href: "https://www.facebook.com/profile.php?id=61595728591443" },
        ],
      },
      {
        title: "License & Attribution",
        links: [
          { label: "Apache License 2.0", href: "#giay-phep" },
          { label: "NOTICE File", href: "#giay-phep" },
          { label: "Copyright 2026 LinkedNodeDigital", href: "#giay-phep" },
        ],
      },
    ],
    pathNote:
      "OpenVie is an internal operations platform that connects an organization's documents, workflows, and business applications.",
    licenseLine: "Apache License 2.0 · Copyright 2026 LinkedNodeDigital · Sovereign Enterprise AI",
  },
};

export function landingContentFor(locale: "vi" | "en"): LandingContent {
  return locale === "en" ? EN : VI;
}

export function landingJsonLd(locale: "vi" | "en") {
  const isVi = locale === "vi";
  return {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "OpenVie",
      url: "https://openvie.org",
      logo: "https://openvie.org/openvie-logo.svg",
      description: isVi
        ? "Nền tảng RAG tự lưu trữ tối ưu tiếng Việt cho doanh nghiệp và cơ quan nhà nước."
        : "A self-hosted platform connecting documents, workflows, and internal data for better operations.",
    },
    software: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "OpenVie",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Linux (Docker / Kubernetes)",
      license: "https://www.apache.org/licenses/LICENSE-2.0",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description: isVi
        ? "Nền tảng RAG tự lưu trữ (self-hosted) ưu tiên tiếng Việt cho tài liệu nội bộ, giấy phép Apache License 2.0."
        : "Self-hosted platform for documents, workflows, and internal data under the Apache License 2.0.",
    },
  };
}
