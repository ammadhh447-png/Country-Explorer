"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountryFlag } from "@/components/features/country-flag";
import { formatNumber } from "@/lib/format";
import type { CountrySummary } from "@/types/country";

export function CountryCard({
  country,
  index = 0,
  variant = "grid",
}: {
  country: CountrySummary;
  index?: number;
  variant?: "grid" | "list";
}) {
  if (variant === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
      >
        <Link href={`/countries/${country.cca3.toLowerCase()}`}>
          <Card className={cn("flex items-center gap-4 !p-4 card-hover")}>
            <CountryFlag cca2={country.cca2} name={country.name} className="w-12 h-8 rounded-lg shadow" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{country.name}</h3>
              <p className="text-sm text-muted-foreground">
                {country.capital} · {country.region}
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{formatNumber(country.population, true)}</p>
              <p className="text-xs text-muted-foreground">{country.area.toLocaleString()} km²</p>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/countries/${country.cca3.toLowerCase()}`}>
        <Card className="group h-full card-hover">
          <div className="flex items-start justify-between mb-3">
            <CountryFlag
              cca2={country.cca2}
              name={country.name}
              className="w-14 h-9 rounded-lg shadow-md group-hover:scale-105 transition-transform"
            />
            <Badge variant="outline">{country.cca3}</Badge>
          </div>
          <h3 className="font-semibold text-lg mb-1">{country.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
            <MapPin className="w-3.5 h-3.5" /> {country.capital}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              {formatNumber(country.population, true)}
            </span>
            <Badge>{country.region}</Badge>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
