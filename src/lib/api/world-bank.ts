import type { CountryIndicator, WorldBankDataPoint } from "@/types/country";

const BASE = "https://api.worldbank.org/v2";

async function fetchIndicator(
  countryCode: string,
  indicator: string,
  years = 15
): Promise<WorldBankDataPoint[]> {
  const endYear = new Date().getFullYear();
  const startYear = endYear - years;
  const url = `${BASE}/country/${countryCode}/indicator/${indicator}?format=json&date=${startYear}:${endYear}&per_page=100`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    const points: WorldBankDataPoint[] = (data[1] ?? [])
      .filter((d: { value: number | null }) => d.value !== null)
      .map((d: { date: string; value: number }) => ({
        date: d.date,
        value: d.value,
      }))
      .reverse();
    return points;
  } catch {
    return [];
  }
}

export async function getCountryIndicators(
  iso3: string
): Promise<CountryIndicator> {
  const code = iso3.toLowerCase();

  const [population, gdp, lifeExpectancy, gdpPerCapita] = await Promise.all([
    fetchIndicator(code, "SP.POP.TOTL"),
    fetchIndicator(code, "NY.GDP.MKTP.CD"),
    fetchIndicator(code, "SP.DYN.LE00.IN"),
    fetchIndicator(code, "NY.GDP.PCAP.CD"),
  ]);

  return { population, gdp, lifeExpectancy, gdpPerCapita };
}

export async function getWorldPopulation(): Promise<number> {
  const url = `${BASE}/country/WLD/indicator/SP.POP.TOTL?format=json&date=2023:2024&per_page=5`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    const latest = data[1]?.[0];
    return latest?.value ?? 8100000000;
  } catch {
    return 8100000000;
  }
}
