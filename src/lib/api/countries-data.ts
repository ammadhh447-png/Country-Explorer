import type { Country, CountryCulture, CountryTimezoneZone } from "@/types/country";
import { getFlagUrl, getFlagSvgUrl } from "@/lib/format";

const COUNTRIES_URL =
  "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";
const POPULATION_URL =
  "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&date=2023&per_page=300";
const ENRICHMENT_URL =
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json";

type TimezoneEntry = {
  zoneName: string;
  gmtOffsetName: string;
  tzName: string;
};

type EnrichmentEntry = {
  iso2?: string;
  iso3?: string;
  name?: string;
  nationality?: string;
  native?: string;
  phonecode?: string;
  emoji?: string;
  timezones?: TimezoneEntry[];
  latitude?: string;
  longitude?: string;
};

type EnrichmentData = {
  timezoneZones: CountryTimezoneZone[];
  culture: CountryCulture;
};

type RawCountry = {
  name: {
    common: string;
    official: string;
    native?: Record<string, { official: string; common: string }>;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  tld?: string[];
  cca2: string;
  ccn3?: string;
  cca3: string;
  cioc?: string;
  independent?: boolean;
  status?: string;
  unMember?: boolean;
  currencies?: Record<string, { name: string; symbol: string }>;
  idd?: { root?: string; suffixes?: string[] };
  capital?: string[];
  altSpellings?: string[];
  region: string;
  subregion?: string;
  languages?: Record<string, string>;
  translations?: Record<string, { official: string; common: string }>;
  latlng?: [number, number];
  landlocked?: boolean;
  borders?: string[];
  area: number;
  population?: number;
};

let cache: { data: Country[]; expires: number; version: number } | null = null;
const CACHE_TTL = 1000 * 60 * 60;
const CACHE_VERSION = 2;

function normalizeOffsetName(name: string): string {
  return name.replace(/\s/g, "");
}

function regionToContinents(region: string): string[] {
  if (region === "Antarctic") return ["Antarctica"];
  if (region === "Americas") return ["North America", "South America"];
  return [region];
}

function estimateTimezoneFromLng(latlng?: [number, number]): CountryTimezoneZone[] {
  if (!latlng) return [];
  const lng = latlng[1];
  const offsetHours = Math.round(lng / 15);
  const sign = offsetHours >= 0 ? "+" : "-";
  const abs = Math.abs(offsetHours);
  const offset = `UTC${sign}${String(abs).padStart(2, "0")}:00`;
  return [{ id: "", offset, label: offset.replace("UTC", "UTC ") }];
}

function buildTimezoneZones(entries?: TimezoneEntry[]): CountryTimezoneZone[] {
  if (!entries?.length) return [];
  const seen = new Set<string>();
  const zones: CountryTimezoneZone[] = [];
  for (const tz of entries) {
    const id = tz.zoneName;
    const offset = normalizeOffsetName(tz.gmtOffsetName);
    const key = `${id}|${offset}`;
    if (seen.has(key)) continue;
    seen.add(key);
    zones.push({ id, offset, label: tz.tzName || id.replace(/_/g, " ") });
  }
  return zones;
}

function resolveEnrichment(
  raw: RawCountry,
  byIso3: Map<string, EnrichmentData>,
  byIso2: Map<string, EnrichmentData>,
  byName: Map<string, EnrichmentData>
): EnrichmentData | undefined {
  return (
    byIso3.get(raw.cca3) ??
    byIso2.get(raw.cca2) ??
    byName.get(raw.name.common.toLowerCase())
  );
}

function applyTimezoneData(
  raw: RawCountry,
  enrichment?: EnrichmentData
): {
  timezoneZones: CountryTimezoneZone[];
  timezones: string[];
  timezoneIds: string[];
} {
  let zones = enrichment?.timezoneZones ?? [];
  if (zones.length === 0) {
    zones = estimateTimezoneFromLng(raw.latlng);
  }
  const timezones = [...new Set(zones.map((z) => z.offset).filter(Boolean))];
  const timezoneIds = zones.map((z) => z.id).filter(Boolean);
  return { timezoneZones: zones, timezones, timezoneIds };
}

function normalizeRaw(
  raw: RawCountry,
  population: number,
  enrichment?: EnrichmentData
): Country {
  const native = raw.name.native ?? raw.name.nativeName;
  const latlng = raw.latlng;
  const cca2 = raw.cca2;
  const tz = applyTimezoneData(raw, enrichment);

  return {
    name: {
      common: raw.name.common,
      official: raw.name.official,
      nativeName: native,
    },
    tld: raw.tld,
    cca2,
    ccn3: raw.ccn3,
    cca3: raw.cca3,
    cioc: raw.cioc,
    independent: raw.independent,
    status: raw.status,
    unMember: raw.unMember,
    currencies: raw.currencies,
    idd: raw.idd,
    capital: raw.capital,
    altSpellings: raw.altSpellings,
    region: raw.region,
    subregion: raw.subregion,
    languages: raw.languages,
    translations: raw.translations,
    latlng,
    landlocked: raw.landlocked,
    borders: raw.borders,
    area: raw.area ?? 0,
    population: population || raw.population || 0,
    continents: regionToContinents(raw.region),
    timezones: tz.timezones,
    timezoneIds: tz.timezoneIds,
    timezoneZones: tz.timezoneZones,
    culture: enrichment?.culture,
    flags: {
      png: getFlagUrl(cca2),
      svg: getFlagSvgUrl(cca2),
      alt: `${raw.name.common} flag`,
    },
    maps: latlng
      ? {
          googleMaps: `https://www.google.com/maps?q=${latlng[0]},${latlng[1]}`,
          openStreetMaps: `https://www.openstreetmap.org/?mlat=${latlng[0]}&mlon=${latlng[1]}`,
        }
      : undefined,
    capitalInfo: latlng ? { latlng } : undefined,
  };
}

async function fetchEnrichmentMaps(): Promise<{
  byIso3: Map<string, EnrichmentData>;
  byIso2: Map<string, EnrichmentData>;
  byName: Map<string, EnrichmentData>;
}> {
  const byIso3 = new Map<string, EnrichmentData>();
  const byIso2 = new Map<string, EnrichmentData>();
  const byName = new Map<string, EnrichmentData>();

  try {
    const res = await fetch(ENRICHMENT_URL, { next: { revalidate: 86400 } });
    if (!res.ok) return { byIso3, byIso2, byName };
    const data: EnrichmentEntry[] = await res.json();

    for (const entry of data) {
      if (!entry.iso3) continue;
      const enrichment: EnrichmentData = {
        timezoneZones: buildTimezoneZones(entry.timezones),
        culture: {
          nationality: entry.nationality,
          nativeName: entry.native,
          phoneCode: entry.phonecode,
          emoji: entry.emoji,
        },
      };
      byIso3.set(entry.iso3, enrichment);
      if (entry.iso2) byIso2.set(entry.iso2, enrichment);
      if (entry.name) byName.set(entry.name.toLowerCase(), enrichment);
    }
  } catch {
    return { byIso3, byIso2, byName };
  }

  return { byIso3, byIso2, byName };
}

async function fetchPopulationMap(): Promise<Map<string, number>> {
  const res = await fetch(POPULATION_URL, { next: { revalidate: 86400 } });
  if (!res.ok) return new Map();
  const data = await res.json();
  const map = new Map<string, number>();
  for (const entry of data[1] ?? []) {
    if (entry.countryiso3code?.length === 3 && entry.value != null) {
      map.set(entry.countryiso3code, entry.value);
    }
  }
  return map;
}

export async function loadCountries(): Promise<Country[]> {
  if (cache && cache.version === CACHE_VERSION && cache.expires > Date.now()) {
    return cache.data;
  }

  const [countriesRes, popMap, enrichmentMaps] = await Promise.all([
    fetch(COUNTRIES_URL, { next: { revalidate: 86400 } }),
    fetchPopulationMap(),
    fetchEnrichmentMaps(),
  ]);

  if (!countriesRes.ok) {
    throw new Error(`Failed to load countries: ${countriesRes.status}`);
  }

  const raw: RawCountry[] = await countriesRes.json();
  const countries = raw
    .filter((c) => c.cca3 && c.name?.common)
    .map((c) => {
      const enrichment = resolveEnrichment(
        c,
        enrichmentMaps.byIso3,
        enrichmentMaps.byIso2,
        enrichmentMaps.byName
      );
      return normalizeRaw(c, popMap.get(c.cca3) ?? 0, enrichment);
    })
    .sort((a, b) => a.name.common.localeCompare(b.name.common));

  cache = { data: countries, expires: Date.now() + CACHE_TTL, version: CACHE_VERSION };
  return countries;
}

export async function getCountryByCodeFromSource(code: string): Promise<Country | null> {
  const countries = await loadCountries();
  const upper = code.toUpperCase();
  return countries.find((c) => c.cca3 === upper || c.cca2 === upper) ?? null;
}
