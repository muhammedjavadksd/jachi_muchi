import { memo, useCallback, useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Loader2, LogOut } from "lucide-react";
import {
  LOGOUT_CONFIRM_TITLE,
  LOGOUT_CONFIRM_DESCRIPTION,
  LOGOUT_CONFIRM_CANCEL_LABEL,
  LOGOUT_CONFIRM_ACTION_LABEL,
} from "@/shared/constants";

const LOGOUT_DIALOG_TITLE_ID = "logout-confirm-dialog-title";
const LOGOUT_DIALOG_DESCRIPTION_ID = "logout-confirm-dialog-description";
const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  isLoggingOut: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

/**
 * Confirmation step for signing out (BUG-006). Clicking Logout no longer wipes
 * the session: this alertdialog asks first, and only the confirm button runs
 * the real logout owned by AuthProvider.
 *
 * Rendered through a portal on document.body so the overlay always lands above
 * every layer regardless of where the trigger is mounted. Two call sites need
 * this: AccountSidebar wraps its panel in `transform: translateZ(0)`, which
 * would otherwise turn this `fixed` overlay into a box clipped to the 280px
 * sidebar, and SiteHeader's account dropdown is `overflow-hidden` inside a
 * `z-50` stacking context. z-[300] clears every content-level modal in the app
 * (highest is z-[200]) while staying under the app-level LoadingScreen (z-[9999]).
 *
 * Accessibility: alertdialog + aria-modal + labelledby/describedby, focus moved
 * to Cancel on open (safest default for a destructive action), Tab cycled inside
 * the panel, and focus handed back to the trigger button on close. Escape and a
 * backdrop click both route to onCancel, i.e. identical to pressing Cancel.
 */
export const LogoutConfirmDialog = memo(function LogoutConfirmDialog({
  isOpen,
  isLoggingOut,
  onCancel,
  onConfirm,
  returnFocusRef,
}: LogoutConfirmDialogProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const previousOverflowRef = useRef("");

  // Depends only on the stable onCancel so the effect below is not torn down
  // and re-run (which would yank focus back into the dialog) when the in-flight
  // isLoggingOut flag flips.
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onCancel]
  );

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    // Saved and restored rather than blanked: the account sidebar's mobile
    // drawer already holds its own scroll lock, and clobbering it to "" on close
    // would let the page behind the open drawer scroll again.
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    cancelButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflowRef.current;
      window.removeEventListener("keydown", handleKeyDown);
      (returnFocusRef.current ?? previouslyFocusedRef.current)?.focus();
    };
  }, [isOpen, handleKeyDown, returnFocusRef]);

  const handleBackdropClick = useCallback(() => {
    if (isLoggingOut) return;
    onCancel();
  }, [isLoggingOut, onCancel]);

  // Double-click guard: once confirm is in flight the button is disabled and
  // this returns early. AuthProvider's own re-entrancy ref is the second layer.
  const handleConfirm = useCallback(() => {
    if (isLoggingOut) return;
    onConfirm();
  }, [isLoggingOut, onConfirm]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={LOGOUT_DIALOG_TITLE_ID}
      aria-describedby={LOGOUT_DIALOG_DESCRIPTION_ID}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <LogOut className="w-5 h-5 text-red-500" />
        </div>

        <h3 id={LOGOUT_DIALOG_TITLE_ID} className="text-lg font-bold text-gray-900">
          {LOGOUT_CONFIRM_TITLE}
        </h3>
        <p
          id={LOGOUT_DIALOG_DESCRIPTION_ID}
          className="mt-1.5 text-sm text-gray-500 leading-relaxed"
        >
          {LOGOUT_CONFIRM_DESCRIPTION}
        </p>

        {/* Stacked on mobile (Cancel above the action, as in CancelOrderModal),
            side by side from sm up (as in DeleteReviewDialog). */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isLoggingOut}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {LOGOUT_CONFIRM_CANCEL_LABEL}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoggingOut}
            aria-busy={isLoggingOut}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoggingOut && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
            {isLoggingOut ? "Logging out..." : LOGOUT_CONFIRM_ACTION_LABEL}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});

LogoutConfirmDialog.displayName = "LogoutConfirmDialog";
