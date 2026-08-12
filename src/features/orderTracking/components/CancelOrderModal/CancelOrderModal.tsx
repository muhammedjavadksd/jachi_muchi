import { memo, useEffect } from "react";
import { Loader2, X } from "lucide-react";

interface CancelOrderModalProps {
  orderId: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

/**
 * Dark-themed confirmation modal for cancelling an order. Replaces window.confirm()
 * and follows the existing fixed-overlay modal pattern used across the app.
 */
export const CancelOrderModal = memo(function CancelOrderModal({
  orderId,
  open,
  onClose,
  onConfirm,
  loading,
}: CancelOrderModalProps): JSX.Element | null {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#151c28] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-100">Cancel Order?</h3>
          <button
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-400 leading-relaxed">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>
        {orderId && <p className="mt-2 text-xs text-gray-500">Order #{orderId}</p>}

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-3 rounded-xl border border-white/10 bg-white/5 text-gray-200 font-semibold text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Cancelling..." : "Yes, Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
});

CancelOrderModal.displayName = "CancelOrderModal";
