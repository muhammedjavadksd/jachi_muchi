import { api } from "./axios";

export interface CreateSkipCashPaymentPayload {
  orderId: string;
  amount: number;
  customerName: string;
  email: string;
  phone: string;
}

export interface CreateSkipCashPaymentResponse {
  success: boolean;
  data?: {
    paymentUrl: string;
    transactionId?: string;
    paymentId?: string;
  };
  message?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  orderId?: string;
  status?: string;
}

export interface SkipCashVerifyQuery {
  transactionId: string;
  paymentId?: string;
  statusId?: string;
}

export interface SkipCashVerifyResponse {
  success: boolean;
  data?: {
    status: "paid" | "failed" | "pending";
    orderId?: string;
  };
}

export const createSkipCashPayment = async (
  payload: CreateSkipCashPaymentPayload
): Promise<CreateSkipCashPaymentResponse> => {
  const res = await api.post<CreateSkipCashPaymentResponse>(
    "/payment/skipcash/create-payment",
    payload
  );
  return res.data;
};

export const verifySkipCashPayment = async (
  orderId: string
): Promise<VerifyPaymentResponse> => {
  const res = await api.get<VerifyPaymentResponse>(
    `/payment/skipcash/status/${orderId}`
  );
  return res.data;
};

export interface RetryPaymentResponse {
  success: boolean;
  checkoutUrl?: string;
  message?: string;
}

export const retrySkipCashPayment = async (
  orderId: string
): Promise<RetryPaymentResponse> => {
  const res = await api.post<RetryPaymentResponse>(
    `/payment/skipcash/retry/${orderId}`
  );
  return res.data;
};

export const verifySkipCashTransaction = async (
  query: SkipCashVerifyQuery
): Promise<SkipCashVerifyResponse> => {
  const res = await api.get<SkipCashVerifyResponse>(
    `/payment/skipcash/verify/${query.transactionId}`,
    { params: { id: query.paymentId, statusId: query.statusId } }
  );
  return res.data;
};
