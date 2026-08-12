import type { TrackStatusKey, TrackStepKey } from "@/features/orderTracking/types";

export const TRACKING_STEPS: { key: TrackStepKey; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export const TRACKING_STEP_KEY_BY_STATUS: Record<string, TrackStepKey | "cancelled"> = {
  pending: "pending",
  placed: "pending",
  "order placed": "pending",
  "order placed successfully": "pending",
  confirmed: "confirmed",
  "order confirmed": "confirmed",
  processing: "processing",
  "in process": "processing",
  shipped: "shipped",
  "out for delivery": "shipped",
  outfordelivery: "shipped",
  out_for_delivery: "shipped",
  "out-for-delivery": "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
  canceled: "cancelled",
  refunded: "cancelled",
};

export const TRACK_STATUS_KEY_BY_VALUE: Record<string, TrackStatusKey> = {
  pending: "pending",
  placed: "pending",
  "order placed": "pending",
  "order placed successfully": "pending",
  confirmed: "confirmed",
  "order confirmed": "confirmed",
  processing: "processing",
  "in process": "processing",
  shipped: "shipped",
  "out for delivery": "shipped",
  outfordelivery: "shipped",
  out_for_delivery: "shipped",
  "out-for-delivery": "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
  canceled: "cancelled",
  refunded: "cancelled",
};

export const TRACK_STATUS_META: Record<
  TrackStatusKey,
  { label: string; badge: string; icon: "clock" | "check" | "truck" | "package" | "x" }
> = {
  pending: { label: "Pending", badge: "bg-amber-400/10 text-amber-300 ring-amber-400/30", icon: "clock" },
  confirmed: { label: "Confirmed", badge: "bg-blue-400/10 text-blue-300 ring-blue-400/30", icon: "check" },
  processing: { label: "Processing", badge: "bg-blue-400/10 text-blue-300 ring-blue-400/30", icon: "truck" },
  shipped: { label: "Shipped", badge: "bg-blue-400/10 text-blue-300 ring-blue-400/30", icon: "package" },
  delivered: { label: "Delivered", badge: "bg-green-400/10 text-green-300 ring-green-400/30", icon: "check" },
  cancelled: { label: "Cancelled", badge: "bg-red-400/10 text-red-300 ring-red-400/30", icon: "x" },
};

export const TRACK_PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: "Cash on Delivery",
  cash: "Cash on Delivery",
  online: "Online",
  upi: "Online",
  card: "Online",
  skipcash: "Online",
};

export const TRACK_PAYMENT_STATUS_META: Record<string, { label: string; badge: string }> = {
  pending: { label: "Pending", badge: "bg-amber-400/10 text-amber-300 ring-amber-400/30" },
  paid: { label: "Paid", badge: "bg-green-400/10 text-green-300 ring-green-400/30" },
  collected: { label: "Collected", badge: "bg-green-400/10 text-green-300 ring-green-400/30" },
  success: { label: "Paid", badge: "bg-green-400/10 text-green-300 ring-green-400/30" },
  failed: { label: "Failed", badge: "bg-red-400/10 text-red-300 ring-red-400/30" },
};
