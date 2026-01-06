import { useState, useEffect } from "react";
import { getPreferences, setDarkMode } from "../utils/preferences";

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => getPreferences().darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    setDarkMode(newValue);
  };

  return { isDark, toggleTheme };
};
