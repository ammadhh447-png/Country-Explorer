import type { CountrySummary } from "@/types/country";
import { formatNumber, formatArea, filterCountriesByQuery } from "@/lib/format";
import { HAPPINESS_RANK } from "@/lib/constants";
import { formatFamousPeople, formatPopulationRank } from "@/lib/country-insights";

export type AssistantBlock =
  | { type: "text"; content: string }
  | { type: "title"; content: string }
  | { type: "stats"; items: { label: string; value: string }[] }
  | {
      type: "compare";
      left: CountrySummary;
      right: CountrySummary;
      rows: { label: string; left: string; right: string }[];
    }
  | { type: "country"; country: CountrySummary }
  | {
      type: "ranking";
      title: string;
      items: { rank: number; name: string; value: string; cca3: string; cca2: string }[];
    }
  | { type: "actions"; links: { label: string; href: string }[] };

export interface AssistantReply {
  blocks: AssistantBlock[];
  source?: "data" | "llm+data";
}

export type AssistantIntent =
  | "compare"
  | "profile"
  | "population_rank"
  | "area_rank"
  | "smallest"
  | "languages"
  | "region"
  | "currency"
  | "help";

export interface ParsedIntent {
  intent: AssistantIntent;
  countries?: string[];
  region?: string;
}

