import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, LogIn, UserPlus, LogOut } from "lucide-react";
import { isLoggedIn, logout } from "../utils/auth";
import { getPreferences, savePreferences } from "../utils/preferences";

interface SettingsPanelProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function SettingsPanel({ isOpen, setIsOpen }: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  useEffect(() => {
    const prefs = getPreferences();
    setSoundEnabled(prefs.soundEnabled);
    setNotificationsEnabled(prefs.notificationsEnabled);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const prevActive = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus the close button
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
      if (e.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      prevActive?.focus();
    };
  }, [isOpen, setIsOpen]);

  const handleClose = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const loggedIn = typeof isLoggedIn === "function" ? isLoggedIn() : false;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    savePreferences({ soundEnabled: next });
  };

  const toggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    savePreferences({ notificationsEnabled: next });
  };

  return (
    <div
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-start sm:items-center justify-center transition-opacity ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        className={`relative w-full sm:max-w-md mx-4 mt-16 sm:mt-0 bg-card rounded-2xl shadow-card border border-border transform transition-all ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ maxHeight: "88vh", overflow: "auto" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label="Close settings"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <nav aria-label="Primary" className="space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === "/" ? "page" : undefined}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                location.pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>

            <Link
              to="/study"
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === "/study" ? "page" : undefined}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                location.pathname === "/study" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Study
            </Link>

            <Link
              to="/stats"
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === "/stats" ? "page" : undefined}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                location.pathname === "/stats" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Stats
            </Link>
          </nav>

          <hr className="border-border" />

          <div className="space-y-2">
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-destructive text-destructive-foreground hover:opacity-95"
                aria-label="Logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-95"
                >
                  <LogIn size={16} />
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted/5"
                >
                  <UserPlus size={16} />
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <hr className="border-border" />

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Preferences</p>

            {/* Sound toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/5">
              <div>
                <p className="text-sm text-foreground">Sound</p>
                <p className="text-xs text-muted-foreground">Play sounds for session events</p>
              </div>

              <button
                onClick={toggleSound}
                role="switch"
                aria-checked={soundEnabled}
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                  soundEnabled ? "bg-primary" : "bg-muted/30"
                }`}
                aria-label={`Sound ${soundEnabled ? "on" : "off"}`}
              >
                <span
                  className={`transform transition-transform inline-block w-4 h-4 bg-white rounded-full shadow ${
                    soundEnabled ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Notifications toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/5">
              <div>
                <p className="text-sm text-foreground">Notifications</p>
                <p className="text-xs text-muted-foreground">Browser notifications for session events</p>
              </div>

              <button
                onClick={toggleNotifications}
                role="switch"
                aria-checked={notificationsEnabled}
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                  notificationsEnabled ? "bg-primary" : "bg-muted/30"
                }`}
                aria-label={`Notifications ${notificationsEnabled ? "on" : "off"}`}
              >
                <span
                  className={`transform transition-transform inline-block w-4 h-4 bg-white rounded-full shadow ${
                    notificationsEnabled ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}