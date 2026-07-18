"use client";

import { useQueries } from "@tanstack/react-query";
import { getCountryIndicators } from "@/lib/api/world-bank";
import { CompareLineChart } from "@/components/features/charts";
import { WorldMap } from "@/components/features/world-map";
import { formatCurrency } from "@/lib/format";
import type { CountrySummary } from "@/types/country";

import { CHART_SERIES } from "@/lib/chart-colors";

export function CompareIndicators({
  countries,
  allCountries,
}: {
  countries: CountrySummary[];
  allCountries: CountrySummary[];
}) {
  const queries = useQueries({
    queries: countries.map((c) => ({
      queryKey: ["indicators", c.cca3],
      queryFn: () => getCountryIndicators(c.cca3),
      enabled: !!c.cca3,
    })),
  });

  const populationDatasets = countries.map((c, i) => ({
    name: c.name,
    data: queries[i]?.data?.population ?? [],
    color: CHART_SERIES[i % CHART_SERIES.length],
  }));

  const gdpDatasets = countries.map((c, i) => ({
    name: c.name,
    data: queries[i]?.data?.gdp ?? [],
    color: CHART_SERIES[i % CHART_SERIES.length],
  }));

  const highlightColors = Object.fromEntries(
    countries.map((c, i) => [c.cca3, CHART_SERIES[i % CHART_SERIES.length]])
  );

  const hasPopulation = populationDatasets.some((d) => d.data.length > 0);
  const hasGdp = gdpDatasets.some((d) => d.data.length > 0);

  return (
    <div className="space-y-8">
      {hasPopulation && (
        <CompareLineChart datasets={populationDatasets} title="Population Trend Comparison" />
      )}
      {hasGdp && (
        <CompareLineChart
          datasets={gdpDatasets}
          title="GDP Trend Comparison (World Bank)"
          formatValue={formatCurrency}
        />
      )}
      <div>
        <h3 className="font-semibold text-lg mb-4">Country Locations on Map</h3>
        <WorldMap
          countries={allCountries}
          highlightCodes={countries.map((c) => c.cca3)}
          highlightColors={highlightColors}
          compareMode
          compact
        />
      </div>
    </div>
  );
}
