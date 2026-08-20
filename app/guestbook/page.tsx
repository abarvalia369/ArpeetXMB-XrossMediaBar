import type { Metadata } from "next";
import { Guestbook } from "@/components/guestbook";

export const metadata: Metadata = { title: "Guestbook" };

export default function GuestbookPage() {
  return (
    <main id="main">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <h1 className="text-3xl font-semibold sm:text-4xl">Sign in.</h1>
        <p className="mt-3 max-w-xl text-base text-white/55">
          Leave a short public note — visible instantly, no moderation queue.
        </p>
        <div className="mt-12">
          <Guestbook />
        </div>
      </div>
    </main>
  );
}
