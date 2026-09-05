import { api } from "@/shared/lib/axios";
import type {
  MyReturnsResponse,
  ReturnCreateRequest,
  ReturnCreateResponse,
  ReturnEligibility,
} from "@/features/returns/types";

/**
 * Fetch return eligibility for a single delivered order item.
 * GET /api/orders/:orderId/return-eligibility
 * Returns { eligible, reason?, deadline? }.
 */
export const getReturnEligibility = async (orderId: string): Promise<ReturnEligibility> => {
  const res = await api.get(`/orders/${encodeURIComponent(orderId)}/return-eligibility`);
  return res.data;
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
