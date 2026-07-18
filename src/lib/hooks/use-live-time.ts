"use client";

import { useEffect, useState } from "react";

/** Returns the current time, refreshed every second for live clocks. */
export function useLiveTime(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
