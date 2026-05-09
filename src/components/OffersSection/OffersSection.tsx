import { memo, useState, useEffect, useCallback } from "react";
import { fetchAvailableCoupons, type AvailableCoupon } from "../../lib/couponApi";
import { CouponCard } from "../CouponCard/CouponCard";

/**
 * Offers For You section for homepage
 * Displays available coupons from backend
 */
export const OffersSection = memo(function OffersSection(): JSX.Element {
  const [coupons, setCoupons] = useState<AvailableCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(""); // For copy notification

  const loadCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAvailableCoupons();
      // Filter out expired coupons
      const now = new Date();
      const validCoupons = data.filter(c => new Date(c.expiresAt) > now);
      setCoupons(validCoupons);
    } catch (err: any) {
      setError(err.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleCopy = (code: string) => {
    setToast(`Coupon "${code}" copied to clipboard!`);
    setTimeout(() => setToast(""), 3000);
  };

  const handleApply = (code: string) => {
    // Navigate to checkout with coupon code
    window.location.href = `/checkout?coupon=${code}`;
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-[fadeIn_0.3s_ease-out]">
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Offers For You 🎁
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Exclusive coupons and discounts available for you. Apply now and save on your next purchase!
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex gap-3">
                  <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-red-600 bg-red-50 px-6 py-3 rounded-xl">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={loadCoupons}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && coupons.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No offers available right now</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for exciting deals!</p>
          </div>
        )}

        {/* Coupon Cards Grid */}
          {!loading && !error && coupons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coupons.map((coupon) => (
              <CouponCard
                key={coupon.code}
                code={coupon.code}
                discountType={coupon.discountType}
                discountValue={coupon.discountValue}
                minPurchase={coupon.minPurchase}
                maxDiscount={coupon.maxDiscount}
                description={coupon.description}
                expiresAt={coupon.expiresAt}
                isNewUserOnly={coupon.isNewUserOnly}
                onCopy={handleCopy}
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

OffersSection.displayName = "OffersSection";
