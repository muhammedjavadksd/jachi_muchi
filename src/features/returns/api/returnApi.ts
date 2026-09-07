import { api } from "@/shared/lib/axios";
import type {
  MyReturnsResponse,
  ReturnCreateRequest,
  ReturnCreateResponse,
  ReturnEligibility,
} from "@/features/returns/types";

/**
 * Fetch return eligibility for a single delivered order item.
 * GET /api/returns/eligibility?orderId=...&orderItemId=...
 * Returns { eligible, reason?, deadline? }.
 */
export const getReturnEligibility = async (orderId: string, orderItemId: string): Promise<ReturnEligibility> => {
  const res = await api.get<{
    success: boolean;
    data?: {
      eligible?: boolean;
      message?: string;
      daysRemaining?: number | null;
      maxAttemptsReached?: boolean;
      rejectionReason?: string;
    };
  }>(
    "/returns/eligibility",
    { params: { orderId, orderItemId } }
  );
  const data = res.data?.data;
  return {
    eligible: Boolean(data?.eligible),
    reason: data?.message,
    maxAttemptsReached: Boolean(data?.maxAttemptsReached),
    rejectionReason: data?.rejectionReason,
    deadline:
      data?.daysRemaining != null
        ? new Date(Date.now() + data.daysRemaining * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
  };
};

/**
 * Create a return request.
 * POST /api/returns (multipart/form-data: orderId, orderItemId, reason,
 * billImage, productImage). Returns { message, returnId }.
 */
export const submitReturn = async (request: ReturnCreateRequest): Promise<ReturnCreateResponse> => {
  const formData = new FormData();
  formData.append("orderId", request.orderId);
  formData.append("orderItemId", request.orderItemId);
  formData.append("reason", request.reason);
  formData.append("billImage", request.billImage);
  formData.append("productImage", request.productImage);

  const res = await api.post<ReturnCreateResponse>("/returns", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/** Fetch the logged-in user's return requests. GET /api/returns/my */
export const getMyReturns = async (): Promise<MyReturnsResponse> => {
  const res = await api.get("/returns/my");
  return res.data;
};
