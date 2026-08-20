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
  GlobeIcon,
  ListIcon,
  type Ps3Icon,
} from "@/components/icons/ps3-icons";
import { FILMS } from "@/lib/videos-data";

export interface SubItem {
  id: string;
  label: string;
  href: string;
  icon: Ps3Icon;
  /** True when the link leaves the app (opens in a new tab). */
  external?: boolean;
}

export interface NavCategory {
  id: string;
  label: string;
  icon: Ps3Icon;
  href: string;
  subItems: SubItem[];
}

export const NAV: NavCategory[] = [
  {
    id: "home",
    label: "Home",
    icon: HomeIcon,
    href: "/",
    subItems: [],
  },
  {
    id: "about",
    label: "About",
    icon: AboutIcon,
    href: "/about",
    subItems: [
      { id: "bio", label: "Bio", href: "/about#bio", icon: DiscIcon },
      { id: "experience", label: "Experience", href: "/about#experience", icon: FolderIcon },
      { id: "education", label: "Education", href: "/about#education", icon: CubeIcon },
      { id: "skills", label: "Skills", href: "/about#skills", icon: BarsIcon },
    ],
  },
  {
    id: "films",
    label: "Films",
    icon: FilmsIcon,
    href: "/work",
    subItems: FILMS.map((f) => ({
      id: f.id,
      label: f.title,
      href: `/work?film=${f.id}`,
      icon: PlayIcon,
    })),
  },
  {
    id: "spotify",
    label: "Spotify",
    icon: SpotifyIcon,
    href: "/",
    subItems: [
      {
        id: "open",
        label: "Open Spotify profile",
        // PLACEHOLDER — replace with your real Spotify profile/playlist URL.
        href: "https://open.spotify.com",
        icon: PlayIcon,
        external: true,
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    icon: ContactIcon,
    href: "/contact",
    subItems: [
      { id: "message", label: "Send a message", href: "/contact#form", icon: SendIcon },
      { id: "github", label: "GitHub", href: "https://github.com/abarvalia369", icon: GlobeIcon, external: true },
      { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/arpeet-barvalia/", icon: GlobeIcon, external: true },
      { id: "instagram", label: "Instagram", href: "https://www.instagram.com/arpeetbarvalia/", icon: GlobeIcon, external: true },
    ],
  },
  {
    id: "guestbook",
    label: "Guestbook",
    icon: GuestbookIcon,
    href: "/guestbook",
    subItems: [
      { id: "sign", label: "Sign the guestbook", href: "/guestbook#form", icon: ChatIcon },
      { id: "entries", label: "View entries", href: "/guestbook#entries", icon: ListIcon },
    ],
  },
];
