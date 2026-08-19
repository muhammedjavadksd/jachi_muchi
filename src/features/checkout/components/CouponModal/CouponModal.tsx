import { memo, useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { UserCoupon } from "@/features/coupon/types";

export function calculateCouponDiscount(coupon: UserCoupon, total: number): number {
  const value = Number(coupon.discountValue) || 0;
  const cap = Number(coupon.maxDiscount) || Infinity;
  if (coupon.discountType === "percentage") {
    return Math.min((value / 100) * total, cap);
  }
  return Math.min(value, total);
}

export function getBestCoupon(coupons: UserCoupon[], totalSellingPrice: number): UserCoupon | null {
  const now = new Date();
  let best: UserCoupon | null = null;
  let bestDiscount = -1;

  for (const coupon of coupons) {
    if (coupon.isUsed) continue;
    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) continue;

    const minReq = Number(coupon.minOrderAmount || 0);
    if (minReq > 0 && totalSellingPrice < minReq) continue;

    const discount = calculateCouponDiscount(coupon, totalSellingPrice);
    if (discount > bestDiscount) {
      bestDiscount = discount;
      best = coupon;
    }
  }

  return best;
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedCoupon: string;
  couponSavings: number;
  couponError: string;
  isApplyingCoupon: boolean;
  couponInput: string;
  userCoupons: UserCoupon[];
  usedCoupons: UserCoupon[];
  copiedCoupon: string | null;
  cartTotal: number;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onCouponInputChange: (value: string) => void;
  onCopyCoupon: (code: string) => void;
}

