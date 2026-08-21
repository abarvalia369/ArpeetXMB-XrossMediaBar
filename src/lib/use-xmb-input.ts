"use client";

import * as React from "react";
import { CATEGORY_PITCH, DRAG_MIN_PX, PITCH, WHEEL_COOLDOWN, WHEEL_THRESHOLD } from "./xmb-layout";

interface UseXmbInputArgs {
  rootRef: React.RefObject<HTMLDivElement>;
  categoryIndex: number;
  isOpen: boolean;
  goCategory: (next: number) => void;
  moveItem: (delta: number) => void;
  openSelected: () => void;
  scrollPanel: (delta: number) => void;
  closeOpen: () => void;
}

export interface UseXmbInputResult {
  onKeyDown: (e: React.KeyboardEvent) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}

/** Keyboard, wheel, and drag input (spec §7, §4.4) — all disabled while OPEN except
 * scroll/close, which target the panel instead of the row/column. */
export function useXmbInput({
  rootRef,
  categoryIndex,
  isOpen,
  goCategory,
  moveItem,
  openSelected,
  scrollPanel,
  closeOpen,
}: UseXmbInputArgs): UseXmbInputResult {
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (isOpen) closeOpen();
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
          if (isOpen) closeOpen();
          break;
      }
    },
    [categoryIndex, isOpen, goCategory, moveItem, scrollPanel, openSelected, closeOpen]
  );

  // Wheel: one step per gesture, 250ms debounce. Disabled while OPEN — the panel
  // just gets native scroll instead.
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
  }, [isOpen, categoryIndex, goCategory, moveItem, rootRef]);

  // Drag: horizontal → category, vertical → item, snap on release. Disabled while OPEN.
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

  return { onKeyDown, onPointerDown, onPointerUp };
}
