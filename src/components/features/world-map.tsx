"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, Minus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountryFlag } from "@/components/features/country-flag";
import { getRegionColor, formatNumber, formatArea } from "@/lib/format";
import type { CountrySummary } from "@/types/country";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const GEO_NAME_ALIASES: Record<string, string> = {
  "United States of America": "United States",
  "United Kingdom of Great Britain and Northern Ireland": "United Kingdom",
  "Ivory Coast": "Côte d'Ivoire",
  "Côte d'Ivoire": "Ivory Coast",
  "Czech Republic": "Czechia",
  "Republic of Serbia": "Serbia",
  "Dem. Rep. Congo": "DR Congo",
  "Dominican Rep.": "Dominican Republic",
  "W. Sahara": "Western Sahara",
  "S. Sudan": "South Sudan",
  "Central African Rep.": "Central African Republic",
  "Eq. Guinea": "Equatorial Guinea",
  "Solomon Is.": "Solomon Islands",
  "Bosnia and Herz.": "Bosnia and Herzegovina",
  "Macedonia": "North Macedonia",
  "eSwatini": "Eswatini",
  "Lao PDR": "Laos",
  "Falkland Is.": "Falkland Islands",
  "Fr. S. Antarctic Lands": "French Southern and Antarctic Lands",
  Turkey: "Türkiye",
};

interface WorldMapProps {
  countries: CountrySummary[];
  onCountryClick?: (cca3: string) => void;
  highlightCode?: string;
  highlightCodes?: string[];
  highlightColors?: Record<string, string>;
  compareMode?: boolean;
  initialCenter?: [number, number];
  compact?: boolean;
}

function buildLookup(countries: CountrySummary[]) {
  const byCode = new Map<string, CountrySummary>();
  const byName = new Map<string, CountrySummary>();

  for (const country of countries) {
    byCode.set(country.cca3, country);
    byCode.set(country.cca2, country);
    if (country.ccn3) {
      byCode.set(country.ccn3, country);
      byCode.set(String(country.ccn3).padStart(3, "0"), country);
    }
    byName.set(country.name.toLowerCase(), country);
    byName.set(country.officialName.toLowerCase(), country);
  }

  return { byCode, byName };
}

function resolveCountry(
  geo: { id?: string | number; properties: { name?: string; ISO_A3?: string; ISO_A2?: string } },
  byCode: Map<string, CountrySummary>,
  byName: Map<string, CountrySummary>
): CountrySummary | undefined {
  if (geo.id != null && geo.id !== "") {
    const byNumeric = byCode.get(String(geo.id).padStart(3, "0"));
    if (byNumeric) return byNumeric;
  }

  const isoA3 = geo.properties.ISO_A3;
  if (isoA3 && isoA3 !== "-99") {
    const match = byCode.get(isoA3);
    if (match) return match;
  }

  const isoA2 = geo.properties.ISO_A2;
  if (isoA2 && isoA2 !== "-99") {
    const match = byCode.get(isoA2);
    if (match) return match;
  }

  const rawName = geo.properties.name?.trim();
  if (!rawName) return undefined;

  const candidates = [rawName, GEO_NAME_ALIASES[rawName]].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const match = byName.get(candidate.toLowerCase());
    if (match) return match;
  }

  return undefined;
}

