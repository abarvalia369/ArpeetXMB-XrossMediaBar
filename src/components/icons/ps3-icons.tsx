import * as React from "react";

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

/**
 * Wraps a real brand-logo asset as a theme-colorable icon via CSS mask-image.
 * The source PNGs under /public/icons/social are pre-processed (see
 * scripts/notes in the PR that added them) so their RGB is pure white and
 * only the alpha channel carries the shape — that keeps them correct under
 * both `mask-mode: alpha` and the luminance-based fallback some engines use.
 * `background-color: currentColor` means the rendered color always comes
 * from the CSS `color` of an ancestor — never a value baked into this file.
 * `sizePercent` is a per-icon fill-percentage (see the exports below for why
 * each value was chosen) so visually different logo shapes read as the same
 * weight in a row instead of the same raw bounding box.
 */
function maskIcon(src: string, sizePercent: number): Ps3Icon {
  return ({ width = "100%", height = "100%", className }) => (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-block",
        width,
        height,
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: `${sizePercent}%`,
        maskSize: `${sizePercent}%`,
      }}
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

// ---- Real brand-logo icons — sourced from brand_assets/icons, pre-processed
// into theme-colorable masks (see maskIcon() above). Replaces the earlier
// hand-drawn approximations of these five marks.

// The octocat silhouette nearly fills its own square bounding box already
// (it's a dense, organic shape), so a fairly tight fill reads correctly
// next to the others without looking oversized.
export const GitHubIcon = maskIcon("/icons/social/github.png", 88);

// Source is the flat "in" lettermark extracted from the official app-icon
// tile (the blue square field was dropped — see below). The letterforms
// themselves are very bold/thick strokes, so — unlike a typical thin
// letterform — this actually needs to be sized DOWN, not up, to avoid
// reading heavier than the other four.
export const LinkedInIcon = maskIcon("/icons/social/linkedin.png", 78);

// Solid filled discs optically read larger than outlined/linear shapes at
// the same box size, so this is sized down a bit more than the others to
// balance it against GitHub/LinkedIn/SoundCloud in the same row.
export const SpotifyGlyphIcon = maskIcon("/icons/social/spotify.png", 84);

// This is the wide icon+wordmark lockup, not just the cloud glyph (the
// asset provided only came as that combined lockup). Its bounding box is
// ~2.3x wider than tall, so "contain"-style fitting inside a square box
// already shrinks its height well below the others automatically; giving
// it a large fill percentage here keeps its horizontal presence close to
// full width so it doesn't also look small on top of being naturally thin.
export const SoundCloudIcon = maskIcon("/icons/social/soundcloud.png", 96);

// The provided Instagram asset is the official gradient app icon (glyph
// distinguished from its field only by color, not transparency, and the
// field itself has wide internal brightness variation) — auto-extracting a
// clean single-tone glyph from that risks pulling in bits of the gradient
// as false "edges." Kept as a hand-drawn glyph instead, matching Instagram's
// actual camera-outline mark. Re-drawn from the original (which had solid
// `fill="black"` cutouts for the lens hole and corner dot — a hardcoded
// color that would look wrong on a light theme) to use `fill-rule="evenodd"`
// instead, so the holes are real transparency and the whole glyph is one
// `currentColor` fill with no baked-in color at all.
export const InstagramIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <rect x="3.3" y="3.3" width="17.4" height="17.4" rx="4.6" fill="none" stroke="currentColor" strokeWidth="2.3" />
    <circle cx="12" cy="12" r="3.9" fill="none" stroke="currentColor" strokeWidth="2.3" />
    <circle cx="16.4" cy="7.6" r="1.25" />
  </svg>
);

// ---- Info-panel chrome icons ----

export const BellIcon: Ps3Icon = (props) => (
  <svg {...base(props)}>
    <path d="M12 2.25c-.55 0-1 .45-1 1v.62C7.9 4.36 6 6.7 6 9.5v3.6l-1.72 2.58a.9.9 0 0 0 .75 1.4h13.94a.9.9 0 0 0 .75-1.4L18 13.1V9.5c0-2.8-1.9-5.14-5-5.63V3.25c0-.55-.45-1-1-1Z" />
    <path d="M9.6 19.2a2.4 2.4 0 0 0 4.8 0Z" />
  </svg>
);

export const PaletteIcon: Ps3Icon = (props) => {
  // A real <mask> cutout, not an overlapping same-color-as-background paint
  // trick — mask luminance (white=visible/black=hidden) is a definition-time
  // concept, not a rendered pixel color, so this stays correct under any
  // theme without needing currentColor inside the mask itself. useId() keeps
  // the mask reference collision-safe if this icon is ever rendered more
  // than once on the same page.
  const maskId = React.useId();
  return (
    <svg {...base(props)}>
      <mask id={maskId}>
        <rect x="0" y="0" width="24" height="24" fill="white" />
        <circle cx="7.3" cy="10.6" r="1.35" fill="black" />
        <circle cx="9.9" cy="6.9" r="1.35" fill="black" />
        <circle cx="14.5" cy="6.9" r="1.35" fill="black" />
        <circle cx="17" cy="10.6" r="1.35" fill="black" />
      </mask>
      <path
        mask={`url(#${maskId})`}
        d="M12 2.5c-5.25 0-9.5 4.25-9.5 9.5s4.25 9.5 9.5 9.5c.97 0 1.75-.78 1.75-1.75 0-.46-.17-.87-.46-1.19-.28-.31-.45-.72-.45-1.16 0-.97.78-1.75 1.75-1.75h2.05c2.15 0 3.9-1.75 3.9-3.9C20.54 6.4 16.75 2.5 12 2.5Z"
      />
    </svg>
  );
};
