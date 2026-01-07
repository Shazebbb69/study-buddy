// src/components/SettingsToggle.tsx
import React from "react";

interface SettingsToggleProps {
  onOpen: () => void;
  isOpen?: boolean;
  ariaLabel?: string;
}

/**
 * Top-left settings toggle using a clean three-line (hamburger) icon.
 * - Matches the app's rounded card look
 * - Hidden while the panel is open to avoid duplicate controls
 * - Accessible: aria-label and keyboard focus styles included
 */
export default function SettingsToggle({
  onOpen,
  isOpen = false,
  ariaLabel = "Open settings",
}: SettingsToggleProps) {
  return (
    <button
      onClick={onOpen}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`fixed left-4 top-4 z-[60] flex items-center justify-center w-12 h-12 rounded-full
        transition-all duration-150 ease-out transform focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isOpen ? "opacity-0 pointer-events-none scale-95" : "opacity-100 pointer-events-auto scale-100"}`}
      style={{
        background: "rgba(17,24,39,0.6)",
        border: "1px solid rgba(124,58,237,0.12)",
        boxShadow: "0 6px 18px rgba(99,102,241,0.08)",
      }}
    >
      <span className="sr-only">{ariaLabel}</span>

      {/* Hamburger icon: three horizontal lines, crisp and minimal */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="text-purple-500"
      >
        <rect x="3" y="5" width="18" height="2" rx="1" fill="currentColor" />
        <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
        <rect x="3" y="17" width="18" height="2" rx="1" fill="currentColor" />
      </svg>
    </button>
  );
}