export function WorldMap({
  countries,
  onCountryClick,
  highlightCode,
  highlightCodes,
  highlightColors,
  compareMode,
  initialCenter,
  compact,
}: WorldMapProps) {
  const router = useRouter();
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });
  const [hovered, setHovered] = useState<CountrySummary | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [search, setSearch] = useState("");
  const [searchFocusCode, setSearchFocusCode] = useState<string | null>(null);

  const { byCode, byName } = useMemo(() => buildLookup(countries), [countries]);

  const flyToCountry = useCallback((country: CountrySummary) => {
    const [lat, lng] = country.latlng;
    if (lat !== 0 || lng !== 0) {
      setPosition({ coordinates: [lng, lat], zoom: 4 });
    }
    setSearchFocusCode(country.cca3);
    setSearch("");
    setHovered(country);
  }, []);

  const clearSearch = useCallback(() => {
    setSearch("");
    setSearchFocusCode(null);
    setHovered(null);
    setPosition({ coordinates: [0, 20], zoom: 1 });
  }, []);

  const searchFocused = useMemo(
    () => countries.find((c) => c.cca3 === searchFocusCode),
    [countries, searchFocusCode]
  );

  const activeHighlights = useMemo(() => {
    const codes = highlightCodes?.length
      ? highlightCodes
      : highlightCode
        ? [highlightCode]
        : [];
    return codes
      .map((code) => countries.find((c) => c.cca3 === code))
      .filter((c): c is CountrySummary => !!c);
  }, [countries, highlightCode, highlightCodes]);

  const highlighted = activeHighlights[0];

  const focusMode = compact && !!highlightCode && !!highlighted && !compareMode;
  const isCompareView = compareMode && activeHighlights.length >= 2;

  useEffect(() => {
    if (isCompareView) {
      const points = activeHighlights
        .map((c) => c.latlng)
        .filter((ll) => ll[0] !== 0 || ll[1] !== 0);
      if (!points.length) return;

      const avgLat = points.reduce((sum, ll) => sum + ll[0], 0) / points.length;
      const avgLng = points.reduce((sum, ll) => sum + ll[1], 0) / points.length;
      const latSpread = Math.max(...points.map((ll) => ll[0])) - Math.min(...points.map((ll) => ll[0]));
      const lngSpread = Math.max(...points.map((ll) => ll[1])) - Math.min(...points.map((ll) => ll[1]));
      const spread = Math.max(latSpread, lngSpread);
      const zoom = spread > 80 ? 1 : spread > 40 ? 1.5 : spread > 20 ? 2 : spread > 8 ? 2.8 : 3.5;

      setPosition({
        coordinates: [avgLng, avgLat],
        zoom,
      });
      return;
    }

    if (!highlightCode) return;
    const target = highlighted;
    const latlng = initialCenter ?? target?.latlng;
    if (latlng && latlng[0] !== 0 && latlng[1] !== 0) {
      setPosition({
        coordinates: [latlng[1], latlng[0]],
        zoom: compact ? 4 : 3,
      });
    }
  }, [highlightCode, highlighted, initialCenter, compact, isCompareView, activeHighlights]);

  const handleClick = useCallback(
    (geo: { id?: string | number; properties: { name?: string; ISO_A3?: string; ISO_A2?: string } }) => {
      const country = resolveCountry(geo, byCode, byName);
      if (!country) return;
      if (focusMode && country.cca3 !== highlightCode) return;
      if (isCompareView && !activeHighlights.some((c) => c.cca3 === country.cca3)) return;

      if (onCountryClick) onCountryClick(country.cca3);
      else router.push(`/countries/${country.cca3.toLowerCase()}`);
    },
    [byCode, byName, focusMode, highlightCode, onCountryClick, router]
  );

  const handleMouseEnter = useCallback(
    (
      e: React.MouseEvent,
      geo: { id?: string | number; properties: { name?: string; ISO_A3?: string; ISO_A2?: string } }
    ) => {
      const country = resolveCountry(geo, byCode, byName);
      if (!country) {
        setHovered(null);
        return;
      }

      if (focusMode) {
        if (country.cca3 !== highlightCode) return;
        setHovered(highlighted!);
      } else {
        setHovered(country);
      }
      setTooltipPos({ x: e.clientX, y: e.clientY });
    },
    [byCode, byName, focusMode, highlightCode, highlighted]
  );

  const searchResults = search.length >= 1
    ? countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className={`relative ${compact ? "h-[450px]" : "h-[600px]"} glass rounded-2xl overflow-hidden`}>
      {!compact && (
        <div className="absolute top-4 left-4 z-10 w-64">
          <div className="relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className={search || searchFocusCode ? "pr-9" : undefined}
            />
            {(search || searchFocusCode) && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 glass rounded-xl overflow-hidden">
              {searchResults.map((c) => (
                <button
                  key={c.cca3}
                  onClick={() => flyToCountry(c)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/30 text-sm text-left"
                >
                  <CountryFlag cca2={c.cca2} name={c.name} className="w-6 h-4 rounded" />
                  {c.name}
                </button>
              ))}
            </div>
          )}
          {searchFocused && (
            <div className="mt-2 glass rounded-xl px-3 py-2 flex items-center gap-2">
              <CountryFlag cca2={searchFocused.cca2} name={searchFocused.name} className="w-7 h-4 rounded shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Located on map</p>
                <p className="font-medium text-sm truncate text-foreground">{searchFocused.name}</p>
              </div>
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0"
                aria-label="Clear located country"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {highlighted && compact && !isCompareView && (
        <div className="absolute top-4 left-4 z-10 glass rounded-xl px-4 py-2 flex items-center gap-3">
          <CountryFlag cca2={highlighted.cca2} name={highlighted.name} className="w-8 h-5 rounded" />
          <div>
            <p className="text-xs text-muted-foreground">Viewing</p>
            <p className="font-semibold text-sm">{highlighted.name}</p>
          </div>
        </div>
      )}

      {isCompareView && (
        <div className="absolute top-4 left-4 z-10 glass rounded-xl px-4 py-3 max-w-xs">
          <p className="text-xs text-muted-foreground mb-2">Compared locations</p>
          <div className="space-y-2">
            {activeHighlights.map((country) => (
              <div key={country.cca3} className="flex items-center gap-2 text-sm">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: highlightColors?.[country.cca3] ?? "#6366f1" }}
                />
                <CountryFlag cca2={country.cca2} name={country.name} className="w-6 h-4 rounded" />
                <span className="font-medium truncate">{country.name}</span>
                <span className="text-xs text-muted-foreground ml-auto shrink-0">
                  {country.latlng[0].toFixed(1)}°, {country.latlng[1].toFixed(1)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.5, 8) }))}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.5, 1) }))}
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={({ coordinates, zoom }) =>
            setPosition({ coordinates: coordinates as [number, number], zoom })
          }
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const country = resolveCountry(geo, byCode, byName);
                const highlightSet = new Set(activeHighlights.map((c) => c.cca3));
                const isHighlighted =
                  country &&
                  (highlightSet.has(country.cca3) || country.cca3 === searchFocusCode);
                const interactive = !focusMode || isHighlighted;

                const fill = country
                  ? isHighlighted
                    ? country.cca3 === searchFocusCode
                      ? "#2563eb"
                      : highlightColors?.[country.cca3] ?? "#2563eb"
                    : isCompareView
                      ? getRegionColor(country.region) + "35"
                      : focusMode
                        ? getRegionColor(country.region) + "35"
                        : getRegionColor(country.region) + "80"
                  : "#1e293b";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => interactive && handleClick(geo)}
                    onMouseEnter={(e) => interactive && handleMouseEnter(e, geo)}
                    onMouseMove={(e) => {
                      if (hovered && interactive) {
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: {
                        fill,
                        stroke: "#334155",
                        strokeWidth: 0.3,
                        outline: "none",
                        pointerEvents: interactive ? "auto" : "none",
                      },
                      hover: {
                        fill: interactive ? (country ? "#818cf8" : fill) : fill,
                        stroke: interactive ? "#a855f7" : "#334155",
                        strokeWidth: interactive ? 0.5 : 0.3,
                        outline: "none",
                        cursor: interactive && country ? "pointer" : "default",
                        pointerEvents: interactive ? "auto" : "none",
                      },
                      pressed: { fill: "#6366f1", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 glass rounded-xl p-4 shadow-2xl pointer-events-none w-64 text-foreground"
            style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 80 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <CountryFlag cca2={hovered.cca2} name={hovered.name} className="w-10 h-7 rounded object-cover" />
              <div>
                <p className="font-semibold text-foreground">{hovered.name}</p>
                <p className="text-xs text-muted-foreground">{hovered.capital}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Population</span>
                <p className="font-medium text-foreground">{formatNumber(hovered.population, true)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Area</span>
                <p className="font-medium text-foreground">{formatArea(hovered.area)}</p>
              </div>
            </div>
            {!focusMode && (
              <p className="text-xs text-accent mt-2">Click to view details →</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
