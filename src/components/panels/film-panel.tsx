"use client";

import * as React from "react";
import { FILMS, MISC } from "@/content";

/** Generic film panel — looks up its film's data by id, so it can be registered
 * once in the panel registry instead of one component per film. */
export function FilmPanel({ filmId }: { filmId: string }) {
  const [error, setError] = React.useState(false);
  const film = FILMS.find((f) => f.id === filmId);
  if (!film) return null;
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
      {error && <p className="mt-3 text-sm text-red-400">{MISC.filmLoadError}</p>}
      <h2 className="mt-4 text-xl font-semibold">{film.title}</h2>
      <p className="mt-1 text-sm text-white/60">{film.description}</p>
    </div>
  );
}
