"use client";

import { INFO_PANEL } from "@/content";
import { PaletteIcon } from "@/src/components/icons/ps3-icons";
import { useDropdown } from "@/src/lib/use-dropdown";
import { DropdownShell } from "./dropdown-shell";

/**
 * Button + dropdown shell only — deliberately not wired to anything yet.
 *
 * TODO(theme pass): replace the placeholder text below with the actual
 * theme option list, and give each option an onClick that updates theme
 * state (context/store TBD by that pass) instead of doing nothing. No
 * color-switching or CSS variable logic belongs in this file until then.
 */
export function ThemeSelectorStub() {
  const { isOpen, toggle, triggerRef, panelRef } = useDropdown();

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="theme-dropdown"
        aria-label={INFO_PANEL.themeTriggerAriaLabel}
        className="flex h-6 w-6 items-center justify-center rounded-md text-foreground/80 outline-none transition-opacity hover:opacity-100 hover:text-foreground focus-visible:opacity-100 sm:h-7 sm:w-7"
      >
        <span className="h-[18px] w-[18px] sm:h-5 sm:w-5">
          <PaletteIcon width="100%" height="100%" />
        </span>
      </button>

      <DropdownShell open={isOpen} panelRef={panelRef} id="theme-dropdown">
        <div role="menu" aria-label={INFO_PANEL.themeTriggerAriaLabel} className="px-3.5 py-3">
          <p className="text-sm text-muted-foreground">{INFO_PANEL.themeComingSoon}</p>
        </div>
      </DropdownShell>
    </div>
  );
}
