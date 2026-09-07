import { memo } from "react";
import { RotateCcw } from "lucide-react";
import { RETURN_AGAIN_LABEL } from "@/features/returns/constants";

interface ReturnAgainButtonProps {
  orderId: string;
  orderItemId: string;
  productName?: string;
  productImage?: string;
}

/**
 * "Return Again" entry point shown for an order item after its FIRST rejection,
 * giving the customer one more chance to submit a fresh return request for the
 * same product. Reuses the standard return-request flow: dispatches the
 * `return:open-form` window event that `ReturnFormModal` listens for.
 * Deliberately styled as a solid-fill action button (distinct from the static
 * status chip rendered next to it).
 */
export const ReturnAgainButton = memo(function ReturnAgainButton({
  orderId,
  orderItemId,
  productName,
  productImage,
}: ReturnAgainButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("return:open-form", {
            detail: { orderId, orderItemId, productName, productImage },
          })
        );
      }}
      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors active:scale-[0.985]"
    >
      <RotateCcw className="w-3.5 h-3.5" />
      {RETURN_AGAIN_LABEL}
    </button>
  );
});

ReturnAgainButton.displayName = "ReturnAgainButton";