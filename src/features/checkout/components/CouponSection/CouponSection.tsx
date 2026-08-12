import { memo, useState, useEffect, useCallback } from "react";
import { fetchApplicableCoupons } from "@/features/coupon/api/couponApi";
import type { ApplicableCoupon } from "@/features/coupon/types";

export interface CouponSectionProps {
  cartValue: number;
  appliedCoupon: string;
  couponSavings: number;
  couponError: string;
  isApplyingCoupon: boolean;
  couponInput: string;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onCouponInputChange: (value: string) => void;
  autoApplyBest?: boolean;
}

export const CouponSection = memo(function CouponSection({
  cartValue,
  appliedCoupon,
  couponSavings,
  couponError,
  isApplyingCoupon,
  couponInput,
  onApplyCoupon,
  onRemoveCoupon,
  onCouponInputChange,
  autoApplyBest = false,
}: CouponSectionProps): JSX.Element {
  const [availableCoupons, setAvailableCoupons] = useState<ApplicableCoupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [showAvailable, setShowAvailable] = useState(false);
  const [autoApplied, setAutoApplied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setCouponsLoading(true);
      try {
        const coupons = await fetchApplicableCoupons(cartValue);
        if (!cancelled) setAvailableCoupons(coupons);
      } catch {
        if (!cancelled) setAvailableCoupons([]);
      } finally {
        if (!cancelled) setCouponsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [cartValue]);

  useEffect(() => {
    if (
      autoApplyBest &&
      !appliedCoupon &&
      !autoApplied &&
      !isApplyingCoupon &&
      availableCoupons.length > 0 &&
      availableCoupons[0].estimatedDiscount > 0
    ) {
      const best = availableCoupons[0];
      onCouponInputChange(best.code);
      setAutoApplied(true);
    }
  }, [autoApplyBest, appliedCoupon, autoApplied, availableCoupons, isApplyingCoupon, onCouponInputChange]);

  const handleApplyFromList = useCallback(
    (code: string) => {
      onCouponInputChange(code);
      setTimeout(() => onApplyCoupon(), 0);
    },
    [onCouponInputChange, onApplyCoupon]
  );

  // bestCoupon reserved for future use
  // const bestCoupon = availableCoupons[0] ?? null;

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6">
      {appliedCoupon ? (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{appliedCoupon}</p>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Applied</span>
                </div>
                <p className="text-green-600 text-sm font-medium">You saved ₹{couponSavings}</p>
              </div>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="px-4 py-2 text-red-600 font-medium text-sm hover:bg-red-50 rounded-xl transition-colors"
            >
              REMOVE
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="font-semibold text-gray-900 mb-3">Apply Coupon</p>

          {couponError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
              <svg className="w-4 h-4 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm">{couponError}</p>
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => onCouponInputChange(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-5 py-3 border border-gray-300 rounded-2xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              disabled={isApplyingCoupon}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isApplyingCoupon && couponInput.trim()) {
                  onApplyCoupon();
                }
              }}
            />
            <button
              onClick={onApplyCoupon}
              disabled={isApplyingCoupon || !couponInput.trim()}
              className="px-7 py-3 bg-teal-700 text-white font-medium rounded-2xl hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 min-w-[100px] justify-center"
            >
              {isApplyingCoupon ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm">Applying</span>
                </>
              ) : (
                "Apply"
              )}
            </button>
          </div>

          <p className="text-gray-500 text-xs mt-2">Press Enter or click Apply to add coupon</p>

          {availableCoupons.length > 0 && (
            <div className="mt-5 border-t border-gray-100 pt-4">
              <button
                onClick={() => setShowAvailable((prev) => !prev)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span>Available Coupons ({availableCoupons.length})</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showAvailable ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showAvailable && (
                <div className="mt-3 space-y-3 animate-[fadeIn_0.3s_ease-out]">
                  {couponsLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    availableCoupons.map((coupon, idx) => {
                      const isBest = idx === 0 && coupon.estimatedDiscount > 0;
                      return (
                        <div
                          key={coupon.code}
                          className={`border rounded-xl p-4 transition-all hover:shadow-sm ${isBest ? "border-amber-300 bg-amber-50/50" : "border-gray-200 bg-white"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-bold text-sm text-gray-900 tracking-wider">
                                  {coupon.code}
                                </span>
                                {isBest && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wide whitespace-nowrap">
                                    Best Offer
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                                {coupon.description || (coupon.discountType === "percentage"
                                  ? `${coupon.discountValue}% OFF${coupon.maxDiscount ? ` up to ₹${coupon.maxDiscount}` : ""}`
                                  : `Flat ₹${coupon.discountValue} OFF`)}
                              </p>
                              <p className="text-gray-400 text-[11px] mt-1">
                                Min. purchase ₹{coupon.minPurchase}
                                {coupon.estimatedDiscount > 0 && (
                                  <span className="text-green-600 ml-2">
                                    Save ₹{Math.round(coupon.estimatedDiscount)}
                                  </span>
                                )}
                              </p>
                            </div>
                            <button
                              onClick={() => handleApplyFromList(coupon.code)}
                              disabled={isApplyingCoupon}
                              className="px-4 py-2 bg-teal-700 text-white text-xs font-semibold rounded-xl hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {!couponsLoading && availableCoupons.length === 0 && (
            <p className="text-gray-400 text-xs mt-3">No coupons available for this cart value</p>
          )}
        </div>
      )}
    </div>
  );
});

CouponSection.displayName = "CouponSection";
