import { api } from "@/shared/lib/axios";
import type {
  InitiateSkipCashPaymentPayload,
  InitiateSkipCashPaymentResponse,
  SkipCashSessionStatus,
  SkipCashSessionStatusResponse,
  VerifyPaymentResponse,
  SkipCashVerifyQuery,
  SkipCashVerifyResponse,
  RetryPaymentResponse,
} from "@/features/checkout/types";

export interface SkipCashInitiation {
  paymentUrl: string;
  sessionRef: string;
}

export interface SkipCashSessionSnapshot {
  status: SkipCashSessionStatus;
  orderId?: string;
}

export const initiateSkipCashPayment = async (
  payload: InitiateSkipCashPaymentPayload
): Promise<SkipCashInitiation> => {
  const res = await api.post<InitiateSkipCashPaymentResponse>(
    "/payments/skipcash/initiate",
    payload
  );
  const body = res.data;
  if (body?.success !== true) {
    throw new Error(body?.message || "Could not initiate the payment session.");
  }
  const paymentUrl = body.data?.paymentUrl;
  const sessionRef = body.data?.ref;
  if (!paymentUrl || !sessionRef) {
    throw new Error("Payment session response did not include a redirect URL.");
  }
  return { paymentUrl, sessionRef };
};

export const getSkipCashSessionStatus = async (
  sessionRef: string
): Promise<SkipCashSessionSnapshot> => {
  const res = await api.get<SkipCashSessionStatusResponse>(
    `/payments/skipcash/session/${encodeURIComponent(sessionRef)}/status`
  );
  const body = res.data;
  return {
    status: (body?.data?.status ?? body?.status ?? "INITIATED") as SkipCashSessionStatus,
    orderId: body?.data?.orderId ?? body?.orderId,
  };
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
