import type { ReturnReason, ReturnStatusKey } from "@/features/returns/types";

/** Fixed reason list — must match the backend enum exactly. */
export const RETURN_REASONS: ReturnReason[] = [
  "Product damaged or defective",
  "Wrong product received",
  "Size / fit issue",
  "Product not as described",
  "Changed my mind",
  "Missing parts or accessories",
];

export const RETURN_SUCCESS_MESSAGE =
  "Return order processing, shortly you will get a confirmation message.";

export const RETURN_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

export const RETURN_IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/** Ordered steps for the return status tracker (Requested -> ... -> Refunded). */
export const RETURN_TRACKING_STEPS: { key: ReturnStatusKey; label: string }[] = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "collected", label: "Collected" },
  { key: "refunded", label: "Refunded" },
];

/** Maps a raw backend status string to a normalized ReturnStatusKey. */
export const RETURN_STATUS_KEY_BY_VALUE: Record<string, ReturnStatusKey> = {
  requested: "requested",
  pending: "requested",
  submitted: "requested",
  accepted: "accepted",
  approved: "accepted",
  collected: "collected",
  picked: "collected",
  picked_up: "collected",
  refunded: "refunded",
  refund: "refunded",
  completed: "refunded",
  rejected: "rejected",
  declined: "rejected",
  cancelled: "rejected",
};

export const RETURN_STATUS_META: Record<
  ReturnStatusKey,
  { label: string; badge: string; dot: string; icon: "clock" | "check" | "package" | "banknote" | "x" }
> = {
  requested: {
    label: "Requested",
    badge: "bg-amber-400/10 text-amber-300 ring-amber-400/30",
    dot: "bg-amber-400",
    icon: "clock",
  },
  accepted: {
    label: "Accepted",
    badge: "bg-blue-400/10 text-blue-300 ring-blue-400/30",
    dot: "bg-blue-400",
    icon: "check",
  },
  collected: {
    label: "Collected",
    badge: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/30",
    dot: "bg-indigo-400",
    icon: "package",
  },
  refunded: {
    label: "Refunded",
    badge: "bg-green-400/10 text-green-300 ring-green-400/30",
    dot: "bg-green-400",
    icon: "banknote",
  },
  rejected: {
    label: "Rejected",
    badge: "bg-red-400/10 text-red-300 ring-red-400/30",
    dot: "bg-red-400",
    icon: "x",
  },
};
