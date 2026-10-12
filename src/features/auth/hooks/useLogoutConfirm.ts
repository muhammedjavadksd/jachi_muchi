import { useCallback, useRef, useState, type RefObject } from "react";
import { useAuth } from "./useAuth";

export interface UseLogoutConfirm {
  isOpen: boolean;
  isLoggingOut: boolean;
  triggerRef: RefObject<HTMLButtonElement>;
  open: () => void;
  cancel: () => void;
  confirm: () => void;
}

/**
 * Owns the logout confirmation state (BUG-006) so every logout entry point —
 * the account sidebar, the header account menu, and anything added later —
 * shares one identical two-step flow instead of signing the user out on click.
 *
 * `open` only reveals LogoutConfirmDialog; the real logout lives in
 * AuthProvider and is still triggered exclusively from `confirm`. The dialog
 * stays open for the provider's redirect delay (so the user sees the
 * "Logging out..." state rather than a blank screen) and closes only once
 * logout has actually completed.
 */
export function useLogoutConfirm(): UseLogoutConfirm {
  const { logout, isLoggingOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(() => {
    if (isLoggingOut) return;
    setIsOpen(true);
  }, [isLoggingOut]);

  const cancel = useCallback(() => setIsOpen(false), []);

  const confirm = useCallback(() => {
    // Repeat clicks are ignored: the provider resolves false while a logout is
    // already in flight, and the dialog is disabled until it settles.
    void logout().then((completed) => {
      if (completed) setIsOpen(false);
    });
  }, [logout]);

  return { isOpen, isLoggingOut, triggerRef, open, cancel, confirm };
}
