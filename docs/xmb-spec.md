# XMB Menu — Implementation Spec

Reference: PS3 XrossMediaBar (`xmbdemo.mp4`). This spec describes the target behavior
derived frame-by-frame from that video, plus the four design decisions the site owner
made explicitly. **Where this spec differs from the PS3, the spec wins** — those
deviations are marked `[DECISION]`.

Target: replace the current menu behavior at `localhost:3000`. The current build's
specific defects are listed in §10.

---

## 1. Mental model

The XMB is **one cross**: a horizontal row of category icons, and a vertical column of
item icons, intersecting at a single fixed point on screen. Nothing "scrolls" in the
web sense. Both axes are **carousels that translate so that the current selection is
always parked at that fixed intersection.**

Two invariant screen anchors, never animated:

| Anchor | Value | Meaning |
|---|---|---|
| `ROW_Y` | `25.3vh` | vertical centerline of the horizontal category row |
| `SELECT_Y` | `45.4vh` | vertical centerline of the selected column item |
| `AXIS_X` | `29.5vw` | horizontal centerline of both the active category icon **and** the entire column |

The active category icon and the selected column item are therefore vertically stacked
on the same `AXIS_X`, separated by `20.1vh` of empty space. **That gap is the whole
point of the design** — see §3.

Derived from the source video at 1280×720:
`ROW_Y = 182px`, `SELECT_Y = 327px`, `AXIS_X = 377px`.

---

## 2. Horizontal row (categories)

Six categories. The row is a carousel translated horizontally so the active category
lands on `AXIS_X`.

```
rowTranslateX = AXIS_X - (activeCategoryIndex * CATEGORY_PITCH)
```

- `CATEGORY_PITCH` = `10.47vw` (134px @1280). Constant, no gaps or grouping.
- Categories to the left of active render at negative x and can go off-screen left;
  same on the right. **Do not clamp.** At `activeCategoryIndex = 0` the row sits so
  that category 0 is on `AXIS_X` and categories 1–5 trail off to the right, leaving
  the left ~30% of the viewport empty. That emptiness is correct and intentional.
- Icon size: `ICON_CAT = 46px` inactive, `ICON_CAT_ACTIVE = 64px` active (≈1.4× scale).
- Inactive icon opacity `0.55`, active `1.0` plus a soft glow
  (`filter: drop-shadow(0 0 10px currentColor)` at low alpha reads correctly).
- **Labels** `[DECISION]`: **all six labels are always visible**, small text,
  **centered directly under each icon**, at `ROW_Y + 41px` (`5.7vh`) baseline.
  The active category's label is **bold and full opacity**; the other five are the
  same size but reduced opacity (~`0.5`). This differs from the PS3, which shows only
  the active label.

### Horizontal navigation animation
Left/Right arrow, click on an icon, horizontal scroll, or horizontal drag.

1. The row translates to the new `rowTranslateX` over **300ms, `cubic-bezier(.22,.61,.36,1)`** (ease-out).
2. **Simultaneously** the outgoing column cross-fades out (opacity → 0 over ~180ms)
   while translating left/right ~30px in the direction of travel, and the incoming
   column cross-fades in at `AXIS_X` (opacity 0 → 1 over ~220ms, starting at ~80ms).
   The columns cross-fade *in place on the axis* — they do **not** slide across with
   the row. In the source video both the old and new column labels are briefly
   visible superimposed near the axis; that overlap is correct.
3. The new category's column always initializes with `itemIndex = 0` selected.

---

## 3. Vertical column (items) — THE CORE BEHAVIOR

**This is the part the current build gets wrong.** The column is not a uniformly
spaced list that slides past a viewport. It is a **piecewise layout with a hole
punched out of it where the horizontal row lives.**

### 3.1 Layout function

Given the selected index `s`, every item `i` in the column gets a y position:

```js
const ROW_Y      = 0.253 * vh;   // 182px @720
const SELECT_Y   = 0.454 * vh;   // 327px @720
const PITCH      = 0.075 * vh;   //  54px @720  — spacing between non-selected items
const SEL_GAP    = 0.1625 * vh;  // 117px @720  — selected item to its immediate neighbour
const ABOVE_GAP  = 0.1556 * vh;  // 112px @720  — row centerline to first item above it

function itemY(i, s) {
  if (i === s) return SELECT_Y;
  if (i > s)   return SELECT_Y + SEL_GAP + (i - s - 1) * PITCH;   // below the axis
  // i < s : ABOVE the horizontal row, stacking upward
  const k = s - i;                                                // 1 = nearest above
  return (ROW_Y - ABOVE_GAP) - (k - 1) * PITCH;
}
```

