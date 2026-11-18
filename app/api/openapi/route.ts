
import { NextResponse } from "next/server";
import openapi from "@/api-docs.json";
import { OPENVIE_API_BASE_URL } from "@/lib/routes";

export async function GET() {
  return NextResponse.json({
    ...openapi,
    servers: [{ url: OPENVIE_API_BASE_URL }],
  });
}
