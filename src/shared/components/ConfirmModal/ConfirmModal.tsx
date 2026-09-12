import { memo, useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Reusable dark-themed confirmation modal. Replaces browser alert()/confirm().
 * Closes on the OK button, clicking the dimmed backdrop, or pressing Escape.
 */
export const ConfirmModal = memo(function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
}: ConfirmModalProps): JSX.Element | null {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#151c28] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-modal-title" className="text-lg font-bold text-gray-100">
          {title}
        </h3>
        <p className="mt-3 text-sm text-gray-400 leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          autoFocus
          className="mt-6 w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors active:scale-[0.985]"
        >
          OK
        </button>
      </div>
    </div>
  );
});

ConfirmModal.displayName = "ConfirmModal";