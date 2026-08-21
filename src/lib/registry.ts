import type { ComponentType } from "react";
import type { IconKey, PanelKey } from "@/content";
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
} from "@/src/components/icons/ps3-icons";
import { HomeBioPanel } from "@/src/components/panels/home-bio";
import { BioPanel, ExperiencePanel, EducationPanel, SkillsPanel } from "@/src/components/panels/about-panels";
import { ContactMessagePanel } from "@/src/components/panels/contact-message";
import { GuestbookSignPanel } from "@/src/components/panels/guestbook-sign";
import { GuestbookEntriesPanel } from "@/src/components/panels/guestbook-entries";

// The ONLY place that maps content's iconKey/panelKey strings to real components.
// content/ never imports from here — this is the boundary between data and code.

export const ICONS: Record<IconKey, Ps3Icon> = {
  home: HomeIcon,
  about: AboutIcon,
  films: FilmsIcon,
  spotify: SpotifyIcon,
  contact: ContactIcon,
  guestbook: GuestbookIcon,
  send: SendIcon,
  chat: ChatIcon,
  disc: DiscIcon,
  folder: FolderIcon,
  cube: CubeIcon,
  bars: BarsIcon,
  play: PlayIcon,
  list: ListIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  spotifyGlyph: SpotifyGlyphIcon,
  soundcloud: SoundCloudIcon,
};

/** Panels that take no extra props. The "film" panelKey is handled separately in
 * PanelBody — it needs a filmId, so it isn't a no-arg ComponentType. */
export const PANELS: Record<Exclude<PanelKey, "film">, ComponentType> = {
  home: HomeBioPanel,
  bio: BioPanel,
  experience: ExperiencePanel,
  education: EducationPanel,
  skills: SkillsPanel,
  contactMessage: ContactMessagePanel,
  guestbookSign: GuestbookSignPanel,
  guestbookEntries: GuestbookEntriesPanel,
};
