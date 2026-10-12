import { memo } from "react";
import { Loader2, LogOut } from "lucide-react";
import { useLogoutConfirm } from "@/features/auth/hooks";
import { LogoutConfirmDialog } from "@/features/auth/components/LogoutConfirmDialog/LogoutConfirmDialog";

interface LogoutButtonProps {
  className?: string;
  iconSize?: number;
}

/**
 * Logout action shared by every account dropdown menu and the account sidebar.
 * A single click no longer signs the user out (BUG-006) — it opens
 * LogoutConfirmDialog, and only the dialog's confirm button runs the flow.
 * While logout is in progress the label is replaced with a spinner +
 * "Logging out..." and the button is disabled (repeat clicks ignored).
 * AuthProvider owns the flow: session cleanup first, then a short visible
 * delay, then redirect to the homepage where the login modal opens.
 */
export const LogoutButton = memo(function LogoutButton({
  className = "",
  iconSize = 20,
}: LogoutButtonProps): JSX.Element {
  const { isOpen, isLoggingOut, triggerRef, open, cancel, confirm } = useLogoutConfirm();

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        disabled={isLoggingOut}
        aria-busy={isLoggingOut}
        aria-haspopup="dialog"
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

      <LogoutConfirmDialog
        isOpen={isOpen}
        isLoggingOut={isLoggingOut}
        onCancel={cancel}
        onConfirm={confirm}
        returnFocusRef={triggerRef}
      />
    </>
  );
});

LogoutButton.displayName = "LogoutButton";
