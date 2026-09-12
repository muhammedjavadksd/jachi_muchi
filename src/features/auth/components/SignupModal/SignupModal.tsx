import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/authApi";
import { useAuth, useLoginModal, useSignupModal } from "@/features/auth/hooks";
import { WelcomeCouponModal } from "@/features/auth/components/WelcomeCouponModal/WelcomeCouponModal";

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function getFirstNameError(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Please enter your first name";
  if (!/^[A-Za-z]+$/.test(trimmed)) return "First name can only contain letters";
  return "";
}

function getLastNameError(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!/^[A-Za-z]+$/.test(trimmed)) return "Last name can only contain letters";
  return "";
}

function getMobileError(value: string): string {
  if (!value.trim()) return "Please enter your mobile number";
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 10) return "Please enter a valid 10-digit mobile number";
  return "";
}

function getEmailError(value: string): string {
  if (!value.trim()) return "Please enter your email address";
  if (!isValidEmail(value)) return "Please enter a valid email address";
  return "";
}

function getPasswordError(value: string): string {
  if (value.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Password must contain a mix of letters and numbers";
  return "";
}

export const SignupModal = memo(function SignupModal(): JSX.Element | null {
  const { isOpen, close } = useSignupModal();
  const { open: openLoginModal } = useLoginModal();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPayload, setSignupPayload] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
  });
  const [showWelcomeCoupon, setShowWelcomeCoupon] = useState(false);

  const firstNameError = getFirstNameError(firstName);
  const lastNameError = getLastNameError(lastName);
  const mobileError = getMobileError(mobile);
  const emailError = getEmailError(email);
  const passwordError = getPasswordError(password);

  const formValid = !firstNameError && !lastNameError && !mobileError && !emailError && !passwordError;

  const showError = (field: string) => touched[field] ?? false;

  const handleClose = () => {
    close();
    setFirstName("");
    setLastName("");
    setMobile("");
    setEmail("");
    setTouched({});
    setApiError("");
    setLoading(false);
    setStep("signup");
    setOtp("");
    setOtpLoading(false);
    setSignupEmail("");
    setSignupPayload({
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
    });
    setShowWelcomeCoupon(false);
  };

  const handleWelcomeCouponClose = () => {
    setShowWelcomeCoupon(false);
    close();
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, mobile: true, email: true, password: true });
    if (!formValid) return;

    setLoading(true);
    setApiError("");
    const payload = {
      firstName,
      lastName,
      email,
      mobile,
      password,
    };

    try {
      const response = await authApi.signup(payload);
      if (response.success) {
        setSignupEmail(email);
        setSignupPayload(payload);
        setStep("otp");
      } else {
        setApiError(response.message || "Signup failed");
      }
    } catch (error: any) {
      console.error("[Signup] Error:", error);
      if (error?.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error?.message?.includes("Network Error") || error?.code === "ERR_NETWORK") {
        setApiError("Network error, please check your connection and try again");
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setApiError("Please enter a valid 6-digit OTP");
      return;
    }

    setOtpLoading(true);
    setApiError("");
    try {
      const response = await authApi.verifyOtp({ email: signupEmail, otp });
      const accessToken = response.data?.accessToken || response.accessToken;
      const refreshToken = response.data?.refreshToken || response.refreshToken;
      const apiUser = response.data?.user;

      if (response.success && accessToken && apiUser) {
        login(accessToken, refreshToken ?? "", {
          id: apiUser._id || apiUser.id || "",
          name: `${apiUser.firstName || ""} ${apiUser.lastName || ""}`.trim(),
          email: apiUser.email,
          phone: signupPayload.mobile,
          role: "user" as const,
          createdAt: new Date().toISOString(),
        });
        setShowWelcomeCoupon(true);
      } else {
        setApiError(response.message || "Invalid response from server");
      }
    } catch (error: any) {
      console.error("[Signup] OTP verify error:", error);
      if (error?.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error?.message?.includes("Network Error") || error?.code === "ERR_NETWORK") {
        setApiError("Network error, please check your connection and try again");
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setApiError("");
    try {
      const response = await authApi.resendOtp(signupEmail);
      if (response.success) {
        setApiError("OTP resent successfully");
      } else {
        setApiError(response.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      console.error("[Signup] Resend OTP error:", error);
      if (error?.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error?.message?.includes("Network Error") || error?.code === "ERR_NETWORK") {
        setApiError("Network error, please check your connection and try again");
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    }
  };

  const handleBackToSignup = () => {
    setStep("signup");
    setOtp("");
    setSignupEmail("");
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    close();
    openLoginModal();
  };

  if (!isOpen && !showWelcomeCoupon) return null;

  return (
    <>
      <WelcomeCouponModal
        isOpen={showWelcomeCoupon}
        onClose={handleWelcomeCouponClose}
      />

      <div
        className="fixed inset-0 bg-black/50 z-[100]"
        onClick={handleClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide bg-white rounded-2xl shadow-xl z-[101]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 id="signup-modal-title" className="text-xl font-bold text-gray-900">
            {step === "otp" ? "Verify OTP" : "Create an Account"}
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

        {step === "otp" ? (
          <form onSubmit={handleOtpSubmit} className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              We sent a 6-digit code to <span className="font-semibold text-gray-900">{signupEmail}</span>
            </p>

            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest text-gray-900 placeholder-gray-400 outline-none focus:border-teal-600 transition-colors"
                maxLength={6}
                autoFocus
              />
            </div>

            {apiError && (
              <p className={`text-sm ${apiError.includes("resent") ? "text-green-600" : "text-red-500"}`}>
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={otpLoading || otp.length < 6}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                otpLoading || otp.length < 6
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-teal-600 underline hover:text-teal-700"
              >
                Resend OTP
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleBackToSignup}
                className="text-sm text-gray-600 underline hover:text-gray-900"
              >
                Back to Signup
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
              placeholder="First Name*"
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-colors ${
                showError("firstName") && firstNameError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-600"
              }`}
              autoComplete="given-name"
            />
            {showError("firstName") && firstNameError && (
              <p className="mt-1 text-sm text-red-500">{firstNameError}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
              placeholder="Last Name"
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-colors ${
                showError("lastName") && lastNameError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-600"
              }`}
              autoComplete="family-name"
            />
            {showError("lastName") && lastNameError && (
              <p className="mt-1 text-sm text-red-500">{lastNameError}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              onBlur={() => setTouched((t) => ({ ...t, mobile: true }))}
              placeholder="+91 Mobile*"
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-colors ${
                showError("mobile") && mobileError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-600"
              }`}
              autoComplete="tel"
            />
            {showError("mobile") && mobileError && (
              <p className="mt-1 text-sm text-red-500">{mobileError}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="Email*"
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-colors ${
                showError("email") && emailError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-600"
              }`}
              autoComplete="email"
            />
            {showError("email") && emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              placeholder="Password*"
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-colors ${
                showError("password") && passwordError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-600"
              }`}
              autoComplete="new-password"
            />
            {showError("password") && passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
          </div>

          {apiError && (
            <p className="text-sm text-red-500">{apiError}</p>
          )}

          <p className="text-xs text-gray-500">
            By creating this account, you agree to our{" "}
            <a href="/terms" className="text-teal-600 underline hover:text-teal-700">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" className="text-teal-600 underline hover:text-teal-700">Privacy Policy</a>
          </p>

          <button
            type="submit"
            disabled={!formValid || loading}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              formValid && !loading
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating Account..." : "Create an Account"}
          </button>

          <p className="text-center text-sm text-gray-600 pt-1">
            Have an account?{" "}
            <button
              type="button"
              onClick={handleSignInClick}
              className="text-teal-600 font-medium underline hover:text-teal-700"
            >
              Sign In
            </button>
          </p>
          </form>
        )}
      </div>
    </>
  );
});

SignupModal.displayName = "SignupModal";
