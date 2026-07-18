import { NextResponse } from "next/server";
import { getCountryByCodeFromSource } from "@/lib/api/countries-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const country = await getCountryByCodeFromSource(code);

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    return NextResponse.json(country, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load country" }, { status: 500 });
  }
}
