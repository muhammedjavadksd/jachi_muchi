import { memo, useCallback, useState } from "react";
import { useForgotPasswordModal } from "../../context/ForgotPasswordModalContext";

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * Forgot password modal: enter email to receive reset link
 */
export const ForgotPasswordModal = memo(function ForgotPasswordModal(): JSX.Element | null {
  const { isOpen, close } = useForgotPasswordModal();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const valid = isValidEmail(email);
  const showError = touched && !valid && email.length > 0;

  const handleClose = useCallback(() => {
    close();
    setEmail("");
    setTouched(false);
    setSubmitted(false);
  }, [close]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      if (!valid) return;
      setSubmitted(true);
    },
    [valid]
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[102]"
        onClick={handleClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-[103] p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="forgot-password-title" className="text-xl font-bold text-gray-900">
            Forgot Password
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="py-4">
            <p className="text-gray-600 text-sm">
              If an account exists for <strong className="text-gray-900">{email}</strong>, you will receive a password reset link shortly.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 w-full py-3 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700"
            >
              OK
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Email"
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-colors ${
                  showError ? "border-red-500" : "border-gray-300 focus:border-teal-600"
                }`}
                autoComplete="email"
              />
              {showError && (
                <p className="mt-1.5 text-sm text-red-500">Please enter a valid email address</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!valid}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                valid ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Send reset link
            </button>
          </form>
        )}
      </div>
    </>
  );
});

ForgotPasswordModal.displayName = "ForgotPasswordModal";
