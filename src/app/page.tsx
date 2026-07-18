"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe2,
  BarChart3,
  Map,
  GitCompare,
  Sparkles,
  Clock,
  ArrowRight,
  Users,
  MapPin,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { CountryCard } from "@/components/features/country-card";
import { AnimatedCounter } from "@/components/features/animated-counter";
import { CountryFlag } from "@/components/features/country-flag";
import { RegionIconBadge } from "@/components/features/region-icon";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountryCardSkeleton } from "@/components/features/loading";
import { FaqAccordion } from "@/components/features/faq-accordion";
import { useCountries } from "@/lib/hooks/use-countries";
import { FAQ_ITEMS, DID_YOU_KNOW, REGIONS } from "@/lib/constants";
import { getCountryOfDayIndex, formatNumber } from "@/lib/format";

const FEATURES = [
  { icon: Globe2, title: "Country Profiles", desc: "250 nations with capitals, languages, currencies, and live population", href: "/countries" },
  { icon: BarChart3, title: "Statistics & Data", desc: "Population trends, regional breakdowns, and World Bank indicators", href: "/statistics" },
  { icon: Map, title: "Interactive Map", desc: "Click any country on the world map for instant profile access", href: "/map" },
  { icon: GitCompare, title: "Compare Countries", desc: "Side-by-side metrics for up to three nations at once", href: "/compare" },
  { icon: Clock, title: "World Time", desc: "Live local times for every nation with UTC reference and regional filters", href: "/time" },
  { icon: Sparkles, title: "Country Assistant", desc: "Structured answers about any nation — no markdown, just clean data", href: "/assistant" },
];

const SECTION = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20";

export default function HomePage() {
  const { data: countries = [], isLoading } = useCountries();

  const featured = countries.filter((c) =>
    ["CHE", "JPN", "FRA", "BRA", "AUS", "ZAF", "IND", "CAN"].includes(c.cca3)
  );
  const trending = [...countries].sort((a, b) => b.population - a.population).slice(0, 6);
  const topRanked = [...countries].sort((a, b) => b.population - a.population).slice(0, 4);
  const didYouKnow = DID_YOU_KNOW[getCountryOfDayIndex(DID_YOU_KNOW.length)];

  return (
    <>
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="default" className="mb-5 sm:mb-6">Live Data · 250 Countries</Badge>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6 px-2">
              Explore. Learn.{" "}
              <span className="gradient-text">Understand Our World.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-3 max-w-2xl mx-auto leading-relaxed px-2">
              Country Explorer brings together geographic profiles, live population data, interactive maps, and side-by-side comparisons in one polished platform.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground/90 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed px-2">
              Browse 250 countries with rankings, statistics, and the Country Assistant to go deeper than a simple search.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 px-2">
              <Link href="/countries" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse All Countries
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/map" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Explore World Map
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-5 text-sm max-w-lg sm:max-w-none mx-auto">
              {[
                { label: "Countries", value: countries.length || 250 },
                { label: "Regions", value: 6 },
                { label: "People", value: 8.1, suffix: "B+", compact: true },
                { label: "Live Updates", value: 24, suffix: "h" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl px-4 sm:px-5 py-3 min-w-0">
                  <p className="text-xl sm:text-2xl font-bold gradient-text">
                    {typeof stat.value === "number" && stat.compact ? (
                      <>{stat.value}{stat.suffix}</>
                    ) : (
                      <AnimatedCounter value={stat.value as number} suffix={stat.suffix ?? ""} />
                    )}
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className={SECTION}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Featured Countries</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Hand-picked destinations from around the globe</p>
          </div>
          <Link href="/countries" className="shrink-0">
            <Button variant="ghost" className="w-full sm:w-auto">View All <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <CountryCardSkeleton key={i} />)
            : featured.map((c, i) => <CountryCard key={c.cca3} country={c} index={i} />)}
        </div>
      </section>

      <section className={`${SECTION} border-t border-border/50`}>
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">Everything You Need To Know</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">A comprehensive platform for exploring our world with live data</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={f.href}>
                <Card className="h-full card-hover">
                  <div className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={`${SECTION} border-t border-border/50`}>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">World Regions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {REGIONS.filter((r) => r !== "Antarctic").map((region) => {
            const count = countries.filter((c) => c.region === region).length;
            return (
              <Link key={region} href={`/countries?region=${region}`}>
                <Card className="text-center !p-3 sm:!p-5 card-hover h-full">
                  <RegionIconBadge region={region} />
                  <p className="font-semibold text-xs sm:text-sm text-foreground">{region}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{count} countries</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={`${SECTION} border-t border-border/50`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 min-w-0">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-5 sm:mb-6">Trending Countries</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trending.map((c, i) => <CountryCard key={c.cca3} country={c} index={i} />)}
            </div>
          </div>
          <div className="space-y-4 sm:space-y-5 min-w-0">
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-accent shrink-0" />
                <h3 className="font-semibold">Did You Know?</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{didYouKnow}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-accent shrink-0" />
                <h3 className="font-semibold">Global Population</h3>
              </div>
              <p className="text-2xl sm:text-3xl font-bold gradient-text">
                <AnimatedCounter value={8100000000} compact />
              </p>
              <p className="text-xs text-muted-foreground mt-1">Estimated world population</p>
            </Card>
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <h3 className="font-semibold">Quick Links</h3>
              </div>
              <div className="space-y-2">
                {[
                  { href: "/map", label: "Interactive World Map" },
                  { href: "/compare", label: "Compare Countries" },
                  { href: "/quiz", label: "Country Quiz" },
                  { href: "/rankings", label: "Country Rankings" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm text-accent hover:underline">
                    {link.label}
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className={`${SECTION} border-t border-border/50`}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">Population Rankings</h2>
            <p className="text-muted-foreground text-sm sm:text-base">The world&apos;s most populous nations by live data</p>
          </div>
          <Link href="/rankings" className="shrink-0">
            <Button variant="ghost" className="w-full sm:w-auto">View Rankings <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <CountryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {topRanked.map((country, i) => (
              <Link key={country.cca3} href={`/countries/${country.cca3.toLowerCase()}`}>
                <Card className="card-hover !p-4 sm:!p-5 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-bold text-accent w-6 shrink-0">#{i + 1}</span>
                    <CountryFlag cca2={country.cca2} name={country.name} className="w-10 h-7 rounded shrink-0" />
                    <p className="font-semibold text-foreground truncate min-w-0">{country.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatNumber(country.population)} people</p>
                  <p className="text-xs text-muted-foreground mt-1">{country.region}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 border-t border-border/50">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Frequently Asked Questions</h2>
        <FaqAccordion items={FAQ_ITEMS} />
      </section>
    </>
  );
}
