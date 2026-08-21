// Types for every content shape in the site. This is the contract: a typo in a
// content/*.ts field fails the build with a clear TypeScript error instead of
// rendering blank or crashing at runtime.

// ---- Icons & panels: components look these up by key, content never imports components ----

export type IconKey =
  | "home"
  | "about"
  | "films"
  | "spotify"
  | "contact"
  | "guestbook"
  | "send"
  | "chat"
  | "disc"
  | "folder"
  | "cube"
  | "bars"
  | "play"
  | "list"
  | "github"
  | "linkedin"
  | "instagram"
  | "spotifyGlyph"
  | "soundcloud";

export type PanelKey =
  | "home"
  | "bio"
  | "experience"
  | "education"
  | "skills"
  | "film"
  | "spotify"
  | "soundcloud"
  | "contactMessage"
  | "guestbookSign"
  | "guestbookEntries";

// ---- Menu structure ----

interface MenuItemCommon {
  id: string;
  label: string;
  iconKey: IconKey;
}

export interface MenuExternalItem extends MenuItemCommon {
  kind: "external";
  url: string;
  /** Short text shown on the placeholder avatar (e.g. "GH", "IG"). */
  avatarText: string;
}

export interface MenuFilmItem extends MenuItemCommon {
  kind: "content";
  panelKey: "film";
  /** Looks up the film's data in content/films.ts by id. */
  filmId: string;
}

export interface MenuSpotifyItem extends MenuItemCommon {
  kind: "content";
  panelKey: "spotify";
  /** Full Spotify embed iframe src (open.spotify.com/embed/...). */
  embedUrl: string;
}

export interface MenuSoundCloudItem extends MenuItemCommon {
  kind: "content";
  panelKey: "soundcloud";
  /** Full SoundCloud embed iframe src (w.soundcloud.com/player/...). */
  embedUrl: string;
}

export interface MenuSimpleContentItem extends MenuItemCommon {
  kind: "content";
  panelKey: Exclude<PanelKey, "film" | "spotify" | "soundcloud">;
}

export type MenuItem = MenuExternalItem | MenuFilmItem | MenuSpotifyItem | MenuSoundCloudItem | MenuSimpleContentItem;

export interface MenuCategory {
  id: string;
  label: string;
  iconKey: IconKey;
  items: MenuItem[];
}

// ---- Site-wide ----

export interface SocialLinks {
  github: string;
  linkedin: string;
  instagram: string;
  spotify: string;
  soundcloud: string;
}

export interface SiteSeo {
  titleTemplate: string;
  ogImage: string;
  favicon: string;
  url: string;
}

export interface SiteContent {
  name: string;
  /** Short one-line description, used for OG/Twitter previews. */
  tagline: string;
  /** Full meta description. */
  description: string;
  email: string;
  social: SocialLinks;
  seo: SiteSeo;
}

// ---- Home ----

export interface HomeContent {
  name: string;
  tagline: string;
  bio: string;
  avatarText: string;
}

// ---- About ----

export interface ExperienceEntry {
  dates: string;
  role: string;
  body: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface AboutContent {
  bioHeading: string;
  bio: string;
  experienceHeading: string;
  experience: ExperienceEntry[];
  educationHeading: string;
  educationSchool: string;
  educationDepartment: string;
  educationDegree: string;
  educationMeta: string;
  skillsHeading: string;
  skillGroups: SkillGroup[];
  resumeButtonLabel: string;
  resumeButtonTitle: string;
}

// ---- Films ----

export interface Film {
  id: string;
  title: string;
  description: string;
  /** YouTube video id (the part after youtu.be/ or /shorts/) — embedded inline, no redirect. */
  youtubeId: string;
}

// ---- Contact ----

export interface ContactFieldLabels {
  name: { label: string };
  email: { label: string };
  message: { label: string };
}

export interface ContactMessages {
  nameRequired: string;
  emailInvalid: string;
  messageRequired: string;
  messageTooLong: (max: number) => string;
  fixFields: string;
  notConnected: string;
  sendFailed: string;
  sendSuccess: string;
}

export interface ContactContent {
  heading: string;
  fields: ContactFieldLabels;
  submitLabel: string;
  submittingLabel: string;
  messages: ContactMessages;
}

// ---- Guestbook ----

export interface GuestbookSignFieldLabels {
  name: { label: string };
  message: { label: string };
  website: { label: string };
  captcha: { label: (a: number, b: number) => string };
}

export interface GuestbookSignMessages {
  honeypot: string;
  rateLimited: (secondsLeft: number) => string;
  fillRequired: string;
  nameTooLong: (max: number) => string;
  messageTooLong: (max: number) => string;
  captchaWrong: string;
  notConnected: string;
  postFailed: string;
  success: string;
}

export interface GuestbookSignContent {
  heading: string;
  fields: GuestbookSignFieldLabels;
  submitLabel: string;
  submittingLabel: string;
  messages: GuestbookSignMessages;
}

export interface GuestbookEntriesContent {
  heading: string;
  loading: string;
  notConnected: string;
  loadFailed: string;
  empty: string;
}

export interface GuestbookContent {
  sign: GuestbookSignContent;
  entries: GuestbookEntriesContent;
}

// ---- Misc (404, external-link panel, film error, aria labels) ----

export interface NotFoundContent {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
}

export interface ExternalLinkPanelContent {
  opensInNewTab: string;
  openLabel: (label: string) => string;
}

export interface MiscContent {
  notFound: NotFoundContent;
  externalLink: ExternalLinkPanelContent;
  mainMenuAriaLabel: string;
  closeCategoryAriaLabel: (categoryLabel: string) => string;
}
