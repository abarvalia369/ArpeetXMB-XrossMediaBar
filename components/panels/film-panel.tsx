"use client";

import * as React from "react";
import type { Film } from "@/lib/videos-data";

/** One panel component per film, closed over that film's data. */
export function makeFilmPanel(film: Film): React.ComponentType {
  return function FilmPanel() {
    const [error, setError] = React.useState(false);
    return (
      <div>
        <video
          key={film.id}
          controls
          preload="none"
          playsInline
          poster={film.poster}
          className="w-full rounded-lg bg-black"
          onError={() => setError(true)}
        >
          <source src={film.src} type="video/mp4" />
        </video>
        {error && (
          <p className="mt-3 text-sm text-red-400">
            This video couldn&apos;t be loaded (placeholder file — add a real .mp4 to /public/videos).
          </p>
        )}
        <h2 className="mt-4 text-xl font-semibold">{film.title}</h2>
        <p className="mt-1 text-sm text-white/60">{film.description}</p>
      </div>
    );
  };
}
