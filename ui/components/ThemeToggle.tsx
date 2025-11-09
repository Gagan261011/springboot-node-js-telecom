"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="group relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/70 px-3 py-1.5 text-xs font-medium text-ink-700 shadow-glow backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-brand-600 dark:border-white/10 dark:bg-ink-700/70 dark:text-white"
    >
      <div className="relative h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 text-brand-500 transition-all duration-300 ${
            theme === "light" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 text-accent-400 transition-all duration-300 ${
            theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
          }`}
        />
      </div>
      <span className="uppercase tracking-wider text-[10px]">
        {theme === "dark" ? "Dark" : "Light"} Mode
      </span>
    </button>
  );
}
