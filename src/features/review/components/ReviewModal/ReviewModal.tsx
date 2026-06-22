import { memo, useEffect, useCallback } from "react";
import { ReviewForm } from "@/features/review/components/ReviewForm/ReviewForm";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; message: string }) => Promise<void>;
  isEditing?: boolean;
  initialValues?: { rating: number; message: string };
}

export const ReviewModal = memo(function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  isEditing = false,
  initialValues,
}: ReviewModalProps): JSX.Element | null {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Your Review" : "Write a Review"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-6 pb-6 pt-2">
          <ReviewForm
            onSubmit={onSubmit}
            initialValues={initialValues}
            isEditing={isEditing}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
});

ReviewModal.displayName = "ReviewModal";
