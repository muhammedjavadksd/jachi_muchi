import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  // Allow through if access token is valid OR if refresh token is still valid
  // (axios interceptor will silently refresh on the first API call)
  const hasValidSession = isTokenValid(accessToken) || isTokenValid(refreshToken);

  if (!hasValidSession) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/?login=true" replace />;
  }

  return <>{children}</>;
}
