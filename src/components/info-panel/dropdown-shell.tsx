"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface DropdownShellProps {
  open: boolean;
  panelRef: React.RefObject<HTMLDivElement>;
  id: string;
  children: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

/** Shared visual chrome for the info panel's dropdowns (notifications,
 * theme selector) — positioned relative to whatever trigger button wraps
 * it, so both dropdowns look and animate identically. Purely presentational:
 * open/close logic lives in useDropdown, semantics (role, aria-*) are set
 * by each caller on `children`. */
export function DropdownShell({ open, panelRef, id, children, onKeyDown }: DropdownShellProps) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          ref={panelRef}
          onKeyDown={onKeyDown}
          initial={reduced ? false : { opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: reduced ? 0 : 0.16 }}
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-xl border border-border bg-muted/95 shadow-lg backdrop-blur-md"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
