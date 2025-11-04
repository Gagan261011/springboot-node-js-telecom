import { create } from "zustand";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { User } from "@/types/user";

interface SessionState {
  user?: User;
  loading: boolean;
  error?: string;
  setUser: (user?: User) => void;
  hydrate: () => Promise<void>;
  clear: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: undefined,
  loading: false,
  error: undefined,
  setUser: (user) => set({ user }),
  clear: () => set({ user: undefined, error: undefined, loading: false }),
  hydrate: async () => {
    set({ loading: true, error: undefined });
    try {
      const response = await apiClient.get<User>("/api/auth/me");
      set({ user: response.data, loading: false });
    } catch (error) {
      const isUnauthorized =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        // @ts-expect-error axios structure
        error.response?.status === 401;
      set({
        user: undefined,
        loading: false,
        error: isUnauthorized ? undefined : getErrorMessage(error)
      });
    }
  }
}));
