// ---- Fixed screen anchors (spec §1), derived frame-by-frame from the PS3 XMB ----
export const ROW_Y = 25.3; // vh — category row centerline
export const SELECT_Y = 45.4; // vh — selected column item centerline
export const AXIS_X = 29.5; // vw — column axis, BROWSE
export const OPEN_AXIS_X = 15; // vw — column axis, OPEN
export const CATEGORY_PITCH = 10.47; // vw — spacing between category icons
export const PITCH = 7.5; // vh — spacing between non-selected column items
export const SEL_GAP = 16.25; // vh — selected item to its immediate neighbour
export const ABOVE_GAP = 15.56; // vh — row centerline to first item above it
export const LABEL_OFFSET = 6; // vw — column label left edge, relative to the axis

export const ICON_CAT = 46;
export const ICON_CAT_ACTIVE = 64;
export const ICON_ITEM_SELECTED = 72;
export const ICON_ITEM_UNSELECTED = 30;

export const EASE = [0.22, 0.61, 0.36, 1] as const;
export const DURATION = 0.3;
export const WHEEL_COOLDOWN = 250;
export const WHEEL_THRESHOLD = 24;
export const DRAG_MIN_PX = 12;
export const PANEL_SCROLL_STEP = 120;

export interface SpringConfig {
  duration: number;
  ease?: readonly number[];
}

/** spec §3.1 — the ONLY column layout function. Piecewise, with a hole where the
 * row sits. Used identically in BROWSE and OPEN — only opacity/x differ between them. */
export function itemY(i: number, s: number): number {
  if (i === s) return SELECT_Y;
  if (i > s) return SELECT_Y + SEL_GAP + (i - s - 1) * PITCH;
  const k = s - i;
  return ROW_Y - ABOVE_GAP - (k - 1) * PITCH;
}
