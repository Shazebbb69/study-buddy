import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getPreferences,
  toggleSound,
  toggleNotifications,
  toggleDarkMode,
  setDailyGoalMinutes,
  UserPreferences,
} from "../utils/preferences";
import { getUser, isLoggedIn, onAuthStateChange, logout } from "../utils/auth";

/* =======================
   PROPS
======================= */
interface SettingsPanelProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSoundChange: React.Dispatch<React.SetStateAction<boolean>>;
  onNotificationChange: React.Dispatch<React.SetStateAction<boolean>>;
}

/* =======================
   ICON
======================= */
function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =======================
   COMPONENT
======================= */
export default function SettingsPanel({
  isOpen,
  setIsOpen,
  onSoundChange,
  onNotificationChange,
}: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState<UserPreferences>(() => getPreferences());
  const [loggedIn, setLoggedIn] = useState<boolean>(() => isLoggedIn());
  const [userEmail, setUserEmail] = useState<string | null>(null);

  /* =======================
     AUTH
  ======================= */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const user = await getUser();
      if (!mounted) return;
      setLoggedIn(Boolean(user));
      setUserEmail(user?.email ?? null);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChange((session) => {
      setLoggedIn(Boolean(session));
      setUserEmail(session?.user?.email ?? null);
    });
    return () => unsub();
  }, []);

  /* =======================
     PREFERENCES SYNC
  ======================= */
  useEffect(() => {
    const onPrefs = (e?: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail) setPrefs((p) => ({ ...p, ...detail }));
      else setPrefs(getPreferences());
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === "studybuddy_preferences") onPrefs();
    };

    window.addEventListener("preferencesChanged", onPrefs as EventListener);
    window.addEventListener("storage", onStorage);
    onPrefs();

    return () => {
      window.removeEventListener("preferencesChanged", onPrefs as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  /* =======================
     FOCUS TRAP + ESC
  ======================= */
  useEffect(() => {
    if (!isOpen) return;

    const prevActive = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      prevActive?.focus();
    };
  }, [isOpen, setIsOpen]);

  const handleClose = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    setUserEmail(null);
    setIsOpen(false);
    navigate("/login");
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex justify-center ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        ref={panelRef}
        className="relative w-full sm:max-w-md mx-4 mt-16 bg-card rounded-2xl border border-border shadow"
      >
        <div className="flex justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button ref={closeButtonRef} onClick={handleClose}>
            <IconX />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* NAV */}
          <nav className="space-y-2">
            {["/", "/study", "/stats"].map((path) => (
              <Link
                key={path}
                to={path}
                onClick={handleClose}
                className={`block p-3 rounded-lg ${
                  location.pathname === path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {path === "/" ? "Home" : path.slice(1)}
              </Link>
            ))}
          </nav>

          <hr />

          {/* AUTH */}
          {loggedIn ? (
            <>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-destructive text-white rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}

          <hr />

          {/* SOUND */}
          <div className="flex justify-between items-center">
            <span>Sound</span>
            <button
              onClick={() => {
                toggleSound();
                onSoundChange((prev) => !prev);
              }}
              className={`w-11 h-6 rounded-full ${
                prefs.soundEnabled ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>

          {/* NOTIFICATIONS */}
          <div className="flex justify-between items-center">
            <span>Notifications</span>
            <button
              onClick={() => {
                toggleNotifications();
                onNotificationChange((prev) => !prev);
              }}
              className={`w-11 h-6 rounded-full ${
                prefs.notificationsEnabled ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>

          {/* DARK MODE */}
          <div className="flex justify-between items-center">
            <span>Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full ${
                prefs.darkMode ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>

          {/* DAILY GOAL */}
          <div className="flex justify-between items-center">
            <span>Daily Goal</span>
            <input
              type="number"
              min={1}
              value={prefs.dailyGoalMinutes}
              onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
              className="w-20 border rounded px-2"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
