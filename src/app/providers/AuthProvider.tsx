import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGOUT_REDIRECT_PATH, LOGOUT_REDIRECT_DELAY_MS } from "@/shared/constants";
import type { User } from "@/features/auth/types";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (accessToken: string, refreshToken: string, userData: User) => void;
  logout: () => Promise<boolean>;
  isLoggingOut: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "app_user";
const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const SESSION_KEYS = [TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, "welcomeCoupon", "pendingCouponMark", "eyeTestResult"];

function clearAllSessionStorage() {
  SESSION_KEYS.forEach((k) => localStorage.removeItem(k));
  sessionStorage.removeItem("redirectAfterLogin");
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isLoggingOutRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedUser && storedToken) {
      if (isTokenExpired(storedToken)) {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken || isTokenExpired(refreshToken)) {
          // Both expired — clear storage, user browses as guest
          clearAllSessionStorage();
        } else {
          // Refresh token still valid — restore session; interceptor silently refreshes on first API call
          try {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } catch {
            clearAllSessionStorage();
          }
        }
      } else {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch {
          clearAllSessionStorage();
        }
      }
    }

    setIsLoading(false);
  }, []);

  // Fired by axios interceptor when refresh token is also expired/invalid.
  // Only resets auth state — does NOT redirect. User stays on current page
  // and can keep browsing. The login modal opens on the next write action.
  useEffect(() => {
    const handler = () => {
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener("auth:session-expired", handler);
    return () => window.removeEventListener("auth:session-expired", handler);
  }, []);

  const login = useCallback((accessToken: string, refreshToken: string, userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }, []);

  // Explicit logout (user clicks "Sign Out"). Tokens are not tracked
  // server-side, so this is purely client-side: reset auth state and wipe all
  // session storage immediately, then keep the "Logging out..." state visible
  // for LOGOUT_REDIRECT_DELAY_MS before redirecting to the homepage
  // (?login=true opens the login modal there). Resolves `true` once the flow
  // completes, `false` when a repeat click is ignored while in progress.
  // Safe against unmounts: this provider lives at the app root, so all
  // state updates after the delay happen on a mounted component.
  const logout = useCallback(async (): Promise<boolean> => {
    if (isLoggingOutRef.current) return false;
    isLoggingOutRef.current = true;
    setIsLoggingOut(true);
    try {
      setUser(null);
      setIsAuthenticated(false);
      clearAllSessionStorage();
      await new Promise((resolve) => setTimeout(resolve, LOGOUT_REDIRECT_DELAY_MS));
      navigate(LOGOUT_REDIRECT_PATH, { replace: true });
      return true;
    } finally {
      isLoggingOutRef.current = false;
      setIsLoggingOut(false);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoggingOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
