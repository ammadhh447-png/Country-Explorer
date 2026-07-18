import { NextResponse } from "next/server";
import { loadCountries } from "@/lib/api/countries-data";
import { toCountrySummary } from "@/lib/api/countries";

export async function GET() {
  try {
    const countries = await loadCountries();
    const summaries = countries.map(toCountrySummary);

    return NextResponse.json(summaries, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load countries" }, { status: 500 });
  }
}
