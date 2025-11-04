"use client";

import { ReactNode, useEffect } from "react";
import { useSessionStore } from "@/stores/session-store";

export default function Providers({ children }: { children: ReactNode }) {
  const hydrate = useSessionStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
