"use client";

import * as React from "react";
import { MENU, type MenuCategory, type MenuItem } from "@/content";
import { readStateFromUrl, writeStateToUrl, type XmbState } from "./url-sync";

export interface UseXmbStateResult {
  categoryIndex: number;
  itemIndex: number;
  isOpen: boolean;
  category: MenuCategory;
  items: MenuItem[];
  setIsOpen: (open: boolean) => void;
  goCategory: (next: number) => void;
  moveItem: (delta: number) => void;
  openSelected: () => void;
  handleCategoryClick: (i: number) => void;
  handleItemClick: (i: number) => void;
}

/** Owns categoryIndex/itemIndex/isOpen, keeps them in sync with the URL (initial read,
 * write-on-change, popstate), and exposes the actions that mutate them. */
export function useXmbState(): UseXmbStateResult {
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

  const category = MENU[categoryIndex];
  const items = category.items;

  const goCategory = React.useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(MENU.length - 1, next));
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

  return {
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
  };
}
