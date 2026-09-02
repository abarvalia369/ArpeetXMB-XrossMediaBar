"use client";

import * as React from "react";
import { NOTIFICATIONS, INFO_PANEL } from "@/content";
import { BellIcon } from "@/src/components/icons/ps3-icons";
import { formatRelativeTime } from "@/src/lib/relative-time";
import { useDropdown } from "@/src/lib/use-dropdown";
import { DropdownShell } from "./dropdown-shell";

export function NotificationBell() {
  const { isOpen, toggle, close, triggerRef, panelRef } = useDropdown();
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;
  const sorted = React.useMemo(
    () => [...NOTIFICATIONS].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    []
  );

  const onListKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = Array.from(
      (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>("[data-notification-entry]")
    );
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    if (currentIndex === -1) return;
    e.preventDefault();
    const nextIndex = e.key === "ArrowDown" ? Math.min(currentIndex + 1, items.length - 1) : Math.max(currentIndex - 1, 0);
    items[nextIndex]?.focus();
  }, []);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="notifications-dropdown"
        aria-label={INFO_PANEL.notificationsTriggerAriaLabel(unreadCount)}
        className="relative flex h-6 w-6 items-center justify-center rounded-md text-foreground/80 outline-none transition-opacity hover:opacity-100 hover:text-foreground focus-visible:opacity-100 sm:h-7 sm:w-7"
      >
        <span className="h-[18px] w-[18px] sm:h-5 sm:w-5">
          <BellIcon width="100%" height="100%" />
        </span>
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-foreground px-[3px] text-[9px] font-bold leading-none text-background"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <DropdownShell open={isOpen} panelRef={panelRef} id="notifications-dropdown" onKeyDown={onListKeyDown}>
        <div role="menu" aria-label={INFO_PANEL.notificationsHeading} className="max-h-80 overflow-y-auto py-1.5">
          <p className="px-3.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {INFO_PANEL.notificationsHeading}
          </p>
          {sorted.length === 0 ? (
            <p className="px-3.5 py-4 text-sm text-muted-foreground">{INFO_PANEL.notificationsEmpty}</p>
          ) : (
            sorted.map((entry) => (
              <div
                key={entry.id}
                data-notification-entry
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") close();
                }}
                className="border-t border-border/60 px-3.5 py-2.5 text-sm outline-none first:border-t-0 focus-visible:bg-background/60"
              >
                <div className="flex items-center gap-1.5">
                  {!entry.read && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />}
                  <p className={entry.read ? "truncate font-medium text-muted-foreground" : "truncate font-semibold text-foreground"}>
                    {entry.title}
                  </p>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{entry.message}</p>
                <p className="mt-1 text-[11px] text-muted-foreground/70">{formatRelativeTime(entry.timestamp)}</p>
              </div>
            ))
          )}
        </div>
      </DropdownShell>
    </div>
  );
}
