"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { useCountries } from "@/lib/hooks/use-countries";
import { TabBar } from "@/components/features/tab-bar";
import { PaginationBar } from "@/components/features/pagination-bar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountryFlag } from "@/components/features/country-flag";
import { formatNumber, formatArea } from "@/lib/format";
import { HAPPINESS_RANK, HDI_RANK } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CountrySummary } from "@/types/country";

const PAGE_SIZE = 25;

const RANKING_TABS = [
  { id: "population", label: "Population" },
  { id: "area", label: "Area" },
  { id: "happiness", label: "Happiness" },
  { id: "hdi", label: "HDI" },
  { id: "languages", label: "Languages" },
] as const;

const RANKING_META: Record<string, { title: string; desc: string }> = {
  population: {
    title: "Population Rankings",
    desc: "All countries ordered by live World Bank population figures.",
  },
  area: {
    title: "Area Rankings",
    desc: "All countries ranked by total land area in square kilometres.",
  },
  happiness: {
    title: "Happiness Rankings",
    desc: "Countries with available World Happiness Report data, best rank first.",
  },
  hdi: {
    title: "Human Development Rankings",
    desc: "Countries with HDI index data, highest development rank first.",
  },
  languages: {
    title: "Language Diversity Rankings",
    desc: "Countries ranked by number of recorded official languages.",
  },
};

type RankingEntry = {
  rank: number;
  cca3: string;
  cca2: string;
  name: string;
  region: string;
  value: string;
};

function buildRankings(active: string, countries: CountrySummary[]): RankingEntry[] {
  if (!countries?.length) return [];

  switch (active) {
    case "population":
      return [...countries]
        .sort((a, b) => b.population - a.population)
        .map((c, i) => ({
          rank: i + 1,
          cca3: c.cca3,
          cca2: c.cca2,
          name: c.name,
          region: c.region,
          value: formatNumber(c.population),
        }));
    case "area":
      return [...countries]
        .filter((c) => c.area > 0)
        .sort((a, b) => b.area - a.area)
        .map((c, i) => ({
          rank: i + 1,
          cca3: c.cca3,
          cca2: c.cca2,
          name: c.name,
          region: c.region,
          value: formatArea(c.area),
        }));
    case "happiness":
      return countries
        .filter((c) => HAPPINESS_RANK[c.cca3])
        .sort((a, b) => (HAPPINESS_RANK[a.cca3] ?? 999) - (HAPPINESS_RANK[b.cca3] ?? 999))
        .map((c, i) => ({
          rank: i + 1,
          cca3: c.cca3,
          cca2: c.cca2,
          name: c.name,
          region: c.region,
          value: `#${HAPPINESS_RANK[c.cca3]} globally`,
        }));
    case "hdi":
      return countries
        .filter((c) => HDI_RANK[c.cca3])
        .sort((a, b) => (HDI_RANK[a.cca3] ?? 999) - (HDI_RANK[b.cca3] ?? 999))
        .map((c, i) => ({
          rank: i + 1,
          cca3: c.cca3,
          cca2: c.cca2,
          name: c.name,
          region: c.region,
          value: `#${HDI_RANK[c.cca3]} globally`,
        }));
    case "languages":
      return [...countries]
        .sort((a, b) => b.languages.length - a.languages.length)
        .map((c, i) => ({
          rank: i + 1,
          cca3: c.cca3,
          cca2: c.cca2,
          name: c.name,
          region: c.region,
          value: `${c.languages.length} language${c.languages.length === 1 ? "" : "s"}`,
        }));
    default:
      return [];
  }
}

function rankAccent(rank: number) {
  if (rank === 1) return "from-amber-500/15 to-transparent border-amber-500/25";
  if (rank === 2) return "from-slate-400/15 to-transparent border-slate-400/25";
  if (rank === 3) return "from-orange-700/15 to-transparent border-orange-700/25";
  return "border-transparent hover:bg-muted/30";
}

export default function RankingsPage() {
  const { data: countries = [], isLoading } = useCountries();
  const [active, setActive] = useState<string>("population");
  const [page, setPage] = useState(1);

  const allRankings = useMemo(() => buildRankings(active, countries), [countries, active]);
  const totalPages = Math.max(1, Math.ceil(allRankings.length / PAGE_SIZE));
  const paginated = allRankings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const meta = RANKING_META[active];

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-4xl font-bold">Country Rankings</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Browse complete ranked lists across population, geography, development, and language diversity.
        </p>
      </motion.div>

      <TabBar
        tabs={[...RANKING_TABS]}
        value={active}
        onValueChange={(tab) => {
          setActive(tab);
          setPage(1);
        }}
        className="mb-6"
      />

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Badge variant="default">{allRankings.length} countries</Badge>
        <Badge variant="secondary">{RANKING_TABS.find((t) => t.id === active)?.label}</Badge>
        {allRankings.length > PAGE_SIZE && (
          <span className="text-sm text-muted-foreground ml-auto">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, allRankings.length)}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <Card className="!p-0 overflow-hidden border-border/60">
          <div className="px-5 py-4 border-b border-border/60 bg-muted/20">
            <div className="flex items-start gap-3">
              <Medal className="size-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold">{meta.title}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{meta.desc}</p>
              </div>
            </div>
          </div>

          {paginated.length === 0 ? (
            <p className="text-center text-muted-foreground py-16 text-sm">No ranking data for this category.</p>
          ) : (
            <div>
              {paginated.map((entry) => (
                <Link
                  key={entry.cca3}
                  href={`/countries/${entry.cca3.toLowerCase()}`}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 border-b border-border/40 last:border-0 transition-colors bg-gradient-to-r",
                    rankAccent(entry.rank)
                  )}
                >
                  <span
                    className={cn(
                      "text-base font-bold w-10 shrink-0 tabular-nums",
                      entry.rank <= 3 ? "gradient-text text-lg" : "text-muted-foreground"
                    )}
                  >
                    #{entry.rank}
                  </span>
                  <CountryFlag cca2={entry.cca2} name={entry.name} className="w-11 h-7 rounded shadow-sm shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.region}</p>
                  </div>
                  <span className="text-sm font-medium text-right shrink-0">{entry.value}</span>
                </Link>
              ))}
            </div>
          )}

          <PaginationBar
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={allRankings.length}
            pageSize={PAGE_SIZE}
            label="countries"
          />
        </Card>
      )}
    </div>
  );
}
