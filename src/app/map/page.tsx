"use client";

import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { WorldMap } from "@/components/features/world-map";
import { useCountries } from "@/lib/hooks/use-countries";
import { Card } from "@/components/ui/card";
import { getRegionColor } from "@/lib/format";
import { REGIONS } from "@/lib/constants";

export default function MapPage() {
  const { data: countries = [], isLoading } = useCountries();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Map className="w-8 h-8 text-accent" />
          <h1 className="font-serif text-4xl font-bold">Interactive World Map</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Search to locate a country on the map. Hover for a preview, click to view full details.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="skeleton h-[600px] rounded-2xl" />
      ) : (
        <WorldMap countries={countries} />
      )}

      <div className="mt-8">
        <h2 className="font-semibold mb-4">Region Legend</h2>
        <div className="flex flex-wrap gap-3">
          {REGIONS.filter((r) => r !== "Antarctic").map((region) => (
            <Card key={region} className="flex items-center gap-2 !p-3">
              <div className="w-4 h-4 rounded" style={{ background: getRegionColor(region) }} />
              <span className="text-sm">{region}</span>
              <span className="text-xs text-muted-foreground">
                ({countries.filter((c) => c.region === region).length})
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
