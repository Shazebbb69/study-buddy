export interface UserPreferences {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  dailyGoalMinutes: number;
}

const PREFERENCES_KEY = "studybuddy_preferences";

export const defaultPreferences: UserPreferences = {
  soundEnabled: true,
  notificationsEnabled: false,
  darkMode: false,
  dailyGoalMinutes: 60,
};

/**
 * Read preferences from localStorage and merge with defaults.
 */
export const getPreferences = (): UserPreferences => {
  try {
    const data = localStorage.getItem(PREFERENCES_KEY);
    if (!data) return { ...defaultPreferences };
    const parsed = JSON.parse(data);
    return { ...defaultPreferences, ...parsed };
  } catch {
    return { ...defaultPreferences };
  }
};

/**
 * Save preferences to localStorage.
 * Accepts a full or partial preferences object.
 * Dispatches a global event so other parts of the app can react immediately.
 */
export const savePreferences = (prefs: Partial<UserPreferences> | UserPreferences): void => {
  try {
    const current = getPreferences();
    const next: UserPreferences = { ...current, ...prefs };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));

    // Notify other windows/tabs via storage (already happens) and notify same-window listeners
    // Custom event for same-window updates
    try {
      window.dispatchEvent(new CustomEvent("preferencesChanged", { detail: next }));
    } catch {
      // ignore if dispatch fails
    }
  } catch {
    // ignore storage errors
  }
};

/** Convenience setters and toggles */

export const setSoundEnabled = (enabled: boolean): void => {
  savePreferences({ soundEnabled: enabled });
};

export const setNotificationsEnabled = (enabled: boolean): void => {
  savePreferences({ notificationsEnabled: enabled });
};

export const setDarkMode = (enabled: boolean): void => {
  savePreferences({ darkMode: enabled });
};

export const setDailyGoalMinutes = (minutes: number): void => {
  const safe = Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : defaultPreferences.dailyGoalMinutes;
  savePreferences({ dailyGoalMinutes: safe });
};

export const toggleSound = (): void => {
  const { soundEnabled } = getPreferences();
  setSoundEnabled(!soundEnabled);
};

export const toggleNotifications = (): void => {
  const { notificationsEnabled } = getPreferences();
  setNotificationsEnabled(!notificationsEnabled);
};

export const toggleDarkMode = (): void => {
  const { darkMode } = getPreferences();
  setDarkMode(!darkMode);
};

export const resetPreferences = (): void => {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(defaultPreferences));
    try {
      window.dispatchEvent(new CustomEvent("preferencesChanged", { detail: defaultPreferences }));
    } catch {}
  } catch {
    // ignore
  }
};