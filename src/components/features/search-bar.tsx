"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X, Users, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CountryFlag } from "@/components/features/country-flag";
import { useCountries } from "@/lib/hooks/use-countries";
import { filterCountriesByQuery, formatNumber } from "@/lib/format";
import type { CountrySummary } from "@/types/country";

function HighlightText({ text, query }: { text: string; query: string }) {
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return <>{text}</>;

  const pattern = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const parts = text.split(new RegExp(`(${pattern})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        words.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-primary/25 text-foreground rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function SearchBar({
  placeholder = "Search any country...",
  className,
  large,
  onSelect,
}: {
  placeholder?: string;
  className?: string;
  large?: boolean;
  onSelect?: (country: CountrySummary) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: countries = [], isLoading } = useCountries();

  const results = useMemo(() => {
    if (query.trim().length === 0) return [];
    return filterCountriesByQuery(countries, query)
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 10);
  }, [countries, query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (country: CountrySummary) => {
    setQuery("");
    setOpen(false);
    if (onSelect) onSelect(country);
    else router.push(`/countries/${country.cca3.toLowerCase()}`);
  };

  const clear = () => {
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") clear();
          }}
          placeholder={placeholder}
          className={cn("pl-11 pr-11", large && "h-14 text-base")}
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden shadow-2xl z-50 max-h-[420px] overflow-y-auto"
          >
            {isLoading ? (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">Loading countries...</p>
            ) : results.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                No countries match &quot;{query}&quot;
              </p>
            ) : (
              <>
                <p className="px-4 py-2 text-xs text-muted-foreground border-b border-border/50">
                  {results.length} result{results.length !== 1 ? "s" : ""} · live
                </p>
                {results.map((country) => (
                  <button
                    key={country.cca3}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left border-b border-border/30 last:border-0"
                  >
                    <CountryFlag
                      cca2={country.cca2}
                      name={country.name}
                      className="w-10 h-7 rounded shadow-sm shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        <HighlightText text={country.name} query={query} />
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3 shrink-0" />
                        <HighlightText text={country.capital} query={query} />
                        <span>·</span>
                        <HighlightText text={country.region} query={query} />
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        <HighlightText text={country.officialName} query={query} />
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="size-3" />
                          {formatNumber(country.population, true)}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="size-3" />
                          {country.subregion}
                        </span>
                        {country.languages.slice(0, 2).map((lang) => (
                          <Badge key={lang} variant="outline" className="text-[10px] px-1.5 py-0">
                            <HighlightText text={lang} query={query} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {country.cca3}
                    </Badge>
                  </button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
