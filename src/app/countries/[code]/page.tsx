"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  ArrowLeft,
  MapPin,
  Users,
  Globe,
  Clock,
  ExternalLink,
  Banknote,
  Languages,
} from "lucide-react";
import { useCountry, useCountryIndicators, useCountries } from "@/lib/hooks/use-countries";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { toCountrySummary, getCountryDescription } from "@/lib/api/countries";
import { TabBar } from "@/components/features/tab-bar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeaderSkeleton, ChartSkeleton } from "@/components/features/loading";
import { TrendChart, GdpBarChart, CHART_POPULATION, CHART_LIFE } from "@/components/features/charts";
import { CHART_GDP } from "@/lib/chart-colors";
import { WorldMap } from "@/components/features/world-map";
import { CountryFlag } from "@/components/features/country-flag";
import { CountryLocalTime, CountryTimezonesPanel } from "@/components/features/country-local-time";
import {
  formatNumber,
  formatArea,
  getLanguageList,
  getCurrencyList,
  getNativeName,
  getPhoneCode,
} from "@/lib/format";
import { HAPPINESS_RANK } from "@/lib/constants";
import {
  formatFamousPeople,
  formatPopulationRank,
  getFamousPeople,
} from "@/lib/country-insights";
import { toast } from "sonner";

const DETAIL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "geography", label: "Geography" },
  { id: "economy", label: "Economy" },
  { id: "demographics", label: "Demographics" },
  { id: "culture", label: "Culture" },
  { id: "charts", label: "Charts" },
  { id: "map", label: "Map" },
];

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}

