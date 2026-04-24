import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, getToken, setToken } from "./api";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
};

type LoginResponse = {
  success: boolean;
  data: { token: string; user: AdminUser };
};

type MeResponse = {
  success: boolean;
  data: { user: AdminUser };
};

type AuthContextValue = {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isReady: boolean;
};

const USER_KEY = "paintbrush.admin.user";

const AuthContext = createContext<AuthContextValue | null>(null);

function clearStoredSession() {
  setToken(null);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = getToken();
      if (!token) {
        if (!cancelled) setIsReady(true);
        return;
      }

      try {
        const cachedRaw = localStorage.getItem(USER_KEY);
        if (cachedRaw && !cancelled) {
          setUser(JSON.parse(cachedRaw) as AdminUser);
        }
      } catch {
        // ignore corrupted cache
      }

      try {
        const res = await api<MeResponse>("/admin/auth/me");
        if (cancelled) return;

        if (res.data.user.role !== "admin") {
          clearStoredSession();
          setUser(null);
        } else {
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
          setUser(res.data.user);
        }
      } catch {
        if (!cancelled) {
          clearStoredSession();
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      login: async (email: string, password: string) => {
        const res = await api<LoginResponse>("/admin/auth/login", {
          method: "POST",
          auth: false,
          body: { email, password },
        });

        if (res.data.user.role !== "admin") {
          throw new Error("Admin access required");
        }

        setToken(res.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        setUser(res.data.user);
      },
      logout: () => {
        clearStoredSession();
        setUser(null);
      },
    }),
    [user, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
