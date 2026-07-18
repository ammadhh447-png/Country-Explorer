"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitCompare, X } from "lucide-react";
import { useCountries } from "@/lib/hooks/use-countries";
import { SearchBar } from "@/components/features/search-bar";
import { CompareIndicators } from "@/components/features/compare-indicators";
import { CountryLocalTime } from "@/components/features/country-local-time";
import { Card } from "@/components/ui/card";
import { formatNumber, formatArea } from "@/lib/format";
import { HAPPINESS_RANK } from "@/lib/constants";
import { formatFamousPeople, formatPopulationRank } from "@/lib/country-insights";
import type { CountrySummary } from "@/types/country";

import { CHART_SERIES } from "@/lib/chart-colors";
const MAX_COMPARE = 3;

const METRICS = [
  { key: "population", label: "Population", format: (v: number) => formatNumber(v) },
  { key: "area", label: "Area", format: (v: number) => formatArea(v) },
  { key: "capital", label: "Capital", format: (v: string) => v },
  { key: "region", label: "Region", format: (v: string) => v },
  { key: "languages", label: "Languages", format: (v: string[]) => v.join(", ") },
  { key: "currencies", label: "Currency", format: (_: unknown, c: CountrySummary) => c.currencies.map((cur) => cur.code).join(", ") },
  { key: "localTime", label: "Local Time (Live)", format: (_: unknown, c: CountrySummary) => null },
  { key: "populationRank", label: "Population Rank", format: (_: unknown, c: CountrySummary, all: CountrySummary[]) => formatPopulationRank(c.cca3, all) },
  { key: "famousPeople", label: "Notable Figures", format: (_: unknown, c: CountrySummary) => formatFamousPeople(c.cca3) },
  { key: "landlocked", label: "Landlocked", format: (v: boolean) => v ? "Yes" : "No" },
  { key: "happiness", label: "Happiness Rank", format: (_: unknown, c: CountrySummary) => HAPPINESS_RANK[c.cca3] ? `#${HAPPINESS_RANK[c.cca3]}` : "N/A" },
];

export default function ComparePage() {
  const { data: allCountries = [] } = useCountries();
  const [selected, setSelected] = useState<CountrySummary[]>([]);

  const addCountry = (country: CountrySummary) => {
    if (selected.length >= MAX_COMPARE) return;
    if (selected.some((s) => s.cca3 === country.cca3)) return;
    setSelected((prev) => [...prev, country]);
  };

  const removeCountry = (cca3: string) => {
    setSelected((prev) => prev.filter((c) => c.cca3 !== cca3));
  };

  const getValue = (country: CountrySummary, key: string): unknown => {
    switch (key) {
      case "happiness":
      case "currencies":
      case "localTime":
      case "populationRank":
      case "famousPeople":
        return null;
      default:
        return (country as unknown as Record<string, unknown>)[key];
    }
  };

  const renderCell = (metricKey: string, country: CountrySummary) => {
    if (metricKey === "localTime") {
      return (
        <CountryLocalTime
          timezoneIds={country.timezoneIds}
          timezones={country.timezones}
        />
      );
    }

    const metric = METRICS.find((m) => m.key === metricKey);
    if (!metric) return "N/A";
    return metric.format(getValue(country, metricKey) as never, country, allCountries);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <GitCompare className="w-8 h-8 text-accent" />
          <h1 className="font-serif text-4xl font-bold">Compare Countries</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Select up to {MAX_COMPARE} countries for side-by-side comparison
        </p>
      </motion.div>

      <div className="max-w-md mb-8">
        <SearchBar placeholder="Add a country to compare..." onSelect={addCountry} />
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {selected.map((country, i) => (
          <Card key={country.cca3} className="flex items-center gap-3 !p-3">
            <div className="w-3 h-3 rounded-full" style={{ background: CHART_SERIES[i] }} />
            <img src={country.flag} alt="" className="w-8 h-5 rounded object-cover" />
            <span className="font-medium text-sm">{country.name}</span>
            <button onClick={() => removeCountry(country.cca3)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </Card>
        ))}
        {selected.length === 0 && (
          <p className="text-sm text-muted-foreground">Search and add countries above to start comparing</p>
        )}
      </div>

      {selected.length >= 2 && (
        <>
          <Card className="overflow-x-auto mb-8 !p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-medium">Metric</th>
                  {selected.map((c, i) => (
                    <th key={c.cca3} className="text-left p-4 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: CHART_SERIES[i] }} />
                        <img src={c.flag} alt="" className="w-6 h-4 rounded" />
                        {c.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRICS.map((metric) => (
                  <tr key={metric.key} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-4 text-muted-foreground">{metric.label}</td>
                    {selected.map((c) => (
                      <td key={c.cca3} className="p-4 font-medium align-top">
                        {renderCell(metric.key, c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <CompareIndicators countries={selected} allCountries={allCountries} />
        </>
      )}

      {selected.length === 1 && (
        <Card className="text-center py-12">
          <p className="text-muted-foreground">Add at least one more country to compare</p>
        </Card>
      )}
    </div>
  );
}
