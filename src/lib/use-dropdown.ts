"use client";

import * as React from "react";

export interface UseDropdownResult {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  panelRef: React.RefObject<HTMLDivElement>;
}

/** Shared open/close behavior for the info panel's two dropdowns
 * (notifications, theme selector): closes on Escape, closes on click
 * outside, and returns focus to the trigger button on close. */
export function useDropdown(): UseDropdownResult {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => {
    setIsOpen((wasOpen) => {
      if (wasOpen) triggerRef.current?.focus();
      return false;
    });
  }, []);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    }
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close();
    }

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [isOpen, close]);

  return { isOpen, toggle, close, triggerRef, panelRef };
}
