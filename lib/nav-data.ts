import type { ComponentType } from "react";
import {
  HomeIcon,
  AboutIcon,
  FilmsIcon,
  SpotifyIcon,
  ContactIcon,
  GuestbookIcon,
  SendIcon,
  ChatIcon,
  DiscIcon,
  FolderIcon,
  CubeIcon,
  BarsIcon,
  PlayIcon,
  ListIcon,
  GitHubIcon,
  LinkedInIcon,
  InstagramIcon,
  SpotifyGlyphIcon,
  SoundCloudIcon,
  type Ps3Icon,
} from "@/components/icons/ps3-icons";
import { HomeBioPanel } from "@/components/panels/home-bio";
import { BioPanel, ExperiencePanel, EducationPanel, SkillsPanel } from "@/components/panels/about-panels";
import { makeFilmPanel } from "@/components/panels/film-panel";
import { ContactMessagePanel } from "@/components/panels/contact-message";
import { GuestbookSignPanel } from "@/components/panels/guestbook-sign";
import { GuestbookEntriesPanel } from "@/components/panels/guestbook-entries";
import { FILMS } from "@/lib/videos-data";

export interface ContentItem {
  kind: "content";
  id: string;
  label: string;
  icon: Ps3Icon;
  Panel: ComponentType;
}

export interface ExternalItem {
  kind: "external";
  id: string;
  label: string;
  icon: Ps3Icon;
  url: string;
  /** Short text shown on the placeholder avatar (e.g. "GH", "IG"). */
  avatarText: string;
}

export type Item = ContentItem | ExternalItem;

export interface NavCategory {
  id: string;
  label: string;
  icon: Ps3Icon;
  items: Item[];
}

export const NAV: NavCategory[] = [
  {
    id: "home",
    label: "Home",
    icon: HomeIcon,
    items: [{ kind: "content", id: "profile", label: "Profile", icon: HomeIcon, Panel: HomeBioPanel }],
  },
  {
    id: "about",
    label: "About",
    icon: AboutIcon,
    items: [
      { kind: "content", id: "bio", label: "Bio", icon: DiscIcon, Panel: BioPanel },
      { kind: "content", id: "experience", label: "Experience", icon: FolderIcon, Panel: ExperiencePanel },
      { kind: "content", id: "education", label: "Education", icon: CubeIcon, Panel: EducationPanel },
      { kind: "content", id: "skills", label: "Skills", icon: BarsIcon, Panel: SkillsPanel },
    ],
  },
  {
    id: "films",
    label: "Films",
    icon: FilmsIcon,
    items: FILMS.map((f) => ({
      kind: "content" as const,
      id: f.id,
      label: f.title,
      icon: PlayIcon,
      Panel: makeFilmPanel(f),
    })),
  },
  {
    id: "music",
    label: "Music",
    icon: SpotifyIcon,
    items: [
      {
        kind: "external",
        id: "spotify",
        label: "Spotify",
        icon: SpotifyGlyphIcon,
        url: "https://open.spotify.com/user/6jees54lel992xynfhr544y5s?si=38ebd3de2ba24817",
        avatarText: "SP",
      },
      {
        kind: "external",
        id: "soundcloud",
        label: "SoundCloud",
        icon: SoundCloudIcon,
        url: "https://soundcloud.com/user-546231074",
        avatarText: "SC",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    icon: ContactIcon,
    items: [
      { kind: "content", id: "message", label: "Send a message", icon: SendIcon, Panel: ContactMessagePanel },
      { kind: "external", id: "github", label: "GitHub", icon: GitHubIcon, url: "https://github.com/abarvalia369", avatarText: "GH" },
      {
        kind: "external",
        id: "linkedin",
        label: "LinkedIn",
        icon: LinkedInIcon,
        url: "https://www.linkedin.com/in/arpeet-barvalia/",
        avatarText: "IN",
      },
      {
        kind: "external",
        id: "instagram",
        label: "Instagram",
        icon: InstagramIcon,
        url: "https://www.instagram.com/arpeetbarvalia/",
        avatarText: "IG",
      },
    ],
  },
  {
    id: "guestbook",
    label: "Guestbook",
    icon: GuestbookIcon,
    items: [
      { kind: "content", id: "sign", label: "Sign the guestbook", icon: ChatIcon, Panel: GuestbookSignPanel },
      { kind: "content", id: "entries", label: "View entries", icon: ListIcon, Panel: GuestbookEntriesPanel },
    ],
  },
];
