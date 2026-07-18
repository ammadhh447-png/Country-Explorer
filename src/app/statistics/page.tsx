"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Globe, Languages, Coins, Waves, MapPin, TrendingUp } from "lucide-react";
import { useCountries } from "@/lib/hooks/use-countries";
import { computeWorldStats } from "@/lib/api/statistics";
import { AnimatedCounter } from "@/components/features/animated-counter";
import { CountryFlag } from "@/components/features/country-flag";
import { Card } from "@/components/ui/card";
import { BarChartCard, PieChartCard } from "@/components/features/charts";
import { formatNumber, formatArea } from "@/lib/format";
import { CountryCardSkeleton } from "@/components/features/loading";

const STAT_CARDS = [
  { key: "totalPopulation", label: "World Population", icon: Globe, suffix: "", compact: true },
  { key: "totalCountries", label: "Countries", icon: MapPin, suffix: "", compact: false },
  { key: "totalLanguages", label: "Languages", icon: Languages, suffix: "+", compact: false },
  { key: "totalCurrencies", label: "Currencies", icon: Coins, suffix: "", compact: false },
  { key: "totalContinents", label: "Continents", icon: Waves, suffix: "", compact: false },
] as const;

export default function StatisticsPage() {
  const { data: countries = [], isLoading } = useCountries();

  const stats = useMemo(
    () => (countries.length ? computeWorldStats(countries) : null),
    [countries]
  );

  const countryByCode = useMemo(
    () => new Map(countries.map((c) => [c.cca3, c])),
    [countries]
  );

  if (isLoading || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="skeleton h-10 w-64 mb-8 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <CountryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-4xl font-bold">World Statistics</h1>
        </div>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          Live global dashboard built from 250 countries — population, area, and continental breakdowns updated from public data.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-14">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="text-center !p-5 h-full border-border/60">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <card.icon className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold gradient-text">
                <AnimatedCounter
                  value={stats[card.key]}
                  compact={card.compact}
                  suffix={card.suffix}
                />
              </p>
              <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h2 className="font-serif text-2xl font-bold">Global Insights</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <PieChartCard
          title="Population by Continent"
          data={stats.populationByContinent.map((c) => ({
            name: c.name,
            value: c.population,
          }))}
        />
        <BarChartCard
          title="Most Populous Countries"
          data={stats.mostPopulous.map((c) => ({
            name: c.name,
            value: c.population,
          }))}
        />
        <BarChartCard
          title="Largest Countries by Area"
          data={stats.largestCountries.map((c) => ({
            name: c.name,
            value: c.area,
          }))}
          formatValue={formatArea}
        />
        <BarChartCard
          title="Smallest Countries by Area"
          data={stats.smallestCountries.map((c) => ({
            name: c.name,
            value: c.area,
          }))}
          formatValue={formatArea}
        />
      </div>

      <Card className="border-border/60">
        <h3 className="font-serif text-xl font-semibold mb-1">Top 10 Most Populous</h3>
        <p className="text-sm text-muted-foreground mb-5">Click any country to open its full profile</p>
        <div className="space-y-1">
          {stats.mostPopulous.map((c, i) => {
            const summary = countryByCode.get(c.cca3);
            return (
              <Link
                key={c.cca3}
                href={`/countries/${c.cca3.toLowerCase()}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-muted-foreground w-6 shrink-0">#{i + 1}</span>
                  {summary && (
                    <CountryFlag cca2={summary.cca2} name={summary.name} className="w-8 h-5 rounded shrink-0" />
                  )}
                  <span className="font-medium truncate group-hover:text-accent transition-colors">{c.name}</span>
                </div>
                <span className="text-sm text-muted-foreground shrink-0 ml-3">{formatNumber(c.population, true)}</span>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
