
import { NextResponse } from "next/server";
import openapi from "@/api-docs.json";

export async function GET() {
  return NextResponse.json(openapi);
}
