/** Formats an ISO timestamp relative to `now` as "2h ago", "3d ago", etc.
 * Falls back to a short absolute date once it's more than a week old. */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  const diffMs = now.getTime() - then;
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 45) return "just now";

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return new Date(then).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
