
import { createContext, useContext, useEffect, useState } from "react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light", // Changed from "system" to "light"
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light", // Changed from "system" to "light"
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const userPrefs = useUserPreferences();
  const [theme, setTheme] = useState<Theme>(
    () => {
      // First check localStorage
      const localTheme = localStorage.getItem(storageKey) as Theme;
      if (localTheme) return localTheme;
      
      // Then check user preferences
      if (userPrefs.theme) return userPrefs.theme;
      
      // Fall back to default theme (now light)
      return defaultTheme;
    }
  );

  // Sync with UserPreferencesContext
  useEffect(() => {
    if (userPrefs.theme && userPrefs.theme !== theme) {
      // When user preferences change, update the theme
      setTheme(userPrefs.theme);
    }
  }, [userPrefs.theme]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Theme setter that updates both localStorage and user preferences
  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
      
      // Also update the user preferences if it exists
      if (userPrefs.setTheme) {
        userPrefs.setTheme(newTheme);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
