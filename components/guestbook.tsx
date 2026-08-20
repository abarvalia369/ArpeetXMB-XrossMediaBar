"use client";

import * as React from "react";
import { getSupabaseClient } from "@/lib/supabase";

const RATE_LIMIT_MS = 60_000;
const RATE_LIMIT_KEY = "ab-guestbook-last-post";
const NAME_MAX = 60;
const MESSAGE_MAX = 500;

interface Entry {
  name: string;
  message: string;
  created_at: string;
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function secondsUntilAllowed() {
  try {
    const last = Number(localStorage.getItem(RATE_LIMIT_KEY) || 0);
    return Math.max(0, Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 1000));
  } catch {
    return 0;
  }
}

function markPosted() {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
  } catch {
    // localStorage unavailable — rate limit just won't persist across reloads
  }
}

function newChallenge() {
  const a = Math.floor(Math.random() * 8) + 1;
  const b = Math.floor(Math.random() * 8) + 1;
  return { a, b, answer: a + b };
}

export function Guestbook() {
  const supabase = React.useMemo(() => getSupabaseClient(), []);
  const [entries, setEntries] = React.useState<Entry[] | null>(null);
  const [loadError, setLoadError] = React.useState(false);
  const [name, setName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [website, setWebsite] = React.useState(""); // honeypot
  const [captchaValue, setCaptchaValue] = React.useState("");
  // Seeded with a fixed value (not newChallenge()) so server and client render the same
  // markup on hydration; Math.random() only runs after mount, client-side.
  const [challenge, setChallenge] = React.useState({ a: 0, b: 0, answer: 0 });
  React.useEffect(() => {
    setChallenge(newChallenge());
  }, []);
  const [status, setStatus] = React.useState<{ text: string; kind: "error" | "success" | "" }>({ text: "", kind: "" });
  const [submitting, setSubmitting] = React.useState(false);

  const loadEntries = React.useCallback(async () => {
    if (!supabase) {
      setLoadError(true);
      return;
    }
    const { data, error } = await supabase
      .from("guestbook_entries")
      .select("name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      setLoadError(true);
      return;
    }
    setLoadError(false);
    setEntries(data as Entry[]);
  }, [supabase]);

  React.useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ text: "", kind: "" });

    if (website.trim() !== "") {
      setStatus({ text: "Something went wrong. Please try again.", kind: "error" });
      return;
    }
    const wait = secondsUntilAllowed();
    if (wait > 0) {
      setStatus({ text: `You're posting a bit fast — try again in ${wait}s.`, kind: "error" });
      return;
    }
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) {
      setStatus({ text: "Please fill in your name and a message.", kind: "error" });
      return;
    }
    if (trimmedName.length > NAME_MAX) {
      setStatus({ text: `Name must be ${NAME_MAX} characters or fewer.`, kind: "error" });
      return;
    }
    if (trimmedMessage.length > MESSAGE_MAX) {
      setStatus({ text: `Message must be ${MESSAGE_MAX} characters or fewer.`, kind: "error" });
      return;
    }
    if (Number(captchaValue) !== challenge.answer) {
      setStatus({ text: "That's not quite right — check the math question.", kind: "error" });
      return;
    }
    if (!supabase) {
      setStatus({ text: "Guestbook is not connected yet (missing Supabase env vars).", kind: "error" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("guestbook_entries").insert({ name: trimmedName, message: trimmedMessage });
    setSubmitting(false);

    if (error) {
      setStatus({ text: "Couldn't post right now. Please try again.", kind: "error" });
      return;
    }

    markPosted();
    setStatus({ text: "Thanks for signing!", kind: "success" });
    setName("");
    setMessage("");
    setCaptchaValue("");
    setChallenge(newChallenge());
    loadEntries();
  }

  return (
    <div className="grid gap-14 lg:grid-cols-5">
      <form id="form" onSubmit={handleSubmit} className="scroll-mt-[calc(var(--xmb-band-h)+16px)] space-y-4 lg:col-span-2" noValidate>
        <div>
          <label htmlFor="guestbook-name" className="mb-2 block text-xs uppercase tracking-widest text-white/50">
            Name
          </label>
          <input
            id="guestbook-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={NAME_MAX}
            required
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-white/50"
          />
        </div>
        <div>
          <label htmlFor="guestbook-message" className="mb-2 block text-xs uppercase tracking-widest text-white/50">
            Message
          </label>
          <textarea
            id="guestbook-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={MESSAGE_MAX}
            required
            rows={3}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-white/50"
          />
        </div>

        <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor="guestbook-website">Website</label>
          <input id="guestbook-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <div>
          <label htmlFor="guestbook-captcha" className="mb-2 block text-xs uppercase tracking-widest text-white/50">
            What is {challenge.a} + {challenge.b}?
          </label>
          <input
            id="guestbook-captcha"
            inputMode="numeric"
            required
            value={captchaValue}
            onChange={(e) => setCaptchaValue(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-white/50"
          />
        </div>

        <div className="flex items-center gap-4 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {submitting ? "Signing…" : "Sign the guestbook"}
          </button>
        </div>
        <p role="status" aria-live="polite" className={cnStatus(status.kind)}>
          {status.text}
        </p>
      </form>

      <ul id="entries" className="scroll-mt-[calc(var(--xmb-band-h)+16px)] list-none lg:col-span-3">
        {entries === null && !loadError && <p className="py-4 font-mono text-sm text-white/40">Loading entries…</p>}
        {loadError && (
          <p className="py-4 font-mono text-sm text-white/40">
            {supabase ? "Couldn't load the guestbook right now. Try again later." : "Guestbook is not connected yet (missing Supabase env vars)."}
          </p>
        )}
        {entries && entries.length === 0 && <p className="py-4 font-mono text-sm text-white/40">Be the first to sign the guestbook!</p>}
        {entries?.map((entry, i) => (
          <li key={i} className="border-b border-white/10 py-3.5 last:border-none">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold text-white">{entry.name}</span>
              <time className="whitespace-nowrap font-mono text-xs text-white/40">{formatTimestamp(entry.created_at)}</time>
            </div>
            <p className="mt-1 break-words text-sm text-white/60">{entry.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function cnStatus(kind: "error" | "success" | "") {
  const base = "text-sm min-h-[1.2em]";
  if (kind === "error") return `${base} text-red-400`;
  if (kind === "success") return `${base} text-white`;
  return base;
}
