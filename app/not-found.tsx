import Link from "next/link";
import { MISC } from "@/content";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">{MISC.notFound.eyebrow}</p>
      <h1 className="mt-2 text-7xl font-semibold sm:text-8xl">{MISC.notFound.title}</h1>
      <p className="mx-auto mt-4 max-w-md text-white/55">{MISC.notFound.body}</p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
      >
        {MISC.notFound.cta}
      </Link>
    </main>
  );
}
