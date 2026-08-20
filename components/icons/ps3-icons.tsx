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
