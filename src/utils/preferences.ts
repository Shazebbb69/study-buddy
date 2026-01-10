export interface UserPreferences {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  dailyGoalMinutes: number;
}

export const PREFERENCES_KEY = "studybuddy_preferences";

export const defaultPreferences: UserPreferences = {
  soundEnabled: true,
  notificationsEnabled: false,
  darkMode: false,
  dailyGoalMinutes: 60,
};

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

export const savePreferences = (
  prefs: Partial<UserPreferences> | UserPreferences
): void => {
  try {
    const current = getPreferences();
    const next: UserPreferences = { ...current, ...prefs };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
    try {
      window.dispatchEvent(
        new CustomEvent<UserPreferences>("preferencesChanged", { detail: next })
      );
    } catch {}
  } catch {}
};

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
  const safe =
    Number.isFinite(minutes) && minutes > 0
      ? Math.round(minutes)
      : defaultPreferences.dailyGoalMinutes;
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
      window.dispatchEvent(
        new CustomEvent<UserPreferences>("preferencesChanged", {
          detail: defaultPreferences,
        })
      );
    } catch {}
  } catch {}
};