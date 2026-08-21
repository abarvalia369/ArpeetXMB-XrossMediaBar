import { FILMS } from "@/content";

/** Generic film panel — looks up its film's data by id, so it can be registered
 * once in the panel registry instead of one component per film. Embeds the
 * YouTube video inline (youtube-nocookie.com) so playback never leaves the site. */
export function FilmPanel({ filmId }: { filmId: string }) {
  const film = FILMS.find((f) => f.id === filmId);
  if (!film) return null;
  return (
    <div>
      {/* Capped to 65vh (not just 100% width) so the 16:9 box never grows taller than
          the viewport has room for once centered — width shrinks to match instead. */}
      <div
        className="mx-auto aspect-video overflow-hidden rounded-lg bg-black"
        style={{ width: "min(100%, calc(65vh * 16 / 9))" }}
      >
        <iframe
          key={film.id}
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}`}
          title={film.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <h2 className="mt-4 text-xl font-semibold">{film.title}</h2>
      <p className="mt-1 text-sm text-white/60">{film.description}</p>
    </div>
  );
}
