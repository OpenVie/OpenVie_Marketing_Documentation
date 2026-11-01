import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "phe-duyet-bpmn-2-cap",
  date: "2026-10-11",
  readingMinutes: 11,
  tags: ["BPMN", "Phê duyệt", "Audit"],
  title: "Phê duyệt hai cấp trên BPMN: kiểm soát quy trình từ sơ đồ đến audit",
  description:
    "Một cột trạng thái không đủ cho nghiệp vụ phê duyệt. Xem cách OpenVie nhúng engine BPMN, ghi audit từng bước và phát webhook có chữ ký.",
  lede: "Khi phê duyệt có hai cấp, hạn chót và leo thang, một cột `status` bắt đầu rò rỉ logic nghiệp vụ ra khắp code. Bản này đi qua cách OpenVie đặt quy trình lên engine BPMN nhúng, ghi quyết định vào trạng thái tài liệu, và biến mỗi bước thành một sự kiện có thể kiểm chứng.",
  blocks: [
    {
      kind: "h2",
      text: "Vì sao một cột trạng thái không mô tả nổi nghiệp vụ",
    },
    {
      kind: "p",
      text: "Hầu hết hệ thống quản lý tài liệu bắt đầu bằng một cột `status` với vài giá trị: nháp, chờ duyệt, đã duyệt. Với luồng một người, một bước, thế là đủ. Nhưng nghiệp vụ phê duyệt hiếm khi dừng ở đó. Người viết không phải người duyệt, cấp một khác cấp hai, và luôn có người phải chịu trách nhiệm khi quá hạn.",
    },
    {
      kind: "p",
      text: "Một cột trạng thái chỉ trả lời \"bây giờ tài liệu ở đâu\", không trả lời \"ai đang giữ\", \"đã giữ bao lâu\", \"bước tiếp theo là gì\". Khi bạn nhồi những câu đó vào thêm cột hay bảng phụ, bạn đang tự dựng một engine quy trình bằng tay — chỉ là không gọi tên nó như vậy.",
    },
    {
      kind: "ul",
      items: [
        "Trạng thái hiện tại không nói được ai chịu trách nhiệm cho bước kế tiếp.",
        "Không có chỗ tự nhiên cho hạn chót và hành vi khi quá hạn.",
        "Lịch sử thay đổi thường mất, hoặc chỉ còn lại dòng cuối cùng.",
        "Mọi chuyển trạng thái nằm rải rác trong code ứng dụng, khó kiểm chứng.",
      ],
    },
    {
      kind: "p",
      text: "Khi những câu hỏi đó xuất hiện, bạn cần một thứ mô tả được cả quy trình. Đó là lý do OpenVie đặt phê duyệt hai cấp trên một engine BPMN.",
    },

    {
      kind: "h2",
      text: "BPMN: mô tả quy trình bằng sơ đồ có node và transition",
    },
    {
      kind: "p",
      text: "BPMN 2.0 mô tả quy trình bằng node (sự kiện, tác vụ) và transition (luồng nối giữa chúng). Thay vì viết logic chuyển trạng thái rải rác trong code, bạn vẽ quy trình và để engine chạy theo đúng sơ đồ đó. Sơ đồ trở thành nguồn sự thật chung cho cả người thiết kế nghiệp vụ lẫn người đọc code.",
    },
    {
      kind: "figure",
      src: "/blog/bpmn-two-step-approval.png",
      width: 483,
      height: 130,
      maxWidth: 560,
      alt: "Sơ đồ BPMN bốn bước: sự kiện bắt đầu, tác vụ người dùng 'Write monthly financial report', tác vụ người dùng 'Verify monthly financial report', sự kiện kết thúc.",
      caption:
        "Ví dụ BPMN do chính Flowable cung cấp: một sự kiện bắt đầu, hai tác vụ người dùng nối tiếp nhau và một sự kiện kết thúc. OpenVie ánh xạ hai bước duyệt này vào hai vai trò khác nhau — bước viết bám vai WORKSPACE_ADMIN, bước kiểm tra bám vai ORG_OWNER.",
      credit: "Ảnh: Flowable (flowable/flowable-engine)",
      creditHref:
        "https://github.com/flowable/flowable-engine/blob/main/docs/docusaurus/docs/assets/bpmn/financial.report.example.diagram.png",
      licence: "Apache License 2.0",
      licenceHref: "https://github.com/flowable/flowable-engine/blob/main/LICENSE",
    },
    {
      kind: "p",
      text: "Engine bạn dùng là Flowable — một engine BPMN/BPM gọn, chạy được như thư viện trong ứng dụng Java thay vì phải là một nền tảng độc lập. Dự án mô tả nó là nền tảng quy trình cho lập trình viên, quản trị hệ thống và người dùng nghiệp vụ.",
    },
    {
      kind: "quote",
      text: "Một quy trình có thể kiểm chứng là quy trình vẽ ra được, không phải quy trình nằm rải trong hàng trăm câu điều kiện.",
    },

    {
      kind: "h2",
      text: "Nhúng engine vào runtime sẵn có thay vì dựng một nền tảng riêng",
    },
    {
      kind: "p",
      text: "OpenVie nhúng engine Flowable BPMN ngay trong runtime API chính: không có dịch vụ quy trình tách riêng, không có database riêng cho quy trình, không có hàng đợi trung gian chỉ để bắc cầu hai hệ thống. Cùng một tiến trình, cùng một kết nối, cùng một vòng đời triển khai.",
    },
    {
      kind: "p",
      text: "Cái giá có thật: engine sống chung tiến trình với API, nên một lỗi trong định nghĩa quy trình có thể ảnh hưởng tới phần còn lại, và bạn kế thừa giới hạn tài nguyên của tiến trình đó. Đổi lại, bạn không phải giữ đồng bộ hai hệ thống, và một lần đổi trạng thái không cần cuộc gọi mạng nội bộ.",
    },
    {
      kind: "code",
      label: "Định danh quy trình và bảng trạng thái",
      lines: [
        "# định danh quy trình tài liệu",
        "workflow_id: approval/v1/document-review",
        "",
        "# bảng engine Flowable nằm cùng PostgreSQL với dữ liệu ứng dụng",
        "ACT_RE_*   # định nghĩa và tài nguyên quy trình",
        "ACT_RU_*   # thực thể đang chạy",
        "ACT_HI_*   # lịch sử",
        "",
        "# trạng thái phê duyệt do ứng dụng đọc trực tiếp",
        "documents.approval_status",
      ],
    },

    {
      kind: "h2",
      text: "Bảng ACT_* và chỗ ghi quyết định",
    },
    {
      kind: "p",
      text: "Bảng của engine dùng tiền tố `ACT_`. Nhóm định nghĩa giữ mô hình quy trình, nhóm runtime giữ thực thể đang chạy, nhóm lịch sử giữ dấu vết đã hoàn thành. Vì các bảng này nằm cùng PostgreSQL với dữ liệu ứng dụng, bạn truy vấn quy trình bằng chính công cụ dùng cho phần còn lại.",
    },
    {
      kind: "p",
      text: "Điểm quan trọng là tách bạch vai trò hai bên. Engine giữ máy trạng thái: node nào đang chờ, ai phải hành động, bước nào tiếp theo. Ứng dụng giữ sự thật nghiệp vụ ở chỗ mà client đọc được. Quyết định duyệt không bị chôn trong bảng engine; nó ghi thẳng vào `approval_status` của tài liệu.",
    },
    {
      kind: "callout",
      title: "Đừng để hai nguồn sự thật lệch nhau",
      body: "Engine biết bước kế tiếp, nhưng người dùng đọc `documents.approval_status`. Nếu một quyết định chỉ ghi vào bảng engine mà không ghi vào tài liệu — hoặc ngược lại — hai bên sẽ lệch. Hãy để quyết định phát ra từ một chỗ và ghi vào cả hai trong cùng một giao dịch.",
      tone: "info",
    },

    {
      kind: "h2",
      text: "Timer event: cơ chế đứng sau nhắc nhở và leo thang",
    },
    {
      kind: "p",
      text: "Nhắc nhở và leo thang không phải là cron job viết tay. Chúng là timer event trong quy trình. Theo tài liệu Flowable, timer có thể là start event, intermediate catching event hoặc boundary event; hành vi phụ thuộc business calendar được dùng, và trong định nghĩa timer có thể ghi tên business calendar riêng. Thuộc tính thời lượng dùng định dạng ISO 8601 theo yêu cầu của BPMN 2.0, và định nghĩa timer phải có đúng một phần tử.",
    },
    {
      kind: "p",
      text: "Với OpenVie, điều đó nghĩa là mốc \"nhắc sau 24 giờ\" và \"leo thang sau 48 giờ\" gắn trực tiếp vào node đang chờ. Khi thời hạn trôi qua, chính engine đẩy bước tiếp theo, không phải một tiến trình quét định kỳ đoán xem ai đang trễ.",
    },
    {
      kind: "h2",
      text: "Lịch sử và audit: engine ghi được gì, mức nào",
    },
    {
      kind: "p",
      text: "Engine có các thực thể lịch sử như `HistoricActivityInstance` — một lần thực thi của một hoạt động — và `HistoricDetail`. Đây là chỗ trả lời \"ai đã làm gì, khi nào\", thay vì chỉ biết trạng thái cuối. Mức lịch sử cấu hình được qua enum `HistoryLevel`.",
    },
    {
      kind: "p",
      text: "Đáng chú ý là mức `none`: nó bỏ toàn bộ việc lưu lịch sử. Đó là mức nhanh nhất, nhưng đổi lại bạn không còn thông tin lịch sử nào. Vì phê duyệt là nghiệp vụ cần truy vết, OpenVie cần mức `audit`.",
    },
    {
      kind: "callout",
      title: "Chọn mức lịch sử là một quyết định, không phải mặc định",
      body: "Đặt mức lịch sử về `none` để tiết kiệm dung lượng là đánh đổi trực tiếp vào khả năng audit: bạn không còn sự kiện nào để dựng lại quá trình duyệt. Với quy trình phê duyệt, hãy chọn mức `audit` và chấp nhận chi phí lưu trữ đi kèm.",
      tone: "warn",
    },

    {
      kind: "h2",
      text: "Hai cấp duyệt và hai vai trò khác nhau",
    },
    {
      kind: "p",
      text: "OpenVie phê duyệt hai cấp trên engine Flowable nhúng trong API runtime chính. Cấp một thuộc vai `WORKSPACE_ADMIN`, cấp hai thuộc vai `ORG_OWNER`. Hai vai này nằm trong mô hình ba vai trò của hệ thống: `ORG_OWNER`, `WORKSPACE_ADMIN`, `MEMBER`.",
    },
    {
      kind: "p",
      text: "Việc chia hai cấp không chỉ là hai lần bấm nút. Nó tách trách nhiệm: người quản trị workspace biết bối cảnh công việc, còn chủ tổ chức chịu trách nhiệm cuối. Vì cả hai cấp ánh xạ vào vai thật, quyền duyệt không phải một cờ rời rạc cần đồng bộ tay.",
    },
    {
      kind: "ol",
      items: [
        "Cấp một — `WORKSPACE_ADMIN` xem tài liệu và đưa ra quyết định đầu tiên.",
        "Cấp hai — `ORG_OWNER` xác nhận hoặc từ chối trên kết quả của cấp một.",
        "Chỉ khi cả hai cấp đồng ý thì quyết định mới hoàn tất và tài liệu mới sang trạng thái đã duyệt.",
      ],
    },

    {
      kind: "h2",
      text: "Chống tự phê duyệt",
    },
    {
      kind: "p",
      text: "Một quy trình hai cấp vô nghĩa nếu người viết tự duyệt tài liệu của mình. OpenVie chặn tự phê duyệt ở tầng quy trình: người đã khởi tạo hoặc đã duyệt một bước không thể duyệt bước kế tiếp khi hai vai trùng nhau. Kiểm tra này nằm trong engine, không phụ thuộc vào việc giao diện có ẩn nút hay không.",
    },
    {
      kind: "p",
      text: "Đây là kiểm tra cấu trúc, chứ không phải một mô hình phán đoán. Nó không cố suy luận ý định; nó chỉ từ chối một chuyển bước khi danh tính người thao tác vi phạm ràng buộc. Nhờ vậy, cùng một tài liệu không thể đi hết hai cấp dưới một danh tính.",
    },

    {
      kind: "h2",
      text: "Quyết định ghi thẳng vào trạng thái tài liệu và phát sự kiện",
    },
    {
      kind: "p",
      text: "Khi một bước được quyết định, kết quả ghi thẳng vào `approval_status` của tài liệu. Client đọc trạng thái phê duyệt từ chỗ quen thuộc, không phải học thêm cách truy vấn bảng engine. Song song đó, mỗi bước để lại một dòng audit log riêng.",
    },
    {
      kind: "p",
      text: "Cùng lúc, hệ thống phát sự kiện quy trình: `workflow.started`, `workflow.approved`, `workflow.rejected`, `workflow.escalated`. Sự kiện không phải một side effect tuỳ tiện — nó là cách phần còn lại của hệ thống biết chuyện gì vừa xảy ra mà không phải đọc lại bảng engine.",
    },
    {
      kind: "code",
      label: "Sự kiện quy trình",
      lines: [
        "workflow.started     # quy trình bắt đầu chờ duyệt",
        "workflow.approved    # một cấp đã đồng ý",
        "workflow.rejected    # một cấp đã từ chối",
        "workflow.escalated   # timer đẩy bước lên cấp trên",
      ],
    },

    {
      kind: "h2",
      text: "Webhook workflow.* và outbox",
    },
    {
      kind: "p",
      text: "Các sự kiện trên phát ra qua webhook, ký bằng HMAC-SHA256 để phía nhận xác minh được nguồn gửi. Danh sách gồm `document.status.changed` và nhóm `workflow.started/approved/rejected/escalated`. Engine BPMN tổng quát cũng lộ qua `/api/v1/workflow/engine`, kèm Postman collection để thử nhanh.",
    },
    {
      kind: "p",
      text: "Webhook không gửi kiểu bắn rồi quên. Hệ thống dùng một outbox: sự kiện được ghi lại trước, rồi một bộ gửi có retry giới hạn. Khi số lần thử vượt ngưỡng, bản ghi chuyển sang trạng thái DEAD thay vì thử vô hạn. Bạn nhìn thấy được cái gì chưa gửi thay vì chỉ biết nó im lặng.",
    },
    {
      kind: "callout",
      title: "HMAC và outbox là hai nửa của một hợp đồng",
      body: "HMAC-SHA256 cho phía nhận biết chắc đó là bạn. Outbox cho bạn biết chắc món gì còn chờ gửi. Một cái không thay thế được cái kia: chữ ký đúng không cứu được một sự kiện đã rơi mất.",
      tone: "info",
    },

    {
      kind: "h2",
      text: "Thông báo và cấu hình SLA theo tổ chức",
    },
    {
      kind: "p",
      text: "Mỗi bước duyệt gửi email thông báo cho người cần hành động, để quy trình không kẹt vì không ai biết mình đang bị chờ. Mặc định SLA nhắc sau 24 giờ và leo thang sau 48 giờ; hai con số này cấu hình được theo tổ chức.",
    },
    {
      kind: "p",
      text: "Cấu hình theo tổ chức nghĩa là bạn không sửa code để đổi chính sách: đổi hạn nhắc cho một tổ chức không đụng tới tổ chức khác. Đổi lại, bạn phải quản lý cấu hình đó như một phần của vận hành.",
    },

    {
      kind: "h2",
      text: "Sao lưu bao trùm cả bảng trạng thái lẫn bảng engine",
    },
    {
      kind: "p",
      text: "Vì bảng trạng thái và bảng engine nằm cùng PostgreSQL, sao lưu và phục hồi đi qua cùng một cơ chế. OpenVie dùng `scripts/ops/backup.sh` và `scripts/ops/restore.sh` với kiểm chứng SHA-256, kèm diễn tập phục hồi thảm hoạ; lịch chạy thuộc người vận hành.",
    },
    {
      kind: "p",
      text: "Điểm cần chú ý là thứ tự khôi phục. Nếu bạn khôi phục dữ liệu tài liệu mà bỏ quên bảng engine, `approval_status` sẽ nói một đằng còn quy trình đang chờ nói một nẻo. Sao lưu đúng nghĩa là cả hai phía trong cùng một ảnh chụp nhất quán.",
    },
    {
      kind: "quote",
      text: "Trạng thái tài liệu và trạng thái quy trình là một cặp. Sao lưu nửa cặp đó thì phục hồi xong bạn có hai nửa không khớp.",
    },

    {
      kind: "h2",
      text: "Danh sách kiểm tra khi thiết kế quy trình",
    },
    {
      kind: "p",
      text: "Trước khi đưa một quy trình phê duyệt vào chạy, hãy đi qua danh sách dưới đây. Nó không thay thế thiết kế nghiệp vụ, chỉ giữ cho sơ đồ và hành vi runtime khớp nhau.",
    },
    {
      kind: "ol",
      items: [
        "Sơ đồ có đúng số cấp duyệt và mỗi cấp bám một vai thật chứ?",
        "Ràng buộc chống tự phê duyệt áp cho mọi bước, không chỉ bước đầu chưa?",
        "Timer event gắn đúng node đang chờ, và mốc thời lượng khai bằng ISO 8601?",
        "Mức lịch sử đủ để dựng lại ai đã duyệt bước nào?",
        "Mỗi quyết định ghi cả vào `approval_status` lẫn audit log từng bước?",
        "Sự kiện `workflow.*` có outbox và ngưỡng retry rõ ràng, chuyển DEAD khi vượt?",
        "Webhook được ký HMAC-SHA256 và phía nhận thực sự kiểm chữ ký?",
        "SLA nhắc và leo thang đã cấu hình theo tổ chức, đúng nhịp làm việc chưa?",
        "Sao lưu phủ cả bảng trạng thái lẫn bảng engine trong một ảnh chụp nhất quán?",
      ],
    },
    {
      kind: "p",
      text: "Khi cả chín mục đều đã trả lời được, bạn có một quy trình mô tả được, chạy được và truy vết được. Đó là toàn bộ điểm của việc đặt phê duyệt lên engine thay vì một cột trạng thái.",
    },
  ],
  sources: [
    {
      label: "flowable/flowable-engine — engine BPMN/BPM (GitHub)",
      href: "https://github.com/flowable/flowable-engine",
    },
    {
      label: "Flowable — BPMN constructs (timer event, tài liệu trong repo)",
      href: "https://github.com/flowable/flowable-engine/blob/main/docs/docusaurus/docs/bpmn/ch07b-BPMN-Constructs.md",
    },
    {
      label: "Flowable — lịch sử và mức lịch sử (tài liệu trong repo)",
      href: "https://github.com/flowable/flowable-engine/blob/main/docs/docusaurus/docs/bpmn/ch10-History.md",
    },
  ],
};
