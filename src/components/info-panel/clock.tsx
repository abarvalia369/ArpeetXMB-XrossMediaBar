"use client";

import * as React from "react";
import { formatClockTimeOnly, msUntilNextMinute } from "@/src/lib/format-clock";

/** Live-updating local date/time, e.g. "9/1 7:07 PM" (date hidden on narrow
 * viewports, leaving just the time). Renders a stable empty placeholder
 * server-side and on the client's first paint — the real value is filled in
 * from an effect after mount, so server and client markup match exactly at
 * hydration time and there's no mismatch warning. */
export function Clock() {
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      setNow(new Date());
      intervalId = setInterval(() => setNow(new Date()), 60_000);
    }, msUntilNextMinute());
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  if (!now) {
    return (
      <span className="whitespace-nowrap text-xs text-foreground/80 sm:text-sm" aria-hidden="true">
        &nbsp;
      </span>
    );
  }

  const month = now.getMonth() + 1;
  const day = now.getDate();

  return (
    <span className="whitespace-nowrap text-xs text-foreground/80 sm:text-sm">
      <span className="hidden sm:inline">{month}/{day} </span>
      {formatClockTimeOnly(now)}
    </span>
  );
}
