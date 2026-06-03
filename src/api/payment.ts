import { api } from "./axios";

export interface CreateSkipCashPaymentPayload {
  orderId: string;
  totalAmount: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
}

export interface CreateSkipCashPaymentResponse {
  success: boolean;
  paymentUrl: string;
  transactionId?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  orderId: string;
  status: "completed" | "failed" | "pending";
}

export const createSkipCashPayment = async (
  payload: CreateSkipCashPaymentPayload
): Promise<CreateSkipCashPaymentResponse> => {
  try {
    const res = await api.post<CreateSkipCashPaymentResponse>(
      "/payment/skipcash/create-payment",
      payload
    );
    return res.data;
  } catch (error) {
    console.error("createSkipCashPayment error:", error);
    throw error;
  }
};

export const verifySkipCashPayment = async (
  transactionId: string
): Promise<VerifyPaymentResponse> => {
  try {
    const res = await api.get<VerifyPaymentResponse>(
      `/payment/skipcash/verify/${transactionId}`
    );
    return res.data;
  } catch (error) {
    console.error("verifySkipCashPayment error:", error);
    throw error;
  }
};
