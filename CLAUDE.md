# CLAUDE.md (project — portfolio repo root)

Frontend Website Rules for this project. My global ~/.claude/CLAUDE.md (Working Preferences) also applies.

### First step, always
Invoke the `frontend-design` skill before writing any frontend code — every session, no exceptions.

### Reference images
- **If provided:** match layout, spacing, typography, and color exactly. Use placeholders (`https://placehold.co/WIDTHxHEIGHT`, generic copy). Don't improve, add to, or reinterpret the design.
- **If not provided:** design from scratch with high craft (see Anti-Generic Guardrails).
- **Compare loop:** screenshot output → compare against reference → fix mismatches → re-screenshot. At least 2 rounds. Stop only when no visible differences remain or the user says so. Be specific when comparing: "heading is 32px but reference shows ~24px", "card gap is 16px, should be 24px". Check spacing/padding, font size/weight/line-height, exact hex colors, alignment, border-radius, shadows, image sizing.

### Local server + screenshots
- Always serve on localhost — never screenshot a `file:///` URL.
- Start dev server in the background before screenshotting: `npm run dev` (Next.js dev server at `http://localhost:3000`). If already running, don't start a second instance.
- Screenshot from localhost: `node screenshot.mjs http://localhost:3000` (optional label: `... http://localhost:3000 label`).
- Saved to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten; label → `screenshot-N-label.png`).
- `screenshot.mjs` lives in the project root — use as-is.
- Puppeteer uses its default browser install/cache location — don't hardcode a path.
- After screenshotting, read the PNG with the Read tool and analyze it directly.

### Brand assets
Check `brand_assets/` before designing (logos, color/style guides, images). Use real assets when present — never placeholders where a real asset exists, never invented brand colors where a palette is defined.

### Output defaults
- Next.js (App Router) + TypeScript + Tailwind (installed, not CDN) + shadcn/ui conventions.
  New reusable components go in `/components/ui`; page-specific ones in `/components`.
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`.
- Mobile-first responsive.

### Anti-Generic Guardrails
- **Colors:** No default Tailwind palette (indigo-500, blue-600, …). Pick a custom brand color and derive from it.
- **Shadows:** No flat `shadow-md`. Use layered, color-tinted shadows at low opacity.
- **Typography:** Different fonts for headings vs body — pair a display/serif with a clean sans. Tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients; add grain/texture via SVG noise filter.
- **Animations:** Animate only `transform` and `opacity`, never `transition-all`. Spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states.
- **Images:** Gradient overlay (`bg-gradient-to-t from-black/60`) plus a color-treatment layer with `mix-blend-multiply`.
- **Spacing:** Intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Layering system (base → elevated → floating), not one z-plane.

### Hard rules
Don't add sections/features/content not in the reference. Don't "improve" a reference — match it. Don't stop after one screenshot pass. Don't use `transition-all`. Don't use default Tailwind blue/indigo as the primary color.
