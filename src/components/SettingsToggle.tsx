// src/components/SettingsToggle.tsx
import React from "react";

interface SettingsToggleProps {
  onOpen: () => void;
  isOpen?: boolean;
  ariaLabel?: string;
}

/**
 * Purple hamburger toggle — simple, self-contained, no external icons.
 * Hidden while the panel is open.
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
      style={{
        position: "fixed",
        left: 16,
        top: 16,
        zIndex: 9999,
        width: 48,
        height: 48,
        borderRadius: 12,
        background: "#7c3aed",
        color: "#fff",
        border: "none",
        display: isOpen ? "none" : "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 6px 18px rgba(99,102,241,0.12)",
      }}
    >
      <span className="sr-only">{ariaLabel}</span>

      {/* Hamburger icon */}
      <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden>
        <rect width="20" height="2" y="0" rx="1" fill="white" />
        <rect width="20" height="2" y="6" rx="1" fill="white" />
        <rect width="20" height="2" y="12" rx="1" fill="white" />
      </svg>
    </button>
  );
}