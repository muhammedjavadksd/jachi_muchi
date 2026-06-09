import { memo, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";
import { markCouponAsUsed } from "../../lib/couponApi";

const PROMOTION_HEADER_HEIGHT = 140;

export const PaymentSuccessPage = memo(function PaymentSuccessPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  // Mark pending coupon as used (from pendingCouponMark localStorage)
  useEffect(() => {
    const pendingCoupon = localStorage.getItem("pendingCouponMark");
    if (pendingCoupon) {
      markCouponAsUsed(pendingCoupon).catch(() => {});
      localStorage.removeItem("pendingCouponMark");
    }
  }, []);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-8 md:py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-11 h-11 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
              <p className="text-gray-600 text-lg mb-2">Your order has been placed successfully.</p>
              {orderId && (
                <p className="text-sm text-gray-500 mb-8">
                  Order: <span className="font-mono font-medium text-gray-700">{orderId}</span>
                </p>
              )}

              {orderId ? (
                <Link
                  to={`/order-success/${orderId}`}
                  className="inline-block w-full sm:w-auto px-10 py-4 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all active:scale-[0.985]"
                >
                  View Order Details
                </Link>
              ) : (
                <Link
                  to="/account"
                  className="inline-block w-full sm:w-auto px-10 py-4 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all active:scale-[0.985]"
                >
                  My Orders
                </Link>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-blue-900 mb-2 text-lg">What happens next?</h2>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    You will receive an order confirmation email shortly. We will notify you once your order is shipped.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

PaymentSuccessPage.displayName = "PaymentSuccessPage";
