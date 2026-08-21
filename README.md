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

```
app/
  page.tsx            home — full-screen XMB hub
  about/page.tsx       Bio, Experience, Education, Skills
  work/page.tsx         film grid (renders <FilmGallery />)
  contact/page.tsx      contact form + direct contact card
  guestbook/page.tsx    guestbook form + entries
  not-found.tsx          404 page
  layout.tsx, globals.css
components/
  ui/xmb-menu.tsx       the PS3 XMB-style navigation menu (measured, spring-driven)
  wave-ribbon.tsx        the ambient silver wave graphic behind the menu
  film-gallery.tsx        film grid + lazy click-to-play modal
  guestbook.tsx            guestbook load/submit (honeypot + math captcha + rate limit)
  contact-form.tsx          contact form validation + submit
lib/
  nav-data.ts             top-level categories + sub-items shown in the XMB menu
  videos-data.ts            the list of films — edit this to add one
  supabase.ts                Supabase client factory (reads NEXT_PUBLIC_* env vars)
  utils.ts                    shadcn's cn() helper
public/
  videos/                   your self-hosted .mp4 files
  images/                    favicon, OG image, poster frames
  robots.txt, sitemap.xml
```

## The XMB menu

`components/ui/xmb-menu.tsx` renders the top-level icon row and each category's sub-item
list. It measures its own container with a `ResizeObserver` and derives every size (icon
size, spacing, row height, font sizes) as a ratio of that measured box, so it looks right
whether it's the full-screen hub on `/` (`variant="full"`) or the slim sticky bar on inner
pages (`variant="compact"`). Two `framer-motion` `useMotionValue`s drive the horizontal
icon-track position and the vertical sub-item-list position, each animated with a spring.

- **Keyboard:** arrow keys move focus (left/right across icons, up/down across sub-items),
  Enter/Space activates, Escape backs out of a sub-item list to the icon row.
- **Pointer:** click any icon or sub-item; drag the icon row horizontally to scrub, with
  velocity-aware snapping on release.
- **Wheel:** horizontal wheel/trackpad steps between icons on the full-screen hub; vertical
  wheel steps the open sub-item list, and falls through to normal page scroll once you're at
  the top/bottom of that list (or when no sub-list is open) so it never fights the browser.
- **Deep-linking:** visiting `/about` or `/work?film=<id>` directly focuses the matching
  category/sub-item on load.
- Respects `prefers-reduced-motion` (springs collapse to instant, stagger delays drop to 0).

To change what's in the menu, edit `lib/nav-data.ts` (and `lib/videos-data.ts` for the Films
category, which is generated from it).

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

## Adding a video

Films are YouTube videos embedded inline (via `youtube-nocookie.com/embed/...`) — playback
never leaves the site. To add one:

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
   The XMB menu's Films sub-items are generated from this file automatically.

## Deploying

Connect the repo on Vercel or Netlify, set the two env vars above, and deploy — this is a
standard Next.js app, so both platforms auto-detect the framework and build command
(`next build`).

## Accessibility & performance notes

- Semantic landmarks (`nav`, `main`), skip-to-content link, visible focus rings, labelled
  form fields, `aria-live` status regions on both forms.
- `prefers-reduced-motion` disables spring/stagger animation throughout, including the XMB
  menu and the ambient wave graphic.
- Videos use `preload="none"` and only get a `<source>` once the modal is opened — nothing
  downloads on page load beyond the (lazy-loaded) poster images.

## Screenshots

`screenshot.mjs` (Puppeteer) still works against `next dev` — it just points at whatever
localhost URL you give it:
```
npm run dev &
node screenshot.mjs http://localhost:3000 home
```
