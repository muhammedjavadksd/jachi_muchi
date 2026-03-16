import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";

/** Height of the promotion header */
const PROMOTION_HEADER_HEIGHT = 140;

/**
 * Order Failure Page
 * Displays order failure message with helpful information and navigation
 */
export const OrderFailurePage = memo(function OrderFailurePage(): JSX.Element {
  /** Memoize header spacer style */
  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`
  }), []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      {/* Promotion Header */}
      <PromotionHeader />
      
      {/* Spacer for fixed header */}
      <div style={spacerStyle} />

      {/* Main Content */}
      <main className="flex-1 py-10">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Failure Banner */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 text-center">
              {/* Failure Icon */}
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-500 mb-6">We couldn't process your payment. Please try again.</p>

              {/* Retry Button */}
              <Link
                to="/checkout"
                className="inline-block px-8 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors"
              >
                Try Again
              </Link>
            </div>

            {/* Important Information Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-amber-900 mb-2">Important Information</h2>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    Please check your email for further updates regarding your order status.
                  </p>
                </div>
              </div>
            </div>

            {/* Refund Information Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-blue-900 mb-2">Payment Debited?</h2>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    If your payment was debited, don't worry! The amount will be automatically refunded to your account within <strong>24-48 hours</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Check Order Status Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 mb-2">Check Your Order Status</h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Sometimes payments may succeed even when this page shows a failure. Please check your orders page to verify if your order was successfully placed.
                  </p>
                  <Link
                    to="/orders"
                    className="inline-flex items-center gap-2 text-teal-700 font-medium hover:text-teal-800 transition-colors"
                  >
                    View My Orders
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation Options */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What would you like to do?</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {/* My Orders */}
                <Link
                  to="/orders"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">My Orders</p>
                    <p className="text-gray-500 text-sm">Check order status</p>
                  </div>
                </Link>

                {/* Continue Shopping */}
                <Link
                  to="/"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Continue Shopping</p>
                    <p className="text-gray-500 text-sm">Browse products</p>
                  </div>
                </Link>

                {/* View Cart */}
                <Link
                  to="/cart"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">View Cart</p>
                    <p className="text-gray-500 text-sm">Review your items</p>
                  </div>
                </Link>

                {/* Contact Support */}
                <Link
                  to="/support"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Contact Support</p>
                    <p className="text-gray-500 text-sm">Get help</p>
                  </div>
                </Link>
              </div>

              {/* Back to Home Button */}
              <Link
                to="/"
                className="block w-full mt-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
});

OrderFailurePage.displayName = "OrderFailurePage";
