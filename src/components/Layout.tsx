import React, { ReactNode, useEffect, useState } from "react";
import SettingsPanel from "./SettingsPanel";
import SettingsToggle from "./SettingsToggle";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const cls = "settings-open";
    if (settingsOpen) {
      document.body.classList.add(cls);
    } else {
      document.body.classList.remove(cls);
    }
    return () => {
      document.body.classList.remove(cls);
    };
  }, [settingsOpen]);

  return (
    <>
      {/* Main app content */}
      <main>{children}</main>

      {/* Settings panel (owned by Layout) */}
      <SettingsPanel isOpen={settingsOpen} setIsOpen={setSettingsOpen} />


      {/* Top-left settings toggle (hidden while panel is open) */}
      <SettingsToggle onOpen={() => setSettingsOpen(true)} isOpen={settingsOpen} />
    </>
  );
}