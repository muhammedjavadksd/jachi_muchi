import { useCallback, useMemo } from "react";
import { useMyReturns } from "./useMyReturns";
import { RETURN_STATUS_KEY_BY_VALUE } from "@/features/returns/constants";
import { dedupeReturns } from "@/features/returns/helpers/dedupeReturns";
import {
  extractRejectionReason,
  hasFinalRejectionFlag,
  isFinalRejection,
  normalizeStatus,
} from "@/features/returns/helpers/returnResolution";
import type { ReturnStatusKey } from "@/features/returns/types";
import type { MyReturnItem } from "@/features/returns/types";

export interface OrderItemReturnInfo {
  statusKey: ReturnStatusKey;
  statusLabel: string;
  /** OrderItemReturnInfo describes one resolved order item. */
  orderItemId?: string;
  rejectionReason?: string;
  /** True when this order item has used up its return attempts. */
  isFinalRejection: boolean;
  /** True when the customer may attempt the return one more time. */
  canRetry: boolean;
}

const STATUS_LABEL: Record<ReturnStatusKey, string> = {
  requested: "Return Requested",
  accepted: "Return Accepted",
  collected: "Return Collected",
  refunded: "Refunded",
  rejected: "Return Rejected",
};

/**
 * Fetch the current user's return requests and index them by
 * `${orderId}::${orderItemId}` so the Orders page can reflect the true return
 * state of every order item (Pending/Approved/Rejected…) instead of relying
 * only on the (sometimes stale) `returnStatus` snapshot from the order API.
 *
 * Rejection metadata (admin reason + final-attempt flag) is carried along so
 * the Orders page can show the actual reason and expose a one-chance
 * "Return Again" flow (or no flow at all after the second rejection).
 */
export function useOrderReturnStatus() {
  const { state, rawReturns } = useMyReturns();

  // Orders that carry an explicit maxAttemptsReached/finalRejection record.
  const finalOrders = useMemo(() => {
    const set = new Set<string>();
    for (const item of rawReturns) {
      const orderId = item.orderId || "";
      if (!orderId || set.has(orderId) || !hasFinalRejectionFlag(rawReturns, orderId)) continue;
      set.add(orderId);
    }
    return set;
  }, [rawReturns]);

  const byItem = useMemo(() => {
    const map: Record<string, OrderItemReturnInfo> = {};
    if (state.phase !== "ready") return map;

    for (const item of dedupeReturns(state.returns)) {
      const orderId = item.orderId || "";
      const orderItemId = item.orderItemId || "";
      if (!orderId || !orderItemId) continue;

      const raw = String(item.status || "").toLowerCase();
      const statusKey = RETURN_STATUS_KEY_BY_VALUE[raw] || "requested";
      const rejectedCount = countRejections(rawReturns, orderId, orderItemId);
      const final =
        statusKey === "rejected" &&
        (isFinalRejection(item, rejectedCount) || finalOrders.has(orderId));

      map[`${orderId}::${orderItemId}`] = {
        statusKey,
        statusLabel: STATUS_LABEL[statusKey] || STATUS_LABEL.requested,
        orderItemId,
        rejectionReason: extractRejectionReason(item),
        isFinalRejection: final,
        canRetry: statusKey === "rejected" && !final,
      };
    }
    return map;
  }, [state, rawReturns, finalOrders]);

  const getItemReturn = useCallback(
    (orderId: string, orderItemId: string): OrderItemReturnInfo | undefined =>
      byItem[`${orderId}::${orderItemId}`],
    [byItem]
  );

  const isOrderFinalRejected = useCallback(
    (orderId: string): boolean => Boolean(orderId && finalOrders.has(orderId)),
    [finalOrders]
  );

  return { inFlight: state.phase === "loading", getItemReturn, isOrderFinalRejected };
}

/** Count rejected records for one order item in the raw (pre-dedupe) list. */
function countRejections(items: MyReturnItem[], orderId: string, orderItemId: string): number {
  let count = 0;
  for (const item of items) {
    if (item.orderId !== orderId || item.orderItemId !== orderItemId) continue;
    if (RETURN_STATUS_KEY_BY_VALUE[normalizeStatus(item.status)] === "rejected") count += 1;
  }
  return count;
}
