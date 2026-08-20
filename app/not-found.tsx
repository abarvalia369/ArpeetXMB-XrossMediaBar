import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Scene missing</p>
      <h1 className="mt-2 text-7xl font-semibold sm:text-8xl">404</h1>
      <p className="mx-auto mt-4 max-w-md text-white/55">
        This frame didn&apos;t make the final cut — the page you&apos;re looking for doesn&apos;t
        exist or moved.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90"
      >
        &#9664; Back to the menu
      </Link>
    </main>
  );
}
