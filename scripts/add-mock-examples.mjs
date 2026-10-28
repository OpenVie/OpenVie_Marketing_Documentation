
import fs from "node:fs";

const filePath = "data/openapi.json";

const openapi = JSON.parse(
  fs.readFileSync(filePath, "utf8")
);

const endpoint =
  openapi.paths["/api/v1/workflow/sla-config"]?.get;

if (!endpoint) {
  throw new Error("Không tìm thấy GET SLA configuration");
}

const response401 = endpoint.responses?.["401"];

if (!response401?.content) {
  throw new Error("Không tìm thấy response 401 có content");
}

// Lấy media type đã có thật trong tài liệu
const mediaType = Object.keys(response401.content)[0];

if (!mediaType) {
  throw new Error("Response 401 không có media type");
}

// Thêm dữ liệu phản hồi minh họa
response401.content[mediaType].examples = {
  unauthorizedDemo: {
    summary: "Unauthorized – Mock Example",
    description: "Dữ liệu giả lập dùng trong tài liệu.",
    value: {
      timestamp: "2026-01-01T10:00:00Z",
      status: 401,
      path: "/api/v1/workflow/sla-config",
      error: "Unauthorized",
      message: "Authentication required"
    }
  }
};

fs.writeFileSync(
  filePath,
  JSON.stringify(openapi, null, 2) + "\n",
  "utf8"
);

console.log("Đã thêm mock example cho response 401");
