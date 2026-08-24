import { memo, useCallback } from "react";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";

interface LogoutButtonProps {
  className?: string;
  iconSize?: number;
}

/**
 * Logout action shared by every account dropdown menu and the account sidebar.
 * While logout is in progress the label is replaced with a spinner +
 * "Logging out..." and the button is disabled (repeat clicks ignored).
 * AuthProvider owns the flow: session cleanup first, then a short visible
 * delay, then redirect to the homepage where the login modal opens.
 */
export const LogoutButton = memo(function LogoutButton({
  className = "",
  iconSize = 20,
}: LogoutButtonProps): JSX.Element {
  const { logout, isLoggingOut } = useAuth();

  const handleLogout = useCallback(() => {
    void logout();
  }, [logout]);

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      aria-busy={isLoggingOut}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {isLoggingOut ? (
        <>
          <Loader2 size={iconSize} className="animate-spin shrink-0" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <LogOut size={iconSize} className="shrink-0" />
          <span>Logout</span>
        </>
      )}
    </button>
  );
});

LogoutButton.displayName = "LogoutButton";
