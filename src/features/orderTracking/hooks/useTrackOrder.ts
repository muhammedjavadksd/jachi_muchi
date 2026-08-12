import { useCallback, useEffect, useState } from "react";
import { trackOrder } from "@/features/orderTracking/api/trackApi";
import {
  TRACKING_STEPS,
  TRACKING_STEP_KEY_BY_STATUS,
  TRACK_STATUS_KEY_BY_VALUE,
} from "@/features/orderTracking/constants";
import type {
  TrackOrderData,
  TrackOrderResponse,
  TrackStatusKey,
  TrackingStep,
} from "@/features/orderTracking/types";

type TrackRequestState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "not_found" }
  | { phase: "error" }
  | { phase: "success"; order: TrackOrderData };

function normalizeStatusKey(value?: string): string {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function unwrapOrder(response: TrackOrderResponse | TrackOrderData | null | undefined): TrackOrderData | null {
  if (!response || typeof response !== "object") return null;
  const obj = response as Record<string, unknown>;
  if ("success" in obj && "data" in obj) {
    if (obj.success === false) return null;
    const data = obj.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    return data as TrackOrderData;
  }
  return obj as TrackOrderData;
}

function formatTrackDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function buildTrackingSteps(order: TrackOrderData): {
  steps: TrackingStep[];
  isCancelled: boolean;
  cancelledDate?: string;
} {
  const entries = order.timeline?.length ? order.timeline : order.statusTimeline;
  const rawEntries = entries || [];

  const completedByKey: Partial<Record<TrackingStep["key"], string>> = {};
  let sawCancelled = false;
  let cancelledDate: string | undefined;

  rawEntries.forEach((entry) => {
    const key = TRACKING_STEP_KEY_BY_STATUS[normalizeStatusKey(entry.status)];
    const ts = entry.timestamp || entry.date;
    if (key === "cancelled") {
      sawCancelled = true;
      if (ts) cancelledDate = ts;
      return;
    }
    if (key && ts) completedByKey[key] = ts;
  });

  const statusKey: TrackStatusKey =
    TRACK_STATUS_KEY_BY_VALUE[normalizeStatusKey(order.orderStatus || order.status)] || "pending";
  const isCancelled = statusKey === "cancelled" || sawCancelled;

  let currentKey: TrackingStep["key"] | undefined;
  if (!isCancelled) {
    currentKey = statusKey as TrackingStep["key"];
    if (currentKey === "delivered") currentKey = undefined;
  }
  const currentIndex = currentKey ? TRACKING_STEPS.findIndex((step) => step.key === currentKey) : -1;

  const steps: TrackingStep[] = TRACKING_STEPS.map((step, index) => {
    const timestamp = completedByKey[step.key];
    let state: TrackingStep["state"];
    if (isCancelled) {
      state = timestamp ? "completed" : "future";
    } else if (currentIndex !== -1 && index < currentIndex) {
      state = "completed";
    } else if (step.key === currentKey) {
      state = "current";
    } else if (timestamp) {
      state = "completed";
    } else {
      state = "future";
    }
    return {
      key: step.key,
      label: step.label,
      timestamp: timestamp ? formatTrackDate(timestamp) : undefined,
      state,
    };
  });

  return { steps, isCancelled, cancelledDate: cancelledDate ? formatTrackDate(cancelledDate) : undefined };
}

export interface UseTrackOrderReturn {
  state: TrackRequestState;
  order: TrackOrderData | null;
  steps: TrackingStep[];
  isCancelled: boolean;
  cancelledDate?: string;
  statusKey: TrackStatusKey;
  placedDate: string;
  estimatedDelivery: string;
  orderIdDisplay: string;
  retry: () => void;
}

export function useTrackOrder(orderId: string): UseTrackOrderReturn {
  const [state, setState] = useState<TrackRequestState>(orderId ? { phase: "loading" } : { phase: "idle" });

  const fetchOrder = useCallback(async (id: string) => {
    if (!id) {
      setState({ phase: "idle" });
      return;
    }
    setState({ phase: "loading" });
    try {
      const response = await trackOrder(id);
      const order = unwrapOrder(response);
      if (!order) {
        setState({ phase: "not_found" });
        return;
      }
      setState({ phase: "success", order });
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      setState(status === 404 ? { phase: "not_found" } : { phase: "error" });
    }
  }, []);

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId, fetchOrder]);

  const retry = useCallback(() => {
    fetchOrder(orderId);
  }, [fetchOrder, orderId]);

  const order = state.phase === "success" ? state.order : null;
  const built = order ? buildTrackingSteps(order) : { steps: [], isCancelled: false, cancelledDate: undefined };

  const statusKey: TrackStatusKey = order
    ? (TRACK_STATUS_KEY_BY_VALUE[normalizeStatusKey(order.orderStatus || order.status)] || "pending")
    : "pending";

  return {
    state,
    order,
    steps: built.steps,
    isCancelled: built.isCancelled,
    cancelledDate: built.cancelledDate,
    statusKey,
    placedDate: order ? formatTrackDate(order.createdAt) : "",
    estimatedDelivery: order ? formatTrackDate(order.estimatedDelivery || order.deliveryDate) : "",
    orderIdDisplay: order?.orderId || order?._id || order?.id || orderId || "",
    retry,
  };
}
