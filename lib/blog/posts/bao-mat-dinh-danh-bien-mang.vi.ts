import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "bao-mat-dinh-danh-bien-mang",
  date: "2026-10-05",
  readingMinutes: 17,
  tags: ["Bảo mật", "OIDC", "Biên mạng"],
  title: "Định danh, quyền và biên mạng: ba lớp của một ranh giới",
  description:
    "Keycloak, PKCE, APISIX và ClamAV trong một mô hình bảo mật: ai được vào, được làm gì, và được gửi bao nhiêu yêu cầu.",
  lede:
    "Bảo mật một nền tảng RAG tự host không nằm ở một middleware duy nhất. Nó nằm ở ba quyết định tách biệt: ai là người gọi, người đó được chạm vào tài nguyên nào, và biên mạng cho phép bao nhiêu lưu lượng đi qua.",
  blocks: [
    {
      kind: "h2",
      text: "Ba câu hỏi khác nhau, ba tầng khác nhau",
    },
    {
      kind: "p",
      text: "Một hệ thống RAG tự host nhận ba câu hỏi bảo mật khác nhau, và chúng không sống cùng một tầng. Câu thứ nhất: bạn là ai. Câu thứ hai: bạn được làm gì với tài nguyên nào. Câu thứ ba: bạn được gửi bao nhiêu yêu cầu trong một khoảng thời gian. Gộp cả ba vào một chỗ là cách nhanh nhất để một lỗi nhỏ ở tầng này mở đường cho lỗi lớn ở tầng khác.",
    },
    {
      kind: "p",
      text: "OpenVie tách ba tầng. Tầng ứng dụng, chạy Spring, quyết định danh tính và quyền dựa trên token OIDC và membership sống. Tầng biên, Apache APISIX, quyết định lưu lượng vào: route nào được gọi, bao nhiêu yêu cầu mỗi giây, header nào bị chặn. Tầng nội bộ, gRPC, quyết định kênh nào được gọi service nào và kênh đó có mTLS hay không. Ba tầng này không thay thế nhau. Chúng chặn ba loại lỗi khác nhau.",
    },
    {
      kind: "ul",
      items: [
        "Danh tính: ai đang gọi — người dùng qua SSO, tài khoản mật khẩu cũ, hay một khoá máy `ovk_`.",
        "Quyền: người gọi được đọc, ghi hay phê duyệt tài nguyên nào, trong tenant nào.",
        "Lưu lượng: người gọi được gửi bao nhiêu yêu cầu, và ai trả lời khi vượt hạn mức.",
      ],
    },
    {
      kind: "h2",
      text: "Không để ứng dụng tự quyết định danh tính",
    },
    {
      kind: "p",
      text: "Cách chắc chắn nhất để có một lỗ hổng định danh là để ứng dụng tự viết luồng đăng nhập. Mật khẩu, phiên, cookie, đặt lại mật khẩu, khoá bí mật — mỗi thứ là một bề mặt tấn công riêng, và mỗi lần vá là một lần bạn tự kiểm chứng lại từ đầu. OpenVie đẩy phần đó sang Keycloak qua OIDC, còn Spring chỉ đóng vai resource server: nhận access token, kiểm tra trước khi xử lý yêu cầu, rồi trả lời theo quyền đã có.",
    },
    {
      kind: "p",
      text: "Điều này không có nghĩa là vai trò trong IdP tự động trở thành quyền trong hệ thống. Vai trò của IdP được ánh xạ sang đúng ba vai trò của OpenVie: `ORG_OWNER`, `WORKSPACE_ADMIN`, `MEMBER`. Tài khoản mật khẩu cũ vẫn đăng nhập được, nên bạn có thể chuyển dần sang SSO mà không cắt ai khỏi hệ thống trong lúc chuyển.",
    },
    {
      kind: "callout",
      title: "Một nguồn sự thật cho danh tính",
      body: "Nếu ứng dụng tự kiểm tra mật khẩu song song với Keycloak, bạn có hai nguồn sự thật và hai cách hiểu khác nhau về cùng một người. Chọn một nguồn, rồi ánh xạ phần còn lại vào đó.",
      tone: "info",
    },
    {
      kind: "h2",
      text: "Authorization Code và PKCE: vì sao mã uỷ quyền bị chặn không dùng lại được",
    },
    {
      kind: "p",
      text: "Grant type Authorization Code chuyển trình duyệt của người dùng tới Keycloak. Người dùng đăng nhập ở đó, Keycloak trả về một mã uỷ quyền ngắn hạn, và ứng dụng đổi mã đó lấy token. Token không bao giờ đi qua thanh địa chỉ. Đây là lý do luồng này được dùng cho ứng dụng web, thay vì luồng implicit cũ.",
    },
    {
      kind: "p",
      text: "Nhưng mã uỷ quyền vẫn có thể bị chặn trên đường: log proxy, lịch sử trình duyệt, một redirect URI bị chiếm. PKCE, theo [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636.txt), xử lý đúng tình huống đó. Ứng dụng tạo một `code_verifier` ngẫu nhiên, băm nó bằng S256 thành `code_challenge`, gửi challenge kèm yêu cầu uỷ quyền. Khi đổi mã lấy token, ứng dụng phải gửi lại verifier gốc. Kẻ tấn công có mã nhưng không có verifier thì không đổi được thành token.",
    },
    {
      kind: "p",
      text: "PKCE quan trọng nhất với client công khai — ứng dụng không giữ được client secret, ví dụ SPA hay ứng dụng chạy trên máy người dùng. Với client bí mật, nó vẫn là một lớp thêm gần như miễn phí. OpenVie dùng Authorization Code kèm PKCE S256 cho luồng SSO.",
    },
    {
      kind: "ol",
      items: [
        "Ứng dụng tạo `code_verifier`, băm thành `code_challenge` bằng S256 và gửi kèm yêu cầu uỷ quyền.",
        "Keycloak xác thực người dùng và trả mã uỷ quyền về redirect URI đã đăng ký.",
        "Ứng dụng đổi mã lấy token, gửi kèm `code_verifier` gốc.",
        "Keycloak băm verifier và so với challenge đã nhận; sai thì từ chối cấp token.",
      ],
    },
    {
      kind: "h2",
      text: "Cấu hình luồng đăng nhập trong Keycloak",
    },
    {
      kind: "p",
      text: "Luồng đăng nhập không phải một hộp đen. Trong Keycloak, luồng `browser` là một chuỗi bước có thứ tự, và mỗi bước là một lựa chọn bạn phải hiểu trước khi bật. Ảnh dưới đây là màn hình quản trị của luồng này trong kho mã nguồn Keycloak.",
    },
    {
      kind: "figure",
      src: "/blog/keycloak-browser-flow.png",
      width: 877,
      height: 965,
      maxWidth: 620,
      alt: "Màn hình Keycloak Admin Console cấu hình luồng xác thực browser, liệt kê các bước cookie, Kerberos, chuyển hướng nhà cung cấp danh tính, form đăng nhập và nhánh 2FA có điều kiện với OTP và WebAuthn.",
      caption:
        "Luồng browser trong Keycloak: cookie phiên, chuyển hướng IdP, form đăng nhập, rồi nhánh 2FA có điều kiện. Thứ tự các bước chính là chính sách đăng nhập.",
      credit: "Ảnh: Keycloak (keycloak/keycloak)",
      creditHref:
        "https://github.com/keycloak/keycloak/blob/main/docs/documentation/server_admin/images/browser-flow.png",
      licence: "Apache License 2.0",
      licenceHref: "https://github.com/keycloak/keycloak/blob/main/LICENSE.txt",
    },
    {
      kind: "p",
      text: "Bốn thành phần đáng chú ý trong ảnh. Cookie phiên giữ trạng thái đăng nhập giữa các lần redirect. Chuyển hướng nhà cung cấp danh tính cho phép đẩy người dùng sang một IdP bên ngoài nếu tổ chức đã có. Form đăng nhập là nơi mật khẩu được nhập, và cũng là nơi bạn gắn các kiểm tra bổ sung. Nhánh 2FA có điều kiện chỉ chạy khi điều kiện đúng, với OTP hoặc WebAuthn.",
    },
    {
      kind: "ul",
      items: [
        "Cookie phiên: giữ phiên giữa các bước chuyển hướng, không phải nơi chứa quyền.",
        "Chuyển hướng IdP: cho phép liên kết danh tính từ hệ thống khác mà không đổi luồng phía ứng dụng.",
        "Form đăng nhập: bề mặt chính của mật khẩu; đặt ở đây các ràng buộc về thử lại và thông báo lỗi.",
        "2FA có điều kiện: thêm OTP hoặc WebAuthn cho nhóm người dùng cần mức bảo đảm cao hơn.",
      ],
    },
    {
      kind: "h2",
      text: "Ánh xạ vai trò và membership sống",
    },
    {
      kind: "p",
      text: "Ba vai trò của OpenVie là `ORG_OWNER`, `WORKSPACE_ADMIN`, `MEMBER`. Chúng đủ hẹp để người vận hành giải thích được, và đủ rộng để không phải tạo vai trò mới cho từng tính năng. Khi IdP trả về một tập vai trò, hệ thống ánh xạ tập đó vào ba vai trò này; phần còn lại không được mang vào như quyền ngầm định.",
    },
    {
      kind: "p",
      text: "Ánh xạ chỉ là bước đầu. Quyền thực tế còn phụ thuộc membership: người dùng thuộc tenant nào, workspace nào, và vai trò của họ ở đó là gì. OpenVie suy ra vai trò từ membership sống ở mỗi yêu cầu, không đọc từ một bản sao trong token rồi tin luôn. Nếu ai đó bị gỡ khỏi workspace, yêu cầu tiếp theo đã mất quyền, không phải chờ token hết hạn.",
    },
    {
      kind: "p",
      text: "Nguyên tắc đi kèm: không tin header tenant. Một header do client gửi lên chỉ là gợi ý, không phải bằng chứng. Tenant phải được xác định từ danh tính đã xác thực và membership tra trong cơ sở dữ liệu. Ở tầng dữ liệu, Qdrant và Kuzu luôn lọc theo tenant, nên một truy vấn thiếu bộ lọc không thể âm thầm trả dữ liệu của tổ chức khác.",
    },
    {
      kind: "h2",
      text: "API key máy: khi hệ thống khác gọi vào",
    },
    {
      kind: "p",
      text: "Không phải lưu lượng nào cũng đến từ người dùng ngồi trước màn hình. Script đồng bộ, pipeline nội bộ, và tích hợp của tổ chức cần gọi API mà không có phiên đăng nhập. OpenVie cấp khoá máy có tiền tố `ovk_`. Khoá này xác thực như một service member có membership sống, và tuân theo đúng RBAC cùng tenancy như người dùng thường.",
    },
    {
      kind: "p",
      text: "Điều đó có nghĩa là một khoá máy không phải vé thông hành toàn hệ thống. Nó thuộc một tenant, có vai trò, và mất quyền khi membership bị gỡ — giống hệt một tài khoản. Bạn không cần thêm một mô hình quyền thứ hai cho máy, cũng không có nhánh code riêng dễ bị bỏ quên khi kiểm tra quyền.",
    },
    {
      kind: "ul",
      items: [
        "Một khoá cho một mục đích: tách khoá đồng bộ tài liệu khỏi khoá đọc báo cáo.",
        "Thu hồi bằng cách gỡ membership, không phải chờ khoá hết hạn.",
        "Không đặt khoá trong mã nguồn hay log; biến môi trường của dịch vụ gọi là mức tối thiểu.",
      ],
    },
    {
      kind: "h2",
      text: "Giới hạn tần suất khác nhau theo từng route",
    },
    {
      kind: "p",
      text: "Một hạn mức duy nhất cho mọi route là hạn mức sai. Đăng nhập chịu thử mật khẩu hàng loạt nên cần rất chặt. API đọc tài liệu phục vụ giao diện nên cần rộng hơn. OpenVie đặt hạn mức ở cổng biên APISIX bằng plugin `limit-req`, với thuật toán leaky bucket: `rate` là số yêu cầu mỗi giây, `burst` là số yêu cầu được phép xếp hàng thêm mỗi giây; vượt cả hai thì bị từ chối.",
    },
    {
      kind: "code",
      label: "Hạn mức theo route tại biên (APISIX limit-req)",
      lines: [
        "# Apache APISIX — plugin limit-req, thuật toán leaky bucket",
        "# /api/v1/auth/**    rate: 5 r/s    key: remote_addr",
        "# /api/v1/admin/**   rate: 20 r/s   key: consumer_name",
        "# /api/v1/**         rate: 50 r/s   key: consumer_name",
        "# rejected_code: mặc định 503 — đặt 429 để đúng ngữ nghĩa HTTP",
        "# nodelay: true — yêu cầu trong ngưỡng burst không bị làm chậm",
        "# policy: redis — bộ đếm dùng chung, không nhân theo số instance",
      ],
    },
    {
      kind: "p",
      text: "Hai tham số quyết định trải nghiệm. `rejected_code` mặc định là 503, nhưng 503 nói với client rằng dịch vụ hỏng, trong khi sự thật là client gửi quá nhanh. Đặt thành 429 thì client và thư viện retry hiểu đúng. `nodelay` quyết định các yêu cầu nằm trong ngưỡng burst được xử lý ngay hay bị giữ lại; với API tương tác, xử lý ngay thường đúng hơn là làm chậm có chủ ý.",
    },
    {
      kind: "p",
      text: "Cổng biên còn lọc URI và gắn security header: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, và HSTS. Đây là những thứ rẻ, làm một lần ở một chỗ, và không nên lặp lại trong từng controller.",
    },
    {
      kind: "h2",
      text: "Cạm bẫy của rate limit cục bộ trên nhiều instance",
    },
    {
      kind: "p",
      text: "APISIX cho chọn `policy`. Với `local`, mỗi instance giữ bộ đếm riêng trong bộ nhớ. Chạy một instance thì không sao. Chạy nhiều instance sau load balancer thì hạn mức hiệu dụng xấp xỉ `rate` nhân với số instance, vì mỗi instance đếm độc lập. Bạn đặt 50 yêu cầu mỗi giây, nhưng hệ thống thực tế nhận nhiều hơn thế.",
    },
    {
      kind: "p",
      text: "Đây là lỗi cấu hình im lặng. Không có cảnh báo, không có log, chỉ có hạn mức bị nới rộng đúng lúc bạn mở rộng quy mô. Với `redis` hoặc `redis-cluster`, các instance dùng chung hạn mức qua Redis, nên con số bạn cấu hình là con số toàn hệ thống.",
    },
    {
      kind: "callout",
      title: "Kiểm tra policy trước khi mở rộng",
      body: "Nếu bạn chạy nhiều instance APISIX mà vẫn để `policy: local`, hạn mức thật là rate nhân số instance. Chọn `redis` hoặc `redis-cluster` trước khi tăng số replica, không phải sau.",
      tone: "warn",
    },
    {
      kind: "h2",
      text: "Giới hạn ở tầng ứng dụng: theo tenant:user",
    },
    {
      kind: "p",
      text: "Hạn mức ở biên đếm theo IP hoặc theo consumer, nhưng nó không biết một người dùng đang gọi qua nhiều đường hay một tenant đang có nhiều thành viên cùng hoạt động. Tầng ứng dụng bổ sung hạn mức phân tán theo cặp `tenant:user`, lưu trong Redis, mặc định 600 yêu cầu mỗi phút. Vượt hạn mức thì trả 429 kèm `Retry-After`.",
    },
    {
      kind: "code",
      label: "Hạn mức tầng ứng dụng",
      lines: [
        "# 600 yêu cầu/phút cho mỗi cặp tenant:user — bộ đếm trong Redis",
        "# vượt hạn mức: 429 + Retry-After",
        "# kill switch: tắt hạn mức theo cấu hình khi cần điều tra sự cố",
      ],
    },
    {
      kind: "p",
      text: "Khoá đếm theo cặp tenant và user là lựa chọn có chủ ý. Nếu chỉ đếm theo user, một người thuộc hai tenant sẽ bị trừ chung một hạn mức. Nếu chỉ đếm theo tenant, một thành viên có thể dùng hết ngân sách của cả tổ chức. Cặp khoá giữ hai chiều tách biệt, và vẫn cho phép đặt hạn mức riêng cho từng tenant khi cần.",
    },
    {
      kind: "p",
      text: "Kill switch là phần ít được nói tới nhưng cần có. Khi điều tra sự cố, bạn cần tắt hạn mức nhanh để loại trừ nó là nguyên nhân, rồi bật lại. Một hạn mức không tắt được là một hạn mức bạn không dám cấu hình chặt.",
    },
    {
      kind: "h2",
      text: "Kiểm dịch luồng tải lên bằng ClamAV",
    },
    {
      kind: "p",
      text: "Tệp tải lên là dữ liệu không tin cậy đi thẳng vào pipeline xử lý. OpenVie quét luồng byte ngay tại biên bằng ClamAV, dùng lệnh `INSTREAM` để gửi nội dung qua chính socket tới clamd, và cách ly tệp bị phát hiện trước khi nó chạm vào bộ hấp thụ tài liệu.",
    },
    {
      kind: "figure",
      src: "/blog/apisix-architecture.png",
      width: 2328,
      height: 996,
      alt: "Sơ đồ kiến trúc phần mềm Apache APISIX: plugin runtime chia thành observability, security và traffic management, chạy trên lõi APISIX, OpenResty và Nginx, nhận yêu cầu từ client và chuyển tiếp tới dịch vụ.",
      caption:
        "APISIX gom plugin theo nhóm quan sát, bảo mật và quản lý lưu lượng trên cùng một lõi. Kiểm dịch tệp là một bước trong chuỗi đó, không phải một dịch vụ đứng riêng.",
      credit: "Ảnh: Apache APISIX (apache/apisix)",
      creditHref:
        "https://github.com/apache/apisix/blob/master/docs/assets/images/flow-software-architecture.png",
      licence: "Apache License 2.0",
      licenceHref: "https://github.com/apache/apisix/blob/master/LICENSE",
    },
    {
      kind: "p",
      text: "Giao thức clamd không phức tạp, nhưng có vài chi tiết dễ làm sai. `INSTREAM` gửi nội dung tệp qua chính socket đó. Mỗi khối bắt đầu bằng độ dài 4 byte theo thứ tự big-endian, rồi tới dữ liệu; kết thúc bằng một khối có độ dài 0. Tổng dung lượng bị chặn bởi `StreamMaxLength` trong `clamd.conf`; vượt thì clamd trả lỗi `INSTREAM size limit exceeded`. Kết quả là một dòng như `stream: OK` hoặc `stream: <tên chữ ký> FOUND`.",
    },
    {
      kind: "ol",
      items: [
        "Mở kết nối tới clamd và gửi lệnh `zINSTREAM\\0` theo khung NUL.",
        "Ghi từng khối: 4 byte độ dài big-endian, rồi đúng số byte dữ liệu đó.",
        "Kết thúc bằng khối độ dài 0 để clamd biết luồng đã hết.",
        "Đọc dòng kết quả: `OK` thì cho qua, `FOUND` thì cách ly và ghi nhận.",
      ],
    },
    {
      kind: "p",
      text: "`StreamMaxLength` là ranh giới bạn phải khớp với giới hạn tải lên của ứng dụng. Mặc định OpenVie nhận 20 MB mỗi tệp; nếu clamd đặt thấp hơn, tệp hợp lệ sẽ bị từ chối ở bước quét với một lỗi trông giống lỗi hệ thống. Nếu đặt cao hơn nhiều, bạn giữ một luồng dài trong bộ nhớ mà không ai cần.",
    },
    {
      kind: "h2",
      text: "Vì sao socket của máy quét phải nằm trong mạng nội bộ",
    },
    {
      kind: "p",
      text: "ClamAV hỗ trợ `INSTREAM` qua socket TCP, nhưng socket đó không được mã hoá và không xác thực. Bất kỳ ai kết nối được đều có thể gửi tệp để quét, và tệp đi qua dây dưới dạng thô. Tài liệu ClamAV nói rõ: không được để lộ socket TCP ra mạng không tin cậy. Vì vậy clamd chỉ nghe trong mạng nội bộ, và không có route nào từ ngoài vào thẳng nó.",
    },
    {
      kind: "p",
      text: "Nếu bạn chạy clamd trên cùng máy, Unix socket là lựa chọn tốt hơn: nó không đi qua mạng, và mở thêm lệnh `FILDES` — lệnh chỉ dùng được trên Unix socket. Với Unix socket, quyền truy cập do quyền của filesystem quyết định, và đó là một mô hình dễ hiểu hơn firewall cho một tiến trình nội bộ.",
    },
    {
      kind: "callout",
      title: "Khung lệnh: chọn NUL",
      body: "clamd chấp nhận `zCOMMAND\\0` hoặc `nCOMMAND\\n`. Tài liệu khuyến nghị dạng NUL, vì newline có thể xuất hiện trong dữ liệu nếu ai đó nối chuỗi sai. Dùng NUL và kiểm tra độ dài khối là hai việc nhỏ loại bỏ cả một lớp lỗi.",
      tone: "warn",
    },
    {
      kind: "h2",
      text: "gRPC nội bộ mTLS và vòng xoay JWT",
    },
    {
      kind: "p",
      text: "Các service nội bộ không đi qua cổng biên. Nếu ai đó vào được mạng nội bộ, họ có thể gọi thẳng service và bỏ qua mọi kiểm tra ở biên. Vì vậy profile production bật mTLS cho gRPC nội bộ: cả hai phía trình chứng chỉ, và một service không có chứng chỉ hợp lệ thì không thiết lập được kênh.",
    },
    {
      kind: "p",
      text: "Token cũng không sống mãi. JWT được xoay vòng, nên một token bị lộ chỉ có giá trị trong cửa sổ ngắn. Quan trọng hơn, vai trò không được đóng băng trong token: mỗi yêu cầu suy ra vai trò từ membership sống. Token trả lời câu hỏi người gọi là ai; cơ sở dữ liệu trả lời câu hỏi người đó còn quyền hay không.",
    },
    {
      kind: "ul",
      items: [
        "mTLS cho mọi kênh gRPC nội bộ trong profile production.",
        "JWT xoay vòng, không dùng một khoá ký vĩnh viễn.",
        "Vai trò đọc từ membership sống ở mỗi yêu cầu, không lấy từ header hay từ bản sao cũ.",
        "Không tin header tenant từ bất kỳ nguồn nào, kể cả service nội bộ.",
      ],
    },
    {
      kind: "p",
      text: "Cái giá của mTLS là vận hành chứng chỉ: cấp, phân phối, và xoay trước khi hết hạn. Đó là công việc thật, không phải một dòng cấu hình. Nhưng so với việc tin tưởng mọi tiến trình trong cùng mạng, nó là mức đánh đổi hợp lý cho một hệ thống giữ dữ liệu của nhiều tenant.",
    },
    {
      kind: "h2",
      text: "Giám sát là tuỳ chọn, và nó phải bind loopback",
    },
    {
      kind: "p",
      text: "Prometheus, Alertmanager và Grafana nằm trong profile `monitoring`, không bật mặc định. Đây là lựa chọn có chủ ý: một stack giám sát tự động bật sẽ thêm cổng, thêm dịch vụ, và thêm bề mặt tấn công cho những người chưa cần tới nó. Khi bật, profile cài sẵn hai dashboard để bạn có điểm bắt đầu thay vì một màn hình trống.",
    },
    {
      kind: "ul",
      items: [
        "Profile `monitoring` là tuỳ chọn; bật khi bạn thực sự có người trực.",
        "Hai dashboard được provision sẵn, không phải dựng tay từ đầu.",
        "Các cổng giám sát bind loopback: chỉ máy đó truy cập được.",
        "Muốn xem từ xa thì đi qua SSH tunnel hoặc reverse proxy có xác thực, không mở cổng ra ngoài.",
      ],
    },
    {
      kind: "callout",
      title: "Bind loopback không phải chi tiết nhỏ",
      body: "Một Grafana mở ra Internet mà không có xác thực là một bảng điều khiển cho người lạ. Bind vào 127.0.0.1 và để người vận hành quyết định cách truy cập.",
      tone: "info",
    },
    {
      kind: "p",
      text: "Giám sát không thay thế kiểm soát truy cập. Nó cho bạn thấy hạn mức đang chặn ai, 429 xuất hiện ở đâu, và clamd có đang trả lỗi hay không. Nhưng nếu bạn không có người đọc dashboard, bật nó chỉ thêm tiến trình chạy nền.",
    },
    {
      kind: "h2",
      text: "Ranh giới trách nhiệm: cái gì thuộc người vận hành",
    },
    {
      kind: "p",
      text: "OpenVie là phần mềm tự host theo Apache License 2.0. Bạn chạy nó, bạn sở hữu môi trường, và một số việc nằm ngoài mã nguồn. TLS termination và WAF ở biên thuộc người vận hành. Chứng chỉ, cipher suite, quy tắc WAF, và việc chặn theo địa lý — không có cái nào được quyết định bởi repo này.",
    },
    {
      kind: "ul",
      items: [
        "TLS termination và WAF ở biên: do bạn chọn, cấu hình và chịu trách nhiệm.",
        "Lịch sao lưu và diễn tập phục hồi: script có sẵn, lịch chạy là của bạn.",
        "Kiểm chứng gia cố trong môi trường của bạn: mã nguồn không phải bằng chứng của một dịch vụ production đang chạy.",
        "Lựa chọn provider bên ngoài: nếu bạn trỏ ra endpoint tương thích OpenAI, trích đoạn nội dung tenant sẽ vượt ranh giới provider đó.",
      ],
    },
    {
      kind: "p",
      text: "Danh sách này không phải để đẩy việc. Nó là ranh giới trung thực: một repo có thể cung cấp mTLS, ClamAV và hạn mức, nhưng không thể biết chứng chỉ của bạn do ai cấp hay WAF của bạn chặn gì. Ghi rõ ranh giới giúp bạn biết phần nào phải tự kiểm tra trước khi mở hệ thống cho người dùng thật.",
    },
    {
      kind: "h2",
      text: "Tóm lại",
    },
    {
      kind: "p",
      text: "Ba câu hỏi, ba tầng. Keycloak trả lời ai đang gọi, với Authorization Code và PKCE S256 để mã uỷ quyền bị chặn không dùng lại được. Spring trả lời người đó được làm gì, dựa trên ba vai trò và membership sống, không tin header tenant. APISIX trả lời lưu lượng được đi bao nhiêu, theo từng route ở biên và theo cặp tenant:user ở tầng ứng dụng. ClamAV và mTLS đóng phần còn lại: dữ liệu vào không mang mã độc, và kênh nội bộ không mở cho tiến trình lạ.",
    },
    {
      kind: "quote",
      text: "Bảo mật không phải một lớp dày. Nó là ba lớp mỏng, mỗi lớp trả lời đúng một câu hỏi, và không lớp nào tin lớp kia thay cho việc tự kiểm tra.",
    },
    {
      kind: "p",
      text: "Không có cấu hình nào đúng cho mọi môi trường. Hạn mức, ngưỡng quét, và chính sách 2FA phụ thuộc vào tải và mức rủi ro của bạn. Hãy kiểm chứng từng lớp trong môi trường của mình trước khi mở cửa.",
    },
  ],
  sources: [
    {
      label: "Securing applications and services with OpenID Connect — Keycloak",
      href: "https://www.keycloak.org/securing-apps/oidc-layers",
    },
    {
      label: "Proof Key for Code Exchange by OAuth Public Clients — RFC 7636",
      href: "https://www.rfc-editor.org/rfc/rfc7636.txt",
    },
    {
      label: "Server Administration Guide — Keycloak documentation",
      href: "https://www.keycloak.org/docs/latest/server_admin/index.html",
    },
    {
      label: "Rate Limiting (limit-req) — Apache APISIX plugin reference",
      href: "https://apisix.apache.org/docs/apisix/plugins/limit-req/",
    },
    {
      label: "ClamD Protocol — ClamAV documentation (INSTREAM)",
      href: "https://docs.clamav.net/manual/Usage/ClamdProtocol.html",
    },
  ],
};