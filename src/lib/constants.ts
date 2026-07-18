export const REGIONS = [
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic",
] as const;

export const SUBREGIONS: Record<string, string[]> = {
  Africa: [
    "Northern Africa",
    "Eastern Africa",
    "Middle Africa",
    "Southern Africa",
    "Western Africa",
  ],
  Americas: ["Caribbean", "Central America", "North America", "South America"],
  Asia: ["Central Asia", "Eastern Asia", "South-Eastern Asia", "Southern Asia", "Western Asia"],
  Europe: ["Eastern Europe", "Northern Europe", "Southern Europe", "Western Europe"],
  Oceania: ["Australia and New Zealand", "Melanesia", "Micronesia", "Polynesia"],
  Antarctic: ["Antarctic"],
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/countries", label: "Countries" },
  { href: "/compare", label: "Compare" },
  { href: "/map", label: "Map" },
  { href: "/statistics", label: "Statistics" },
  { href: "/rankings", label: "Rankings" },
  { href: "/time", label: "World Time" },
  { href: "/about", label: "About" },
] as const;

export const FEATURE_LINKS = [
  { href: "/assistant", label: "Country Assistant" },
  { href: "/quiz", label: "Country Quiz" },
  { href: "/flags", label: "Flag Explorer" },
  { href: "/currency", label: "Currencies" },
  { href: "/favorites", label: "Favorites" },
] as const;

export const FAQ_ITEMS = [
  {
    q: "What can I do on Country Explorer?",
    a: "Browse 250 country profiles, compare nations side by side, explore an interactive world map, review rankings, and ask the Country Assistant for structured answers.",
  },
  {
    q: "How do I compare two or more countries?",
    a: "Open the Compare page, search for countries, and add up to three. Population, area, languages, currencies, and key indicators appear in a clear side-by-side view.",
  },
  {
    q: "Are my favorites saved?",
    a: "Yes. Favorites are stored locally in your browser so they remain available on your next visit.",
  },
  {
    q: "How often is the data updated?",
    a: "Country profiles refresh from trusted public sources on a regular schedule. Population figures use recent World Bank data, and world time updates live from each nation's time zone.",
  },
  {
    q: "Is Country Explorer free to use?",
    a: "Yes. Country Explorer is free to use for learning, research, and everyday geographic discovery.",
  },
] as const;

export const DID_YOU_KNOW = [
  "Russia spans 11 time zones — more than any other country.",
  "There are over 7,000 languages spoken worldwide, but only ~195 countries.",
  "Vatican City is the smallest country by both area and population.",
  "Indonesia has over 17,000 islands, making it the largest archipelago.",
  "France has the most time zones of any country due to its overseas territories.",
  "Brazil shares a border with every South American country except Chile and Ecuador.",
  "Monaco has the highest population density in the world.",
  "Canada has the longest coastline of any country at over 202,000 km.",
] as const;

export const HAPPINESS_RANK: Record<string, number> = {
  FIN: 1, DNK: 2, ISL: 3, ISR: 4, NLD: 5, SWE: 6, NOR: 7, CHE: 8, LUX: 9, NZL: 10,
  AUT: 11, AUS: 12, CAN: 13, IRL: 14, USA: 15, DEU: 16, BEL: 17, CZE: 18, GBR: 19, LTU: 20,
  SGP: 21, FRA: 22, POL: 23, ESP: 24, SVN: 25, ITA: 26, JPN: 47, KOR: 52, CHN: 60, IND: 126,
  BRA: 49, MEX: 55, ZAF: 83, NGA: 95, PAK: 108, BGD: 129,
};

export const HDI_RANK: Record<string, number> = {
  CHE: 1, NOR: 2, ISL: 3, HKG: 4, AUS: 5, DNK: 6, SWE: 7, IRL: 8, DEU: 9, NLD: 10,
  FIN: 11, CAN: 12, NZL: 13, SGP: 14, BEL: 15, USA: 16, GBR: 17, JPN: 18, KOR: 19, FRA: 20,
};
