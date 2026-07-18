import type { CountrySummary, CountryTimezoneZone } from "@/types/country";

export interface LiveTimeDisplay {
  time: string;
  date: string;
}

const TIME_OPTS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
};

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
};

const UTC_DATE_OPTS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
};

function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function getLiveTimeInZone(timeZone: string, now = new Date()): LiveTimeDisplay {
  if (!isValidTimeZone(timeZone)) {
    return { time: "N/A", date: "" };
  }

  return {
    time: new Intl.DateTimeFormat("en-US", { ...TIME_OPTS, timeZone }).format(now),
    date: new Intl.DateTimeFormat("en-US", { ...DATE_OPTS, timeZone }).format(now),
  };
}

export function getLiveTimeFromOffset(offset: string, now = new Date()): LiveTimeDisplay {
  const cleaned = offset.replace(/\s/g, "");
  const match = cleaned.match(/UTC([+-])(\d{1,2}):(\d{2})/);
  if (!match) return { time: "N/A", date: "" };

  const sign = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  const totalMinutes = sign * (hours * 60 + minutes);

  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const fixed = new Date(utcMs + totalMinutes * 60_000);

  return {
    time: fixed.toLocaleTimeString("en-US", { ...TIME_OPTS, timeZone: "UTC" }),
    date: fixed.toLocaleDateString("en-US", { ...DATE_OPTS, timeZone: "UTC" }),
  };
}

export function getUtcLiveTime(now = new Date()): LiveTimeDisplay {
  return {
    time: new Intl.DateTimeFormat("en-US", { ...TIME_OPTS, timeZone: "UTC" }).format(now),
    date: new Intl.DateTimeFormat("en-US", { ...UTC_DATE_OPTS, timeZone: "UTC" }).format(now),
  };
}

export function resolvePrimaryZone(
  timezoneZones?: CountryTimezoneZone[],
  timezoneIds?: string[],
  timezones?: string[]
): { zoneId: string; offset: string; label: string } {
  if (timezoneZones?.length) {
    const withId = timezoneZones.find((z) => z.id && isValidTimeZone(z.id));
    const zone = withId ?? timezoneZones[0];
    return {
      zoneId: zone.id,
      offset: zone.offset,
      label: zone.label || zone.id.replace(/_/g, " "),
    };
  }

  const zoneId = timezoneIds?.find((id) => id && isValidTimeZone(id)) ?? "";
  return {
    zoneId,
    offset: timezones?.[0] ?? "",
    label: zoneId ? zoneId.replace(/_/g, " ") : "",
  };
}

export function getCountryLiveTime(
  country: Pick<CountrySummary, "timezoneIds" | "timezones" | "timezoneZones">,
  now = new Date()
): (LiveTimeDisplay & { label: string }) | null {
  const primary = resolvePrimaryZone(country.timezoneZones, country.timezoneIds, country.timezones);

  if (primary.zoneId) {
    const live = getLiveTimeInZone(primary.zoneId, now);
    if (live.time !== "N/A") {
      return { ...live, label: primary.label || primary.zoneId.replace(/_/g, " ") };
    }
  }

  if (primary.offset) {
    const live = getLiveTimeFromOffset(primary.offset, now);
    if (live.time !== "N/A") {
      return { ...live, label: primary.label || primary.offset.replace("UTC", "UTC ") };
    }
  }

  return null;
}

export function formatUtcOffsetLabel(offset: string): string {
  return offset.replace("UTC", "UTC ");
}
