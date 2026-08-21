"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NAV, type Item } from "@/lib/nav-data";
import { WavyBackground } from "@/components/ui/wavy-background";
import { ExternalLinkPanel } from "@/components/panels/external-link-panel";

// ---- Fixed screen anchors (spec §1), derived frame-by-frame from the PS3 XMB ----
const ROW_Y = 25.3; // vh — category row centerline
const SELECT_Y = 45.4; // vh — selected column item centerline
const AXIS_X = 29.5; // vw — column axis, BROWSE
const OPEN_AXIS_X = 15; // vw — column axis, OPEN
const CATEGORY_PITCH = 10.47; // vw — spacing between category icons
const PITCH = 7.5; // vh — spacing between non-selected column items
const SEL_GAP = 16.25; // vh — selected item to its immediate neighbour
const ABOVE_GAP = 15.56; // vh — row centerline to first item above it
const LABEL_OFFSET = 6; // vw — column label left edge, relative to the axis

const ICON_CAT = 46;
const ICON_CAT_ACTIVE = 64;
const ICON_ITEM_SELECTED = 72;
const ICON_ITEM_UNSELECTED = 30;

const EASE = [0.22, 0.61, 0.36, 1] as const;
const DURATION = 0.3;
const WHEEL_COOLDOWN = 250;
const WHEEL_THRESHOLD = 24;
const DRAG_MIN_PX = 12;
const PANEL_SCROLL_STEP = 120;

// spec §3.1 — the ONLY column layout function. Piecewise, with a hole where the
// row sits. Used identically in BROWSE and OPEN — only opacity/x differ between them.
function itemY(i: number, s: number) {
  if (i === s) return SELECT_Y;
  if (i > s) return SELECT_Y + SEL_GAP + (i - s - 1) * PITCH;
  const k = s - i;
  return ROW_Y - ABOVE_GAP - (k - 1) * PITCH;
}

interface XmbState {
  categoryIndex: number;
  itemIndex: number;
  isOpen: boolean;
}

function readStateFromUrl(): XmbState {
  if (typeof window === "undefined") return { categoryIndex: 0, itemIndex: 0, isOpen: false };
  const params = new URLSearchParams(window.location.search);
  const found = NAV.findIndex((cat) => cat.id === params.get("c"));
  const categoryIndex = found === -1 ? 0 : found;
  const items = NAV[categoryIndex].items;
  const idx = items.findIndex((it) => it.id === params.get("i"));
  const itemIndex = idx === -1 ? 0 : idx;
  return { categoryIndex, itemIndex, isOpen: params.get("o") === "1" };
}