Read that carefully:

- **Items below the selection** flow downward from `SELECT_Y`, with an extra `SEL_GAP`
  before the first one (because the selected icon is enlarged and needs breathing
  room), then plain `PITCH` after that.
- **Items above the selection do not sit just above `SELECT_Y`.** They start at
  `ROW_Y - ABOVE_GAP` — i.e. **above the horizontal category row** — and stack
  upward from there. The entire vertical band from `ROW_Y - ABOVE_GAP` to
  `SELECT_Y` contains nothing but the category row.
- There is therefore a **discontinuity of ≈145px (20vh)** between the selected item
  and the item immediately above it. The column literally straddles the row.

Concrete check against the source frame at 0:45 (1280×720, "Saved Data Utility
(minis/PSP)" selected, index 2 of 5):

```
index 0  "Game Data Utility"        y =  17   ← above the row
index 1  "Memory Card Utility"      y =  70   ← above the row
        [ category row              y = 182 ]
index 2  "Saved Data Utility(minis)" y = 327   ← SELECTED
index 3  "Saved Data Utility(PS3)"  y = 443
index 4  "PlayStation Store"        y = 497
index 5  (partial)                  y = 549
```

### 3.2 The "jump over the row" transition

When you press Down and `s` increments, the item that *was* selected must travel from
`SELECT_Y` (327) all the way up to `ROW_Y - ABOVE_GAP` (70) — crossing straight over
the category row — while every item below shifts up by one `PITCH` and the new
selection settles onto `SELECT_Y`.

- **This is a single continuous tween, not a teleport.** Animate `y` (and `scale` and
  `opacity`) per item from its old computed position to its new computed position.
  Simply re-running the layout function with the new `s` and letting Framer Motion /
  a spring interpolate each item's `y` produces exactly the right motion for free.
- **Duration ≈ 300ms, ease-out** (`cubic-bezier(.22,.61,.36,1)`). Measured from the
  video: motion begins and fully settles inside 9–10 frames at 30fps.
- **Z-order: the travelling item passes IN FRONT of the category row icons.** In the
  video the orange "What's New" icon is clearly drawn over the PlayStation Network
  icon mid-flight. Give the column a higher `z-index` than the row.
- The travelling item interpolates its scale down from selected-size to
  unselected-size *during* the flight, so it is already small by the time it clears
  the row.
- Items do not move as a rigid block. Because the layout is piecewise, an item near
  the axis travels ~257px while an item three slots down travels 54px, in the same
  300ms. That non-uniformity is the signature look — don't "fix" it.

### 3.3 Column item rendering

- Icon on `AXIS_X`, horizontally centered.
- Selected: icon `72px` (`10vh`), opacity `1.0`.
- Unselected: icon `30px` (`4.2vh`), opacity `~0.45` above the row, `~0.6` below.
- **Labels** `[DECISION]`: column item labels sit **to the RIGHT of the icon**,
  vertically centered on the icon, left edge at `AXIS_X + 6vw` (`x = 453px @1280`).
  - Selected label: **bold, full white/full-contrast, larger** (≈`21px @720`), with a
    subtle text glow. Optional second line beneath it in ~`11px` at 60% opacity for a
    subtitle (the PS3 uses this for e.g. a username).
  - Unselected labels: regular weight, ~`17px @720`, opacity `~0.55`.
- Column items must **not** be clipped by any container — items above the row live at
  negative-ish y near the top of the viewport and must remain visible.

### 3.4 Vertical navigation
Up/Down arrow, click on any column item (sets `itemIndex` to that item), vertical
scroll, vertical drag. Clamp at both ends: no wrap-around.

---

## 4. Two depths: BROWSE and OPEN

There is no "closed / itemIndex = null" state. Whenever a category is active,
exactly one column item is selected. Depth is a separate flag.

```ts
type XmbState = {
  categoryIndex: number;   // 0..5
  itemIndex: number;       // always a real index, never null
  isOpen: boolean;          // false = BROWSE, true = OPEN
};
```

### 4.1 BROWSE (`isOpen === false`) — the default

- The horizontal row is FULLY VISIBLE: all six icons, all six labels under them,
  active one bold.
- The column uses the piecewise `itemY()` from §3.1 — the one with the hole.
- Up/Down runs the jump-over animation of §3.2. **This is the primary interaction of
  the whole menu and must be visible constantly, not just in an edge case.**
- The right side of the screen is EMPTY. No panel, no preview card, no body copy. The
  only thing identifying the selection is its own title, bold, in its normal position
  beside its icon per §3.3.
- Left/Right changes category (§2) and resets `itemIndex` to 0, staying in BROWSE.

### 4.2 OPEN (`isOpen === true`) — entered via Enter, or clicking the already-selected item

On entering OPEN, over 300ms with the shared easing:

1. The five NON-active category icons fade to opacity 0 (and their labels with
   them). They do not translate; they just fade.
2. The ACTIVE category icon SURVIVES as a heading. It keeps its size and its `y`
   (`ROW_Y`), and translates left from `AXIS_X` (29.5vw) to `OPEN_AXIS_X` (15vw). Its
   label travels with it.
3. The SELECTED column item survives, at full size, and translates left from
   `AXIS_X` to `OPEN_AXIS_X`. Its `y` stays at `SELECT_Y`. Its bold label stays to the
   right of its icon.
4. ALL NON-SELECTED column items fade to opacity 0. They do not reflow, do not
   collapse the hole, do not slide. They fade where they are.
   → `itemYOpen()` from the old spec no longer exists. There is only `itemY()`. The
   layout function never changes; only opacity and the axis `x` change.
5. The content panel fades in on the RIGHT: left edge `32vw`, right edge `90vw`,
   first heading baseline near `SELECT_Y`. Enters opacity 0→1 over 250ms with
   `translateX(24px) → 0`, delayed ~100ms behind the slide.

The end state reads as: category icon at top-left, selected item icon beneath it,
both on the `15vw` axis, and the item's content filling the right two-thirds. Nothing
else on screen.

### 4.3 Leaving OPEN

Left arrow, Escape, Backspace, or clicking the surviving category icon returns to
BROWSE: panel fades out first, then the two survivors slide back to `AXIS_X` while
the faded-out icons fade back in. Same 300ms, reversed order.

### 4.4 Up/Down while OPEN

**Resolved:** Up/Down scrolls the content panel internally. It does not change
`itemIndex` and does not affect the column while OPEN.

---

## 5. State model and routing `[DECISION]`

Single page, single component tree, **no route navigation.** The entire menu is driven
by one piece of state:

```ts
type XmbState = {
  categoryIndex: number;      // 0..5
  itemIndex: number | null;   // null = closed / row-browsing
};
```

- **No `<Link>`, no `router.push`, no page remount ever.** The current build's
  `Enter → /about#education` navigation is the root cause of "content dumped at the
  bottom" and must be removed entirely.
- **Shallow URL sync**: on every state change, mirror it into the URL *without*
  navigating:
  ```js
  window.history.replaceState(null, '', `/?c=${catSlug}&i=${itemSlug ?? ''}`);
  ```
  (In Next.js App Router use `window.history.replaceState` directly, or
  `router.replace(url, { scroll: false })` — verify it does not remount. The plain
  History API call is safer here.)
- On mount, read `?c=` and `?i=` and initialize state from them (falling back to
  `{0, null}`), so refresh and shared links restore position.
- Push a real history entry (`pushState`) only on *category* changes and on
  open/close, not on every up/down highlight move — otherwise the Back button becomes
  unusable. Listen for `popstate` and apply the state without animation suppression.

---

## 6. Typography and assets

- **Font**: use the typeface in the repo's `brand_assets/` folder. Load it via
  `next/font/local` (or `@font-face` with `font-display: swap`) and set it as the
  base family for the whole XMB. Do not fall back to the current default.
- Icon set stays as-is (the existing icons in the build are fine).
- Small-caps / letterspaced treatment on the row labels reads well at these sizes;
  keep them ~`11px` with `letter-spacing: .08em`.

---

## 7. Input handling

| Input | Effect |
|---|---|
| ← / → | change `categoryIndex` (clamped 0..5) |
| ↑ / ↓ | change `itemIndex` (clamped; ↑ from item 0 sets `null` and closes) |
| Enter | no-op at depth 1 (content is already shown on highlight) |
| Esc / Backspace | close (`itemIndex = null`) |
| Click category icon | set `categoryIndex`, set `itemIndex = null` |
| Click column item | set `itemIndex` to that item |
| Wheel — horizontal | change category (debounce ~250ms per step) |
| Wheel — vertical | change item (debounce ~250ms per step) |
| Drag | horizontal drag → category, vertical drag → item; snap on release |

Debounce/throttle wheel and key-repeat so one gesture never queues more than one step
per 250ms — otherwise the 300ms tweens stack and the motion turns to mush. Do not
cancel an in-flight tween on a new input; let the spring retarget.

---

## 8. Recommended implementation shape

```jsx
// Single client component. No routing.
<div className="xmb-root">          {/* position: fixed; inset: 0; overflow: hidden */}

  <motion.div className="xmb-row" style={{ x: rowTranslateX }}>  {/* z-index: 1 */}
    {categories.map((c, i) => (
      <CategoryIcon key={c.id}
        active={i === categoryIndex}
        /* absolute at i*PITCH; fades to 0 when isOpen && i !== categoryIndex */
        animate={{ opacity: isOpen && i !== categoryIndex ? 0 : (i === categoryIndex ? 1 : 0.55) }}
      />
    ))}
  </motion.div>

  <div className="xmb-column">  {/* z-index: 2 ← ABOVE the row. x is fixed at AXIS_X — it never moves. */}
    {items.map((it, i) => (
      <motion.div key={it.id}
        animate={{
          y:       `${itemY(i, s)}vh`,               // itemY() is the ONLY layout function — no itemYOpen
          scale:   i === s ? 1 : 30 / 72,
          opacity: isOpen ? (i === s ? 0 : 0.5) : (i === s ? 1 : 0.5),
          // ^ the selected item ALSO fades here — its "survivor" duplicate below takes over visually
        }}
        transition={EASE}>
        <Icon/><Label align="right" bold={i === s}/>
      </motion.div>
    ))}
  </div>

  {/* z-index: 3 — the two OPEN survivors, independently positioned so only the
      selected pair moves to OPEN_AXIS_X while everything else in the row/column
      just fades in place. */}
  <motion.div style={{ top: `${ROW_Y}vh` }} animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? `${OPEN_AXIS_X}vw` : `${AXIS_X}vw` }} transition={EASE}>
    <CategoryIcon active category={categories[categoryIndex]} />
  </motion.div>
  <motion.div style={{ top: `${SELECT_Y}vh` }} animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? `${OPEN_AXIS_X}vw` : `${AXIS_X}vw` }} transition={EASE}>
    <Icon/><Label bold />
  </motion.div>

  <AnimatePresence>
    {isOpen && <ContentPanel key={activeItem.id} item={activeItem} />}
  </AnimatePresence>
</div>

const EASE = { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] };
```

Key points: **one absolutely-positioned layer per axis**, per-item `y` driven purely by
`itemY()` (never a second formula), and the column layered above the row. The BROWSE↔OPEN
transition is implemented as two small "survivor" elements crossfading with their
in-row/in-column counterparts — not by moving the whole row or column.

A spring (`stiffness: 260, damping: 30`) is an acceptable substitute for the fixed
easing and arguably feels closer to the console; pick one and use it everywhere so
the row, column, and panel stay in sync.

---

## 9. Responsive / other details

- Root is `position: fixed; inset: 0; overflow: hidden` — the page never scrolls;
  only the content panel scrolls internally.
- All anchors are `vh`/`vw`-derived so the cross scales with the viewport. Below
  ~900px wide, reduce `CATEGORY_PITCH` and icon sizes proportionally rather than
  wrapping.
- Respect `prefers-reduced-motion`: drop all durations to 0 and apply positions
  instantly; the layout function is unchanged.

---

## 10. Defects in the current `localhost:3000` build, for reference

Observed directly by driving the running app:

1. **The column hangs straight down off the row instead of straddling it.** With
   "About" active, the first column item ("Bio") renders at `y ≈ 130` while the row
   sits at `y ≈ 90` and the row's label at `y ≈ 114` — the item icon overlaps the
   category label. There is no `SELECT_Y` anchor and no hole in the layout.
2. **Moving down scrolls the column up over the row and the row disappears behind
   it.** After two Down presses the six category icons are gone entirely. The correct
   behavior is that items *jump over* a row that stays put and stays visible (§3.2).
3. **Item spacing is uniform (~35px) with no enlargement of the selection.** Needs the
   `PITCH` / `SEL_GAP` distinction and the 72px vs 30px icon sizes.
4. **Enter navigates to `/about#education` and renders the entire About page below the
   menu.** All content ends up centered at the bottom of the page and is not per-item.
   Replace with the highlight-driven right-hand panel (§4) and delete the routing (§5).
5. **The menu is horizontally centered at 50vw.** Move the axis to `AXIS_X = 29.5vw`.
6. **Column labels and row labels both need the treatment in §2 / §3.3**, and the
   `brand_assets/` font is not currently applied.
