import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupModal } from "../../context/SignupModalContext";
import { useLoginModal } from "../../context/LoginModalContext";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { WelcomeCouponModal } from "../WelcomeCouponModal/WelcomeCouponModal";

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function isValidPassword(value: string): boolean {
  return value.length >= 6;
}

/**
 * Create an Account modal with First Name, Last Name, Mobile, Email, Password,
 * referral link, WhatsApp opt-in, terms, and Sign In link
 */
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
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
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

  const mobileDigits = mobile.replace(/\D/g, "");
  const mobileValid = mobileDigits.length === 10 && /^[6-9]/.test(mobileDigits);
  const emailValid = isValidEmail(email);
  const passwordValid = isValidPassword(password);
  const firstNameValid = firstName.trim().length > 0;

  const formValid = firstNameValid && mobileValid && emailValid && passwordValid;

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
    setTouched({ firstName: true, mobile: true, email: true, password: true });
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
      const errorMsg = error.response?.data?.message || "Something went wrong";
      setApiError(errorMsg);
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
      const token = response.data?.token || response.token;
      const apiUser = response.data?.user;

      if (response.success && token && apiUser) {
        login(token, token, {
          id: apiUser._id || apiUser.id || "",
          name: `${apiUser.firstName || ""} ${apiUser.lastName || ""}`.trim(),
          email: apiUser.email,
          phone: signupPayload.mobile,
        });
        // Show welcome coupon modal instead of closing directly
        setShowWelcomeCoupon(true);
      } else {
        setApiError(response.message || "Invalid response from server");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      setApiError(errorMsg);
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
      const errorMsg = error.response?.data?.message || "Something went wrong";
      setApiError(errorMsg);
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
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl z-[101]"
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
                showError("firstName") && !firstNameValid
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-600"
              }`}
              autoComplete="given-name"
            />
            {showError("firstName") && !firstNameValid && (
              <p className="mt-1 text-sm text-red-500">Please enter your first name</p>
            )}
          </div>

          <div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 outline-none focus:border-teal-600 transition-colors"
              autoComplete="family-name"
            />
          </div>

          <div>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              onBlur={() => setTouched((t) => ({ ...t, mobile: true }))}
              placeholder="+91 Mobile*"
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 outline-none transition-colors ${
                showError("mobile") && !mobileValid
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-600"
              }`}
              autoComplete="tel"
            />
            {showError("mobile") && !mobileValid && mobile.length > 0 && (
              <p className="mt-1 text-sm text-red-500">Please enter a valid 10-digit mobile number</p>
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
                showError("email") && !emailValid
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-600"
              }`}
              autoComplete="email"
            />
            {showError("email") && !emailValid && email.length > 0 && (
              <p className="mt-1 text-sm text-red-500">Please enter a valid email</p>
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
                showError("password") && !passwordValid
                  ? "border-red-500"
                  : "border-gray-300 focus:border-teal-600"
              }`}
              autoComplete="new-password"
            />
            {showError("password") && !passwordValid && password.length > 0 && (
              <p className="mt-1 text-sm text-red-500">Password must be at least 6 characters</p>
            )}
          </div>

          {apiError && (
            <p className="text-sm text-red-500">{apiError}</p>
          )}

          <button
            type="button"
            className="text-sm text-gray-600 hover:text-teal-600 hover:underline"
          >
            Got a Referral Code? (Optional)
          </button>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={whatsappUpdates}
              onChange={(e) => setWhatsappUpdates(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Get updates on Whatsapp</span>
            <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </label>

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
