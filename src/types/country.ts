export interface CountryCurrency {
  name: string;
  symbol: string;
}

export interface CountryLanguage {
  [code: string]: string;
}

export interface CountryName {
  common: string;
  official: string;
  nativeName?: Record<string, { official: string; common: string }>;
}

export interface CountryFlags {
  png: string;
  svg: string;
  alt?: string;
}

export interface CountryCoatOfArms {
  png?: string;
  svg?: string;
}

export interface CountryMaps {
  googleMaps: string;
  openStreetMaps: string;
}

export interface CountryTimezoneZone {
  id: string;
  offset: string;
  label: string;
}

export interface CountryCulture {
  nationality?: string;
  nativeName?: string;
  phoneCode?: string;
  emoji?: string;
}

export interface Country {
  name: CountryName;
  tld?: string[];
  cca2: string;
  ccn3?: string;
  cca3: string;
  cioc?: string;
  independent?: boolean;
  status?: string;
  unMember?: boolean;
  currencies?: Record<string, CountryCurrency>;
  idd?: { root?: string; suffixes?: string[] };
  capital?: string[];
  altSpellings?: string[];
  region: string;
  subregion?: string;
  languages?: CountryLanguage;
  translations?: Record<string, { official: string; common: string }>;
  latlng?: [number, number];
  landlocked?: boolean;
  borders?: string[];
  area: number;
  flag?: string;
  maps?: CountryMaps;
  population: number;
  fifa?: string;
  car?: { signs?: string[]; side?: string };
  timezones?: string[];
  timezoneIds?: string[];
  timezoneZones?: CountryTimezoneZone[];
  culture?: CountryCulture;
  continents?: string[];
  flags: CountryFlags;
  coatOfArms?: CountryCoatOfArms;
  startOfWeek?: string;
  capitalInfo?: { latlng?: [number, number] };
  postalCode?: { format?: string; regex?: string };
}

export interface CountrySummary {
  cca3: string;
  cca2: string;
  name: string;
  officialName: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  flag: string;
  flagSvg: string;
  languages: string[];
  currencies: { code: string; name: string; symbol: string }[];
  timezones: string[];
  timezoneIds?: string[];
  timezoneZones?: CountryTimezoneZone[];
  latlng: [number, number];
  ccn3?: string;
  borders: string[];
  continents: string[];
  drivingSide: string;
  unMember: boolean;
  landlocked: boolean;
}

export interface WorldBankDataPoint {
  date: string;
  value: number;
}

export interface CountryIndicator {
  population: WorldBankDataPoint[];
  gdp: WorldBankDataPoint[];
  lifeExpectancy: WorldBankDataPoint[];
  gdpPerCapita: WorldBankDataPoint[];
}

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "population-desc"
  | "population-asc"
  | "area-desc"
  | "area-asc";

export interface CountryFilters {
  search: string;
  region: string;
  subregion: string;
  language: string;
  currency: string;
  populationMin: number;
  populationMax: number;
  areaMin: number;
  areaMax: number;
  timezone: string;
}

export interface CompareMetric {
  label: string;
  key: string;
  format?: (value: unknown, country: CountrySummary) => string;
}

export interface FavoriteEntry {
  cca3: string;
  name: string;
  flag: string;
  addedAt: string;
}

export interface FavoritesState {
  favorites: FavoriteEntry[];
}

export interface WorldStats {
  totalPopulation: number;
  totalCountries: number;
  totalLanguages: number;
  totalCurrencies: number;
  totalContinents: number;
  populationByContinent: { name: string; population: number }[];
  largestCountries: { name: string; area: number; cca3: string }[];
  smallestCountries: { name: string; area: number; cca3: string }[];
  mostPopulous: { name: string; population: number; cca3: string }[];
}

export interface RankingEntry {
  rank: number;
  cca3: string;
  name: string;
  flag: string;
  value: number | string;
}
