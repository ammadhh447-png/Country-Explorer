"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountryCard } from "@/components/features/country-card";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { FilterSelect } from "@/components/features/filter-select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountryCardSkeleton } from "@/components/features/loading";
import { PaginationBar } from "@/components/features/pagination-bar";
import { useCountries } from "@/lib/hooks/use-countries";
import {
  filterCountries,
  sortCountries,
  getUniqueLanguages,
  getUniqueCurrencies,
  getUniqueTimezones,
} from "@/lib/api/statistics";
import { REGIONS, SUBREGIONS } from "@/lib/constants";

const PAGE_SIZE = 24;

function CountriesContent() {
  const searchParams = useSearchParams();
  const { data: countries = [], isLoading, isError, refetch } = useCountries();

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState(searchParams.get("region") ?? "All");
  const [subregion, setSubregion] = useState("All");
  const [language, setLanguage] = useState("All");
  const [currency, setCurrency] = useState("All");
  const [timezone, setTimezone] = useState("All");
  const [sort, setSort] = useState("name-asc");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const languages = useMemo(() => getUniqueLanguages(countries), [countries]);
  const currencies = useMemo(() => getUniqueCurrencies(countries), [countries]);
  const timezones = useMemo(() => getUniqueTimezones(countries), [countries]);

  const filtered = useMemo(() => {
    const result = filterCountries(countries, {
      search,
      region,
      subregion,
      language,
      currency,
      timezone,
    });
    return sortCountries(result, sort);
  }, [countries, search, region, subregion, language, currency, timezone, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, region, subregion, language, currency, timezone, sort]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const subregions = region !== "All" ? SUBREGIONS[region] ?? [] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl font-bold mb-2">All Countries</h1>
        <p className="text-muted-foreground mb-8">
          Explore {countries.length || 250} countries with live data
        </p>
      </motion.div>

      {isError && (
        <div className="glass rounded-xl p-4 mb-6 text-sm text-destructive flex items-center justify-between">
          <span>Failed to load countries. Check your connection and try again.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, capital, region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 pr-11"
          />
          {search.length > 0 && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <FilterSelect
            value={sort}
            onChange={setSort}
            options={[
              { value: "name-asc", label: "A → Z" },
              { value: "name-desc", label: "Z → A" },
              { value: "population-desc", label: "Population ↓" },
              { value: "population-asc", label: "Population ↑" },
              { value: "area-desc", label: "Area ↓" },
              { value: "area-asc", label: "Area ↑" },
            ]}
            className="w-40"
          />
          <Button
            variant={showFilters ? "default" : "secondary"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
          <div className="flex glass rounded-xl p-1">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                view === "grid" ? "gradient-bg text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                view === "list" ? "gradient-bg text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6"
        >
          <FilterSelect
            value={region}
            onChange={(v) => {
              setRegion(v);
              setSubregion("All");
            }}
            options={[
              { value: "All", label: "All Regions" },
              ...REGIONS.map((r) => ({ value: r, label: r })),
            ]}
          />
          {subregions.length > 0 && (
            <FilterSelect
              value={subregion}
              onChange={setSubregion}
              options={[
                { value: "All", label: "All Subregions" },
                ...subregions.map((s) => ({ value: s, label: s })),
              ]}
            />
          )}
          <FilterSelect
            value={language}
            onChange={setLanguage}
            options={[
              { value: "All", label: "All Languages" },
              ...languages.slice(0, 50).map((l) => ({ value: l, label: l })),
            ]}
          />
          <FilterSelect
            value={currency}
            onChange={setCurrency}
            options={[
              { value: "All", label: "All Currencies" },
              ...currencies.slice(0, 50).map((c) => ({
                value: c.code,
                label: `${c.code} - ${c.name}`,
              })),
            ]}
          />
          <FilterSelect
            value={timezone}
            onChange={setTimezone}
            options={[
              { value: "All", label: "All Timezones" },
              ...timezones.slice(0, 30).map((t) => ({ value: t, label: `UTC${t}` })),
            ]}
          />
        </motion.div>
      )}

      <div className="flex items-center gap-2 mb-6">
        <Badge variant="default">{filtered.length} countries</Badge>
        {region !== "All" && <Badge variant="secondary">{region}</Badge>}
        {filtered.length > PAGE_SIZE && (
          <span className="text-sm text-muted-foreground ml-auto">
            Page {page} of {totalPages}
          </span>
        )}
      </div>

      {isLoading ? (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              : "space-y-3"
          }
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <CountryCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              : "space-y-3"
          }
        >
          {paginated.map((country, i) => (
            <CountryCard key={country.cca3} country={country} index={i} variant={view} />
          ))}
        </div>
      )}

      {!isLoading && filtered.length > PAGE_SIZE && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          label="countries"
        />
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No countries match your filters.</p>
        </div>
      )}
    </div>
  );
}

export default function CountriesPage() {
  return (
    <Suspense>
      <CountriesContent />
    </Suspense>
  );
}
