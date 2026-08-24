import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Footer, WhatsAppButton, PromotionHeader } from "@/components";
import { Container } from "@/shared/components/Container/Container";
import { getSkipCashSessionStatus } from "@/features/checkout/api/paymentApi";
import { clearCartApi, notifyCartUpdated } from "@/features/cart/api/cartApi";
import { markCouponAsUsed } from "@/features/coupon/api/couponApi";
import { useAuth } from "@/features/auth/hooks";
import {
  PAYMENT_SESSION_REF_KEY,
  SKIPCASH_POLL_INTERVAL_MS,
  SKIPCASH_POLL_TIMEOUT_MS,
} from "@/features/checkout/constants";

const PROMOTION_HEADER_HEIGHT = 140;
const MAX_CONSECUTIVE_ERRORS = 3;

type ReturnView = "confirming" | "success" | "failed";
type FailureKind = "failed" | "expired" | "timeout" | "invalid" | "error";

const FAILURE_COPY: Record<FailureKind, { title: string; message: string }> = {
  failed: {
    title: "Payment Failed",
    message: "We couldn't process your payment. Your order has not been placed.",
  },
  expired: {
    title: "Payment Session Expired",
    message: "The payment session expired before it could be completed. Your order has not been placed.",
  },
  timeout: {
    title: "Payment Not Confirmed",
    message: "We didn't receive confirmation for your payment in time. If any amount was debited, it will be verified automatically — please retry checkout or contact support.",
  },
  invalid: {
    title: "Payment Reference Not Found",
    message: "We couldn't find a valid payment session to verify. Please go back to checkout and place your order again.",
  },
  error: {
    title: "Payment Could Not Be Verified",
    message: "Something went wrong while confirming your payment. Please try again or contact support if your account was debited.",
  },
};

export const PaymentReturnPage = memo(function PaymentReturnPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const sessionRef = useMemo(() => {
    const fromUrl = searchParams.get("ref") || "";
    if (fromUrl) return fromUrl;
    try {
      return localStorage.getItem(PAYMENT_SESSION_REF_KEY) || "";
    } catch {
      return "";
    }
  }, [searchParams]);

  const [view, setView] = useState<ReturnView>("confirming");
  const [orderId, setOrderId] = useState("");
  const [failureKind, setFailureKind] = useState<FailureKind>("error");

  const finalizeSuccess = useCallback((completedOrderId?: string) => {
    setOrderId(completedOrderId || "");
    setView("success");
    try {
      const pendingCoupon = localStorage.getItem("pendingCouponMark");
      if (pendingCoupon && user?.id && completedOrderId) {
        markCouponAsUsed(pendingCoupon, user.id, completedOrderId).catch(() => {});
      }
      localStorage.removeItem("pendingCouponMark");
      localStorage.removeItem(PAYMENT_SESSION_REF_KEY);
    } catch {}
    clearCartApi()
      .then(() => notifyCartUpdated())
      .catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    if (!sessionRef) {
      setFailureKind("invalid");
      setView("failed");
      return;
    }
    let cancelled = false;
    let consecutiveErrors = 0;
    const deadline = Date.now() + SKIPCASH_POLL_TIMEOUT_MS;
    const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

    const run = async () => {
      setView("confirming");
      while (!cancelled) {
        try {
          const snapshot = await getSkipCashSessionStatus(sessionRef);
          if (cancelled) return;
          consecutiveErrors = 0;
          if (snapshot.status === "COMPLETED") {
            finalizeSuccess(snapshot.orderId);
            return;
          }
          if (snapshot.status === "FAILED" || snapshot.status === "EXPIRED") {
            setFailureKind(snapshot.status === "EXPIRED" ? "expired" : "failed");
            setView("failed");
            return;
          }
          if (Date.now() >= deadline) {
            setFailureKind("timeout");
            setView("failed");
            return;
          }
        } catch (error) {
          console.error("[PaymentReturn] Status check failed:", error);
          if (cancelled) return;
          consecutiveErrors += 1;
          if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS || Date.now() >= deadline) {
            setFailureKind("error");
            setView("failed");
            return;
          }
        }
        await wait(SKIPCASH_POLL_INTERVAL_MS);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [sessionRef, finalizeSuccess]);

  const spacerStyle = useMemo(() => ({
    height: `${PROMOTION_HEADER_HEIGHT}px`,
  }), []);

  const failureCopy = FAILURE_COPY[view === "failed" ? failureKind : "error"];

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <PromotionHeader />
      <div style={spacerStyle} />

      <main className="flex-1 py-8 md:py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            {view === "confirming" && (
              <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 text-center mb-8">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-7 h-7 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Confirming your payment...</h1>
                <p className="text-gray-600 text-lg mb-2">
                  Please don't close or refresh this page.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  This usually takes just a few seconds.
                </p>
                <p className="text-xs text-gray-400">
                  Ref: <span className="font-mono break-all">{sessionRef}</span>
                </p>
              </div>
            )}

            {view === "success" && (
              <>
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
              </>
            )}

            {view === "failed" && (
              <>
                <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 text-center mb-8">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-11 h-11 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{failureCopy.title}</h1>
                  <p className="text-gray-600 text-lg mb-8">{failureCopy.message}</p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/checkout"
                      className="px-8 py-4 bg-teal-700 text-white font-semibold rounded-2xl hover:bg-teal-800 transition-all active:scale-[0.985]"
                    >
                      Retry Checkout
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

PaymentReturnPage.displayName = "PaymentReturnPage";
