
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
    if (settingsOpen) document.body.classList.add(cls);
    else document.body.classList.remove(cls);
    return () => document.body.classList.remove(cls);
  }, [settingsOpen]);

  return (
    <>
      <main>{children}</main>

      {/* Pass only the props SettingsPanel expects */}
      <SettingsPanel isOpen={settingsOpen} setIsOpen={setSettingsOpen} />

      {/* Keep the toggle to open the panel */}
      <SettingsToggle onOpen={() => setSettingsOpen(true)} isOpen={settingsOpen} />
    </>
  );
}