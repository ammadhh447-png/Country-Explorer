"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountryFlag } from "@/components/features/country-flag";
import { CountryLocalTime } from "@/components/features/country-local-time";
import { useLiveTime } from "@/lib/hooks/use-live-time";
import { formatUtcOffsetLabel, getUtcLiveTime } from "@/lib/time";
import type { CountrySummary } from "@/types/country";

export function UtcClock() {
  const now = useLiveTime();
  const utc = getUtcLiveTime(now);

  return (
    <Card className="!p-5 sm:!p-6 border-accent/15 bg-accent/[0.04] h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
          <Globe className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Reference</p>
          <p className="font-semibold text-foreground">Coordinated Universal Time (UTC)</p>
        </div>
      </div>
      <p className="font-serif text-3xl sm:text-4xl font-bold tabular-nums text-foreground">{utc.time}</p>
      <p className="text-sm text-muted-foreground mt-1">{utc.date}</p>
    </Card>
  );
}

export function FeaturedCapitalTile({ country }: { country: CountrySummary }) {
  return (
    <Link
      href={`/countries/${country.cca3.toLowerCase()}`}
      className="rounded-xl border border-border/60 bg-muted/20 px-3 py-3 hover:border-accent/30 transition-colors min-w-0 block"
    >
      <div className="flex items-center gap-2 mb-2 min-w-0">
        <CountryFlag cca2={country.cca2} name={country.name} className="w-6 h-4 rounded shrink-0" />
        <p className="text-xs font-medium truncate">{country.capital}</p>
      </div>
      <CountryLocalTime
        timezoneIds={country.timezoneIds}
        timezones={country.timezones}
        timezoneZones={country.timezoneZones}
        showDate={false}
      />
    </Link>
  );
}

export function CountryTimeCard({ country }: { country: CountrySummary }) {
  const offset = country.timezones[0] ? formatUtcOffsetLabel(country.timezones[0]) : "";

  return (
    <Link href={`/countries/${country.cca3.toLowerCase()}`} className="block h-full min-w-0 group">
      <Card className="h-full card-hover !p-4 sm:!p-5 flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <CountryFlag cca2={country.cca2} name={country.name} className="w-11 h-8 rounded shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate group-hover:text-accent transition-colors">
              {country.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{country.capital || "Capital N/A"}</p>
          </div>
          {offset && (
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              {offset}
            </Badge>
          )}
        </div>
        <div className="mt-auto pt-3 border-t border-border/50">
          <CountryLocalTime
            timezoneIds={country.timezoneIds}
            timezones={country.timezones}
            timezoneZones={country.timezoneZones}
            large
            showDate
          />
        </div>
      </Card>
    </Link>
  );
}
