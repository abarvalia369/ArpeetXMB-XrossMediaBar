# Prompt for Claude Code — Personal Portfolio Website

> Assumes my CLAUDE.md is active — it governs HOW you work (frontend-design skill first,
> screenshot compare loop, anti-generic design, output defaults, planning-first, scope,
> clarify-before-coding). This prompt is only the WHAT. Don't restate my CLAUDE.md rules
> back to me. Fill in the **[bracketed]** bits before pasting.

---

Build my **personal portfolio website**. This is a from-scratch design (no reference image).
Follow my CLAUDE.md throughout. Below is the spec plus the technical decisions I've made.

## About me (fill in)
- Name / role / tagline: **[…]**
- Location: **[optional]**
- Social links: **[GitHub / LinkedIn / Instagram / YouTube / X — whichever apply]**
- Contact email: **[…]**
- Real content for Experience / Education / Skills: **[paste, or say "use labelled placeholders"]**

## Technical decisions (already made — don't re-litigate)
- **Static site + serverless.** Deploy target: **Netlify or Vercel** (free tier).
- **Supabase** (free tier) is the backend for the guestbook and contact form. Supabase URL
  and anon key go in **environment variables**, never hardcoded. Include the exact SQL to
  create the tables and the Supabase setup steps in the README.
- Follow my CLAUDE.md output defaults for file structure/styling. If the Supabase wiring or
  video gallery makes a single `index.html` impractical, propose the split in your plan.

## Sections

**1. Hero** — name, tagline, one-line intro, primary CTAs ("See my work" / "Get in touch"),
smooth scroll.

**2. About** — bio, **Experience** (role, org, dates, 1–2 lines — timeline/cards),
**Education**, **Skills/tools**. Optional resume-download button (placeholder if no PDF yet).

**3. Content / video showcase** — gallery of my short films. **Videos are self-hosted .mp4**
in a `/videos` folder. Per video: poster/thumbnail image, `preload="none"`, **lazy-load** —
never autoplay or load every file on page open. Click-to-play opening a larger player
(modal or dedicated view), with title + short description. Also tell me how to compress the
.mp4s (target size/resolution/H.264) and generate poster frames, since I'm self-hosting.

**4. Contact** — form (name, email, message) that saves to Supabase with success/error
states and client-side validation. Show my direct email + socials as a fallback.

**5. Guestbook** — visitors leave a short public note (name + message), saved to Supabase,
newest first. **Spam protection: lightweight** — hidden honeypot field + a simple captcha
(or math challenge); notes post instantly, no moderation queue. Enforce a max length,
**sanitize/escape all displayed text (no XSS)**, and rate-limit obvious abuse. Graceful
empty state ("Be the first to sign the guestbook!").

**6. Footer** — socials, copyright, back-to-top.

## Extras (include all)
- **SEO + social sharing:** title + meta description, Open Graph + Twitter card tags,
  favicon, sitemap.xml, robots.txt.
- **Dark mode + responsive:** light/dark toggle defaulting to OS preference; great on phone,
  tablet, desktop.
- **Analytics + accessibility:** privacy-friendly analytics slot (e.g. Plausible — leave the
  script commented with a note on where my domain goes); build to **WCAG AA** (semantic HTML,
  keyboard nav, visible focus, alt text, contrast, labelled fields, reduced-motion).

## Also include
- A styled **404 page**.
- **Loading + error states** for every Supabase call.
- **README:** run locally, Supabase setup + SQL, env variables, how to add a new video,
  deploy to Netlify/Vercel.

## Content constraint
Don't invent experience, education, or testimonials — use clearly-labelled placeholders where
I haven't given real content.

## Build order
Because this exceeds a single small change, structure it as phases (per my planning rule):
(1) plan file structure + Supabase schemas, (2) sections with placeholder content,
(3) Supabase wiring for guestbook + contact, (4) video showcase, (5) SEO/404/a11y/analytics
+ README. **Start with the plan and stop for my approval.**
