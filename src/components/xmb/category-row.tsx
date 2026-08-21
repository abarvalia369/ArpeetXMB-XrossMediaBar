"use client";

import { motion } from "framer-motion";
import type { MenuCategory } from "@/content";
import { ICONS } from "@/src/lib/registry";
import { AXIS_X, CATEGORY_PITCH, ICON_CAT, ICON_CAT_ACTIVE, ROW_Y, type SpringConfig } from "@/src/lib/xmb-layout";

interface CategoryRowProps {
  categories: MenuCategory[];
  categoryIndex: number;
  isOpen: boolean;
  spring: SpringConfig;
  onCategoryClick: (i: number) => void;
}

/** spec §2 — the horizontal category row, z-index 1. In BROWSE, fully visible. In
 * OPEN, every icon (active included) fades to 0 — the survivor layer in open-panel.tsx
 * represents the active one instead, so it can move to OPEN_AXIS_X independently. */
export function CategoryRow({ categories, categoryIndex, isOpen, spring, onCategoryClick }: CategoryRowProps) {
  const rowTranslateX = AXIS_X - categoryIndex * CATEGORY_PITCH;
  return (
    <div className="absolute left-0 z-10 w-full" style={{ top: `${ROW_Y}vh` }}>
      <motion.div className="relative h-0" animate={{ x: `${rowTranslateX}vw` }} transition={spring}>
        {categories.map((cat, i) => {
          const active = i === categoryIndex;
          const Icon = ICONS[cat.iconKey];
          return (
            <button
              key={cat.id}
              type="button"
              tabIndex={-1}
              aria-current={active ? "true" : undefined}
              aria-label={cat.label}
              onClick={() => onCategoryClick(i)}
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
  );
}
