
import { NextResponse } from "next/server";

const OPENAPI_URL =
  "https://swaggerapi.qtitpc.dev/v3/api-docs/api";

export async function GET() {
  try {
    const response = await fetch(OPENAPI_URL, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Unable to retrieve OpenAPI specification",
          upstreamStatus: response.status,
        },
        { status: 502 },
      );
    }

    const specification = await response.json();

    if (
      specification.openapi !== "3.1.0" ||
      !specification.paths
    ) {
      return NextResponse.json(
        { error: "Invalid OpenAPI specification" },
        { status: 502 },
      );
    }

    return NextResponse.json(specification);
  } catch {
    return NextResponse.json(
      { error: "OpenAPI service is unavailable" },
      { status: 502 },
    );
  }
}
