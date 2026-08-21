import type { Film } from "./types";

// Add a new film by adding an entry here (youtubeId is the part after
// youtu.be/ or /shorts/), then referencing its id from a "film" item in
// content/menu.ts.
export const FILMS: Film[] = [
  {
    id: "film-01",
    title: "SPAINDIA",
    description: "[One or two sentences describing this short film — placeholder copy.]",
    youtubeId: "i1W16Rf3bZI",
  },
  {
    id: "film-02",
    title: "Irish Spring GREEEEEN",
    description: "[One or two sentences describing this short film — placeholder copy.]",
    youtubeId: "sMIec1Gq5R0",
  },
  {
    id: "film-03",
    title: "Swetty Weddy",
    description: "[One or two sentences describing this short film — placeholder copy.]",
    youtubeId: "Oko53EBJz4s",
  },
];
