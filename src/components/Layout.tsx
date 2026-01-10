import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SettingsPanel from "./SettingsPanel";
import SettingsToggle from "./SettingsToggle";

/* ✅ Layout ONLY accepts children */
type LayoutProps = {
  children: ReactNode;
};

export default function Layout(props: LayoutProps) {
  const { children } = props;

  const [settingsOpen, setSettingsOpen] = useState(false);

  // REQUIRED because SettingsPanel (option 2) needs these
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(true);

  const location = useLocation();

  /* ✅ Close settings on route change */
  useEffect(() => {
    setSettingsOpen(false);
  }, [location.pathname]);

  /* ✅ Body class handling (your original logic) */
  useEffect(() => {
    const cls = "settings-open";
    if (settingsOpen) document.body.classList.add(cls);
    else document.body.classList.remove(cls);

    return () => {
      document.body.classList.remove(cls);
    };
  }, [settingsOpen]);

  return (
    <>
      {/* PAGE CONTENT */}
      <main>{children}</main>

      {/* SETTINGS PANEL */}
      {settingsOpen && (
        <SettingsPanel
          isOpen={settingsOpen}
          setIsOpen={setSettingsOpen}
          onSoundChange={setSoundEnabled}
          onNotificationChange={setNotificationsEnabled}
        />
      )}

      {/* SETTINGS TOGGLE */}
      <SettingsToggle
        isOpen={settingsOpen}
        onOpen={() => setSettingsOpen(true)}
      />
    </>
  );
}
