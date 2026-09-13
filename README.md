# Arpeet Barvalia — Portfolio

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, styled as a PS3 XMB-style menu
system. Supabase backend for the guestbook and contact form. Deploys to Vercel or Netlify.

## Run locally

```
npm install
cp .env.local.example .env.local
# edit .env.local with your Supabase URL + anon key (or leave the placeholders —
# the site still works, the guestbook/contact form just show a "not connected" message)
npm run dev          # http://localhost:3000
```

## Project structure

The whole site is a single page (`app/page.tsx`) — there's no `/about`, `/work`, etc.
Everything is one category/sub-item menu with a content panel that opens over it.

```
app/
  page.tsx              renders <XmbMenu /> + <InfoPanel />
  not-found.tsx         404 page
  layout.tsx, globals.css
content/                ALL user-facing text/data lives here — see "Editing site
                        content" below. Nothing outside this directory should
                        contain a hardcoded string, image path, or embed URL.
  index.ts              barrel — components import only from "@/content"
  types.ts              the type contract for every content shape
  site.ts               site name, tagline, social links, SEO
  menu.ts               THE single definition of the 6 categories + their items
                        (labels, icons, URLs, embed URLs, film ids — everything
                        that drives the menu)
  home.ts, about.ts, contact.ts, guestbook.ts   page copy
  films.ts              film titles/descriptions/YouTube ids
  profile.ts            info-panel avatar
  notifications.ts      info-panel notification entries
  misc.ts, info-panel.ts   smaller UI strings (404 copy, aria-labels, etc.)
src/
  components/
    xmb/                the menu engine itself (category row, item column,
                         open-state panel, root) — see docs/xmb-spec.md
    panels/              one renderer per content shape (bio, experience,
                         contact form, guestbook, film embed, Spotify/
                         SoundCloud embed, external-link panel, ...)
    info-panel/           the top-right status bar (avatar, notifications,
                          clock, theme-selector stub)
    icons/                every icon component (ps3-icons.tsx)
    ui/                   shared primitives (wavy-background, etc.)
  lib/
    registry.ts           the ONLY place that maps content's iconKey/panelKey
                          strings to real icon/panel components
    xmb-layout.ts          layout constants + the column positioning math
    use-xmb-state.ts, use-xmb-input.ts, url-sync.ts   menu state/input/URL sync
    use-dropdown.ts        shared open/close logic for the info-panel dropdowns
    supabase.ts             Supabase client factory
public/
  images/                 favicon, OG image, avatar placeholder goes here too
  icons/                  top-level category tab icons (PS3-style glyphs)
  icons/social/            processed brand-logo masks (see "Images" below)
tests/
  xmb.spec.ts             Playwright spec — npm test
```

## The XMB menu

`src/components/xmb/xmb-menu.tsx` is the root of the menu engine, composed from
`category-row.tsx` (the horizontal category icons), `item-column.tsx` (the vertical
sub-item list), and `open-panel.tsx` (the survivor icons + content panel shown once you
open an item). The full behavior spec — the BROWSE/OPEN depth model, the column layout
math, animation timing — lives in `docs/xmb-spec.md`.

- **Keyboard:** ←/→ changes category, ↑/↓ moves the selected sub-item, Enter opens the
  content panel, Escape/Backspace closes it.
- **Pointer:** click any category/item; drag horizontally to change category, vertically
  to move the selection.
- **Wheel:** horizontal wheel/trackpad steps between categories; vertical steps the
  sub-item list (or scrolls the open content panel, once one is open).
- **URL sync:** the current category/item/open-state is reflected in the URL
  (`?c=music&i=spotify&o=1`) so it's shareable and back/forward works.
- Respects `prefers-reduced-motion` (springs collapse to instant).

To change the menu's structure (categories, order, items), edit `content/menu.ts` — see
below.

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run:

```sql
create table guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);
create index guestbook_entries_created_at_idx on guestbook_entries (created_at desc);
alter table guestbook_entries enable row level security;
create policy "public read" on guestbook_entries for select using (true);
create policy "public insert" on guestbook_entries for insert with check (true);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 200),
  message text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);
alter table contact_messages enable row level security;
create policy "public insert only" on contact_messages for insert with check (true);
-- deliberately no select policy — contact messages are only readable
-- from the Supabase dashboard (Table Editor), not from the site.
```

3. Settings → API: copy the **Project URL** and the **anon public** key.
4. Local dev: put them in `.env.local` (see above). Never commit that file.

**Known limitation:** rate limiting on the guestbook is client-side only (a 60s
`localStorage` cooldown) plus a honeypot field and a math captcha. This deters casual spam
but not a determined bot — a proper server-side limit would need a Supabase Edge Function,
which is out of scope for this build.

## Environment variables in production

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as project environment
variables on Vercel or Netlify — Next.js inlines `NEXT_PUBLIC_*` vars at build time, no extra
build-step scripting needed (unlike the previous static-HTML version of this site). The anon
key is meant to be exposed client-side; access control lives entirely in the RLS policies
above.

