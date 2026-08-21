export interface IconProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}
export type Ps3Icon = (props: IconProps) => JSX.Element;

const base = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  fill: "currentColor",
  xmlns: "http://www.w3.org/2000/svg",
  ...props,
});

/** Wraps a real icon asset from brand_assets/icons — copied exactly, not redrawn. */
function imageIcon(src: string): Ps3Icon {
  return ({ width = "100%", height = "100%", className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      className={className}
      style={{ width, height, objectFit: "contain", display: "block" }}
    />
  );
}

// ---- Top-level category icons — real assets from brand_assets/icons ----
export const HomeIcon = imageIcon("/icons/home.png");
export const AboutIcon = imageIcon("/icons/about.png");
export const FilmsIcon = imageIcon("/icons/films.png");
export const SpotifyIcon = imageIcon("/icons/spotify.png");
export const ContactIcon = imageIcon("/icons/contact.png");
export const GuestbookIcon = imageIcon("/icons/guestbook.png");

// ---- Hand-authored sub-item badge glyphs (no matching asset provided for these) ----

export const SendIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <path d="M3 11.2 20.5 3.5a.6.6 0 0 1 .8.77l-5.9 16.9a.6.6 0 0 1-1.09.07l-3.4-6.3-6.3-3.4a.6.6 0 0 1 .39-1.34Zm7.9 3.9 2.6 4.83 4.4-12.6-7 7.77Zm5.9-8.3-12.6 4.4 4.83 2.6 7.77-7Z" />
  </svg>
);

export const ChatIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9.4L5 20.5V17H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
    <circle cx="8.4" cy="10.5" r="1.15" fill="black" />
    <circle cx="12" cy="10.5" r="1.15" fill="black" />
    <circle cx="15.6" cy="10.5" r="1.15" fill="black" />
  </svg>
);

export const DiscIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.6" fill="black" />
  </svg>
);

export const FolderIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z" />
  </svg>
);

export const CubeIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <path d="M12 2.5 21 7.5v9L12 21.5 3 16.5v-9L12 2.5Zm0 2.28L5.2 8.5 12 12.22l6.8-3.72L12 4.78Zm-7 5.4v6.1l6 3.3v-6.1l-6-3.3Zm8 9.4 6-3.3v-6.1l-6 3.3v6.1Z" />
  </svg>
);

export const BarsIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <rect x="5" y="10" width="3" height="9" rx="1" />
    <rect x="10.5" y="5" width="3" height="14" rx="1" />
    <rect x="16" y="13" width="3" height="6" rx="1" />
  </svg>
);

export const PlayIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <path d="M7 4.5v15l13-7.5-13-7.5Z" />
  </svg>
);

export const GlobeIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm6.9 8.5h-3.02a14.9 14.9 0 0 0-1.06-5.16A7.53 7.53 0 0 1 18.9 11ZM12 4.53c.82 1.13 1.5 2.98 1.77 5.47H10.2c.28-2.5.95-4.34 1.77-5.47Zm-2.82.31A14.9 14.9 0 0 0 8.12 11H5.1a7.53 7.53 0 0 1 4.08-6.16ZM5.1 13h3.02c.11 1.9.48 3.66 1.06 5.16A7.53 7.53 0 0 1 5.1 13Zm6.9 6.47c-.82-1.13-1.5-2.98-1.77-5.47h3.55c-.28 2.5-.95 4.34-1.77 5.47Zm2.82-.31A14.9 14.9 0 0 0 15.88 13h3.02a7.53 7.53 0 0 1-4.08 6.16Z" />
  </svg>
);

export const ListIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <rect x="4" y="6" width="16" height="2.1" rx="1" />
    <rect x="4" y="11" width="16" height="2.1" rx="1" />
    <rect x="4" y="16" width="16" height="2.1" rx="1" />
  </svg>
);

export const GitHubIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.48.09.65-.21.65-.46v-1.7c-2.64.57-3.2-1.14-3.2-1.14-.43-1.1-1.06-1.39-1.06-1.39-.86-.6.07-.58.07-.58.96.07 1.46.99 1.46.99.85 1.46 2.23 1.04 2.77.8.09-.62.33-1.04.6-1.28-2.11-.24-4.33-1.06-4.33-4.72 0-1.04.37-1.9.98-2.56-.1-.24-.43-1.22.09-2.54 0 0 .8-.26 2.62.98a9.05 9.05 0 0 1 4.78 0c1.82-1.24 2.62-.98 2.62-.98.52 1.32.19 2.3.1 2.54.6.66.98 1.52.98 2.56 0 3.67-2.23 4.48-4.35 4.71.34.3.65.87.65 1.76v2.6c0 .25.17.55.66.46A9.5 9.5 0 0 0 12 2.5Z" />
  </svg>
);

export const LinkedInIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <rect x="6.2" y="9.6" width="2.7" height="8.4" fill="black" />
    <circle cx="7.55" cy="6.4" r="1.55" fill="black" />
    <path
      d="M11.4 9.6h2.6v1.15c.5-.75 1.35-1.35 2.65-1.35 2 0 3.35 1.32 3.35 4.02V18h-2.7v-4.2c0-1.15-.45-1.93-1.5-1.93-.82 0-1.3.55-1.51 1.08-.08.19-.09.46-.09.73V18h-2.7c0-.03.03-7.5 0-8.4Z"
      fill="black"
    />
  </svg>
);

export const InstagramIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" fill="black" />
    <circle cx="12" cy="12" r="2.5" />
    <circle cx="17.15" cy="6.85" r="1.15" fill="black" />
  </svg>
);

export const SpotifyGlyphIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="9.5" />
    <path
      d="M6.9 9.9c3.2-.95 6.9-.75 9.6.85"
      stroke="black"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M7.3 12.85c2.65-.75 5.7-.6 8 .75"
      stroke="black"
      strokeWidth="1.3"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M7.7 15.6c2.2-.55 4.7-.45 6.6.68"
      stroke="black"
      strokeWidth="1.15"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export const SoundCloudIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <rect x="4" y="12.5" width="1.6" height="5.5" rx="0.8" />
    <rect x="6.4" y="10.5" width="1.6" height="7.5" rx="0.8" />
    <rect x="8.8" y="8.8" width="1.6" height="9.2" rx="0.8" />
    <path d="M11.2 18h6.4a3 3 0 0 0 .35-5.98A4.4 4.4 0 0 0 13.6 8.6c-.5 0-.97.09-1.4.25a.6.6 0 0 0-.4.57V17.4a.6.6 0 0 0 .6.6Z" />
  </svg>
);
