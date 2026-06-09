import { memo, useMemo, useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "../../components";
import { Container } from "../../components/Container/Container";
import { verifySkipCashPayment } from "../../api/payment";

const PROMOTION_HEADER_HEIGHT = 140;
const POLL_INTERVAL = 5000;

export const PaymentPendingPage = memo(function PaymentPendingPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [checking, setChecking] = useState(false);
  const [resolved, setResolved] = useState(false);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  const checkStatus = useCallback(async () => {
    if (!orderId || resolved) return;
    setChecking(true);
    try {
      const res = await verifySkipCashPayment(orderId);
      if (res.success && (res.status === "paid" || res.status === "completed" || res.status === "success")) {
        setResolved(true);
        window.location.href = `/payment/success?orderId=${orderId}`;
      }
    } catch {
      // silent - will retry
    } finally {
      setChecking(false);
    }
  }, [orderId, resolved]);

  useEffect(() => {
    if (!orderId) return;

    const timer = setInterval(checkStatus, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [orderId, checkStatus]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-8 md:py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 text-center mb-8">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {checking ? (
                  <div className="w-7 h-7 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-11 h-11 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Payment Pending</h1>
              <p className="text-gray-600 text-lg mb-2">
                Your payment is being processed.
              </p>
              <p className="text-sm text-gray-500 mb-3">
                This usually takes a few seconds. We are checking the status automatically.
              </p>
              {orderId && (
                <p className="text-xs text-gray-400 mb-8">
                  Order: <span className="font-mono text-gray-500">{orderId}</span>
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={checkStatus}
                  disabled={checking}
                  className="px-8 py-4 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all active:scale-[0.985] disabled:bg-gray-300"
                >
                  {checking ? "Checking..." : "Check Status"}
                </button>
                <Link
                  to="/"
                  className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.985]"
                >
                  Return Home
                </Link>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-blue-900 mb-2 text-lg">What does pending mean?</h2>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    Your payment has been received but is still being confirmed by the payment gateway.
                    This usually resolves within a few minutes. You can check back using the button above.
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

PaymentPendingPage.displayName = "PaymentPendingPage";
