"use client";

import * as React from "react";
import { getSupabaseClient } from "@/lib/supabase";

interface Entry {
  name: string;
  message: string;
  created_at: string;
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function GuestbookEntriesPanel() {
  const supabase = React.useMemo(() => getSupabaseClient(), []);
  const [entries, setEntries] = React.useState<Entry[] | null>(null);
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!supabase) {
        setLoadError(true);
        return;
      }
      const { data, error } = await supabase
        .from("guestbook_entries")
        .select("name, message, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (cancelled) return;
      if (error) {
        setLoadError(true);
        return;
      }
      setLoadError(false);
      setEntries(data as Entry[]);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return (
    <div>
      <h2 className="text-2xl font-semibold sm:text-3xl">Guestbook entries</h2>
      <ul className="mt-5 list-none">
        {entries === null && !loadError && <p className="py-4 text-sm text-white/40">Loading entries…</p>}
        {loadError && (
          <p className="py-4 text-sm text-white/40">
            {supabase ? "Couldn't load the guestbook right now. Try again later." : "Guestbook is not connected yet (missing Supabase env vars)."}
          </p>
        )}
        {entries && entries.length === 0 && <p className="py-4 text-sm text-white/40">Be the first to sign the guestbook!</p>}
        {entries?.map((entry, i) => (
          <li key={i} className="border-b border-white/10 py-3.5 last:border-none">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold text-white">{entry.name}</span>
              <time className="whitespace-nowrap text-xs text-white/40">{formatTimestamp(entry.created_at)}</time>
            </div>
            <p className="mt-1 break-words text-sm text-white/60">{entry.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
