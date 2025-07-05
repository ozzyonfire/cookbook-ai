"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { setThemeFn } from "../theme/functions";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    // Update the document class
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);

      // Update the cookie via server action
      setThemeFn(newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Initialize theme from document class on mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      const isDark = root.classList.contains("dark");
      const isLight = root.classList.contains("light");

      if (isDark) {
        setThemeState("dark");
      } else if (isLight) {
        setThemeState("light");
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