export const CouponModal = memo(function CouponModal({
  isOpen,
  onClose,
  appliedCoupon,
  couponSavings,
  couponError,
  isApplyingCoupon,
  couponInput,
  userCoupons,
  usedCoupons,
  copiedCoupon,
  cartTotal,
  onApplyCoupon,
  onRemoveCoupon,
  onCouponInputChange,
  onCopyCoupon,
}: CouponModalProps): JSX.Element | null {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localCopied, setLocalCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Reset local copied state when modal closes
  useEffect(() => {
    if (!isOpen) setLocalCopied(null);
  }, [isOpen]);

  const handleCopy = useCallback(
    (code: string) => {
      onCopyCoupon(code);
      setLocalCopied(code);
      setTimeout(() => setLocalCopied(null), 2000);
      setTimeout(() => inputRef.current?.focus(), 100);
    },
    [onCopyCoupon]
  );

  // Classify coupons into eligible / almost-there / used — computed from cartTotal reactively
  const { eligibleCoupons, almostThereCoupons } = useMemo(() => {
    const eligible: UserCoupon[] = [];
    const almostThere: UserCoupon[] = [];
    const now = new Date();

    for (const coupon of userCoupons) {
      if (coupon.isUsed) continue;
      if (coupon.expiresAt && new Date(coupon.expiresAt) < now) continue;

      const minReq = coupon.minOrderAmount || 0;
      if (minReq > 0 && cartTotal < minReq) {
        almostThere.push(coupon);
      } else {
        eligible.push(coupon);
      }
    }

    return { eligibleCoupons: eligible, almostThereCoupons: almostThere };
  }, [userCoupons, cartTotal]);

  const getDiscountText = (coupon: UserCoupon) => {
    const value = Number(coupon.discountValue) || 0;
    if (coupon.discountType === "percentage") {
      const cap = coupon.maxDiscount ? ` up to ₹${coupon.maxDiscount}` : "";
      return `${value}% OFF${cap}`;
    }
    return `Flat ₹${value} OFF`;
  };

  // Pick the single best coupon (highest discount) from eligible ones — re-runs when cartTotal changes
  const bestCoupon = useMemo(
    () => getBestCoupon(userCoupons, cartTotal),
    [userCoupons, cartTotal],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 shrink-0">
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-base font-semibold text-gray-900">Apply Coupon</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Applied coupon banner */}
          {appliedCoupon && (
            <div className="mx-4 mt-4 bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <span className="font-semibold text-teal-700">{appliedCoupon}</span>
                  <span className="text-sm text-teal-600 ml-2">−₹{couponSavings}</span>
                </div>
              </div>
              <button onClick={onRemoveCoupon} className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-all shrink-0">
                Remove
              </button>
            </div>
          )}

          {/* Manual input */}
          <div className="p-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={couponInput}
                onChange={(e) => onCouponInputChange(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isApplyingCoupon && couponInput.trim()) {
                    onApplyCoupon();
                  }
                }}
                placeholder="Enter coupon code"
                disabled={isApplyingCoupon}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all disabled:opacity-50"
              />
              <button
                onClick={onApplyCoupon}
                disabled={isApplyingCoupon || !couponInput.trim()}
                className="px-5 py-3 bg-teal-700 text-white font-semibold text-sm rounded-xl hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shrink-0"
              >
                {isApplyingCoupon ? "Applying..." : "Apply"}
              </button>
            </div>
            {couponError && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {couponError}
              </p>
            )}
          </div>

          {/* Best offer — single recommended */}
          {userCoupons.length === 0 && almostThereCoupons.length === 0 ? (
            <div className="px-4 pb-4">
              <div className="text-center py-8">
                <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                <p className="text-sm font-medium text-gray-500">No coupons available for your order</p>
                <p className="text-xs text-gray-400 mt-1">Keep shopping to unlock exclusive offers</p>
              </div>
            </div>
          ) : (
            <div className="px-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Best offer for you</p>

              {bestCoupon ? (
                (() => {
                  const isCopied = localCopied === bestCoupon.code;
                  const discountAmount = calculateCouponDiscount(bestCoupon, cartTotal);
                  return (
                    <div className="border border-teal-200 bg-teal-50/50 rounded-xl p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-mono font-bold text-sm text-gray-900">{bestCoupon.code}</span>
                            <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-semibold rounded-full">
                              Save ₹{Math.round(discountAmount).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500">{getDiscountText(bestCoupon)}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(bestCoupon.code)}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                            isCopied
                              ? "bg-green-100 text-green-700"
                              : "bg-teal-700 text-white hover:bg-teal-800 active:scale-95"
                          }`}
                        >
                          {isCopied ? (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                              Copied!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                              Copy
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No offers available for your current order value. Add more items to unlock discounts!</p>
              )}
            </div>
          )}

          {/* Almost there — not yet eligible */}
          {almostThereCoupons.length > 0 && (
            <div className="px-4 pb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Almost there</p>
              <div className="space-y-2.5">
                {almostThereCoupons.map((coupon) => {
                  const isCopied = localCopied === coupon.code;
                  const shortfall = (coupon.minPurchase || coupon.minOrderAmount || 0) - cartTotal;
                  return (
                    <div key={coupon.code} className="border border-dashed border-amber-300 rounded-xl p-3.5 bg-amber-50/50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-mono font-bold text-sm text-gray-700">{coupon.code}</span>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded-full">
                              {getDiscountText(coupon)}
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-600 font-medium">
                            Add ₹{shortfall.toLocaleString("en-IN")} more to unlock this offer
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                            isCopied
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200 active:scale-95"
                          }`}
                        >
                          {isCopied ? (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                              Copied!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                              Copy
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Previously used */}
          {usedCoupons.length > 0 && (
            <div className="px-4 pb-4 pt-2">
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2.5">Previously used</p>
                <div className="space-y-2">
                  {usedCoupons.map((coupon) => (
                    <div key={coupon.code} className="border border-gray-100 rounded-xl p-3.5 opacity-60">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <span className="font-mono font-bold text-sm text-gray-400">{coupon.code}</span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[10px] font-semibold rounded-full line-through">
                            {getDiscountText(coupon)}
                          </span>
                        </div>
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-medium rounded-lg cursor-not-allowed shrink-0">
                          Used
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CouponModal.displayName = "CouponModal";