function writeStateToUrl(state: XmbState, push: boolean) {
  const cat = NAV[state.categoryIndex];
  const item = cat.items[state.itemIndex];
  const params = new URLSearchParams();
  params.set("c", cat.id);
  params.set("i", item.id);
  if (state.isOpen) params.set("o", "1");
  const url = `${window.location.pathname}?${params.toString()}`;
  if (push) window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

export function XmbMenu() {
  const reduced = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const [categoryIndex, setCategoryIndex] = React.useState(0);
  const [itemIndex, setItemIndex] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const readyRef = React.useRef(false);

  React.useEffect(() => {
    const initial = readStateFromUrl();
    setCategoryIndex(initial.categoryIndex);
    setItemIndex(initial.itemIndex);
    setIsOpen(initial.isOpen);
    readyRef.current = true;
    rootRef.current?.focus();
  }, []);

  const prevStateRef = React.useRef<XmbState>({ categoryIndex: 0, itemIndex: 0, isOpen: false });
  React.useEffect(() => {
    if (!readyRef.current) return;
    const prev = prevStateRef.current;
    const categoryChanged = prev.categoryIndex !== categoryIndex;
    const openChanged = prev.isOpen !== isOpen;
    writeStateToUrl({ categoryIndex, itemIndex, isOpen }, categoryChanged || openChanged);
    prevStateRef.current = { categoryIndex, itemIndex, isOpen };
  }, [categoryIndex, itemIndex, isOpen]);

  React.useEffect(() => {
    function onPopState() {
      const state = readStateFromUrl();
      setCategoryIndex(state.categoryIndex);
      setItemIndex(state.itemIndex);
      setIsOpen(state.isOpen);
      prevStateRef.current = state;
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const category = NAV[categoryIndex];
  const items = category.items;
  const s = itemIndex;

  const spring = reduced ? { duration: 0 } : { duration: DURATION, ease: EASE };

  const goCategory = React.useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(NAV.length - 1, next));
    setCategoryIndex(clamped);
    setItemIndex(0);
    setIsOpen(false);
  }, []);

  const moveItem = React.useCallback(
    (delta: number) => {
      setItemIndex((cur) => Math.max(0, Math.min(items.length - 1, cur + delta)));
    },
    [items.length]
  );

  const scrollPanel = React.useCallback(
    (delta: number) => {
      panelRef.current?.scrollBy({ top: delta * PANEL_SCROLL_STEP, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced]
  );

  // Enter, or clicking the already-selected item (spec §4.2 preamble).
  // Always opens the content panel — external items navigate only when the
  // user explicitly activates the link shown inside that panel.
  const openSelected = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCategoryClick = React.useCallback(
    (i: number) => {
      if (i === categoryIndex) {
        setIsOpen((prev) => !prev);
      } else {
        goCategory(i);
      }
    },
    [categoryIndex, goCategory]
  );

  const handleItemClick = React.useCallback(
    (i: number) => {
      if (i === itemIndex) {
        setIsOpen(true);
      } else {
        setItemIndex(i);
      }
    },
    [itemIndex]
  );

  // ---- Keyboard (spec §7, §4.4) ----
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (isOpen) setIsOpen(false);
          else goCategory(categoryIndex - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          if (!isOpen) goCategory(categoryIndex + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpen) scrollPanel(-1);
          else moveItem(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (isOpen) scrollPanel(1);
          else moveItem(1);
          break;
        case "Enter":
          e.preventDefault();
          if (!isOpen) openSelected();
          break;
        case "Escape":
        case "Backspace":
          e.preventDefault();
          if (isOpen) setIsOpen(false);
          break;
      }
    },
    [categoryIndex, isOpen, goCategory, moveItem, scrollPanel, openSelected]
  );

  // ---- Wheel: one step per gesture, 250ms debounce (spec §7). Disabled while OPEN —
  // the panel just gets native scroll instead (spec §4.4). ----
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let acc = 0;
    let until = 0;
    function onWheel(e: WheelEvent) {
      if (isOpen) return;
      const horizontalDominant = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      e.preventDefault();
      const now = e.timeStamp;
      if (now < until) return;
      if (horizontalDominant) {
        acc += e.deltaX;
        if (Math.abs(acc) < WHEEL_THRESHOLD) return;
        goCategory(categoryIndex + Math.sign(acc));
      } else {
        acc += e.deltaY;
        if (Math.abs(acc) < WHEEL_THRESHOLD) return;
        moveItem(Math.sign(acc));
      }
      acc = 0;
      until = now + WHEEL_COOLDOWN;
    }
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [isOpen, categoryIndex, goCategory, moveItem]);

  // ---- Drag: horizontal → category, vertical → item, snap on release. Disabled while OPEN. ----
  const dragStart = React.useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if (isOpen) return;
      dragStart.current = { x: e.clientX, y: e.clientY };
    },
    [isOpen]
  );
  const onPointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      const start = dragStart.current;
      dragStart.current = null;
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < DRAG_MIN_PX) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        const pxPerStep = (window.innerWidth * CATEGORY_PITCH) / 100;
        const steps = Math.round(-dx / pxPerStep);
        if (steps !== 0) goCategory(categoryIndex + steps);
      } else {
        const pxPerStep = (window.innerHeight * PITCH) / 100;
        const steps = Math.round(-dy / pxPerStep);
        if (steps !== 0) moveItem(steps);
      }
    },
    [categoryIndex, goCategory, moveItem]
  );

  const rowTranslateX = AXIS_X - categoryIndex * CATEGORY_PITCH;
  const survivorAxisX = isOpen ? OPEN_AXIS_X : AXIS_X;
  const selectedItem = items[itemIndex] as Item | undefined;

  return (
    <div
      ref={rootRef}
      role="application"
      aria-label="Main menu"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="fixed inset-0 overflow-hidden bg-black text-white outline-none"
    >
      <WavyBackground
        containerClassName="absolute inset-0 pointer-events-none"
        speed="slow"
        blur={0}
        glow
        glowColor="#ffffff"
        glowStrength={36}
        waveCount={4}
        waveWidth={2}
        waveOpacity={0.65}
      />

      {/* Category row — z-index 1. In BROWSE, fully visible (spec §4.1). In OPEN, every
          icon (active included) fades to 0 — the survivor layer below represents the
          active one instead, so it can move to OPEN_AXIS_X independently of its siblings. */}
      <div className="absolute left-0 z-10 w-full" style={{ top: `${ROW_Y}vh` }}>
        <motion.div className="relative h-0" animate={{ x: `${rowTranslateX}vw` }} transition={spring}>
          {NAV.map((cat, i) => {
            const active = i === categoryIndex;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                tabIndex={-1}
                aria-current={active ? "true" : undefined}
                aria-label={cat.label}
                onClick={() => handleCategoryClick(i)}
                style={{ left: `${i * CATEGORY_PITCH}vw` }}
                className="absolute top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center bg-transparent outline-none"
              >
                <motion.span
                  animate={{
                    width: active ? ICON_CAT_ACTIVE : ICON_CAT,
                    height: active ? ICON_CAT_ACTIVE : ICON_CAT,
                    opacity: isOpen ? 0 : active ? 1 : 0.55,
                  }}
                  transition={spring}
                  className="flex items-center justify-center"
                  style={active ? { filter: "drop-shadow(0 0 10px rgba(255,255,255,0.55))" } : undefined}
                >
                  <Icon width="100%" height="100%" />
                </motion.span>
                <motion.span
                  animate={{ opacity: isOpen ? 0 : active ? 1 : 0.5 }}
                  transition={spring}
                  className="absolute top-full mt-[9px] whitespace-nowrap text-[11px] uppercase tracking-[0.08em]"
                  style={{ fontWeight: active ? 700 : 400 }}
                >
                  {cat.label}
                </motion.span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Column — z-index 2, ABOVE the row, so the item travelling through the row's
          vertical band during BROWSE up/down draws in front of the row icons (spec §3.2).
          x is fixed at AXIS_X always — only the survivor layer moves to OPEN_AXIS_X.
          y always comes from itemY() — there is no second layout function. */}
      <div className="absolute top-0 z-20 h-full" style={{ left: `${AXIS_X}vw` }}>
        {items.map((item, i) => {
          const selected = i === itemIndex;
          const y = itemY(i, s);
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              className="absolute left-0"
              // `top` is a layout property, not a transform — without a matching `initial`,
              // Framer Motion defaults a fresh mount's starting value to 0 (the very top of
              // the container), so on every category switch (new key -> new mount) the item
              // would visibly slide down from the top of the screen. `initial={false}` makes
              // it appear immediately at its correct itemY() position instead; the jump-over
              // animation between items within an already-mounted column is unaffected.
              initial={false}
              animate={{
                top: `${y}vh`,
                scale: selected ? 1 : ICON_ITEM_UNSELECTED / ICON_ITEM_SELECTED,
                opacity: isOpen ? 0 : selected ? 1 : i < s ? 0.45 : 0.6,
              }}
              transition={spring}
            >
              <button
                type="button"
                tabIndex={-1}
                onClick={() => handleItemClick(i)}
                style={{ width: ICON_ITEM_SELECTED, height: ICON_ITEM_SELECTED, transform: "translate(-50%, -50%)" }}
                className="absolute left-0 top-0 flex items-center justify-center bg-transparent outline-none"
              >
                <Icon width="100%" height="100%" />
              </button>
              <span
                style={{ left: `${LABEL_OFFSET}vw`, transform: "translateY(-50%)", fontSize: selected ? 21 : 17, fontWeight: selected ? 700 : 400 }}
                className="absolute top-0 whitespace-nowrap"
              >
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* OPEN survivors — z-index 3. The active category icon and the selected item icon,
          independently positioned so only this pair moves to OPEN_AXIS_X while the rest of
          the row/column just fade in place (spec §4.2). Invisible + non-interactive in BROWSE. */}
      <motion.div
        className="absolute left-0 top-0 z-30 h-full"
        animate={{ x: `${survivorAxisX}vw`, opacity: isOpen ? 1 : 0 }}
        transition={spring}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Close ${category.label}`}
          onClick={() => handleCategoryClick(categoryIndex)}
          style={{ top: `${ROW_Y}vh`, width: ICON_CAT_ACTIVE, height: ICON_CAT_ACTIVE, transform: "translate(-50%, -50%)" }}
          className="absolute left-0 flex items-center justify-center bg-transparent outline-none"
        >
          {React.createElement(category.icon, { width: "100%", height: "100%" })}
        </button>
        <span
          style={{ top: `calc(${ROW_Y}vh + ${ICON_CAT_ACTIVE / 2}px + 9px)`, left: 0, transform: "translateX(-50%)" }}
          className="absolute whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.08em]"
        >
          {category.label}
        </span>

        {selectedItem && (
          <>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => handleItemClick(itemIndex)}
              style={{ top: `${SELECT_Y}vh`, left: 0, width: ICON_ITEM_SELECTED, height: ICON_ITEM_SELECTED, transform: "translate(-50%, -50%)" }}
              className="absolute flex items-center justify-center bg-transparent outline-none"
            >
              {React.createElement(selectedItem.icon, { width: "100%", height: "100%" })}
            </button>
            <span
              style={{ top: `${SELECT_Y}vh`, left: `${LABEL_OFFSET}vw`, transform: "translateY(-50%)", fontSize: 21, fontWeight: 700 }}
              className="absolute whitespace-nowrap"
            >
              {selectedItem.label}
            </span>
          </>
        )}
      </motion.div>

      {/* Content panel — z-index 4. spec §4.2: left 32vw, right 90vw (=58vw wide), heading
          near SELECT_Y. Up/Down scrolls this internally while OPEN (spec §4.4). */}
      <AnimatePresence>
        {isOpen && selectedItem && (
          <motion.div
            key={`${category.id}:${selectedItem.id}`}
            ref={panelRef}
            className="absolute z-40 overflow-y-auto"
            style={{ left: "32vw", width: "58vw", top: `${SELECT_Y}vh`, bottom: "4vh" }}
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : 0.1 }}
          >
            <PanelBody item={selectedItem} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PanelBody({ item }: { item: Item }) {
  if (item.kind === "external") {
    return <ExternalLinkPanel label={item.label} url={item.url} avatarText={item.avatarText} />;
  }
  const Panel = item.Panel;
  return <Panel />;
}
