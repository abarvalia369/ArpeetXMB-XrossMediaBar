/** Formats a Date as "9/1 7:07 PM" — fixed M/D h:mm AM/PM structure
 * regardless of locale, using the Date object's local (viewer) timezone. */
export function formatClock(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const mm = String(minutes).padStart(2, "0");

  return `${month}/${day} ${hours}:${mm} ${period}`;
}

/** Just the time portion ("7:07 PM") — used at narrow viewports where the
 * date is hidden to save space. */
export function formatClockTimeOnly(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const mm = String(minutes).padStart(2, "0");
  return `${hours}:${mm} ${period}`;
}

/** Milliseconds until the top of the next minute — schedule the first clock
 * tick at this delay, then re-tick every 60s, instead of polling every
 * second for a display that only changes once a minute. */
export function msUntilNextMinute(date: Date = new Date()): number {
  return (60 - date.getSeconds()) * 1000 - date.getMilliseconds();
}
