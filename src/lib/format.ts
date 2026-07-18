export function formatNumber(num: number, compact = false): string {
  if (compact) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  }
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatArea(sqKm: number): string {
  return `${formatNumber(sqKm)} km²`;
}

export function formatCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${formatNumber(value)}`;
}

export function getNativeName(country: {
  name: {
    common: string;
    nativeName?: Record<string, { common: string }>;
    native?: Record<string, { common: string }>;
  };
}): string {
  const native = country.name.nativeName ?? country.name.native;
  if (!native) return country.name.common;
  const first = Object.values(native)[0];
  return first?.common ?? country.name.common;
}

export function getLanguageList(languages?: Record<string, string>): string[] {
  if (!languages) return ["N/A"];
  return Object.values(languages);
}

export function getCurrencyList(
  currencies?: Record<string, { name: string; symbol: string }>
): { code: string; name: string; symbol: string }[] {
  if (!currencies) return [];
  return Object.entries(currencies).map(([code, c]) => ({
    code,
    name: c.name,
    symbol: c.symbol,
  }));
}

export function getRegionColor(region: string): string {
  const colors: Record<string, string> = {
    Africa: "#8b5cf6",
    Americas: "#3b82f6",
    Asia: "#ec4899",
    Europe: "#06b6d4",
    Oceania: "#10b981",
    Antarctic: "#64748b",
  };
  return colors[region] ?? "#6366f1";
}

export function getCountryOfDayIndex(total: number): number {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return dayOfYear % total;
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getFlagUrl(cca2: string, width: "w80" | "w160" | "w320" = "w320"): string {
  return `https://flagcdn.com/${width}/${cca2.toLowerCase()}.png`;
}

export function getFlagSvgUrl(cca2: string): string {
  return `https://flagcdn.com/${cca2.toLowerCase()}.svg`;
}

export { getLiveTimeInZone, getLiveTimeFromOffset, getUtcLiveTime } from "@/lib/time";

export function getPhoneCode(country: {
  idd?: { root?: string; suffixes?: string[] };
  culture?: { phoneCode?: string };
}): string {
  if (country.culture?.phoneCode) return `+${country.culture.phoneCode.replace(/^\+/, "")}`;
  const root = country.idd?.root?.replace("+", "") ?? "";
  const suffix = country.idd?.suffixes?.[0] ?? "";
  return root ? `+${root}${suffix}` : "N/A";
}

export function filterCountriesByQuery<T extends {
  name: string;
  officialName: string;
  capital: string;
  region: string;
  subregion: string;
  cca3: string;
  cca2: string;
  languages: string[];
}>(countries: T[], query: string): T[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  return countries.filter((c) => {
    const haystack = [
      c.name,
      c.officialName,
      c.capital,
      c.region,
      c.subregion,
      c.cca3,
      c.cca2,
      ...c.languages,
    ]
      .join(" ")
      .toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}
