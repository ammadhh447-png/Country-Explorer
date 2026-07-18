"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Search } from "lucide-react";
import { useCountries } from "@/lib/hooks/use-countries";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TabBar } from "@/components/features/tab-bar";
import { PaginationBar } from "@/components/features/pagination-bar";
import { CountryCardSkeleton } from "@/components/features/loading";
import { UtcClock, FeaturedCapitalTile, CountryTimeCard } from "@/components/features/world-time";
import { REGIONS } from "@/lib/constants";
import { filterCountriesByQuery } from "@/lib/format";
import type { CountrySummary } from "@/types/country";

const PAGE_SIZE = 24;

const FEATURED_CODES = [
  "USA", "GBR", "FRA", "DEU", "JPN", "CHN", "IND", "AUS",
  "BRA", "ZAF", "ARE", "SGP", "MEX", "CAN", "KOR", "EGY",
] as const;

export default function WorldTimePage() {
  const { data: countries = [], isLoading } = useCountries();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [page, setPage] = useState(1);

  const regionTabs = useMemo(
    () => [{ id: "All", label: "All Regions" }, ...REGIONS.filter((r) => r !== "Antarctic").map((r) => ({ id: r, label: r }))],
    []
  );

  const featured = useMemo(
    () => FEATURED_CODES.map((code) => countries.find((c) => c.cca3 === code)).filter(Boolean) as CountrySummary[],
    [countries]
  );

  const filtered = useMemo(() => {
    let list = countries.filter((c) => c.timezones.length > 0 || (c.timezoneIds?.length ?? 0) > 0);
    if (region !== "All") list = list.filter((c) => c.region === region);
    if (search.trim()) list = filterCountriesByQuery(list, search);
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, region, search]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search, region]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="skeleton h-10 w-64 mb-8 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CountryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-w-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Clock className="w-8 h-8 text-accent shrink-0" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">World Time</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl text-sm sm:text-base">
          Live local times for every nation — search by country or capital, filter by region, and compare time zones worldwide.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-1">
          <UtcClock />
        </div>
        <div className="lg:col-span-2 min-w-0">
          <Card className="!p-5 sm:!p-6 h-full">
            <h2 className="font-semibold text-foreground mb-4">Major Capitals</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {featured.map((country) => (
                <FeaturedCapitalTile key={country.cca3} country={country} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country or capital..."
            className="pl-9"
            aria-label="Search country or capital"
          />
        </div>
        <p className="text-sm text-muted-foreground shrink-0">
          {filtered.length} countr{filtered.length === 1 ? "y" : "ies"}
        </p>
      </div>

      <TabBar tabs={regionTabs} value={region} onValueChange={setRegion} className="mb-8" />

      {paginated.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-muted-foreground">No countries match your search.</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-8">
            {paginated.map((country, i) => (
              <motion.div
                key={country.cca3}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="h-full min-w-0"
              >
                <CountryTimeCard country={country} />
              </motion.div>
            ))}
          </div>
          <PaginationBar
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            label="countries"
          />
        </>
      )}
    </div>
  );
}
