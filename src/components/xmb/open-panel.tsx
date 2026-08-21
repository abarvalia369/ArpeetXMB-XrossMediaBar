"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MenuCategory, MenuItem } from "@/content";
import { MISC } from "@/content";
import { ICONS } from "@/src/lib/registry";
import { AXIS_X, ICON_CAT_ACTIVE, ICON_ITEM_SELECTED, LABEL_OFFSET, OPEN_AXIS_X, ROW_Y, SELECT_Y, type SpringConfig } from "@/src/lib/xmb-layout";
import { PanelBody } from "./panel-body";

interface OpenPanelProps {
  category: MenuCategory;
  categoryIndex: number;
  itemIndex: number;
  selectedItem: MenuItem | undefined;
  isOpen: boolean;
  reduced: boolean;
  spring: SpringConfig;
  panelRef: React.RefObject<HTMLDivElement>;
  onCategoryClick: (i: number) => void;
  onItemClick: (i: number) => void;
}

/** spec §4.2 — the OPEN-state survivor layer (z-index 3: active category icon +
 * selected item icon, moved independently to OPEN_AXIS_X) plus the content panel
 * itself (z-index 4). Invisible + non-interactive while BROWSE. */
export function OpenPanel({
  category,
  categoryIndex,
  itemIndex,
  selectedItem,
  isOpen,
  reduced,
  spring,
  panelRef,
  onCategoryClick,
  onItemClick,
}: OpenPanelProps) {
  const survivorAxisX = isOpen ? OPEN_AXIS_X : AXIS_X;
  const CategoryIcon = ICONS[category.iconKey];
  const SelectedIcon = selectedItem ? ICONS[selectedItem.iconKey] : null;
  // Video panels are tall (esp. vertical Shorts) — anchoring them at SELECT_Y like text
  // panels crops the bottom off-screen. Center them in the full viewport height instead
  // so the whole video always fits in frame; text panels keep the SELECT_Y anchor + scroll.
  const isVideoPanel = !!selectedItem && selectedItem.kind === "content" && selectedItem.panelKey === "film";

  return (
    <>
      <motion.div
        className="absolute left-0 top-0 z-30 h-full"
        animate={{ x: `${survivorAxisX}vw`, opacity: isOpen ? 1 : 0 }}
        transition={spring}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label={MISC.closeCategoryAriaLabel(category.label)}
          onClick={() => onCategoryClick(categoryIndex)}
          style={{ top: `${ROW_Y}vh`, width: ICON_CAT_ACTIVE, height: ICON_CAT_ACTIVE, transform: "translate(-50%, -50%)" }}
          className="absolute left-0 flex items-center justify-center bg-transparent outline-none"
        >
          <CategoryIcon width="100%" height="100%" />
        </button>
        <span
          style={{ top: `calc(${ROW_Y}vh + ${ICON_CAT_ACTIVE / 2}px + 9px)`, left: 0, transform: "translateX(-50%)" }}
          className="absolute whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.08em]"
        >
          {category.label}
        </span>

        {selectedItem && SelectedIcon && (
          <>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => onItemClick(itemIndex)}
              style={{ top: `${SELECT_Y}vh`, left: 0, width: ICON_ITEM_SELECTED, height: ICON_ITEM_SELECTED, transform: "translate(-50%, -50%)" }}
              className="absolute flex items-center justify-center bg-transparent outline-none"
            >
              <SelectedIcon width="100%" height="100%" />
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

      {/* Content panel — spec §4.2: left 32vw, right 90vw (=58vw wide). Text panels anchor
          near SELECT_Y and scroll internally (spec §4.4); video panels center vertically
          in the full viewport instead so the whole video fits in frame. */}
      <AnimatePresence>
        {isOpen && selectedItem && (
          <motion.div
            key={`${category.id}:${selectedItem.id}`}
            ref={panelRef}
            className={`absolute z-40 overflow-y-auto ${isVideoPanel ? "flex flex-col justify-center" : ""}`}
            style={
              isVideoPanel
                ? { left: "32vw", width: "58vw", top: 0, bottom: 0 }
                : { left: "32vw", width: "58vw", top: `${SELECT_Y}vh`, bottom: "4vh" }
            }
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : 0.1 }}
          >
            <PanelBody item={selectedItem} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
