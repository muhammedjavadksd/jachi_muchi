import { memo, useEffect } from "react";
import { Trash2 } from "lucide-react";
import {
  DELETE_CONFIRM_TITLE,
  DELETE_CONFIRM_DESCRIPTION,
  DELETE_CONFIRM_CANCEL_LABEL,
  DELETE_CONFIRM_ACTION_LABEL,
} from "@/features/review/constants";

interface DeleteReviewDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteReviewDialog = memo(function DeleteReviewDialog({
  isOpen,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteReviewDialogProps): JSX.Element | null {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-review-dialog-title"
    >
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <h3
          id="delete-review-dialog-title"
          className="text-lg font-bold text-gray-900"
        >
          {DELETE_CONFIRM_TITLE}
        </h3>
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
          {DELETE_CONFIRM_DESCRIPTION}
        </p>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {DELETE_CONFIRM_CANCEL_LABEL}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting…" : DELETE_CONFIRM_ACTION_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
});

DeleteReviewDialog.displayName = "DeleteReviewDialog";
