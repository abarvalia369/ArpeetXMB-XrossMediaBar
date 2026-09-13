"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { MENU, MISC, type MenuItem } from "@/content";
import { WavyBackground } from "@/src/components/ui/wavy-background";
import { useXmbState } from "@/src/lib/use-xmb-state";
import { useXmbInput } from "@/src/lib/use-xmb-input";
import { DURATION, EASE, PANEL_SCROLL_STEP } from "@/src/lib/xmb-layout";
import { CategoryRow } from "./category-row";
import { ItemColumn } from "./item-column";
import { OpenPanel } from "./open-panel";

export function XmbMenu() {
  const reduced = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const {
    categoryIndex,
    itemIndex,
    isOpen,
    category,
    items,
    setIsOpen,
    goCategory,
    moveItem,
    openSelected,
    handleCategoryClick,
    handleItemClick,
  } = useXmbState();

  React.useEffect(() => {
    rootRef.current?.focus();
  }, []);

  const scrollPanel = React.useCallback(
    (delta: number) => {
      panelRef.current?.scrollBy({ top: delta * PANEL_SCROLL_STEP, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced]
  );

  const closeOpen = React.useCallback(() => setIsOpen(false), [setIsOpen]);

  const { onKeyDown, onPointerDown, onPointerUp } = useXmbInput({
    rootRef,
    categoryIndex,
    isOpen,
    goCategory,
    moveItem,
    openSelected,
    scrollPanel,
    closeOpen,
  });

  const spring = reduced ? { duration: 0 } : { duration: DURATION, ease: EASE };
  const selectedItem = items[itemIndex] as MenuItem | undefined;

  return (
    <div
      ref={rootRef}
      role="application"
      aria-label={MISC.mainMenuAriaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="fixed inset-0 overflow-hidden bg-background text-foreground outline-none"
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

      <CategoryRow categories={MENU} categoryIndex={categoryIndex} isOpen={isOpen} spring={spring} onCategoryClick={handleCategoryClick} />

      <ItemColumn items={items} itemIndex={itemIndex} isOpen={isOpen} spring={spring} onItemClick={handleItemClick} />

      <OpenPanel
        category={category}
        categoryIndex={categoryIndex}
        itemIndex={itemIndex}
        selectedItem={selectedItem}
        isOpen={isOpen}
        reduced={!!reduced}
        spring={spring}
        panelRef={panelRef}
        onCategoryClick={handleCategoryClick}
        onItemClick={handleItemClick}
      />
    </div>
  );
}
