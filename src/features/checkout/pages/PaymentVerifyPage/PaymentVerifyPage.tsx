import { memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifySkipCashTransaction } from "@/features/checkout/api/paymentApi";

export const PaymentVerifyPage = memo(function PaymentVerifyPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const id = searchParams.get("id");
    const statusId = searchParams.get("statusId");

    if (!id) {
      navigate("/payment-failed", { replace: true });
      return;
    }

    const verify = async () => {
      try {
        const res = await verifySkipCashTransaction({
          transactionId: id,
          paymentId: id,
          statusId: statusId || undefined,
        });

        if (res.success && res.data?.status === "paid") {
          const orderId = res.data.orderId || id;
          navigate(`/payment-success/${orderId}`, { replace: true });
        } else {
          navigate("/payment-failed", { replace: true });
        }
      } catch {
        setMessage("Verification failed. Redirecting...");
        setTimeout(() => navigate("/payment-failed", { replace: true }), 1000);
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
});

PaymentVerifyPage.displayName = "PaymentVerifyPage";
