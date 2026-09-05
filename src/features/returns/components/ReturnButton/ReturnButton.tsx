import { memo } from "react";
import { RotateCcw, Clock } from "lucide-react";
import { useReturnEligibility } from "@/features/returns/hooks";

interface ReturnButtonProps {
  orderId: string;
  orderItemId: string;
  productName?: string;
  productImage?: string;
}

/**
 * Eligibility-driven "Return" entry point for a single delivered order item.
 * Requests GET /api/orders/:orderId/return-eligibility.
 *  - Only renders a "Return" button when eligible is true.
 *  - When not eligible, hides the button entirely (with a small "X days left
 *    to return" notice only if the window is about to expire, i.e. <= 1 day).
 *  - While eligibility loads, a compact skeleton is shown.
 */
export const ReturnButton = memo(function ReturnButton({
  orderId,
  orderItemId,
  productName,
  productImage,
}: ReturnButtonProps): JSX.Element | null {
  const eligibility = useReturnEligibility(orderId);

  if (eligibility.phase === "loading") {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-gray-100 text-xs font-semibold text-gray-400"
      >
        <span className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" />
        Checking...
      </button>
    );
  }

  if (eligibility.phase === "error") return null;

  const { eligible, daysLeft } = eligibility;

  if (eligible) {
    return (
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent("return:open-form", {
              detail: { orderId, orderItemId, productName, productImage, deadline: eligibility.deadline },
            })
          );
        }}
        className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Return
      </button>
    );
  }

  // Not eligible: hide the button. Only surface a "days left" notice when the
  // return window is about to expire (<= 1 day remaining).
  if (daysLeft !== undefined && daysLeft <= 1) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-amber-600">
        <Clock className="w-3.5 h-3.5 shrink-0" />
        {daysLeft <= 0 ? "Expires today" : `${daysLeft} day${daysLeft > 1 ? "s" : ""} left to return`}
      </span>
    );
  }

  return null;
});

ReturnButton.displayName = "ReturnButton";
