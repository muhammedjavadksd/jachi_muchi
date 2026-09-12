import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useLoginModal, useSignupModal, useForgotPasswordModal } from "@/features/auth/hooks";
import { authApi } from "@/features/auth/api/authApi";

function isValidEmailOrMobile(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) return true;
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(trimmed.replace(/\s/g, ""));
}

type LoginStep = "email" | "password";

export const LoginModal = memo(function LoginModal(): JSX.Element | null {
  const { isOpen, close } = useLoginModal();
  const { open: openSignupModal } = useSignupModal();
  const { open: openForgotPasswordModal } = useForgotPasswordModal();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<LoginStep>("email");
  const [mobileOrEmail, setMobileOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const emailValid = isValidEmailOrMobile(mobileOrEmail);
  const showEmailError = touched && !emailValid && mobileOrEmail.length > 0;
  const canContinue = emailValid;
  const canSignIn = step === "password" && password.length >= 6;

  const handleClose = useCallback(() => {
    close();
    setStep("email");
    setMobileOrEmail("");
    setPassword("");
    setTouched(false);
  }, [close]);

  const handleContinue = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      if (!emailValid) return;
      setStep("password");
      setTouched(false);
    },
    [emailValid]
  );

  const handleSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (step !== "password" || !canSignIn) return;
      setIsLoading(true);
      setLoginError("");
      try {
        const response = await authApi.login({
          email: mobileOrEmail,
          password,
        });
        if (response.success && response.data) {
          const { accessToken, refreshToken, user: apiUser } = response.data;
          if (accessToken && refreshToken && apiUser) {
            login(accessToken, refreshToken, {
              id: apiUser._id || apiUser.id || "",
              name: `${apiUser.firstName || ""} ${apiUser.lastName || ""}`.trim(),
              email: apiUser.email,
              role: "user" as const,
              createdAt: new Date().toISOString(),
            });
            close();
            navigate("/");
          } else {
            setLoginError(response.message || "Invalid email or password");
          }
        } else {
          setLoginError(response.message || "Invalid email or password");
        }
      } catch (error: any) {
        const data = error.response?.data;
        const serverMessage = data?.error || data?.message;

        if (serverMessage) {
          let displayMessage = serverMessage;
          if (typeof data.retryAfter === "number" && data.retryAfter > 0) {
            const totalSeconds = Math.ceil(data.retryAfter / 1000);
            if (totalSeconds >= 60) {
              const minutes = Math.ceil(totalSeconds / 60);
              displayMessage += ` Try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`;
            } else {
              displayMessage += ` Try again in ${totalSeconds} second${totalSeconds > 1 ? "s" : ""}.`;
            }
          }
          setLoginError(displayMessage);
        } else {
          setLoginError("Something went wrong. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [step, canSignIn, mobileOrEmail, password, login, close, navigate]
  );

  const handleBack = useCallback(() => {
    setStep("email");
    setPassword("");
  }, []);

  const handleForgotPassword = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      openForgotPasswordModal();
    },
    [openForgotPasswordModal]
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={handleClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-[101] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        {/* Branded header */}
        <div className="bg-[#0a1f44] px-6 pt-8 pb-6 flex flex-col items-center relative">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img src="/logo.png" alt="Jachi Muchi" className="h-14 w-auto mb-3 object-contain" />
          <h2 id="login-modal-title" className="text-xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-blue-200 mt-1">Sign in to continue shopping</p>
        </div>

        <div className="p-6">
          {step === "email" ? (
            <form onSubmit={handleContinue} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={mobileOrEmail}
                  onChange={(e) => setMobileOrEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Mobile / Email"
                  className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-colors ${
                    showEmailError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-teal-600"
                  }`}
                  autoComplete="email"
                  aria-invalid={showEmailError}
                  aria-describedby={showEmailError ? "login-error" : undefined}
                />
                {showEmailError && (
                  <p id="login-error" className="mt-1.5 text-sm text-red-500">
                    Please enter a valid Email or Mobile Number
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                By signing in, you agree to the{" "}
                <a href="/terms" className="text-teal-600 underline hover:text-teal-700">Terms of Service</a>
                {" "}&{" "}
                <a href="/privacy" className="text-teal-600 underline hover:text-teal-700">Privacy Policy</a>
              </p>

              <button
                type="submit"
                disabled={!canContinue}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  canContinue
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4">
              <p className="text-sm text-gray-600">
                Welcome back. Enter password for <strong className="text-gray-900">{mobileOrEmail}</strong>
              </p>

              <button
                type="button"
                onClick={handleBack}
                className="text-sm text-teal-600 hover:text-teal-700 hover:underline"
              >
                ← Use a different email or mobile
              </button>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:border-teal-600 transition-colors"
                  autoComplete="current-password"
                />
                <div className="mt-1.5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
              <button
                type="submit"
                disabled={!canSignIn || isLoading}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  canSignIn && !isLoading
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            New member?{" "}
            <button
              type="button"
              onClick={() => {
                close();
                openSignupModal();
              }}
              className="text-teal-600 font-medium underline hover:text-teal-700"
            >
              Create an Account
            </button>
          </p>
        </div>
      </div>
    </>
  );
});

LoginModal.displayName = "LoginModal";
