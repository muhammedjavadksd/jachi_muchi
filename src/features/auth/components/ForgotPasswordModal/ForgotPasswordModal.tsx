import { memo, useCallback, useState } from "react";
import { useForgotPasswordModal } from "@/features/auth/hooks";
import { authApi } from "@/features/auth/api/authApi";

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function getPasswordError(value: string): string {
  if (value.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Password must contain a mix of letters and numbers";
  return "";
}

function getApiError(error: any): string {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message?.includes("Network Error") || error?.code === "ERR_NETWORK") {
    return "Network error, please check your connection and try again";
  }
  return "Something went wrong. Please try again.";
}

type ForgotPasswordStep = "email" | "otp" | "done";

export const ForgotPasswordModal = memo(function ForgotPasswordModal(): JSX.Element | null {
  const { isOpen, close } = useForgotPasswordModal();
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emailValid = isValidEmail(email);
  const otpValid = otp.length === 6;
  const newPasswordError = getPasswordError(newPassword);
  const resetValid = otpValid && !newPasswordError;

  const showError = (field: string) => touched[field] ?? false;

  const handleClose = useCallback(() => {
    close();
    setStep("email");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setTouched({});
    setSending(false);
    setSubmitting(false);
    setError("");
    setSuccess("");
  }, [close]);

  const handleSendCode = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched((t) => ({ ...t, email: true }));
      setError("");
      setSuccess("");
      if (!emailValid) return;

      setSending(true);
      try {
        const response = await authApi.forgotPassword({ email: email.trim() });
        if (response.success) {
          setStep("otp");
          setSuccess(`Reset code sent to ${email.trim()}`);
        } else {
          setError(response.message || "Failed to send reset code");
        }
      } catch (error: any) {
        setError(getApiError(error));
      } finally {
        setSending(false);
      }
    },
    [email, emailValid]
  );

  const handleResendCode = useCallback(async () => {
    setError("");
    setSuccess("");
    try {
      const response = await authApi.forgotPassword({ email: email.trim() });
      if (response.success) {
        setSuccess("Code resent successfully");
      } else {
        setError(response.message || "Failed to resend code");
      }
    } catch (error: any) {
      setError(getApiError(error));
    }
  }, [email]);

  const handleResetSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched((t) => ({ ...t, otp: true, newPassword: true }));
      setError("");
      setSuccess("");
      if (!resetValid) return;

      setSubmitting(true);
      try {
        const response = await authApi.resetPassword({
          email: email.trim(),
          otp,
          newPassword,
        });
        if (response.success) {
          setStep("done");
          setSuccess(response.message || "Password reset successful");
        } else {
          setError(response.message || "Failed to reset password");
        }
      } catch (error: any) {
        setError(getApiError(error));
      } finally {
        setSubmitting(false);
      }
    },
    [email, otp, newPassword, resetValid]
  );

  const handleBackToEmail = useCallback(() => {
    setStep("email");
    setOtp("");
    setNewPassword("");
    setTouched({});
    setError("");
    setSuccess("");
  }, []);

  if (!isOpen) return null;

  const title = step === "done" ? "Password Reset" : step === "otp" ? "Reset Password" : "Forgot Password";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[102]"
        onClick={handleClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide bg-white rounded-2xl shadow-xl z-[103] p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="forgot-password-title" className="text-xl font-bold text-gray-900">
            {title}
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

        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your email address and we&apos;ll send you a reset code.
            </p>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="Email"
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-colors ${
                  showError("email") && !emailValid
                    ? "border-red-500"
                    : "border-gray-300 focus:border-teal-600"
                }`}
                autoComplete="email"
              />
              {showError("email") && !emailValid && (
                <p className="mt-1.5 text-sm text-red-500">Please enter a valid email address</p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={!emailValid || sending}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                emailValid && !sending
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {sending ? "Sending..." : "Send reset code"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-sm text-gray-600 underline hover:text-gray-900"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
              We sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>. Enter the code
              and set a new password.
            </p>

            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onBlur={() => setTouched((t) => ({ ...t, otp: true }))}
                placeholder="Enter 6-digit code"
                className={`w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest text-gray-900 placeholder-gray-400 outline-none transition-colors ${
                  showError("otp") && !otpValid
                    ? "border-red-500"
                    : "border-gray-300 focus:border-teal-600"
                }`}
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
              />
              {showError("otp") && !otpValid && (
                <p className="mt-1.5 text-sm text-red-500">Please enter a valid 6-digit code</p>
              )}
            </div>

            <div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, newPassword: true }))}
                placeholder="New password"
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-colors ${
                  showError("newPassword") && newPasswordError
                    ? "border-red-500"
                    : "border-gray-300 focus:border-teal-600"
                }`}
                autoComplete="new-password"
              />
              {showError("newPassword") && newPasswordError && (
                <p className="mt-1.5 text-sm text-red-500">{newPasswordError}</p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <button
              type="submit"
              disabled={!resetValid || submitting}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                resetValid && !submitting
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleBackToEmail}
                className="text-gray-600 underline hover:text-gray-900"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={sending}
                className="text-teal-600 underline hover:text-teal-700 disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </form>
        )}

        {step === "done" && (
          <div className="py-4">
            <p className="text-gray-600 text-sm">
              {success}. You can now sign back in with your new password.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 w-full py-3 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700"
            >
              OK
            </button>
          </div>
        )}
      </div>
    </>
  );
});

ForgotPasswordModal.displayName = "ForgotPasswordModal";