"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Coins, Search } from "lucide-react";
import { useCountries } from "@/lib/hooks/use-countries";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountryFlag } from "@/components/features/country-flag";
import { PaginationBar } from "@/components/features/pagination-bar";
import type { CountrySummary } from "@/types/country";

const PAGE_SIZE = 24;

type CurrencyEntry = {
  code: string;
  name: string;
  symbol: string;
  countries: CountrySummary[];
};

export default function CurrencyPage() {
  const { data: countries = [], isLoading } = useCountries();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const currencyMap = useMemo(() => {
    const map = new Map<string, CurrencyEntry>();
    countries.forEach((c) => {
      c.currencies.forEach((cur) => {
        const existing = map.get(cur.code);
        if (existing) {
          existing.countries.push(c);
        } else {
          map.set(cur.code, {
            code: cur.code,
            name: cur.name,
            symbol: cur.symbol,
            countries: [c],
          });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, [countries]);

  const filtered = useMemo(() => {
    if (!search) return currencyMap;
    const q = search.toLowerCase();
    return currencyMap.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.countries.some((country) => country.name.toLowerCase().includes(q))
    );
  }, [currencyMap, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Coins className="w-8 h-8 text-accent" />
          <h1 className="font-serif text-4xl font-bold">Currency Explorer</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Explore {currencyMap.length} currencies used across the world
        </p>
      </motion.div>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by code, name, or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-muted-foreground">No currencies match your search.</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((currency) => (
              <Card key={currency.code} className="card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold gradient-text">{currency.symbol || currency.code}</span>
                    <h3 className="font-semibold mt-1">{currency.code}</h3>
                  </div>
                  <Badge variant="outline">{currency.countries.length} countries</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{currency.name}</p>
                <div className="flex flex-wrap gap-2">
                  {currency.countries.slice(0, 6).map((country) => (
                    <Link
                      key={country.cca3}
                      href={`/countries/${country.cca3.toLowerCase()}`}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-xs"
                      title={country.name}
                    >
                      <CountryFlag cca2={country.cca2} name={country.name} className="w-5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[100px]">{country.name}</span>
                    </Link>
                  ))}
                  {currency.countries.length > 6 && (
                    <Badge variant="outline" className="text-xs self-center">
                      +{currency.countries.length - 6} more
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <PaginationBar
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            label="currencies"
          />
        </>
      )}
    </div>
  );
}
