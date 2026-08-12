import { api } from "@/shared/lib/axios";
import type { TrackOrderResponse } from "@/features/orderTracking/types";

/**
 * Fetch order tracking data for a public (non-authenticated) order.
 * Hits GET /api/track/:orderId. The backend returns 404 when the order
 * is unknown; the caller surfaces that as the "Order not found" state.
 */
export const trackOrder = async (orderId: string): Promise<TrackOrderResponse> => {
  const res = await api.get(`/track/${encodeURIComponent(orderId)}`);
  return res.data;
};