export default function CountryDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const upperCode = code.toUpperCase();
  const { data: country, isLoading } = useCountry(upperCode);
  const { data: indicators, isLoading: indicatorsLoading } = useCountryIndicators(upperCode);
  const { data: allCountries = [] } = useCountries();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Country not found</h1>
        <Link href="/countries"><Button>Back to Countries</Button></Link>
      </div>
    );
  }

  const summary = toCountrySummary(country);
  const langs = getLanguageList(country.languages);
  const currencies = getCurrencyList(country.currencies);
  const favorited = isFavorite(summary.cca3);
  const latestGdp = indicators?.gdp[indicators.gdp.length - 1]?.value;
  const latestLifeExp = indicators?.lifeExpectancy[indicators.lifeExpectancy.length - 1]?.value;
  const latestGdpPerCapita = indicators?.gdpPerCapita[indicators.gdpPerCapita.length - 1]?.value;
  const latestPopTrend = indicators?.population;
  const popGrowth =
    latestPopTrend && latestPopTrend.length >= 2
      ? latestPopTrend[latestPopTrend.length - 1].value -
        latestPopTrend[latestPopTrend.length - 2].value
      : null;
  const phoneCode = getPhoneCode(country);
  const tzProps = {
    timezoneIds: country.timezoneIds,
    timezones: country.timezones,
    timezoneZones: country.timezoneZones,
  };
  const borderNames = summary.borders
    .map((b) => allCountries.find((c) => c.cca3 === b)?.name ?? b)
    .join(", ");
  const famousPeople = getFamousPeople(country.cca3);
  const populationRankLabel = formatPopulationRank(country.cca3, allCountries);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/countries" className="hover:text-foreground">Countries</Link>
        <span>/</span>
        <Link href={`/countries?region=${country.region}`} className="hover:text-foreground">{country.region}</Link>
        <span>/</span>
        <span className="text-foreground">{country.name.common}</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start gap-6 mb-8"
      >
        <CountryFlag
          cca2={country.cca2}
          name={country.name.common}
          svg
          className="w-32 h-20 rounded-xl shadow-lg"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl font-bold">{country.name.common}</h1>
              <p className="text-muted-foreground mt-1">{country.name.official}</p>
              <p className="text-sm text-muted-foreground mt-1">Native: {getNativeName(country)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={favorited ? "default" : "secondary"}
                size="sm"
                onClick={() => {
                  const added = toggleFavorite({
                    cca3: summary.cca3,
                    name: summary.name,
                    flag: summary.flag,
                  });
                  toast.success(added ? `Added ${summary.name} to favorites` : `Removed ${summary.name} from favorites`);
                }}
              >
                <Heart className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
              </Button>
              <Link href="/compare">
                <Button variant="secondary" size="sm">Compare</Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="default">{country.region}</Badge>
            {country.subregion && <Badge variant="secondary">{country.subregion}</Badge>}
            {country.unMember && <Badge variant="outline">UN Member</Badge>}
            {country.landlocked && <Badge variant="outline">Landlocked</Badge>}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <InfoItem label="Capital" value={summary.capital} />
        <InfoItem label="Population" value={formatNumber(country.population, true)} />
        <InfoItem label="Area" value={formatArea(country.area)} />
        <InfoItem label="Language" value={langs.join(", ")} />
        <InfoItem label="Currency" value={currencies.map((c) => c.code).join(", ") || "N/A"} />
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Local Time</p>
          <CountryLocalTime {...tzProps} />
        </div>
      </div>

      <TabBar tabs={DETAIL_TABS} value={activeTab} onValueChange={setActiveTab} className="mb-8" />

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="font-semibold text-lg mb-3">About {country.name.common}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getCountryDescription(country)}
              </p>
            </Card>
            <Card>
              <h2 className="font-semibold text-lg mb-3">Quick Facts</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">Population Rank</span>
                  <span className="text-right">{populationRankLabel}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">Local Time</span>
                  <span className="text-right"><CountryLocalTime {...tzProps} /></span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">Continents</span>
                  <span className="text-right">{country.continents?.join(", ") ?? "N/A"}</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">UN Member</span>
                  <span className="text-right">{country.unMember ? "Yes" : "No"}</span>
                </li>
                {famousPeople.length > 0 && (
                  <li className="flex justify-between gap-4">
                    <span className="text-muted-foreground shrink-0">Notable Figures</span>
                    <span className="text-right">{formatFamousPeople(country.cca3)}</span>
                  </li>
                )}
                {HAPPINESS_RANK[country.cca3] && (
                  <li className="flex justify-between gap-4">
                    <span className="text-muted-foreground shrink-0">Happiness Rank</span>
                    <span className="text-right">#{HAPPINESS_RANK[country.cca3]}</span>
                  </li>
                )}
              </ul>
            </Card>
          </div>
          <div className="space-y-4">
            {[
              { label: "Population", value: formatNumber(country.population), icon: Users },
              { label: "GDP", value: latestGdp ? `$${formatNumber(latestGdp, true)}` : "Loading...", icon: Globe },
              { label: "Life Expectancy", value: latestLifeExp ? `${latestLifeExp.toFixed(1)} yrs` : "Loading...", icon: Clock },
              { label: "Density", value: `${Math.round(country.population / country.area)}/km²`, icon: MapPin },
            ].map((stat) => (
              <Card key={stat.label} className="flex items-center gap-4 !p-4">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-bold text-lg">{stat.value}</p>
                </div>
              </Card>
            ))}
            {country.maps && (
              <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full">
                  <ExternalLink className="w-4 h-4" /> View on Google Maps
                </Button>
              </a>
            )}
          </div>
        </div>
      )}

      {activeTab === "geography" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem label="Region" value={country.region} />
            <InfoItem label="Subregion" value={country.subregion ?? "N/A"} />
            <InfoItem label="Area" value={formatArea(country.area)} />
            <InfoItem label="Landlocked" value={country.landlocked ? "Yes" : "No"} />
            <InfoItem label="Borders" value={borderNames || "None (island/none)"} />
            <InfoItem label="Continents" value={country.continents?.join(", ") ?? "N/A"} />
          </div>
          <Card>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="size-4 text-accent" />
              Local Time by Time Zone
            </h3>
            <CountryTimezonesPanel {...tzProps} />
          </Card>
        </div>
      )}

      {activeTab === "economy" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem label="GDP (Latest)" value={latestGdp ? `$${formatNumber(latestGdp, true)}` : "N/A"} />
            <InfoItem label="GDP Per Capita" value={latestGdpPerCapita ? `$${formatNumber(latestGdpPerCapita, true)}` : "N/A"} />
            <InfoItem label="Currency" value={currencies.map((c) => `${c.name} (${c.symbol})`).join(", ") || "N/A"} />
          </div>
          {!indicatorsLoading && indicators && (
            <GdpBarChart data={indicators.gdp} title="GDP Trend (World Bank)" />
          )}
        </div>
      )}

      {activeTab === "demographics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem label="Total Population" value={formatNumber(country.population)} />
            <InfoItem label="Population Density" value={`${Math.round(country.population / country.area)} per km²`} />
            <InfoItem label="Life Expectancy" value={latestLifeExp ? `${latestLifeExp.toFixed(1)} years` : "N/A"} />
            <InfoItem label="Languages Spoken" value={String(langs.length)} />
            <InfoItem label="Annual Population Change" value={popGrowth != null ? `${popGrowth >= 0 ? "+" : ""}${formatNumber(popGrowth)}` : "N/A"} />
            <InfoItem label="Share of World Population" value={`${((country.population / 8100000000) * 100).toFixed(2)}%`} />
          </div>
          {!indicatorsLoading && indicators?.population && indicators.population.length > 1 && (
            <TrendChart data={indicators.population} title="Population Trend (World Bank)" color={CHART_POPULATION} />
          )}
        </div>
      )}

      {activeTab === "culture" && (
        <div className="space-y-6">
          <Card className="!p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Live Local Time</p>
                <CountryLocalTime {...tzProps} large showDate />
              </div>
              {country.culture?.emoji && (
                <span className="text-5xl" aria-hidden>{country.culture.emoji}</span>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem label="Nationality" value={country.culture?.nationality ?? "N/A"} />
            <InfoItem label="Native Name" value={country.culture?.nativeName ?? getNativeName(country)} />
            <InfoItem label="Calling Code" value={phoneCode} />
            <InfoItem label="Population Rank" value={populationRankLabel} />
            <InfoItem
              label="Currency"
              value={currencies.map((c) => `${c.name} (${c.symbol})`).join(", ") || "N/A"}
            />
            <InfoItem label="Capital City" value={summary.capital} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Languages className="size-5 text-accent" />
                <h3 className="font-semibold">Official Languages</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {langs.map((l) => <Badge key={l}>{l}</Badge>)}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Banknote className="size-5 text-accent" />
                <h3 className="font-semibold">Currency in Use</h3>
              </div>
              <div className="space-y-3">
                {currencies.length > 0 ? currencies.map((c) => (
                  <div key={c.code} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-sm text-muted-foreground">{c.code} · {c.symbol}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No currency data available</p>
                )}
              </div>
            </Card>
          </div>

          {famousPeople.length > 0 && (
            <Card>
              <h3 className="font-semibold mb-3">Notable Figures</h3>
              <div className="flex flex-wrap gap-2">
                {famousPeople.map((person) => (
                  <Badge key={person} variant="secondary">{person}</Badge>
                ))}
              </div>
            </Card>
          )}

          {HAPPINESS_RANK[country.cca3] && (
            <InfoItem label="World Happiness Rank" value={`#${HAPPINESS_RANK[country.cca3]} globally`} />
          )}
        </div>
      )}

      {activeTab === "charts" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {indicatorsLoading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : indicators ? (
            <>
              <TrendChart data={indicators.population} title="Population Growth" color={CHART_POPULATION} />
              <GdpBarChart data={indicators.gdp} title="GDP Trend" />
              <TrendChart data={indicators.lifeExpectancy} title="Life Expectancy" color={CHART_LIFE} />
              <TrendChart data={indicators.gdpPerCapita} title="GDP Per Capita" color={CHART_GDP} />
            </>
          ) : (
            <p className="text-muted-foreground">Chart data unavailable</p>
          )}
        </div>
      )}

      {activeTab === "map" && (
        <WorldMap
          countries={allCountries}
          highlightCode={country.cca3}
          initialCenter={country.latlng}
          compact
        />
      )}

      <div className="mt-10">
        <Link href="/countries">
          <Button variant="ghost"><ArrowLeft className="w-4 h-4" /> Back to Countries</Button>
        </Link>
      </div>
    </div>
  );
}
