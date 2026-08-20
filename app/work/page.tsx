import type { Metadata } from "next";
import { FilmGallery } from "@/components/film-gallery";

export const metadata: Metadata = { title: "Films" };

export default function WorkPage() {
  return (
    <main id="main">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <h1 className="text-3xl font-semibold sm:text-4xl">Short films.</h1>
        <p className="mt-3 max-w-xl text-base text-white/55">
          Click a frame to play. Nothing loads until you do — these are self-hosted, full-size files.
        </p>
        <div className="mt-12">
          <FilmGallery />
        </div>
      </div>
    </main>
  );
}