## Editing site content

Everything a visitor reads, sees, or plays comes from one of two places: **text/data**
lives in `content/*.ts`, **images** live in `public/`. You should never need to touch a
component file just to change a word, swap a photo, or update a link.

### Text

Every string on the site is a field in a `content/*.ts` file — open the one for the page
you want to change and edit the value directly:

| To change... | Edit |
|---|---|
| Home bio / tagline | `content/home.ts` |
| About (bio, experience, education, skills) | `content/about.ts` |
| Contact form labels/messages | `content/contact.ts` |
| Guestbook labels/messages | `content/guestbook.ts` |
| Film titles/descriptions | `content/films.ts` |
| Site name, tagline, social links, SEO | `content/site.ts` |
| Category/item labels, order, structure | `content/menu.ts` |
| 404 page copy | `content/misc.ts` |
| Info panel notifications | `content/notifications.ts` |

All of these are plain TypeScript objects/arrays with string fields — no markup, no build
step. Save the file and `next dev` picks it up immediately. `content/types.ts` defines the
shape of each one, so if you typo a field name or leave one out, the build fails with a
clear TypeScript error instead of silently rendering blank.

### Images

- **Category tab icons, brand-logo icons:** `public/icons/` (top-level) and
  `public/icons/social/` (GitHub/LinkedIn/Spotify/SoundCloud — pre-processed into
  theme-colorable masks; see `src/components/icons/ps3-icons.tsx` if you ever need to
  regenerate one from a new source file).
- **Favicon / OG image:** `public/images/favicon.svg`, `public/images/og-image.svg`.
- **Your avatar (info panel, top-right):** no real photo exists yet — it's currently a
  placeholder. Drop your image at `public/images/avatar.jpg` (or `.png`), then update
  `avatarSrc` in `content/profile.ts` to `"/images/avatar.jpg"`.
- **Film poster/thumbnail images:** handled automatically by YouTube's own thumbnail for
  each video — nothing to upload here (see Embeds below).

Any new image just needs to land under `public/` and be referenced by its `/`-prefixed
path (e.g. `/images/whatever.jpg`) from the relevant `content/*.ts` file.

### Embeds

Films, Spotify, and SoundCloud are all inline embeds (iframes) — nothing is self-hosted,
and none of them redirect away from the site.

**Films (YouTube):**
1. Upload the film to YouTube (public or unlisted both work for embedding).
2. Take its id — the part of the URL after `youtu.be/` or `youtube.com/shorts/`
   (e.g. `https://youtu.be/dQw4w9WgXcQ` → `dQw4w9WgXcQ`).
3. Add an entry to `content/films.ts`:
   ```ts
   {
     id: "my-film",
     title: "My Film",
     description: "One or two sentences about it.",
     youtubeId: "dQw4w9WgXcQ",
   }
   ```
   The Films sub-items in the menu are generated from this file automatically — no need
   to touch `content/menu.ts` for a new film.

**Spotify / SoundCloud:** these are edited directly in `content/menu.ts`, under the
`"music"` category's `items` array — each has an `embedUrl` field, which is the exact
iframe `src` from that platform's own embed code:
- **Spotify:** go to the playlist/track/album → `···` → *Share* → *Embed playlist*, copy
  the `src="..."` value out of the generated `<iframe>` code, paste it in as `embedUrl`.
- **SoundCloud:** go to the track/playlist/profile page → *Share* → *Embed*, same thing —
  copy the `src="..."` value into `embedUrl`.
- **Note on SoundCloud specifically:** their public embed widget only supports tracks,
  playlists, and profiles as embeddable resources — a "Likes" page isn't one of them (a
  `/likes` URL just falls back to showing your general profile). If you want a
  likes-style embed, create a public playlist of your favorites and embed that instead.

The panel components that render these (`src/components/panels/spotify-embed-panel.tsx`,
`soundcloud-embed-panel.tsx`, `film-panel.tsx`) control the *size* of the embed, not its
content — `content/menu.ts`/`content/films.ts` control what plays.

## Deploying

Connect the repo on Vercel or Netlify, set the two env vars above, and deploy — this is a
standard Next.js app, so both platforms auto-detect the framework and build command
(`next build`).

## Accessibility & performance notes

- Visible focus rings, labelled form fields, `aria-live` status regions on both the
  contact and guestbook forms.
- `prefers-reduced-motion` disables spring/fade animation throughout, including the XMB
  menu and the ambient wave graphic.
- Films/Spotify/SoundCloud are all iframes that only start loading once their panel is
  actually opened — nothing embeds or downloads on initial page load.

## Screenshots

`screenshot.mjs` (Puppeteer) still works against `next dev` — it just points at whatever
localhost URL you give it:
```
npm run dev &
node screenshot.mjs http://localhost:3000 home
```
