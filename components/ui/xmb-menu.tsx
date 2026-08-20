"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV, type NavCategory } from "@/lib/nav-data";
import { WaveRibbon } from "@/components/wave-ribbon";

// NAV is imported directly (not passed as a prop) because it embeds icon
// components — functions can't cross the server/client boundary as props,
// which breaks static generation of the (server) page components that render this.
const categories = NAV;

const WHEEL_THRESHOLD = 60;
const WHEEL_COOLDOWN = 420;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function findInitialState(categories: NavCategory[], pathname: string, filmParam: string | null) {
  let categoryIndex = categories.findIndex((c) => c.href === pathname);
  if (categoryIndex === -1) {
    categoryIndex = categories.findIndex((c) => c.subItems.some((s) => pathname.startsWith(c.href) && c.href !== "/"));
  }
  if (categoryIndex === -1) categoryIndex = 0;

  const category = categories[categoryIndex];
  let subIndex = 0;
  let focusLevel: "top" | "sub" = "top";
  if (filmParam) {
    const i = category.subItems.findIndex((s) => s.id === filmParam);
    if (i !== -1) {
      subIndex = i;
      focusLevel = "sub";
    }
  } else {
    const i = category.subItems.findIndex((s) => s.href === pathname || s.href.split("#")[0] === pathname);
    if (i !== -1 && pathname !== "/") {
      subIndex = i;
    }
  }
  return { categoryIndex, subIndex, focusLevel };
}

export function XmbMenu() {
  // useSearchParams() opts this subtree into dynamic rendering and requires a Suspense boundary.
  return (
    <React.Suspense fallback={<div className="h-[var(--xmb-band-h)] w-full bg-black" />}>
      <XmbMenuInner />
    </React.Suspense>
  );
}

function XmbMenuInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();

  const stageRef = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [dragging, setDragging] = React.useState(false);

  const initial = React.useMemo(
    () => findInitialState(categories, pathname, searchParams.get("film")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [categoryIndex, setCategoryIndex] = React.useState(initial.categoryIndex);
  const [subIndex, setSubIndex] = React.useState(initial.subIndex);
  const [focusLevel, setFocusLevel] = React.useState<"top" | "sub">(initial.focusLevel);

  // Deep-linking: re-sync when the route changes from outside the menu (browser back/forward, direct nav).
  // The menu itself lives once in the root layout and never remounts on navigation, so this effect
  // is what keeps it in sync — not a fresh mount picking up initial state each time.
  React.useEffect(() => {
    const next = findInitialState(categories, pathname, searchParams.get("film"));
    setCategoryIndex(next.categoryIndex);
    setSubIndex(next.subIndex);
    setFocusLevel(next.focusLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const read = () => setBox({ w: stage.clientWidth, h: stage.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const category = categories[categoryIndex];
  const subLast = Math.max(0, category.subItems.length - 1);

  // ---- Measured geometry (ratios of the stage box, clamped to sane pixel ranges) ----
  // One consistent band, same on every page — no separate "full-bleed hero" vs "compact bar"
  // treatment, so the menu never visually resizes/relocates when navigating between routes.
  const ICON = clamp(box.h * 0.14, 30, 46);
  const STEP = clamp(box.w * 0.115, 88, 156);
  // Sub-item rows are icon-sized (not a small badge) with a little vertical breathing room.
  const SUB_ROW_H = ICON * 1.25;
  const TITLE_FONT = clamp(box.w * 0.0125, 12, 15);
  const SUB_FONT = clamp(box.w * 0.0145, 13, 17);
  // Matches the reference frames — the icon row sits close to the top of the
  // screen, not vertically centered.
  const ICON_ROW_Y = box.h * 0.24;
  const SUB_ANCHOR_Y = ICON_ROW_Y + ICON * 1.35;
  // The focused top-level icon is always horizontally centered on the stage, so a
  // sub-item icon of the same size, centered on that same axis, always starts here.
  const SUB_ICON_LEFT = box.w / 2 - ICON / 2;
  const SUB_LABEL_LEFT = box.w / 2 + ICON / 2 + 14;

  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 32, mass: 0.9 };

  // ---- Horizontal (category) axis ----
  const xFor = React.useCallback(
    (i: number) => box.w / 2 - (i * STEP + STEP / 2),
    [box.w, STEP]
  );
  const x = useMotionValue(0);
  const xTarget = xFor(categoryIndex);
  // The stage is measured async (ResizeObserver), so box.w jumps from 0 to its real value
  // shortly after mount. If that jump were spring-animated like a real focus change, the
  // spring's carried-over velocity while chasing a target that itself is still moving can
  // overshoot well past the final position. Snap instantly on the first real measurement;
  // only spring for genuine user-driven category changes after that.
  const hasMeasured = React.useRef(false);
  React.useEffect(() => {
    if (dragging) return;
    if (!hasMeasured.current) {
      if (box.w === 0) return;
      hasMeasured.current = true;
      x.set(xTarget);
      return;
    }
    const run = animate(x, xTarget, spring);
    return () => run.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xTarget, dragging, reduced, box.w]);

  // ---- Vertical (sub-item) axis ----
  const y = useMotionValue(0);
  const yTarget = -subIndex * SUB_ROW_H;
  // Same rationale as the horizontal axis above: snap on the first real measurement
  // (matters when deep-linking straight to a non-zero sub-item), spring afterward.
  const yHasMeasured = React.useRef(false);
  React.useEffect(() => {
    if (!yHasMeasured.current) {
      if (box.h === 0) return;
      yHasMeasured.current = true;
      y.set(yTarget);
      return;
    }
    const run = animate(y, yTarget, spring);
    return () => run.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yTarget, reduced, category.id, box.h]);

  // Single click (or arrow-key move) on a top-level icon: shift focus there immediately.
  // This never navigates by itself — it only reveals that category's sub-item list, exactly
  // like moving horizontal focus in the real XMB reveals the list without drilling into it.
  const goCategory = React.useCallback(
    (next: number) => {
      const wrapped = ((next % categories.length) + categories.length) % categories.length;
      setCategoryIndex(wrapped);
      setSubIndex(0);
      setFocusLevel("top");
    },
    [categories.length]
  );

  const goSub = React.useCallback(
    (next: number) => {
      setSubIndex(clamp(next, 0, subLast));
    },
    [subLast]
  );

  const navigate = React.useCallback(
    (href: string, external?: boolean) => {
      if (external) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }
      router.push(href);
    },
    [router]
  );

  // Enter/Space (or clicking an already-focused icon): drill into its sub-item list,
  // or navigate directly if it has no children.
  const commitEnter = React.useCallback(() => {
    if (focusLevel === "top") {
      if (category.subItems.length > 0) {
        setFocusLevel("sub");
        setSubIndex(0);
      } else {
        navigate(category.href);
      }
      return;
    }
    const item = category.subItems[subIndex];
    if (item) navigate(item.href, item.external);
  }, [category, focusLevel, subIndex, navigate]);

  // ---- Keyboard ----
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goCategory(categoryIndex - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          goCategory(categoryIndex + 1);
          break;
        case "ArrowDown":
          if (category.subItems.length === 0) return;
          e.preventDefault();
          if (focusLevel === "top") {
            setFocusLevel("sub");
            setSubIndex(0);
          } else {
            goSub(subIndex + 1);
          }
          break;
        case "ArrowUp":
          if (category.subItems.length === 0) return;
          e.preventDefault();
          if (focusLevel === "sub") {
            if (subIndex === 0) setFocusLevel("top");
            else goSub(subIndex - 1);
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          commitEnter();
          break;
        case "Escape":
          if (focusLevel === "sub") {
            e.preventDefault();
            setFocusLevel("top");
          }
          break;
      }
    },
    [category, categoryIndex, focusLevel, subIndex, goCategory, goSub, commitEnter]
  );

  // ---- Wheel: accumulate-then-commit, one step at a time, chains back to page scroll at the edges ----
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let acc = 0;
    let until = 0;

    const onWheel = (e: WheelEvent) => {
      const horizontalDominant = Math.abs(e.deltaX) > Math.abs(e.deltaY);

      if (horizontalDominant) {
        e.preventDefault();
        const now = e.timeStamp;
        if (now < until) return;
        acc += e.deltaX;
        if (Math.abs(acc) < WHEEL_THRESHOLD) return;
        goCategory(categoryIndex + Math.sign(acc));
        acc = 0;
        until = now + WHEEL_COOLDOWN;
        return;
      }

      // Vertical wheel only steps the sub-item list while it's actively focused;
      // otherwise let the event fall through so the page keeps scrolling normally.
      if (focusLevel !== "sub" || category.subItems.length === 0) return;
      const delta = e.deltaY;
      const atStart = delta < 0 && subIndex === 0;
      const atEnd = delta > 0 && subIndex === subLast;
      if (atStart || atEnd) {
        acc = 0;
        return;
      }
      e.preventDefault();
      const now = e.timeStamp;
      if (now < until) return;
      acc += delta;
      if (Math.abs(acc) < WHEEL_THRESHOLD) return;
      goSub(subIndex + Math.sign(acc));
      acc = 0;
      until = now + WHEEL_COOLDOWN;
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [categoryIndex, focusLevel, subIndex, subLast, category.subItems.length, goCategory, goSub]);

  // ---- Drag-to-scrub horizontally, velocity-aware snap on release ----
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const current = x.get();
    const projected = current + info.velocity.x * 0.12;
    const rawIndex = (box.w / 2 - STEP / 2 - projected) / STEP;
    goCategory(Math.round(rawIndex));
    setDragging(false);
  };

  return (
    <nav
      ref={stageRef}
      role="navigation"
      aria-label="Main menu"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="sticky top-0 z-50 h-[var(--xmb-band-h)] w-full select-none overflow-hidden bg-black outline-none"
    >
      <WaveRibbon className="pointer-events-none absolute left-0 top-1/2 h-[55%] w-full -translate-y-1/2 opacity-90" />

      {/* Icon row */}
      <motion.div
        drag="x"
        dragMomentum={false}
        dragElastic={0.08}
        onDragStart={() => setDragging(true)}
        onDragEnd={onDragEnd}
        style={{ x, top: ICON_ROW_Y }}
        className="absolute left-0 flex cursor-grab items-start active:cursor-grabbing"
      >
        {categories.map((cat, i) => {
          const focused = i === categoryIndex;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              tabIndex={-1}
              aria-current={focused ? "page" : undefined}
              aria-label={cat.label}
              onClick={() => {
                stageRef.current?.focus();
                // A single click always shifts focus immediately, whether or not this
                // icon was already focused. Clicking the already-focused icon additionally
                // drills into its sub-item list (or navigates, for a leaf category).
                if (focused) {
                  commitEnter();
                } else {
                  goCategory(i);
                }
              }}
              style={{ width: STEP }}
              className="flex flex-col items-center gap-2 bg-transparent outline-none"
            >
              <motion.span
                animate={{
                  scale: focused ? 1.55 : 1,
                  opacity: focused ? 1 : 0.42,
                }}
                transition={spring}
                style={{ width: ICON, height: ICON }}
                className="flex items-center justify-center text-white"
              >
                <Icon width="100%" height="100%" />
              </motion.span>
              <span
                style={{ fontSize: TITLE_FONT, minHeight: TITLE_FONT * 1.4 }}
                className={cn(
                  "tracking-wide transition-opacity duration-200",
                  focused ? "font-semibold text-white opacity-100" : "opacity-0"
                )}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Sub-item list — always rendered inline, directly under the focused icon */}
      <AnimatePresence mode="wait">
        {category.subItems.length > 0 && (
          <motion.div
            key={category.id}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            style={{ top: SUB_ANCHOR_Y, left: 0 }}
            className="absolute w-full"
          >
            <motion.ul style={{ y }} transition={spring} className="relative">
              {category.subItems.map((item, i) => {
                const focused = focusLevel === "sub" && i === subIndex;
                return (
                  <motion.li
                    key={item.id}
                    initial={reduced ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: reduced ? 0 : i * 0.02 }}
                    style={{ height: SUB_ROW_H }}
                    className="relative"
                  >
                    {/* Same size as the top-level icon, centered on that same column. */}
                    <span
                      style={{
                        width: ICON,
                        height: ICON,
                        left: SUB_ICON_LEFT,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      className={cn("absolute flex items-center justify-center", focused ? "text-white" : "text-white/40")}
                    >
                      <item.icon width="100%" height="100%" />
                    </span>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => {
                        stageRef.current?.focus();
                        setFocusLevel("sub");
                        setSubIndex(i);
                        navigate(item.href, item.external);
                      }}
                      style={{
                        fontSize: SUB_FONT,
                        left: SUB_LABEL_LEFT,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      className={cn(
                        "absolute whitespace-nowrap bg-transparent text-left tracking-wide outline-none transition-all duration-150",
                        focused
                          ? "font-semibold text-white [text-shadow:0_0_18px_rgba(255,255,255,0.75)]"
                          : "text-white/45 hover:text-white/70"
                      )}
                    >
                      {item.label}
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
