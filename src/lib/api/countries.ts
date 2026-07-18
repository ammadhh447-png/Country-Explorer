import type { Country, CountrySummary } from "@/types/country";import {
  getCurrencyList,
  getLanguageList,
  getNativeName,
  getFlagUrl,
  getFlagSvgUrl,
} from "@/lib/format";

export function toCountrySummary(country: Country): CountrySummary {
  const currencies = getCurrencyList(country.currencies);
  return {
    cca3: country.cca3,
    cca2: country.cca2,
    name: country.name.common,
    officialName: country.name.official,
    capital: country.capital?.[0] ?? "N/A",
    region: country.region,
    subregion: country.subregion ?? "N/A",
    population: country.population,
    area: country.area,
    flag: getFlagUrl(country.cca2),
    flagSvg: getFlagSvgUrl(country.cca2),
    languages: getLanguageList(country.languages),
    currencies,
    timezones: country.timezones ?? [],
    timezoneIds: country.timezoneIds,
    timezoneZones: country.timezoneZones,
    latlng: country.latlng ?? [0, 0],
    ccn3: country.ccn3,
    borders: country.borders ?? [],
    continents: country.continents ?? [],
    drivingSide: country.car?.side ?? "N/A",
    unMember: country.unMember ?? false,
    landlocked: country.landlocked ?? false,
  };
}

export function getCountryDescription(country: Country): string {
  const native = getNativeName(country);
  const langs = getLanguageList(country.languages).join(", ");
  const capital = country.capital?.[0] ?? "its capital";
  const region = country.subregion ?? country.region;
  const currencies = getCurrencyList(country.currencies)
    .map((c) => `${c.name} (${c.symbol})`)
    .join(", ");

  return `${country.name.common} (${native}), officially ${country.name.official}, is a ${country.landlocked ? "landlocked " : ""}country in ${region}. Its capital is ${capital}, and it has a population of approximately ${country.population.toLocaleString()} people across ${country.area.toLocaleString()} km². ${langs !== "N/A" ? `The official language${country.languages && Object.keys(country.languages).length > 1 ? "s include" : " is"} ${langs}.` : ""} ${currencies ? `The currency is ${currencies}.` : ""}`.trim();
}

async function clientFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function getAllSummaries(): Promise<CountrySummary[]> {
  return clientFetch<CountrySummary[]>("/api/countries");
}

export async function getCountryByCode(code: string): Promise<Country> {
  return clientFetch<Country>(`/api/countries/${encodeURIComponent(code)}`);
}

export async function searchCountries(query: string): Promise<CountrySummary[]> {
  const all = await getAllSummaries();
  if (!query.trim()) return all;
  const q = query.toLowerCase();
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.capital.toLowerCase().includes(q) ||
      c.cca3.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q)
  );
}

export async function getCountriesByCodes(codes: string[]): Promise<Country[]> {
  return Promise.all(codes.map((code) => getCountryByCode(code)));
}
