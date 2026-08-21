"use client";

import { motion } from "framer-motion";
import type { MenuItem } from "@/content";
import { ICONS } from "@/src/lib/registry";
import { AXIS_X, ICON_ITEM_SELECTED, ICON_ITEM_UNSELECTED, LABEL_OFFSET, itemY, type SpringConfig } from "@/src/lib/xmb-layout";

interface ItemColumnProps {
  items: MenuItem[];
  itemIndex: number;
  isOpen: boolean;
  spring: SpringConfig;
  onItemClick: (i: number) => void;
}

/** spec §3 — the vertical column, z-index 2, ABOVE the row, so an item travelling
 * through the row's vertical band during BROWSE up/down draws in front of the row
 * icons (spec §3.2). x is fixed at AXIS_X always; y always comes from itemY(). */
export function ItemColumn({ items, itemIndex, isOpen, spring, onItemClick }: ItemColumnProps) {
  const s = itemIndex;
  return (
    <div className="absolute top-0 z-20 h-full" style={{ left: `${AXIS_X}vw` }}>
      {items.map((item, i) => {
        const selected = i === itemIndex;
        const y = itemY(i, s);
        const Icon = ICONS[item.iconKey];
        return (
          <motion.div
            key={item.id}
            className="absolute left-0"
            // `top` is a layout property, not a transform — without a matching `initial`,
            // Framer Motion defaults a fresh mount's starting value to 0 (the very top of
            // the container), so on every category switch (new key -> new mount) the item
            // would visibly slide down from the top of the screen. `initial={false}` makes
            // it appear immediately at its correct itemY() position instead.
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
              onClick={() => onItemClick(i)}
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
  );
}
