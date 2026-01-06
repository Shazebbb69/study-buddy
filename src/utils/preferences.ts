export interface UserPreferences {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  darkMode: boolean;
  dailyGoalMinutes: number;
}

const PREFERENCES_KEY = "studybuddy_preferences";

const defaultPreferences: UserPreferences = {
  soundEnabled: true,
  notificationsEnabled: false,
  darkMode: false,
  dailyGoalMinutes: 60,
};

export const getPreferences = (): UserPreferences => {
  const data = localStorage.getItem(PREFERENCES_KEY);
  if (!data) return defaultPreferences;
  try {
    const parsed = JSON.parse(data);
    return { ...defaultPreferences, ...parsed };
  } catch {
    return defaultPreferences;
  }
};

export const savePreferences = (prefs: UserPreferences): void => {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
};

export const setSoundEnabled = (enabled: boolean): void => {
  const prefs = getPreferences();
  savePreferences({ ...prefs, soundEnabled: enabled });
};

export const setNotificationsEnabled = (enabled: boolean): void => {
  const prefs = getPreferences();
  savePreferences({ ...prefs, notificationsEnabled: enabled });
};

export const setDarkMode = (enabled: boolean): void => {
  const prefs = getPreferences();
  savePreferences({ ...prefs, darkMode: enabled });
};
