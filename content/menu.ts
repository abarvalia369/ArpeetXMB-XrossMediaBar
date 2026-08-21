import type { MenuCategory } from "./types";
import { SITE } from "./site";
import { FILMS } from "./films";

// THE single definition of menu structure: category order, icons, and each
// category's ordered items. Nothing else may define this — everything else
// (components, url-sync, registry lookups) reads MENU.
export const MENU: MenuCategory[] = [
  {
    id: "home",
    label: "Home",
    iconKey: "home",
    items: [{ kind: "content", id: "profile", label: "Profile", iconKey: "home", panelKey: "home" }],
  },
  {
    id: "about",
    label: "About",
    iconKey: "about",
    items: [
      { kind: "content", id: "bio", label: "Bio", iconKey: "disc", panelKey: "bio" },
      { kind: "content", id: "experience", label: "Experience", iconKey: "folder", panelKey: "experience" },
      { kind: "content", id: "education", label: "Education", iconKey: "cube", panelKey: "education" },
      { kind: "content", id: "skills", label: "Skills", iconKey: "bars", panelKey: "skills" },
    ],
  },
  {
    id: "films",
    label: "Films",
    iconKey: "films",
    items: FILMS.map((f) => ({
      kind: "content" as const,
      id: f.id,
      label: f.title,
      iconKey: "play" as const,
      panelKey: "film" as const,
      filmId: f.id,
    })),
  },
  {
    id: "music",
    label: "Music",
    iconKey: "spotify",
    items: [
      {
        kind: "content",
        id: "spotify",
        label: "Spotify",
        iconKey: "spotifyGlyph",
        panelKey: "spotify",
        embedUrl: "https://open.spotify.com/embed/playlist/5JdrDuWM9PV93wPIkmaaUY?utm_source=generator&theme=0",
      },
      {
        kind: "content",
        id: "soundcloud",
        label: "SoundCloud",
        iconKey: "soundcloud",
        panelKey: "soundcloud",
        embedUrl:
          "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1859727372&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    iconKey: "contact",
    items: [
      { kind: "content", id: "message", label: "Send a message", iconKey: "send", panelKey: "contactMessage" },
      { kind: "external", id: "github", label: "GitHub", iconKey: "github", url: SITE.social.github, avatarText: "GH" },
      { kind: "external", id: "linkedin", label: "LinkedIn", iconKey: "linkedin", url: SITE.social.linkedin, avatarText: "IN" },
      { kind: "external", id: "instagram", label: "Instagram", iconKey: "instagram", url: SITE.social.instagram, avatarText: "IG" },
    ],
  },
  {
    id: "guestbook",
    label: "Guestbook",
    iconKey: "guestbook",
    items: [
      { kind: "content", id: "sign", label: "Sign the guestbook", iconKey: "chat", panelKey: "guestbookSign" },
      { kind: "content", id: "entries", label: "View entries", iconKey: "list", panelKey: "guestbookEntries" },
    ],
  },
];
