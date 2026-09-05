import { useCallback, useEffect, useState } from "react";
import { getMyReturns } from "@/features/returns/api/returnApi";
import {
  RETURN_STATUS_KEY_BY_VALUE,
  RETURN_TRACKING_STEPS,
} from "@/features/returns/constants";
import type { MyReturnItem, ReturnStatusKey } from "@/features/returns/types";

type MyReturnsState =
  | { phase: "loading" }
  | { phase: "error" }
  | { phase: "ready"; returns: MyReturnItem[] };

export interface ReturnTimelineStep {
  key: ReturnStatusKey;
  label: string;
  timestamp?: string;
  state: "completed" | "current" | "future";
}

export interface NormalizedReturn {
  id: string;
  orderId: string;
  statusKey: ReturnStatusKey;
  statusLabel: string;
  reason: string;
  productName: string;
  productImage?: string;
  billImage?: string;
  productImageSrc?: string;
  billImageSrc?: string;
  rejectionReason?: string;
  steps: ReturnTimelineStep[];
}

function normalize(value?: string | ReturnStatusKey): string {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Extract the timestamp for a given step from either flat fields or a timeline array. */
export function extractStepDate(
  item: MyReturnItem,
  key: ReturnStatusKey
): string | undefined {
  const flatMap: Record<ReturnStatusKey, string | undefined> = {
    requested: item.requestedAt || item.createdAt,
    accepted: item.acceptedAt,
    collected: item.collectedAt,
    refunded: item.refundedAt,
    rejected: item.rejectedAt,
  };
  const flat = flatMap[key];
  if (flat) return formatDate(flat);

  const timeline = item.statusTimeline || [];
  for (const entry of timeline) {
    if (RETURN_STATUS_KEY_BY_VALUE[normalize(entry.status)] === key) {
      return formatDate(entry.date || entry.timestamp);
    }
  }
  return undefined;
}

function buildSteps(item: MyReturnItem): ReturnTimelineStep[] {
  const statusKey = RETURN_STATUS_KEY_BY_VALUE[normalize(item.status)] || "requested";
  const isRejected = statusKey === "rejected";
  const currentIndex = RETURN_TRACKING_STEPS.findIndex((step) => step.key === statusKey);

  return RETURN_TRACKING_STEPS.map((step, index) => {
    const timestamp = extractStepDate(item, step.key);
    let state: ReturnTimelineStep["state"];
    if (isRejected) {
      state = timestamp ? "completed" : "future";
    } else if (index < currentIndex) {
      state = "completed";
    } else if (index === currentIndex) {
      state = "current";
    } else {
      state = "future";
    }
    return { key: step.key, label: step.label, timestamp, state };
  });
}

export function useMyReturns() {
  const [state, setState] = useState<MyReturnsState>({ phase: "loading" });
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchReturns = useCallback(async () => {
    setState({ phase: "loading" });
    try {
      const res = await getMyReturns();
      const raw: MyReturnItem[] = res?.data || [];
      setState({ phase: "ready", returns: raw });
    } catch {
      setState({ phase: "error" });
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns, refreshKey]);

  /** Re-fetch the list (e.g. after the user submits a new return). */
  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  const returns: NormalizedReturn[] = state.phase === "ready"
    ? state.returns.map((item, index) => {
        const statusKey = RETURN_STATUS_KEY_BY_VALUE[normalize(item.status)] || "requested";
        return {
          id: item._id || item.returnId || `return-${index}`,
          orderId: item.orderId || item.returnId || item._id || "N/A",
          statusKey,
          statusLabel: RETURN_TRACKING_STEPS.find((s) => s.key === statusKey)?.label || "Requested",
          reason: item.reason || "",
          productName: item.product?.name || "Product",
          productImage: item.product?.image,
          productImageSrc: item.productImage,
          billImageSrc: item.billImage,
          rejectionReason: item.rejectionReason,
          steps: buildSteps(item),
        };
      })
    : [];

  return { state, returns, refetch };
}
