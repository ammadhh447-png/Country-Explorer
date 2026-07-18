import type { CountrySummary, WorldStats } from "@/types/country";
import { filterCountriesByQuery } from "@/lib/format";

export function computeWorldStats(countries: CountrySummary[]): WorldStats {
  const languages = new Set<string>();
  const currencies = new Set<string>();
  const continents = new Set<string>();
  const continentPop: Record<string, number> = {};

  for (const c of countries) {
    c.languages.forEach((l) => languages.add(l));
    c.currencies.forEach((cur) => currencies.add(cur.code));
    c.continents.forEach((cont) => {
      continents.add(cont);
      continentPop[cont] = (continentPop[cont] ?? 0) + c.population;
    });
  }

  const sortedByArea = [...countries].sort((a, b) => b.area - a.area);
  const sortedByPop = [...countries].sort((a, b) => b.population - a.population);

  return {
    totalPopulation: countries.reduce((s, c) => s + c.population, 0),
    totalCountries: countries.length,
    totalLanguages: languages.size,
    totalCurrencies: currencies.size,
    totalContinents: continents.size,
    populationByContinent: Object.entries(continentPop)
      .map(([name, population]) => ({ name, population }))
      .sort((a, b) => b.population - a.population),
    largestCountries: sortedByArea.slice(0, 10).map((c) => ({
      name: c.name,
      area: c.area,
      cca3: c.cca3,
    })),
    smallestCountries: sortedByArea
      .filter((c) => c.area > 0)
      .slice(-10)
      .reverse()
      .map((c) => ({ name: c.name, area: c.area, cca3: c.cca3 })),
    mostPopulous: sortedByPop.slice(0, 10).map((c) => ({
      name: c.name,
      population: c.population,
      cca3: c.cca3,
    })),
  };
}

export function filterCountries(
  countries: CountrySummary[],
  filters: {
    search?: string;
    region?: string;
    subregion?: string;
    language?: string;
    currency?: string;
    populationMin?: number;
    populationMax?: number;
    areaMin?: number;
    areaMax?: number;
    timezone?: string;
  }
): CountrySummary[] {
  return countries.filter((c) => {
    if (filters.search?.trim()) {
      const matched = filterCountriesByQuery([c], filters.search);
      if (matched.length === 0) return false;
    }
    if (filters.region && filters.region !== "All" && c.region !== filters.region)
      return false;
    if (
      filters.subregion &&
      filters.subregion !== "All" &&
      c.subregion !== filters.subregion
    )
      return false;
    if (filters.language && filters.language !== "All") {
      if (!c.languages.some((l) => l === filters.language)) return false;
    }
    if (filters.currency && filters.currency !== "All") {
      if (!c.currencies.some((cur) => cur.code === filters.currency)) return false;
    }
    if (filters.populationMin && c.population < filters.populationMin) return false;
    if (filters.populationMax && c.population > filters.populationMax) return false;
    if (filters.areaMin && c.area < filters.areaMin) return false;
    if (filters.areaMax && c.area > filters.areaMax) return false;
    if (filters.timezone && filters.timezone !== "All") {
      if (!c.timezones.some((tz) => tz.includes(filters.timezone!))) return false;
    }
    return true;
  });
}

export function sortCountries(
  countries: CountrySummary[],
  sort: string
): CountrySummary[] {
  const sorted = [...countries];
  switch (sort) {
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "population-desc":
      return sorted.sort((a, b) => b.population - a.population);
    case "population-asc":
      return sorted.sort((a, b) => a.population - b.population);
    case "area-desc":
      return sorted.sort((a, b) => b.area - a.area);
    case "area-asc":
      return sorted.sort((a, b) => a.area - b.area);
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function getUniqueLanguages(countries: CountrySummary[]): string[] {
  const set = new Set<string>();
  countries.forEach((c) => c.languages.forEach((l) => set.add(l)));
  return Array.from(set).sort();
}

export function getUniqueCurrencies(
  countries: CountrySummary[]
): { code: string; name: string }[] {
  const map = new Map<string, string>();
  countries.forEach((c) =>
    c.currencies.forEach((cur) => map.set(cur.code, cur.name))
  );
  return Array.from(map.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function getUniqueTimezones(countries: CountrySummary[]): string[] {
  const set = new Set<string>();
  countries.forEach((c) =>
    c.timezones.forEach((tz) => {
      const offset = tz.replace(/^UTC/, "");
      set.add(offset);
    })
  );
  return Array.from(set).sort();
}
