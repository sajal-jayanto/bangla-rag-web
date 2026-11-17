import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

// Circular with api/client (which reads the token); safe because both only use each
// other inside functions, never at module load.
import { authApi } from "../api/endpoints";
import type { PublicUser } from "../api/types";

export type AuthStatus = "idle" | "loading" | "authed" | "guest";

interface AuthState {
  token: string | null;
  user: PublicUser | null;
  status: AuthStatus;
  /** Set when the session ended because the token expired (shown on the login page). */
  expired: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loadMe: () => Promise<void>;
  logout: (opts?: { expired?: boolean }) => void;
}

/** localStorage that never throws (private windows, blocked site data). */
const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      /* ignore */
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

const resetListeners = new Set<() => void>();
/** Other stores register here so logout clears their data. */
export const onLogout = (fn: () => void) => {
  resetListeners.add(fn);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      status: "idle",
      expired: false,

      login: async (email, password) => {
        const { user, token } = await authApi.login({ email, password });
        set({ token, user, status: "authed", expired: false });
      },

      register: async (name, email, password) => {
        const { user, token } = await authApi.register({ name, email, password });
        set({ token, user, status: "authed", expired: false });
      },

      loadMe: async () => {
        if (!get().token) {
          set({ status: "guest", user: null });
          return;
        }
        set({ status: "loading" });
        try {
          const user = await authApi.me();
          set({ user, status: "authed" });
        } catch {
          // A 401 already triggered logout via the interceptor; other errors also mean
          // we can't trust the session.
          if (get().status === "loading") get().logout();
        }
      },

      logout: (opts) => {
        set({ token: null, user: null, status: "guest", expired: Boolean(opts?.expired) });
        resetListeners.forEach((fn) => fn());
      },
    }),
    {
      name: "bangla-rag-auth",
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ token: s.token }),
    },
  ),
);
