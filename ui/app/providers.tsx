"use client";

import { ReactNode, useEffect } from "react";
import { useSessionStore } from "@/stores/session-store";
import { useThemeStore } from "@/stores/theme-store";

export default function Providers({ children }: { children: ReactNode }) {
  const hydrateSession = useSessionStore((state) => state.hydrate);
  const theme = useThemeStore((state) => state.theme);
  const hydrateTheme = useThemeStore((state) => state.hydrate);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
