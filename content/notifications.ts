import type { NotificationEntry } from "./types";

// Placeholder entries — replace with your own. Order here doesn't matter;
// the notification panel always sorts newest-first by timestamp. The
// unread badge count is derived from how many entries have read: false.
export const NOTIFICATIONS: NotificationEntry[] = [
  {
    id: "n1",
    title: "Welcome",
    message: "This is a placeholder notification — replace these in content/notifications.ts.",
    timestamp: "2026-09-01T16:05:00.000Z",
    read: false,
  },
  {
    id: "n2",
    title: "Guestbook",
    message: "Example of an older entry, shown further down the list.",
    timestamp: "2026-08-31T09:20:00.000Z",
    read: false,
  },
  {
    id: "n3",
    title: "Setup",
    message: "Example of a read entry — shown dimmed, doesn't count toward the badge.",
    timestamp: "2026-08-28T12:00:00.000Z",
    read: true,
  },
];
