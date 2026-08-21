import type { MiscContent } from "./types";

export const MISC: MiscContent = {
  notFound: {
    eyebrow: "Scene missing",
    title: "404",
    body: "This frame didn't make the final cut — the page you're looking for doesn't exist or moved.",
    cta: "◀ Back to the menu",
  },
  externalLink: {
    opensInNewTab: "This opens in a new tab.",
    openLabel: (label) => `Open ${label} ↗`,
  },
  filmLoadError: "This video couldn't be loaded (placeholder file — add a real .mp4 to /public/videos).",
  mainMenuAriaLabel: "Main menu",
  closeCategoryAriaLabel: (categoryLabel) => `Close ${categoryLabel}`,
};
