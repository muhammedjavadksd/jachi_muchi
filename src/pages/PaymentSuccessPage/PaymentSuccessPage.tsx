import { memo, useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";
import { verifySkipCashPayment } from "../../api/payment";

const PROMOTION_HEADER_HEIGHT = 140;

export const PaymentSuccessPage = memo(function PaymentSuccessPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const transactionId = searchParams.get("transactionId") || searchParams.get("transaction_id") || "";
  const orderId = searchParams.get("orderId") || searchParams.get("order_id") || "";

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  useEffect(() => {
    if (!transactionId && !orderId) {
      setVerifying(false);
      setError("No payment reference found.");
      return;
    }

    const verify = async () => {
      try {
        if (transactionId) {
          const res = await verifySkipCashPayment(transactionId);
          if (res.success && res.status === "completed") {
            setVerified(true);
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        } else {
          setVerified(true);
        }
      } catch {
        setError("Could not verify payment. Please contact support.");
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [transactionId, orderId]);

  const displayId = orderId || transactionId;

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-8 md:py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            {verifying ? (
              <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 text-center">
                <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verifying Payment</h1>
                <p className="text-gray-500">Please wait while we confirm your payment...</p>
              </div>
            ) : verified || (!transactionId && orderId) ? (
              <>
                <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-11 h-11 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
                  <p className="text-gray-600 text-lg mb-2">Your order has been placed successfully.</p>
                  {displayId && (
                    <p className="text-sm text-gray-500 mb-8">
                      Reference: <span className="font-mono font-medium text-gray-700">{displayId}</span>
                    </p>
                  )}

                  <Link
                    to={orderId ? `/order-success/${orderId}` : "/account"}
                    className="inline-block w-full sm:w-auto px-10 py-4 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all active:scale-[0.985]"
                  >
                    View Order Details
                  </Link>
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
              </>
            ) : (
              <>
                <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 text-center mb-8">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-11 h-11 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900 mb-3">Verification Issue</h1>
                  <p className="text-gray-600 mb-2">{error || "We could not verify your payment."}</p>
                  <p className="text-sm text-gray-500 mb-8">Please check your orders page to confirm status.</p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/account"
                      className="px-8 py-4 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all active:scale-[0.985]"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/support"
                      className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.985]"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </Container>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
});

PaymentSuccessPage.displayName = "PaymentSuccessPage";
