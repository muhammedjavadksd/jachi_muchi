import { useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Returns a `requireAuth` wrapper.
 * Usage: const { requireAuth } = useAuthGuard();
 *        <button onClick={() => requireAuth(handleAddToCart)} />
 *
 * If the user is authenticated the action runs immediately.
 * If not, dispatches auth:require-login which LoginModalProvider
 * listens for and opens the login modal — no provider ordering issues.
 */
export function useAuthGuard() {
  const { isAuthenticated } = useAuth();

  const requireAuth = useCallback(
    (action: () => void | Promise<void>) => {
      if (!isAuthenticated) {
        window.dispatchEvent(new Event("auth:require-login"));
        return;
      }
      action();
    },
    [isAuthenticated]
  );

  return { requireAuth };
}
