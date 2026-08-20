# Portfolio starter — setup

## What's in here
- `CLAUDE.md` — the **project** rules (Frontend Website Rules). Stays in this folder.
- `serve.mjs` — zero-dependency local server (serves this folder at http://localhost:3000).
- `screenshot.mjs` — screenshots localhost into `temporary screenshots/` (needs puppeteer).
- `package.json` — scripts + the puppeteer dependency.
- `brand_assets/` — put your logo/colors/fonts here before building.
- `temporary screenshots/` — where screenshots land (git-ignored).
- `.env.example` — copy to `.env` and add your Supabase keys.
- `PROMPT-to-paste.md` — the prompt to give Claude Code to start building.

## One-time setup
1. Put this folder wherever you keep projects, and open a terminal in it.
2. Install the screenshot dependency:  `npm install`
   (This pulls puppeteer + a bundled Chromium. `serve.mjs` needs nothing.)
3. Put your **global** rules at `~/.claude/CLAUDE.md` (the separate global file I gave you,
   renamed to just `CLAUDE.md`). That applies to every project; this folder's `CLAUDE.md`
   applies only here. Claude Code reads and merges both automatically.

## Daily use
- Start the server (leave it running):  `npm run serve`
- Take a screenshot in another terminal:  `node screenshot.mjs http://localhost:3000 hero`
- Then start Claude Code in this folder and paste `PROMPT-to-paste.md`.

## Supabase (when you get to the guestbook/contact phase)
1. Create a free project at supabase.com.
2. Settings -> API: copy the Project URL and the anon public key.
3. `cp .env.example .env` and paste them in.
4. Claude Code will give you the SQL to create the guestbook + contact tables.
