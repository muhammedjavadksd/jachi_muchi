import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const token = localStorage.getItem("access_token");
  const location = useLocation();

  if (!token) {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/?login=true" replace />;
  }

  return <>{children}</>;
}
