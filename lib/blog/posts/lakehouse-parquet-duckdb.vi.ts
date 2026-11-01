import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "lakehouse-parquet-duckdb",
  date: "2026-10-17",
  readingMinutes: 11,
  tags: ["Lakehouse", "DuckDB", "Parquet"],
  title: "Lakehouse nhỏ với Parquet và DuckDB",
  description:
    "Một câu hỏi đếm theo workspace mở ra cả đường ống dữ liệu: Parquet, phân vùng thư mục, CDC và DuckDB nhúng cạnh database giao dịch.",
  lede: "Một câu hỏi đếm tưởng đơn giản chạm đúng ranh giới giữa OLTP và OLAP. Bài này đi từ Parquet và phân vùng thư mục tới CDC và DuckDB nhúng, cùng những gì OpenVie thực sự làm.",
  blocks: [
    { kind: "h2", text: "Câu hỏi vận hành tưởng đơn giản: đếm văn bản đã duyệt theo workspace" },
    {
      kind: "p",
      text: "Ai đó trong nhóm vận hành hỏi một câu ngắn: tháng này mỗi workspace có bao nhiêu văn bản đã duyệt? Không cần mô hình ngôn ngữ, không cần truy hồi — chỉ cần đếm. Nhưng khi trả lời, bạn nhận ra đây là một bài toán dữ liệu.",
    },
    {
      kind: "p",
      text: "Dữ liệu phục vụ ứng dụng và dữ liệu phục vụ phân tích có hình dạng khác nhau. Câu hỏi này chạm vào bốn điểm cùng lúc:",
    },
    {
      kind: "ul",
      items: [
        "Phạm vi tenant: mỗi workspace thuộc một tenant, và kết quả không được rò rỉ giữa các tenant.",
        "Khối lượng: số văn bản tăng theo thời gian, còn câu trả lời chỉ là một bảng nhỏ theo tháng.",
        "Tần suất: câu hỏi được hỏi lại mỗi tuần, mỗi tháng, cho nhiều workspace.",
        "Nguồn: trạng thái duyệt nằm trong dữ liệu nghiệp vụ, và bạn muốn đọc nó mà không làm chậm đường ghi của ứng dụng.",
      ],
    },

    { kind: "h2", text: "Vì sao không nên chạy OLAP trên database giao dịch" },
    {
      kind: "p",
      text: "PostgreSQL mà OpenVie dùng cho giao dịch tối ưu cho điều ngược lại: đọc ghi từng hàng, độ trễ thấp. Một truy vấn đếm theo tháng quét gần hết bảng lớn là điều nó không được thiết kế để làm thường xuyên.",
    },
    {
      kind: "ul",
      items: [
        "Truy vấn quét toàn bảng chiếm CPU và I/O dành cho yêu cầu người dùng.",
        "Khóa và bộ nhớ đệm bị chia sẻ giữa hai kiểu tải khác nhau.",
        "Mỗi chỉ số phân tích mới thêm một truy vấn nặng vào cùng một cỗ máy.",
        "Bạn khó mở rộng phần phân tích mà không mở rộng luôn phần giao dịch.",
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Cái giá của việc gộp chung",
      body: "Chạy phân tích trực tiếp trên database giao dịch vẫn hoạt động ở quy mô nhỏ. Vấn đề lộ ra khi dữ liệu lớn dần: cùng một CPU, cùng một đĩa, nhưng hai kiểu tải tranh nhau. Tách hai đường ra là cách rẻ nhất để giữ cả hai ổn định.",
    },
    {
      kind: "p",
      text: "Cách tách phổ biến là sao chép dữ liệu sang nơi tối ưu cho việc đọc. Truyền thống thì đó là một kho dữ liệu; cách nhẹ hơn là để dữ liệu nằm trong tệp và đọc trực tiếp từ tệp.",
    },

    { kind: "h2", text: "Parquet: lưu theo cột kèm metadata (figure)" },
    {
      kind: "p",
      text: "Parquet là định dạng tệp hướng cột: lưu dữ liệu theo cột, kèm metadata theo từng nhóm cột. Hệ quả rất rõ — một truy vấn chỉ chạm vài cột không phải đọc phần còn lại của tệp.",
    },
    {
      kind: "figure",
      src: "/blog/parquet-file-layout.gif",
      width: 601,
      height: 478,
      alt: "Sơ đồ bố cục tệp Parquet: một tệp chứa các row group, mỗi row group chia thành column chunk theo cột, mỗi column chunk gồm một dãy page, và phần footer giữ metadata.",
      caption:
        "Bố cục tệp Parquet theo tài liệu định dạng chính thức: tệp → row group → column chunk → page, với footer giữ metadata.",
      credit: "Ảnh: Apache Parquet (apache/parquet-format)",
      creditHref: "https://github.com/apache/parquet-format/blob/master/doc/images/FileLayout.gif",
      licence: "Apache License 2.0",
      licenceHref: "https://github.com/apache/parquet-format/blob/master/LICENSE",
    },
    {
      kind: "p",
      text: "Điều này khớp câu hỏi ban đầu: bạn cần workspace, tháng và trạng thái duyệt — ba cột. DuckDB đọc và ghi Parquet trực tiếp, không cần nạp trước vào một database khác, nên bạn trỏ thẳng vào tệp, chi tiết ở [hướng dẫn Parquet của DuckDB](https://duckdb.org/docs/stable/data/parquet/overview).",
    },

    { kind: "h2", text: "Row group, column chunk và page" },
    {
      kind: "p",
      text: "Theo tài liệu định dạng chính thức, một tệp Parquet có cấu trúc phân cấp rõ ràng. Hiểu nó giải thích vì sao cắt cột và đẩy bộ lọc lại hiệu quả đến vậy.",
    },
    {
      kind: "ul",
      items: [
        "Một tệp gồm nhiều row group, thường vài chục nghìn hàng mỗi nhóm.",
        "Mỗi row group chia thành các column chunk, mỗi chunk giữ dữ liệu của một cột.",
        "Mỗi column chunk là một dãy page liên tiếp — đơn vị nhỏ nhất mà tầng đọc làm việc cùng.",
      ],
    },
    {
      kind: "p",
      text: "Vì dữ liệu một cột nằm liền nhau trong column chunk, đọc vài cột chỉ là một tập đọc nhỏ. Vì mỗi row group có thống kê riêng, bộ lọc loại cả row group mà không chạm dữ liệu bên trong — cả hai cùng phục vụ mục tiêu đọc ít nhất có thể.",
    },

    { kind: "h2", text: "Chỉ đọc phần cần: cắt cột và đẩy bộ lọc xuống tệp" },
    {
      kind: "p",
      text: "Hai kỹ thuật làm nên phần lớn tốc độ đọc Parquet. Cắt cột chỉ đọc những cột truy vấn thực sự dùng. Đẩy bộ lọc xuống áp điều kiện ngay ở tầng tệp để bỏ qua dữ liệu không khớp.",
    },
    {
      kind: "ul",
      items: [
        "Cắt cột: tầng đọc chỉ mở đúng các column chunk cần thiết thay vì toàn bộ hàng.",
        "Đẩy bộ lọc: dựa vào thống kê row group, một số row group bị bỏ qua hoàn toàn.",
        "Kết hợp cả hai: lượng dữ liệu phải giải mã giảm mạnh trước khi tính toán.",
      ],
    },
    {
      kind: "p",
      text: "Phía người viết SQL, bạn chỉ cần chọn đúng cột, viết `WHERE` cụ thể và để engine lo phần còn lại. Điều bạn chủ động là sắp dữ liệu cho bộ lọc phổ biến khớp với cấu trúc tệp — đó là lúc phân vùng bước vào.",
    },

    { kind: "h2", text: "Phân vùng theo thư mục: tenant, năm, tháng" },
    {
      kind: "p",
      text: "Phân vùng là chia dữ liệu thành nhiều tệp theo giá trị của một cột, rồi đặt vào thư mục có tên phản ánh giá trị đó. DuckDB hỗ trợ phân vùng kiểu Hive theo đường dẫn, nên `tenant=acme/year=2026/month=10` trở thành một phần của bộ lọc.",
    },
    {
      kind: "p",
      text: "Với OpenVie, ba cột phân vùng đã rõ: tenant, năm, tháng. Truy vấn một tenant trong một tháng chỉ mở đúng thư mục đó. Phân vùng theo tenant biến ranh giới tenant thành ranh giới thư mục, nhất quán với phần còn lại: Qdrant và Kuzu luôn lọc theo tenant, quyền do vai trò `ORG_OWNER`, `WORKSPACE_ADMIN`, `MEMBER` quyết định.",
    },
    {
      kind: "quote",
      text: "Phân vùng không làm truy vấn nhanh lên một cách thần kỳ. Nó chỉ làm cho tập tệp phải mở nhỏ đi — và điều đó thường là yếu tố quyết định.",
    },
    {
      kind: "p",
      text: "Đổi lại, quá nhiều thư mục nhỏ khiến mỗi truy vấn phải mở nhiều tệp và tốn chi phí metadata. Chọn khóa phân vùng là quyết định thiết kế, không phải mặc định. Cách DuckDB ánh xạ tên thư mục thành cột nằm trong [tài liệu phân vùng Hive](https://duckdb.org/docs/stable/data/partitioning/hive_partitioning).",
    },

    { kind: "h2", text: "Trỏ DuckDB vào tệp Parquet (code block)" },
    {
      kind: "p",
      text: "DuckDB cho truy vấn Parquet bằng một hàm đọc ngay trong SQL. Bạn dùng mẫu đường dẫn có ký tự đại diện để gom nhiều tệp trong một thư mục phân vùng, và cột phân vùng được nhận diện từ tên thư mục.",
    },
    {
      kind: "code",
      label: "DuckDB đọc Parquet phân vùng theo Hive",
      lines: [
        "SELECT",
        "  workspace_id,",
        "  month,",
        "  count(*) AS approved_documents",
        "FROM read_parquet('s3://lakehouse/tenant=acme/year=2026/month=10/*.parquet')",
        "WHERE approval_status = 'approved'",
        "GROUP BY workspace_id, month",
        "ORDER BY workspace_id;",
      ],
    },
    {
      kind: "p",
      text: "Truy vấn chạm đúng ba cột, lọc trên một cột, gom theo workspace cùng tháng. Không có bước nạp nào trước: DuckDB đọc thẳng tệp Parquet, dù trên đĩa hay object storage.",
    },
    {
      kind: "callout",
      tone: "info",
      title: "Đọc trên object storage",
      body: "Đọc Parquet trên object storage cần cấu hình truy cập S3 của engine — khóa, vùng, endpoint. Khi đã cấu hình, bạn dùng được `read_parquet('s3://bucket/...')` như với tệp cục bộ.",
    },

    { kind: "h2", text: "CDC: phần biến database thành hồ dữ liệu" },
    {
      kind: "p",
      text: "Đọc tệp là nửa sau của câu chuyện. Nửa trước là đưa dữ liệu từ database giao dịch tới hồ dưới dạng Parquet — việc của CDC, change data capture.",
    },
    {
      kind: "p",
      text: "Trong OpenVie, thay đổi từ database đi qua RabbitMQ rồi được ghi thành Parquet nén Snappy trên SeaweedFS S3. Ứng dụng vẫn ghi PostgreSQL như thường, còn một luồng riêng mang thay đổi ra hồ.",
    },
    {
      kind: "ol",
      items: [
        "Thay đổi được phát ra khi dữ liệu nghiệp vụ thay đổi.",
        "Thông điệp đi qua RabbitMQ, tách tốc độ ghi của ứng dụng khỏi tốc độ của hồ.",
        "Bộ ghi nhận thông điệp và tạo tệp Parquet nén Snappy.",
        "Tệp được đặt vào thư mục phân vùng tenant, năm, tháng trên SeaweedFS S3.",
      ],
    },
    {
      kind: "p",
      text: "Các bộ dữ liệu tách theo lĩnh vực: chat, audit, document và workflow. Kết quả là một hồ nhỏ đủ dùng: dữ liệu ở Parquet chuẩn, DuckDB nhúng chạy SQL phân tích trên đó mà không gây tải lên PostgreSQL.",
    },

    { kind: "h2", text: "Vì sao ghi phải bất đồng bộ và theo lô" },
    {
      kind: "p",
      text: "Nếu mỗi thay đổi tạo ngay một tệp Parquet nhỏ, bạn sớm có hàng nghìn tệp tí hon. Mỗi tệp mang chi phí metadata và mở tệp mà mọi truy vấn về sau phải trả.",
    },
    {
      kind: "p",
      text: "Vì thế đường ghi được thiết kế bất đồng bộ và theo lô: thay đổi gom lại rồi ghi thành tệp kích thước hợp lý, và ứng dụng không bị buộc phải chờ hồ dữ liệu.",
    },
    {
      kind: "ul",
      items: [
        "Bất đồng bộ: ứng dụng không chặn theo tốc độ của hồ.",
        "Theo lô: nhiều thay đổi nhỏ gộp thành ít tệp lớn hơn.",
        "Nén Snappy: giảm dung lượng lưu trữ với chi phí giải mã chấp nhận được.",
        "Phân vùng: giữ số tệp trong mỗi thư mục ở mức hợp lý.",
      ],
    },
    {
      kind: "p",
      text: "Đây cũng là mô hình DuckLake mô tả: ghi nhanh bằng nhiều lô nhỏ rồi nén gộp ở nền. Nó thừa nhận ghi nhanh và đọc hiệu quả có nhu cầu khác nhau — nền tảng tốt dung hòa cả hai. Chi tiết ở [bài kiến trúc DuckLake của MotherDuck](https://motherduck.com/blog/ducklake-architecture-deep-dive).",
    },

    { kind: "h2", text: "Object storage tự lưu trữ vẫn dùng được cách này" },
    {
      kind: "p",
      text: "Một hiểu lầm hay gặp là lakehouse chỉ hợp với cloud. Điều đó không đúng: Parquet là định dạng tệp, object storage là giao diện đọc ghi, và bạn tự chạy được cả hai.",
    },
    {
      kind: "ul",
      items: [
        "Parquet chuẩn hoạt động với mọi hệ thống đọc được định dạng này, kể cả tệp trên S3, Azure Blob, GCS, R2 hay Tigris.",
        "SeaweedFS S3 trong OpenVie là object storage tự lưu trữ, tương thích giao diện S3.",
        "DuckDB nhúng chạy trong tiến trình, không cần cluster riêng, và đọc trực tiếp tệp.",
        "Bạn giữ quyền kiểm soát vị trí dữ liệu, khóa truy cập và vòng đời tệp.",
      ],
    },
    {
      kind: "p",
      text: "Đổi lại, bạn tự lo hạ tầng: cấu hình truy cập, phân quyền, sao lưu, giám sát. DuckLake cũng theo tinh thần đó: mang blob storage riêng, dữ liệu ở Parquet chuẩn, catalog lo phần quản lý.",
    },

    { kind: "h2", text: "Phả hệ và kiểm định chất lượng dữ liệu" },
    {
      kind: "p",
      text: "Khi dữ liệu chảy qua nhiều bước, câu hỏi đổi từ con số đúng chưa thành con số này đến từ đâu. Phả hệ dữ liệu — lineage DAG — trả lời bằng cách ghi lại các bước biến đổi và quan hệ phụ thuộc.",
    },
    {
      kind: "ul",
      items: [
        "Lineage DAG: mỗi bộ dữ liệu biết nó sinh ra từ đâu và đi qua những bước nào.",
        "Khung kiểm định chất lượng: các kiểm tra chạy như một phần của đường ống, không phải việc thủ công.",
        "Kiểm tra điển hình: hàng thiếu, hàng trùng, giá trị ngoài miền hợp lệ, phân vùng rỗng bất thường.",
        "Kết quả kiểm định phải nhìn thấy được, nếu không nó chỉ là bước chạy mà không ai đọc.",
      ],
    },

    { kind: "h2", text: "Sao lưu, phục hồi và ranh giới vận hành" },
    {
      kind: "p",
      text: "OpenVie cung cấp script vận hành sao lưu và phục hồi có kiểm chứng SHA-256 (`scripts/ops/backup.sh`, `restore.sh`), kèm một buổi diễn tập phục hồi thảm họa. Lịch chạy thuộc về người vận hành: sản phẩm cho bạn công cụ, nó không quyết định thay bạn chạy lúc nào.",
    },
    {
      kind: "ol",
      items: [
        "Đặt tần suất sao lưu theo tốc độ thay đổi dữ liệu và mức mất mát chấp nhận được.",
        "Kiểm chứng bản sao lưu bằng SHA-256 trước khi tin vào nó.",
        "Chạy diễn tập phục hồi định kỳ, không chỉ khi có sự cố.",
        "Ghi lại ai chịu trách nhiệm cho từng bước và bằng chứng mỗi lần chạy.",
      ],
    },
    {
      kind: "callout",
      tone: "warn",
      title: "Sao lưu chưa phục hồi được thì chưa phải sao lưu",
      body: "Một tệp sao lưu tồn tại không chứng minh rằng bạn khôi phục được. Chỉ buổi diễn tập phục hồi, chạy trên môi trường thật, mới trả lời được câu hỏi đó. Lịch diễn tập là quyết định của người vận hành.",
    },
    {
      kind: "p",
      text: "Ranh giới cũng cần rõ: tầng phân tích là bản sao dùng để đọc, không thay thế database giao dịch.",
    },

    { kind: "h2", text: "Danh sách kiểm tra khi thiết kế" },
    {
      kind: "ol",
      items: [
        "Chọn khóa phân vùng khớp với câu hỏi phổ biến nhất, ví dụ tenant, năm, tháng.",
        "Giữ tệp ở kích thước hợp lý; tránh biến hồ thành hàng nghìn tệp nhỏ.",
        "Chỉ định rõ bộ dữ liệu nào dùng nén Snappy và vì sao.",
        "Viết SQL chỉ chọn cột cần thiết để cắt cột phát huy tác dụng.",
        "Đẩy bộ lọc xuống bằng điều kiện `WHERE` cụ thể và đúng kiểu.",
        "Tách bộ dữ liệu theo lĩnh vực — chat, audit, document, workflow — khi hình dạng và tần suất hỏi khác nhau.",
        "Thiết kế đường ghi bất đồng bộ và theo lô ngay từ đầu.",
        "Thêm kiểm tra chất lượng dữ liệu vào đường ống, kèm cảnh báo khi bước kiểm tra thất bại.",
        "Ghi lại phả hệ để có thể lần ngược nguồn của mỗi con số.",
        "Đặt lịch sao lưu và diễn tập phục hồi, ghi rõ người chịu trách nhiệm.",
      ],
    },
    {
      kind: "p",
      text: "Với OpenVie, câu trả lời là một hồ Parquet phân vùng, ghi qua CDC, đọc bằng DuckDB nhúng, tuân theo cùng ranh giới tenant như phần còn lại của hệ thống. Lõi headless: toàn bộ năng lực đi qua HTTP JSON tại `/api/v1/**`, ứng dụng web chỉ là một client tham chiếu. Bạn có thể giữ cách này hoặc thay — miễn là hiểu cái giá của nó.",
    },
  ],
  sources: [
    {
      label: "Reading and Writing Parquet Files — DuckDB documentation",
      href: "https://duckdb.org/docs/stable/data/parquet/overview",
    },
    {
      label: "Hive Partitioning — DuckDB documentation",
      href: "https://duckdb.org/docs/stable/data/partitioning/hive_partitioning",
    },
    {
      label: "DuckLake Architecture Deep Dive — MotherDuck",
      href: "https://motherduck.com/blog/ducklake-architecture-deep-dive",
    },
    {
      label: "apache/parquet-format — định dạng tệp Parquet (GitHub)",
      href: "https://github.com/apache/parquet-format",
    },
  ],
};
