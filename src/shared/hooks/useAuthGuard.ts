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
 *
 * The action's promise is returned rather than dropped, so a caller can await it
 * and put its own try/catch around it. BUG-012's Add to Cart relies on this: the
 * action performs the write, so a rejected request has to reach the caller to
 * produce the error toast instead of becoming an unhandled rejection.
 */
export function useAuthGuard() {
  const { isAuthenticated } = useAuth();

  const requireAuth = useCallback(
    (action: () => void | Promise<void>) => {
      if (!isAuthenticated) {
        window.dispatchEvent(new Event("auth:require-login"));
        return;
      }
      return action();
    },
    [isAuthenticated]
  );

  return { requireAuth };
}
