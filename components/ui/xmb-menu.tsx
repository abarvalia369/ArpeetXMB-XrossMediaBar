"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NAV, type Item } from "@/lib/nav-data";
import { WaveRibbon } from "@/components/wave-ribbon";
import { ExternalLinkPanel } from "@/components/panels/external-link-panel";

// ---- Fixed screen anchors (spec §1), derived frame-by-frame from the PS3 XMB ----
const ROW_Y = 25.3; // vh — category row centerline
const SELECT_Y = 45.4; // vh — selected column item centerline
const AXIS_X = 29.5; // vw — column axis, closed
const OPEN_AXIS_X = 15; // vw — column axis, open
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

// §3.1 — piecewise layout with a hole where the row sits.
function itemY(i: number, s: number) {
  if (i === s) return SELECT_Y;
  if (i > s) return SELECT_Y + SEL_GAP + (i - s - 1) * PITCH;
  const k = s - i;
  return ROW_Y - ABOVE_GAP - (k - 1) * PITCH;
}

// §4.1.3 — the row is gone in the open state, so the hole closes into a plain list.
function itemYOpen(i: number, s: number) {
  if (i === s) return SELECT_Y;
  if (i > s) return SELECT_Y + SEL_GAP + (i - s - 1) * PITCH;
  return SELECT_Y - SEL_GAP - (s - i - 1) * PITCH;
}

interface XmbState {
  categoryIndex: number;
  itemIndex: number | null;
}

function readStateFromUrl(): XmbState {
  if (typeof window === "undefined") return { categoryIndex: 0, itemIndex: null };
  const params = new URLSearchParams(window.location.search);
  const found = NAV.findIndex((cat) => cat.id === params.get("c"));
  const categoryIndex = found === -1 ? 0 : found;
  const iSlug = params.get("i");
  if (!iSlug) return { categoryIndex, itemIndex: null };
  const itemIndex = NAV[categoryIndex].items.findIndex((it) => it.id === iSlug);
  return { categoryIndex, itemIndex: itemIndex === -1 ? null : itemIndex };
}

