import type { Film } from "./types";

// Add a new film by adding an entry here, dropping the compressed .mp4 in
// /public/videos and a poster frame in /public/images (see README), then
// referencing its id from a "film" item in content/menu.ts.
export const FILMS: Film[] = [
  {
    id: "film-01",
    title: "[FILM TITLE — placeholder]",
    description: "[One or two sentences describing this short film — placeholder copy.]",
    poster: "https://placehold.co/800x450/000000/e5e5e5?text=Poster+01",
    src: "/videos/sample-1.mp4",
    duration: "00:00",
    placeholder: true,
  },
  {
    id: "film-02",
    title: "[FILM TITLE — placeholder]",
    description: "[One or two sentences describing this short film — placeholder copy.]",
    poster: "https://placehold.co/800x450/000000/e5e5e5?text=Poster+02",
    src: "/videos/sample-2.mp4",
    duration: "00:00",
    placeholder: true,
  },
  {
    id: "film-03",
    title: "[FILM TITLE — placeholder]",
    description: "[One or two sentences describing this short film — placeholder copy.]",
    poster: "https://placehold.co/800x450/000000/e5e5e5?text=Poster+03",
    src: "/videos/sample-3.mp4",
    duration: "00:00",
    placeholder: true,
  },
];
