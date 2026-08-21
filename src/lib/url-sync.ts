import { MENU } from "@/content";

export interface XmbState {
  categoryIndex: number;
  itemIndex: number;
  isOpen: boolean;
}

export function readStateFromUrl(): XmbState {
  if (typeof window === "undefined") return { categoryIndex: 0, itemIndex: 0, isOpen: false };
  const params = new URLSearchParams(window.location.search);
  const found = MENU.findIndex((cat) => cat.id === params.get("c"));
  const categoryIndex = found === -1 ? 0 : found;
  const items = MENU[categoryIndex].items;
  const idx = items.findIndex((it) => it.id === params.get("i"));
  const itemIndex = idx === -1 ? 0 : idx;
  return { categoryIndex, itemIndex, isOpen: params.get("o") === "1" };
}

export function writeStateToUrl(state: XmbState, push: boolean): void {
  const cat = MENU[state.categoryIndex];
  const item = cat.items[state.itemIndex];
  const params = new URLSearchParams();
  params.set("c", cat.id);
  params.set("i", item.id);
  if (state.isOpen) params.set("o", "1");
  const url = `${window.location.pathname}?${params.toString()}`;
  if (push) window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}
