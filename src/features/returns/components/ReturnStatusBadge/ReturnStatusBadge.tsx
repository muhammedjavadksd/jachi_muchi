import { memo } from "react";
import { Banknote, CheckCircle2, Clock, Info, Package, XCircle } from "lucide-react";
import {
  RETURN_DISCONTINUED_LABEL,
  RETURN_FINAL_REJECTION_MESSAGE,
  RETURN_STATUS_KEY_BY_VALUE,
} from "@/features/returns/constants";
import type { ReturnStatusKey } from "@/features/returns/types";

interface ReturnStatusBadgeProps {
  status?: string;
  /** Optional reason — surfaced via a focusable "i" tooltip for rejections. */
  rejectionReason?: string;
  /** Optional: true when the item used up its final return attempt. */
  finalRejection?: boolean;
}

const BADGE_LABELS: Record<ReturnStatusKey, string> = {
  requested: "Return Requested",
  accepted: "Return Accepted",
  collected: "Return Collected",
  refunded: "Refunded",
  rejected: "Return Rejected",
};

const BADGE_CLASSES: Record<ReturnStatusKey, string> = {
  requested: "bg-amber-50 text-amber-700 ring-amber-200/80",
  accepted: "bg-blue-50 text-blue-700 ring-blue-200/80",
  collected: "bg-indigo-50 text-indigo-700 ring-indigo-200/80",
  refunded: "bg-green-50 text-green-700 ring-green-200/80",
  rejected: "bg-red-50 text-red-700 ring-red-200/80",
};

const STATUS_ICONS: Record<ReturnStatusKey, JSX.Element> = {
  requested: <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />,
  accepted: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />,
  collected: <Package className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />,
  refunded: <Banknote className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />,
  rejected: <XCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />,
};

/**
 * Static, read-only status chip for an order item's return state. Each status
 * pairs a distinct icon with a distinct color so states are scannable at a
 * glance and distinguishable without color alone. Deliberately styled as a
 * non-interactive chip (subtle background fill, inset ring, no hover state,
 * `cursor-default`, `select-none`) — in contrast to solid-fill action buttons —
 * so users never mistake it for clickable control.
 *
 * A rejected return surfaces a focusable "i" indicator (hover, tap or focus)
 * with a tooltip. First rejection → the admin's actual reason; final rejection
 * (`finalRejection`) → the "Return Discontinued" state with the nearest-branch
 * message, matching what the "My Returns" tracker shows.
 */
export const ReturnStatusBadge = memo(function ReturnStatusBadge({
  status,
  rejectionReason,
  finalRejection,
}: ReturnStatusBadgeProps): JSX.Element | null {
  const key = status ? RETURN_STATUS_KEY_BY_VALUE[status] : undefined;
  if (!key) return null;

  const showReason =
    key === "rejected" &&
    Boolean(finalRejection ? RETURN_FINAL_REJECTION_MESSAGE : rejectionReason);
  const message = finalRejection ? RETURN_FINAL_REJECTION_MESSAGE : rejectionReason;
  const label = finalRejection && key === "rejected" ? RETURN_DISCONTINUED_LABEL : BADGE_LABELS[key];
  const described = showReason ? `${label}: ${message}` : label;

  return (
    <span className="relative inline-flex group">
      <span
        aria-label={described}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset cursor-default select-none ${BADGE_CLASSES[key]}`}
      >
        {STATUS_ICONS[key]}
        {label}
        {showReason && (
          <span
            role="img"
            aria-label={finalRejection ? "Why can't I return this item?" : "Tap for rejection reason"}
            tabIndex={0}
            className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center cursor-help outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <Info className="w-2.5 h-2.5" strokeWidth={3} />
          </span>
        )}
      </span>

      {showReason && (
        <span
          role="tooltip"
          className="pointer-events-none absolute right-0 bottom-full mb-2 w-60 rounded-lg bg-gray-900 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-40 shadow-lg"
        >
          <span className="font-semibold block mb-0.5">
            {finalRejection ? "Return Discontinued" : "Why was it rejected?"}
          </span>
          <span className="text-gray-200 leading-snug block">{message}</span>
          <span className="absolute right-3 top-full -mt-1 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
});

ReturnStatusBadge.displayName = "ReturnStatusBadge";