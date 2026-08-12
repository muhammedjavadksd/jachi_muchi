import { memo, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "@/components";
import { Container } from "@/shared/components/Container/Container";

const PROMOTION_HEADER_HEIGHT = 140;

export const PaymentFailedPage = memo(function PaymentFailedPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  searchParams.get("orderId"); // orderId reserved for future use

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
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-11 h-11 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Payment Failed</h1>
              <p className="text-gray-600 text-lg mb-2">
                We were unable to process your payment.
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Your order has not been placed. Please try again or choose a different payment method.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/checkout"
                  className="px-8 py-4 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all active:scale-[0.985]"
                >
                  Try Again
                </Link>
                <Link
                  to="/"
                  className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.985]"
                >
                  Return Home
                </Link>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-amber-900 mb-2 text-lg">Need help?</h2>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    If you encountered an error during payment, please contact our support team. No amount has been charged.
                  </p>
                  <Link
                    to="/support"
                    className="inline-block mt-3 text-amber-700 font-medium underline underline-offset-2 hover:text-amber-800"
                  >
                    Contact Support
                  </Link>
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

PaymentFailedPage.displayName = "PaymentFailedPage";
