import type { InfoPanelContent } from "./types";

export const INFO_PANEL: InfoPanelContent = {
  panelAriaLabel: "Status",
  notificationsTriggerAriaLabel: (unreadCount) =>
    unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications",
  notificationsHeading: "Notifications",
  notificationsEmpty: "No notifications",
  themeTriggerAriaLabel: "Theme",
  themeComingSoon: "Theme options coming soon",
};
