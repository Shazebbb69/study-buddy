import { useEffect } from "react";

interface KeyboardShortcutsConfig {
  onSpace: () => void;
  onReset: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onSpace,
  onReset,
  enabled = true,
}: KeyboardShortcutsConfig) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        onSpace();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        onReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSpace, onReset, enabled]);
};
