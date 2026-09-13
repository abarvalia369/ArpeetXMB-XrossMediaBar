import { INFO_PANEL } from "@/content";
import { Avatar } from "./avatar";
import { NotificationBell } from "./notification-bell";
import { Clock } from "./clock";
import { ThemeSelectorStub } from "./theme-selector-stub";

/** Fixed top-right status bar, styled after the PS3 XMB's status pill:
 * compact, rounded, subtle/translucent, small monochrome icons in a row.
 * Sits above both the wave background and the XMB menu (z-50 — higher than
 * any layer inside XmbMenu, which tops out at z-40 for its content panel)
 * and is a sibling of XmbMenu, not nested inside it, so its own keyboard
 * handling (Escape/outside-click on the dropdowns) never competes with the
 * menu's root keydown handler. */
export function InfoPanel() {
  return (
    <div
      role="group"
      aria-label={INFO_PANEL.panelAriaLabel}
      className="fixed right-3 top-3 z-50 inline-flex items-center gap-2.5 rounded-full border border-border bg-background/40 px-2.5 py-1.5 shadow-lg backdrop-blur-md sm:right-4 sm:top-4 sm:gap-3.5 sm:px-3.5 sm:py-2"
    >
      <Avatar />
      <NotificationBell />
      <Clock />
      <ThemeSelectorStub />
    </div>
  );
}
