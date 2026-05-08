import { useState, useEffect } from "react";

interface WelcomeCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponCode?: string;
  discount?: number;
  minOrder?: number;
  validDays?: number;
}

/**
 * Welcome Coupon Modal
 * Shown after successful signup + OTP verification
 */
export function WelcomeCouponModal({
  isOpen,
  onClose,
  couponCode = "WELCOME100",
  discount = 100,
  minOrder = 999,
  validDays = 7,
}: WelcomeCouponModalProps): JSX.Element | null {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = couponCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShopNow = () => {
    onClose();
    // Navigation will be handled by parent component
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Green Success Header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-6 py-8 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12" />

          {/* Checkmark Icon */}
          <div className="relative z-10 flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg animate-[popIn_0.5s_ease-out]">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="relative z-10 text-2xl font-bold text-white mb-1">
            Welcome to Our Store!
          </h2>
          <p className="relative z-10 text-green-100 text-sm">
            Your account has been created successfully
          </p>
        </div>

        {/* Coupon Details */}
        <div className="p-6">
          {/* Coupon Code Box */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 mb-5 relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              SPECIAL OFFER
            </div>

            <p className="text-sm text-gray-600 mb-2">Your Welcome Coupon</p>

            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-3xl font-black text-gray-900 tracking-wider">
                  {couponCode}
                </p>
                <p className="text-green-600 font-semibold mt-1">
                  ₹{discount} OFF
                </p>
              </div>

              <button
                onClick={handleCopyCoupon}
                className={`shrink-0 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-white border-2 border-green-500 text-green-600 hover:bg-green-50"
                }`}
              >
                {copied ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Coupon Terms */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">₹{discount} OFF</span> on your first order
              </p>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-700">
                Minimum purchase of <span className="font-semibold">₹{minOrder}</span>
              </p>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-700">
                Valid for <span className="font-semibold">{validDays} days</span> only
              </p>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-700">
                First order only
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleShopNow}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-200 active:scale-[0.98]"
            >
              Shop Now 🛍️
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 text-gray-600 font-medium rounded-2xl hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

WelcomeCouponModal.displayName = "WelcomeCouponModal";