const COUNTRY_ALIASES: Record<string, string> = {
  usa: "United States",
  us: "United States",
  america: "United States",
  uk: "United Kingdom",
  britain: "United Kingdom",
  england: "United Kingdom",
  korea: "South Korea",
  "south korea": "South Korea",
  "north korea": "North Korea",
  uae: "United Arab Emirates",
  russia: "Russia",
  holland: "Netherlands",
  czechia: "Czech Republic",
  "ivory coast": "Côte d'Ivoire",
  "cote d'ivoire": "Côte d'Ivoire",
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeQuery(query: string): string {
  let q = query.toLowerCase().trim();
  for (const [alias, name] of Object.entries(COUNTRY_ALIASES)) {
    const pattern = new RegExp(`\\b${escapeRegex(alias)}\\b`, "gi");
    q = q.replace(pattern, name.toLowerCase());
  }
  return q;
}

function matchesWord(haystack: string, needle: string): boolean {
  if (!needle || needle.length < 2) return false;
  return new RegExp(`\\b${escapeRegex(needle.toLowerCase())}\\b`, "i").test(haystack);
}

export function resolveCountries(names: string[], countries: CountrySummary[]): CountrySummary[] {
  const resolved: CountrySummary[] = [];
  const seen = new Set<string>();

  for (const raw of names) {
    const name = COUNTRY_ALIASES[raw.toLowerCase()] ?? raw;
    const matches = filterCountriesByQuery(countries, name);
    const best =
      matches.find((c) => c.name.toLowerCase() === name.toLowerCase()) ??
      matches.find((c) => c.cca3.toLowerCase() === name.toLowerCase()) ??
      matches[0];

    if (best && !seen.has(best.cca3)) {
      seen.add(best.cca3);
      resolved.push(best);
    }
  }

  return resolved;
}

function findMentioned(query: string, countries: CountrySummary[]): CountrySummary[] {
  const q = normalizeQuery(query);
  const found: CountrySummary[] = [];
  const seen = new Set<string>();

  const sorted = [...countries].sort((a, b) => b.name.length - a.name.length);

  for (const c of sorted) {
    const names = [c.name, c.officialName, c.capital, c.cca3, c.cca2].filter(Boolean);
    if (names.some((n) => matchesWord(q, n))) {
      if (!seen.has(c.cca3)) {
        seen.add(c.cca3);
        found.push(c);
      }
    }
  }

  if (found.length >= 2) return found;

  const compareMatch = q.match(
    /compare\s+(.+?)\s+(?:and|vs\.?|versus|with)\s+(.+)/i
  );
  if (compareMatch) {
    const left = resolveCountries([compareMatch[1].trim()], countries);
    const right = resolveCountries([compareMatch[2].trim()], countries);
    return [...left, ...right].filter((c, i, arr) => arr.findIndex((x) => x.cca3 === c.cca3) === i);
  }

  const aboutMatch = q.match(
    /(?:tell me about|about|info on|information on|what is|what's|describe)\s+(.+)/i
  );
  if (aboutMatch) {
    const resolved = resolveCountries([aboutMatch[1].trim()], countries);
    if (resolved.length) return resolved;
  }

  return found;
}

export function parseIntentLocally(query: string, countries: CountrySummary[]): ParsedIntent {
  const q = normalizeQuery(query);

  if (q.includes("compare") || q.includes(" vs ") || q.includes(" versus ")) {
    const mentioned = findMentioned(query, countries);
    return {
      intent: "compare",
      countries: mentioned.slice(0, 2).map((c) => c.name),
    };
  }

  const mentioned = findMentioned(query, countries);
  if (mentioned.length === 1) {
    if (q.includes("currency") || q.includes("money") || q.includes("coin")) {
      return { intent: "currency", countries: [mentioned[0].name] };
    }
    return { intent: "profile", countries: [mentioned[0].name] };
  }

  if (
    (q.includes("largest") || q.includes("biggest") || q.includes("most populous")) &&
    (q.includes("population") || q.includes("populous") || q.includes("people"))
  ) {
    return { intent: "population_rank" };
  }

  if (q.includes("smallest") || q.includes("tiny") || q.includes("compact")) {
    return { intent: "smallest" };
  }

  if (q.includes("language") || q.includes("linguistic")) {
    return { intent: "languages" };
  }

  if (q.includes("largest") || q.includes("biggest")) {
    return { intent: "area_rank" };
  }

  const regionMap: Record<string, string> = {
    europe: "Europe",
    asia: "Asia",
    asian: "Asia",
    africa: "Africa",
    african: "Africa",
    america: "Americas",
    americas: "Americas",
    oceania: "Oceania",
    antarctic: "Antarctic",
  };
  const region = Object.entries(regionMap).find(([k]) => q.includes(k))?.[1];
  if (region) return { intent: "region", region };

  return { intent: "help" };
}

function countryStats(c: CountrySummary, allCountries: CountrySummary[]): { label: string; value: string }[] {
  const items = [
    { label: "Official Name", value: c.officialName },
    { label: "Capital", value: c.capital },
    { label: "Region", value: `${c.region} · ${c.subregion}` },
    { label: "Population", value: formatNumber(c.population) },
    { label: "Population Rank", value: formatPopulationRank(c.cca3, allCountries) },
    { label: "Area", value: formatArea(c.area) },
    { label: "Languages", value: c.languages.join(", ") || "N/A" },
    {
      label: "Currency",
      value: c.currencies.map((cur) => `${cur.name} (${cur.code}${cur.symbol ? ` · ${cur.symbol}` : ""})`).join(", ") || "N/A",
    },
    { label: "Notable Figures", value: formatFamousPeople(c.cca3) },
    { label: "UN Member", value: c.unMember ? "Yes" : "No" },
  ];
  if (HAPPINESS_RANK[c.cca3]) {
    items.push({ label: "Happiness Rank", value: `#${HAPPINESS_RANK[c.cca3]} globally` });
  }
  return items;
}

function compareRows(a: CountrySummary, b: CountrySummary, allCountries: CountrySummary[]) {
  return [
    { label: "Population", left: formatNumber(a.population, true), right: formatNumber(b.population, true) },
    { label: "Population Rank", left: formatPopulationRank(a.cca3, allCountries), right: formatPopulationRank(b.cca3, allCountries) },
    { label: "Area", left: formatArea(a.area), right: formatArea(b.area) },
    { label: "Capital", left: a.capital, right: b.capital },
    { label: "Region", left: a.region, right: b.region },
    { label: "Languages", left: a.languages.join(", ") || "N/A", right: b.languages.join(", ") || "N/A" },
    {
      label: "Currency",
      left: a.currencies.map((c) => c.code).join(", ") || "N/A",
      right: b.currencies.map((c) => c.code).join(", ") || "N/A",
    },
    {
      label: "Notable Figures",
      left: formatFamousPeople(a.cca3),
      right: formatFamousPeople(b.cca3),
    },
    {
      label: "Happiness Rank",
      left: HAPPINESS_RANK[a.cca3] ? `#${HAPPINESS_RANK[a.cca3]}` : "N/A",
      right: HAPPINESS_RANK[b.cca3] ? `#${HAPPINESS_RANK[b.cca3]}` : "N/A",
    },
  ];
}

function rankingBlock(
  title: string,
  desc: string,
  items: { rank: number; name: string; value: string; cca3: string; cca2: string }[],
  actions?: { label: string; href: string }[]
): AssistantReply {
  const blocks: AssistantBlock[] = [
    { type: "title", content: title },
    { type: "text", content: desc },
    { type: "ranking", title, items },
  ];
  if (actions?.length) blocks.push({ type: "actions", links: actions });
  return { blocks };
}

export function buildAssistantReply(
  query: string,
  countries: CountrySummary[],
  parsed?: ParsedIntent,
  source: AssistantReply["source"] = "data"
): AssistantReply {
  const intent = parsed ?? parseIntentLocally(query, countries);
  const mentioned = intent.countries?.length
    ? resolveCountries(intent.countries, countries)
    : findMentioned(query, countries);

  if (intent.intent === "compare" && mentioned.length >= 2) {
    const [left, right] = mentioned;
    return {
      source,
      blocks: [
        { type: "title", content: `${left.name} vs ${right.name}` },
        { type: "text", content: "Side-by-side comparison from verified country database." },
        { type: "compare", left, right, rows: compareRows(left, right, countries) },
        {
          type: "actions",
          links: [
            { label: "Open Compare Tool", href: "/compare" },
            { label: `View ${left.name}`, href: `/countries/${left.cca3.toLowerCase()}` },
            { label: `View ${right.name}`, href: `/countries/${right.cca3.toLowerCase()}` },
          ],
        },
      ],
    };
  }

  if ((intent.intent === "profile" || intent.intent === "currency") && mentioned.length === 1) {
    const c = mentioned[0];
    if (intent.intent === "currency") {
      return {
        source,
        blocks: [
          { type: "title", content: `Currency in ${c.name}` },
          {
            type: "text",
            content: `${c.name} uses the following official ${c.currencies.length === 1 ? "currency" : "currencies"}:`,
          },
          {
            type: "stats",
            items: c.currencies.length
              ? c.currencies.map((cur) => ({
                  label: cur.code,
                  value: `${cur.name}${cur.symbol ? ` (${cur.symbol})` : ""}`,
                }))
              : [{ label: "Currency", value: "No currency data available" }],
          },
          { type: "country", country: c },
          {
            type: "actions",
            links: [
              { label: "Currency Explorer", href: "/currency" },
              { label: `View ${c.name}`, href: `/countries/${c.cca3.toLowerCase()}` },
            ],
          },
        ],
      };
    }

    return {
      source,
      blocks: [
        { type: "country", country: c },
        { type: "stats", items: countryStats(c, countries) },
        {
          type: "actions",
          links: [
            { label: "Full Country Profile", href: `/countries/${c.cca3.toLowerCase()}` },
            { label: "Compare with Others", href: "/compare" },
            { label: "View on Map", href: "/map" },
          ],
        },
      ],
    };
  }

  if (intent.intent === "population_rank") {
    const sorted = [...countries].sort((a, b) => b.population - a.population).slice(0, 10);
    return {
      source,
      ...rankingBlock(
        "Most Populous Countries",
        "Ranked by World Bank population figures from our live database.",
        sorted.map((c, i) => ({
          rank: i + 1,
          name: c.name,
          value: formatNumber(c.population, true),
          cca3: c.cca3,
          cca2: c.cca2,
        })),
        [{ label: "View All Rankings", href: "/rankings" }]
      ),
    };
  }

  if (intent.intent === "area_rank") {
    const sorted = [...countries].sort((a, b) => b.area - a.area).slice(0, 10);
    return {
      source,
      ...rankingBlock(
        "Largest Countries by Area",
        "Ranked by total land area in square kilometres.",
        sorted.map((c, i) => ({
          rank: i + 1,
          name: c.name,
          value: formatArea(c.area),
          cca3: c.cca3,
          cca2: c.cca2,
        })),
        [{ label: "View All Rankings", href: "/rankings" }]
      ),
    };
  }

  if (intent.intent === "smallest") {
    const sorted = [...countries].filter((c) => c.area > 0).sort((a, b) => a.area - b.area).slice(0, 10);
    return {
      source,
      ...rankingBlock(
        "Smallest Countries by Area",
        "Ranked by land area from smallest upward.",
        sorted.map((c, i) => ({
          rank: i + 1,
          name: c.name,
          value: formatArea(c.area),
          cca3: c.cca3,
          cca2: c.cca2,
        }))
      ),
    };
  }

  if (intent.intent === "languages") {
    const sorted = [...countries].sort((a, b) => b.languages.length - a.languages.length).slice(0, 10);
    return {
      source,
      ...rankingBlock(
        "Most Linguistically Diverse Countries",
        "Countries with the highest number of recorded languages.",
        sorted.map((c, i) => ({
          rank: i + 1,
          name: c.name,
          value: `${c.languages.length} languages`,
          cca3: c.cca3,
          cca2: c.cca2,
        }))
      ),
    };
  }

  if (intent.intent === "region" && intent.region) {
    const inRegion = countries
      .filter((c) => c.region === intent.region)
      .sort((a, b) => b.population - a.population)
      .slice(0, 10);
    return {
      source,
      ...rankingBlock(
        `${intent.region} Overview`,
        `${countries.filter((c) => c.region === intent.region).length} countries in ${intent.region}, shown by population.`,
        inRegion.map((c, i) => ({
          rank: i + 1,
          name: c.name,
          value: formatNumber(c.population, true),
          cca3: c.cca3,
          cca2: c.cca2,
        })),
        [{ label: `Browse ${intent.region}`, href: `/countries?region=${encodeURIComponent(intent.region)}` }]
      ),
    };
  }

  if (mentioned.length === 1) {
    const c = mentioned[0];
    return {
      source,
      blocks: [
        { type: "country", country: c },
        { type: "stats", items: countryStats(c, countries) },
        {
          type: "actions",
          links: [
            { label: "Full Country Profile", href: `/countries/${c.cca3.toLowerCase()}` },
            { label: "Compare with Others", href: "/compare" },
          ],
        },
      ],
    };
  }

  return {
    source,
    blocks: [
      { type: "title", content: "Country Explorer Assistant" },
      {
        type: "text",
        content:
          "Ask about any country, compare two nations, or request rankings. Every answer is built from verified live data — not guessed.",
      },
      {
        type: "stats",
        items: [
          { label: "Countries in Database", value: String(countries.length) },
          { label: "Data Sources", value: "mledoze Countries + World Bank" },
          { label: "Example Queries", value: "Tell me about Japan · Compare France and Germany" },
        ],
      },
      {
        type: "actions",
        links: [
          { label: "Browse Countries", href: "/countries" },
          { label: "Compare Tool", href: "/compare" },
          { label: "Rankings", href: "/rankings" },
        ],
      },
    ],
  };
}
