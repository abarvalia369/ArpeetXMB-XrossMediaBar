"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FILMS, type Film } from "@/lib/videos-data";

export function FilmGallery() {
  return (
    <React.Suspense fallback={<GridSkeleton />}>
      <FilmGalleryInner />
    </React.Suspense>
  );
}

function GridSkeleton() {
  return <p className="font-mono text-sm text-white/40">Loading films…</p>;
}

function FilmGalleryInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [videoError, setVideoError] = React.useState(false);
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const lastFocused = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const filmParam = searchParams.get("film");
    if (filmParam && FILMS.some((f) => f.id === filmParam)) {
      setOpenId(filmParam);
    }
  }, [searchParams]);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openId) {
      setVideoError(false);
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      if (dialog.open) dialog.close();
      document.body.style.overflow = "";
    }
  }, [openId]);

  function open(film: Film, trigger: HTMLElement) {
    lastFocused.current = trigger;
    setOpenId(film.id);
    router.push(`${pathname}?film=${film.id}`, { scroll: false });
  }

  function close() {
    setOpenId(null);
    router.push(pathname, { scroll: false });
    lastFocused.current?.focus();
  }

  const openFilm = FILMS.find((f) => f.id === openId) ?? null;

  if (FILMS.length === 0) {
    return <p className="col-span-full text-center font-mono text-sm text-white/40">No films uploaded yet — check back soon.</p>;
  }

  return (
    <>
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {FILMS.map((film) => (
          <FilmCard key={film.id} film={film} onOpen={open} />
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="film-modal-title"
        className="bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        {openFilm && (
          <div className="relative w-[min(92vw,900px)]">
            <button
              type="button"
              onClick={close}
              aria-label="Close video"
              className="absolute right-3.5 top-3.5 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white hover:bg-white/20"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            {/* preload="none" + src only attached once the modal is actually open: nothing downloads until the user opens it */}
            <video
              key={openFilm.id}
              controls
              preload="none"
              playsInline
              poster={openFilm.poster}
              className="w-full rounded-lg bg-black"
              onError={() => setVideoError(true)}
            >
              <source src={openFilm.src} type="video/mp4" />
            </video>
            {videoError && (
              <p className="mt-3 font-mono text-sm text-red-400">
                This video couldn&apos;t be loaded (placeholder file — add a real .mp4 to /public/videos).
              </p>
            )}
            <div className="mt-4 text-white">
              <h3 id="film-modal-title" className="text-xl font-semibold">
                {openFilm.title}
              </h3>
              <p className="mt-1 text-sm opacity-70">{openFilm.description}</p>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function FilmCard({ film, onOpen }: { film: Film; onOpen: (film: Film, trigger: HTMLElement) => void }) {
  return (
    <article className="group">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={`Play ${film.title}`}
        onClick={(e) => onOpen(film, e.currentTarget)}
        className="relative block w-full overflow-hidden rounded-[10px] border border-white/12 bg-white/[0.03] py-2.5"
      >
        <span
          aria-hidden="true"
          className="mx-2.5 block h-2.5 rounded-sm opacity-70"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, #000 0 6px, transparent 6px 14px)" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={film.poster}
          alt=""
          loading="lazy"
          className="mt-2 aspect-video w-full object-cover saturate-[0.92] transition-transform duration-500 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
        />
        <span
          aria-hidden="true"
          className="mx-2.5 mt-2 block h-2.5 rounded-sm opacity-70"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, #000 0 6px, transparent 6px 14px)" }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-y-8 inset-x-0 m-auto flex h-14 w-14 scale-90 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="absolute bottom-[18px] right-[18px] rounded bg-black/75 px-[7px] py-[2px] font-mono text-[0.72rem] tracking-wide text-white">
          {film.duration}
        </span>
      </button>
      <div className="pt-3.5">
        <h3 className="text-[1.05rem] font-semibold text-white">{film.title}</h3>
        <p className="mt-1 text-sm text-white/50">{film.description}</p>
      </div>
    </article>
  );
}
