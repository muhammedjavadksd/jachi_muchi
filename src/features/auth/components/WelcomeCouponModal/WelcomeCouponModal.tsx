import { useState, useEffect } from "react";
import { fetchWelcomeCoupon } from "@/features/coupon/api/couponApi";
import type { WelcomeCoupon } from "@/features/coupon/types";
import { Price } from "@/shared/components";

interface WelcomeCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeCouponModal({
  isOpen,
  onClose,
}: WelcomeCouponModalProps): JSX.Element | null {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [welcomeData, setWelcomeData] = useState<WelcomeCoupon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);

      fetchWelcomeCoupon()
        .then(data => {
          setWelcomeData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch welcome coupon:", err);
          setLoading(false);
        });
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleCopyCoupon = async () => {
    if (!welcomeData) return;
    try {
      await navigator.clipboard.writeText(welcomeData.code);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = welcomeData.code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShopNow = () => {
    if (welcomeData) {
      localStorage.setItem("welcomeCoupon", JSON.stringify({
        code: welcomeData.code,
        discount: welcomeData.discountType === 'percentage' ? `${welcomeData.discountValue}%` : `QAR ${welcomeData.discountValue}`,
        discountValue: welcomeData.discountValue,
        discountType: welcomeData.discountType,
        minOrder: welcomeData.minPurchase,
        validDays: welcomeData.validDays,
        applied: false,
      }));
    }
    onClose();
  };

  const handleMaybeLater = () => {
    if (welcomeData) {
      localStorage.setItem("welcomeCoupon", JSON.stringify({
        code: welcomeData.code,
        discount: welcomeData.discountType === 'percentage' ? `${welcomeData.discountValue}%` : `QAR ${welcomeData.discountValue}`,
        discountValue: welcomeData.discountValue,
        discountType: welcomeData.discountType,
        minOrder: welcomeData.minPurchase,
        validDays: welcomeData.validDays,
        applied: false,
        skipped: true,
      }));
    }
    onClose();
  };

  if (!isOpen) return null;

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
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12" />

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
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-20 bg-gray-100 rounded-2xl mb-5"></div>
              <div className="space-y-3 mb-6">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-2xl"></div>
            </div>
          ) : welcomeData ? (
            <>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 mb-5 relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  SPECIAL OFFER
                </div>

                <p className="text-sm text-gray-600 mb-2">Your Welcome Coupon</p>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-3xl font-black text-gray-900 tracking-wider">
                      {welcomeData.code}
                    </p>
                    <p className="text-green-600 font-semibold mt-1">
                      {welcomeData.discountType === 'percentage'
                        ? `${welcomeData.discountValue}% OFF`
                        : <><Price value={welcomeData.discountValue} size="md" className="text-green-600" /> OFF</>}
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
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {welcomeData.discountType === 'percentage'
                        ? `${welcomeData.discountValue}% OFF`
                        : <><Price value={welcomeData.discountValue} size="md" className="text-green-600" /> OFF</>}
                    </span> on your first order
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    Minimum purchase of <span className="font-semibold"><Price value={welcomeData.minPurchase} size="md" /></span>
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    Valid for <span className="font-semibold">{welcomeData.validDays} days</span> only
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    First order only
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleShopNow}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-200 active:scale-[0.98]"
                >
                  Shop Now 🛍️
                </button>

                <button
                  onClick={handleMaybeLater}
                  className="w-full py-3 text-gray-600 font-medium rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No welcome coupon available right now.</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

WelcomeCouponModal.displayName = "WelcomeCouponModal";
