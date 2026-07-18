"use client";

import { useLiveTime } from "@/lib/hooks/use-live-time";
import {
  getCountryLiveTime,
  getLiveTimeFromOffset,
  getLiveTimeInZone,
  resolvePrimaryZone,
} from "@/lib/time";
import type { CountryTimezoneZone } from "@/types/country";

interface CountryLocalTimeProps {
  timezoneIds?: string[];
  timezones?: string[];
  timezoneZones?: CountryTimezoneZone[];
  className?: string;
  showDate?: boolean;
  large?: boolean;
}

export function CountryLocalTime({
  timezoneIds = [],
  timezones = [],
  timezoneZones,
  className,
  showDate = true,
  large = false,
}: CountryLocalTimeProps) {
  const now = useLiveTime();
  const display = getCountryLiveTime({ timezoneIds, timezones, timezoneZones }, now);

  if (!display) {
    return <span className={className}>Unavailable</span>;
  }

  return (
    <div className={className}>
      <p className={`font-semibold tabular-nums ${large ? "text-3xl sm:text-4xl" : "text-sm"}`}>
        {display.time}
      </p>
      {showDate && (
        <p className={`text-muted-foreground mt-0.5 ${large ? "text-sm" : "text-[11px]"}`}>
          {display.date}
          {display.label ? ` · ${display.label}` : ""}
        </p>
      )}
    </div>
  );
}

interface CountryTimezonesPanelProps {
  timezoneIds?: string[];
  timezones?: string[];
  timezoneZones?: CountryTimezoneZone[];
}

export function CountryTimezonesPanel({
  timezoneIds = [],
  timezones = [],
  timezoneZones,
}: CountryTimezonesPanelProps) {
  const zones: CountryTimezoneZone[] =
    timezoneZones?.length
      ? timezoneZones
      : timezoneIds.length > 0
        ? timezoneIds.map((id, i) => ({
            id,
            offset: timezones[i] ?? "",
            label: id.replace(/_/g, " "),
          }))
        : timezones.map((offset) => ({
            id: "",
            offset,
            label: offset.replace("UTC", "UTC "),
          }));

  const unique = zones.filter(
    (z, i, arr) => arr.findIndex((x) => x.id === z.id && x.offset === z.offset) === i
  );

  if (unique.length === 0) {
    return <p className="text-sm text-muted-foreground">Timezone data unavailable</p>;
  }

  return (
    <div className="space-y-3">
      {unique.slice(0, 6).map((zone) => (
        <TimezoneRow key={`${zone.id}-${zone.offset}`} zone={zone} />
      ))}
      {unique.length > 6 && (
        <p className="text-xs text-muted-foreground">+{unique.length - 6} more time zones</p>
      )}
    </div>
  );
}

function TimezoneRow({ zone }: { zone: CountryTimezoneZone }) {
  const now = useLiveTime();
  const live = zone.id
    ? getLiveTimeInZone(zone.id, now)
    : zone.offset
      ? getLiveTimeFromOffset(zone.offset, now)
      : null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <div className="min-w-0 pr-3">
        <p className="text-sm font-medium truncate">
          {zone.label || zone.id.replace(/_/g, " ") || zone.offset.replace("UTC", "UTC ")}
        </p>
        {zone.offset && zone.id && (
          <p className="text-xs text-muted-foreground">{zone.offset.replace("UTC", "UTC ")}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold tabular-nums">{live?.time ?? "—"}</p>
        <p className="text-[11px] text-muted-foreground">{live?.date ?? ""}</p>
      </div>
    </div>
  );
}
