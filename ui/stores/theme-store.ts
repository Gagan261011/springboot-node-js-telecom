import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  ready: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  hydrate: () => void;
}

const STORAGE_KEY = "connectify-theme";

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  ready: false,
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  },
  toggleTheme: () => {
    const current = get().theme;
    get().setTheme(current === "light" ? "dark" : "light");
  },
  hydrate: () => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    set({
      theme: stored === "dark" ? "dark" : "light",
      ready: true
    });
  }
}));