function writeStateToUrl(state: XmbState, push: boolean) {
  const cat = NAV[state.categoryIndex];
  const item = state.itemIndex !== null ? cat.items[state.itemIndex] : null;
  const params = new URLSearchParams();
  params.set("c", cat.id);
  if (item) params.set("i", item.id);
  const url = `${window.location.pathname}?${params.toString()}`;
  if (push) window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

export function XmbMenu() {
  const reduced = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);

  const [categoryIndex, setCategoryIndex] = React.useState(0);
  const [itemIndex, setItemIndex] = React.useState<number | null>(null);
  const readyRef = React.useRef(false);

  // Initialize from the URL on mount, then focus the root so keyboard nav works immediately.
  React.useEffect(() => {
    const initial = readStateFromUrl();
    setCategoryIndex(initial.categoryIndex);
    setItemIndex(initial.itemIndex);
    readyRef.current = true;
    rootRef.current?.focus();
  }, []);

  // Shallow URL sync (spec §5): replaceState on every change, pushState only on
  // category changes and open/close, so Back stays usable without spamming history.
  const prevStateRef = React.useRef<XmbState>({ categoryIndex: 0, itemIndex: null });
  React.useEffect(() => {
    if (!readyRef.current) return;
    const prev = prevStateRef.current;
    const categoryChanged = prev.categoryIndex !== categoryIndex;
    const openChanged = (prev.itemIndex === null) !== (itemIndex === null);
    writeStateToUrl({ categoryIndex, itemIndex }, categoryChanged || openChanged);
    prevStateRef.current = { categoryIndex, itemIndex };
  }, [categoryIndex, itemIndex]);

  React.useEffect(() => {
    function onPopState() {
      const state = readStateFromUrl();
      setCategoryIndex(state.categoryIndex);
      setItemIndex(state.itemIndex);
      prevStateRef.current = state;
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const category = NAV[categoryIndex];
  const items = category.items;
  const isOpen = itemIndex !== null;
  const s = itemIndex ?? 0;

  const spring = reduced ? { duration: 0 } : { duration: DURATION, ease: EASE };

  const goCategory = React.useCallback((next: number) => {
    setCategoryIndex((cur) => {
      const clamped = Math.max(0, Math.min(NAV.length - 1, next));
      return clamped === cur ? cur : clamped;
    });
    setItemIndex(null);
  }, []);

  const moveItem = React.useCallback(
    (delta: number) => {
      setItemIndex((cur) => {
        if (cur === null) {
          return delta > 0 && items.length > 0 ? 0 : null;
        }
        const next = cur + delta;
        if (next < 0) return null;
        return Math.max(0, Math.min(items.length - 1, next));
      });
    },
    [items.length]
  );

  const openExternal = React.useCallback((item: Item) => {
    if (item.kind === "external") window.open(item.url, "_blank", "noopener,noreferrer");
  }, []);

  const handleItemClick = React.useCallback(
    (i: number) => {
      setItemIndex(i);
      openExternal(items[i]);
    },
    [items, openExternal]
  );

  // ---- Keyboard (spec §7) ----
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (isOpen) setItemIndex(null);
          else goCategory(categoryIndex - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          goCategory(categoryIndex + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          moveItem(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          moveItem(1);
          break;
        case "Enter":
          e.preventDefault();
          if (itemIndex !== null) openExternal(items[itemIndex]);
          break;
        case "Escape":
        case "Backspace":
          e.preventDefault();
          setItemIndex(null);
          break;
      }
    },
    [categoryIndex, isOpen, itemIndex, items, goCategory, moveItem, openExternal]
  );

  // ---- Wheel: one step per gesture, 250ms debounce (spec §7) ----
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let acc = 0;
    let until = 0;
    function onWheel(e: WheelEvent) {
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
  }, [categoryIndex, goCategory, moveItem]);

  // ---- Drag: horizontal → category, vertical → item, snap on release (spec §7) ----
  const dragStart = React.useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = React.useCallback((e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);
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
  const columnAxisX = isOpen ? OPEN_AXIS_X : AXIS_X;
  const activeItem = items[s] as Item | undefined;

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
      <WaveRibbon
        className="pointer-events-none absolute left-0 w-full opacity-90"
        style={{ top: `${ROW_Y}vh`, height: "42vh", transform: "translateY(-50%)" }}
      />

      {/* Category row — z-index 1, hides completely when open (spec §4.1.1) */}
      <motion.div
        className="absolute left-0 z-10 w-full"
        style={{ top: `${ROW_Y}vh` }}
        animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? -60 : 0 }}
        transition={spring}
      >
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
                onClick={() => goCategory(i)}
                style={{ left: `${i * CATEGORY_PITCH}vw` }}
                className="absolute top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center bg-transparent outline-none"
              >
                <motion.span
                  animate={{
                    width: active ? ICON_CAT_ACTIVE : ICON_CAT,
                    height: active ? ICON_CAT_ACTIVE : ICON_CAT,
                    opacity: active ? 1 : 0.55,
                  }}
                  transition={spring}
                  className="flex items-center justify-center"
                  style={active ? { filter: "drop-shadow(0 0 10px rgba(255,255,255,0.55))" } : undefined}
                >
                  <Icon width="100%" height="100%" />
                </motion.span>
                <span
                  className="absolute top-full mt-[9px] whitespace-nowrap text-[11px] uppercase tracking-[0.08em]"
                  style={{ opacity: active ? 1 : 0.5, fontWeight: active ? 700 : 400 }}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Column — z-index 2, ABOVE the row (spec §3.2 "z-order").
          No `mode="wait"`: the outgoing and incoming columns are meant to briefly
          overlap near the axis during a category change (spec §2, step 2). */}
      <AnimatePresence>
        <motion.div
          key={category.id}
          className="absolute top-0 z-20 h-full"
          initial={reduced ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, left: `${columnAxisX}vw` }}
          exit={reduced ? undefined : { opacity: 0, x: 20 }}
          transition={spring}
        >
          {items.map((item, i) => {
            // `s` (defaulted to 0) is only a layout anchor for itemY — visual emphasis
            // must key off the real itemIndex, or item 0 looks selected while closed.
            const selected = isOpen && i === itemIndex;
            const y = isOpen ? itemYOpen(i, s) : itemY(i, s);
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                className="absolute left-0"
                animate={{
                  top: `${y}vh`,
                  scale: selected ? 1 : ICON_ITEM_UNSELECTED / ICON_ITEM_SELECTED,
                  opacity: selected ? 1 : i < s ? 0.45 : 0.6,
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
                  style={{
                    left: `${LABEL_OFFSET}vw`,
                    transform: "translateY(-50%)",
                    fontSize: selected ? 21 : 17,
                    fontWeight: selected ? 700 : 400,
                    textShadow: selected ? "0 0 14px rgba(255,255,255,0.6)" : undefined,
                  }}
                  className="absolute top-0 whitespace-nowrap"
                >
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Content panel — highlight-triggered, right side, no navigation (spec §4).
          Cross-fades (old out, new in, overlapping), not sequential — spec §4.2. */}
      <AnimatePresence>
        {isOpen && activeItem && (
          <motion.div
            key={`${category.id}:${activeItem.id}`}
            className="absolute overflow-y-auto"
            style={{ left: "38vw", right: "12vw", top: "36.8vh", bottom: "4vh" }}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            <PanelBody item={activeItem} />
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
