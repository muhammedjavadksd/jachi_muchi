import { useState, useCallback } from "react";

export function usePayment() {
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handlePaymentMethodChange = useCallback((method: string) => {
    setPaymentMethod(method);
  }, []);

  return {
    paymentMethod,
    setPaymentMethod: handlePaymentMethodChange,
  };
}
