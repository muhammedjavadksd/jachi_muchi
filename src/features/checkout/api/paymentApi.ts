import { api } from "@/shared/lib/axios";
import type {
  CreateSkipCashPaymentPayload,
  CreateSkipCashPaymentResponse,
  VerifyPaymentResponse,
  SkipCashVerifyQuery,
  SkipCashVerifyResponse,
  RetryPaymentResponse,
} from "@/features/checkout/types";

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
