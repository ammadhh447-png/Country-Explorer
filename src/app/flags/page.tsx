"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flag, Download, Search } from "lucide-react";
import { useCountries } from "@/lib/hooks/use-countries";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CountryFlag } from "@/components/features/country-flag";
import { PaginationBar } from "@/components/features/pagination-bar";
import { filterCountriesByQuery } from "@/lib/format";

const PAGE_SIZE = 32;

export default function FlagsPage() {
  const { data: countries = [], isLoading } = useCountries();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search.trim()) return countries;
    return filterCountriesByQuery(countries, search);
  }, [countries, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const selectedCountry = countries.find((c) => c.cca3 === selected);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Flag className="w-8 h-8 text-accent" />
          <h1 className="font-serif text-4xl font-bold">Flag Explorer</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Browse and download high-resolution SVG flags for every country
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, capital, or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11"
            />
          </div>
          {!isLoading && filtered.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} flag{filtered.length === 1 ? "" : "s"} found
            </p>
          )}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-muted-foreground">No flags match your search.</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {paginated.map((country) => (
                  <button
                    key={country.cca3}
                    type="button"
                    onClick={() => setSelected(country.cca3)}
                    aria-selected={selected === country.cca3}
                    className={`glass rounded-xl p-3 text-left transition-all hover:scale-105 ${
                      selected === country.cca3 ? "ring-2 ring-accent" : ""
                    }`}
                  >
                    <CountryFlag
                      cca2={country.cca2}
                      name={country.name}
                      svg
                      className="w-full h-16 rounded-lg mb-2"
                    />
                    <p className="text-xs font-medium truncate">{country.name}</p>
                  </button>
                ))}
              </div>
              <PaginationBar
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                label="flags"
              />
            </>
          )}
        </div>

        <div>
          {selectedCountry ? (
            <Card className="sticky top-24">
              <CountryFlag
                cca2={selectedCountry.cca2}
                name={selectedCountry.name}
                svg
                className="w-full rounded-xl mb-4 shadow-lg"
              />
              <h2 className="font-serif text-xl font-bold mb-1">{selectedCountry.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{selectedCountry.officialName}</p>
              <div className="space-y-2">
                <a href={selectedCountry.flagSvg} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="w-full">
                    <Download className="w-4 h-4" /> Download SVG
                  </Button>
                </a>
                <Link href={`/countries/${selectedCountry.cca3.toLowerCase()}`}>
                  <Button className="w-full">View Country</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12 sticky top-24">
              <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Select a flag to preview</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
