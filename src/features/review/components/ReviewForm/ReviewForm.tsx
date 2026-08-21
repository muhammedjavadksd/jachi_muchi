import { memo, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { StarRating } from "@/features/review/components/StarRating/StarRating";
import { validateReview } from "@/features/review/validations";
import {
  REVIEW_MIN_COMMENT_LENGTH,
  REVIEW_MAX_COMMENT_LENGTH,
} from "@/features/review/constants";

interface ReviewFormProps {
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  initialValues?: { rating: number; comment: string };
  isEditing?: boolean;
  onCancel?: () => void;
}

interface FieldErrors {
  rating?: string;
  comment?: string;
}

export const ReviewForm = memo(function ReviewForm({
  onSubmit,
  initialValues,
  isEditing = false,
  onCancel,
}: ReviewFormProps): JSX.Element {
  const [rating, setRating] = useState(initialValues?.rating || 0);
  const [comment, setComment] = useState(initialValues?.comment || "");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState("");

  const charCount = comment.length;

  const handleRatingChange = useCallback((value: number) => {
    setRating(value);
    setFieldErrors((prev) => ({ ...prev, rating: undefined }));
    setApiError("");
  }, []);

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      if (val.length <= REVIEW_MAX_COMMENT_LENGTH) {
        setComment(val);
        setFieldErrors((prev) => ({ ...prev, comment: undefined }));
        setApiError("");
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (submitting) return;

      const errors = validateReview(rating, comment);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      try {
        setSubmitting(true);
        setApiError("");
        await onSubmit({ rating, comment: comment.trim() });
      } catch (error) {
        setApiError(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, rating, comment, onSubmit]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white border rounded-2xl p-5 ${
        isEditing ? "border-teal-300" : "border-gray-200"
      }`}
    >
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        {isEditing ? "Edit Your Review" : "Write a Review"}
      </h3>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Your Rating</p>
        <StarRating
          value={rating}
          onChange={handleRatingChange}
          readOnly={false}
          size="lg"
        />
        {fieldErrors.rating && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.rating}</p>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="review-comment" className="text-sm text-gray-600">
            Your Review
          </label>
          <span
            className={`text-xs ${
              charCount > REVIEW_MAX_COMMENT_LENGTH * 0.9
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            {charCount}/{REVIEW_MAX_COMMENT_LENGTH}
          </span>
        </div>
        <textarea
          id="review-comment"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Share your experience with this product..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
        />
        {fieldErrors.comment && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.comment}</p>
        )}
        {!fieldErrors.comment && charCount > 0 && charCount < REVIEW_MIN_COMMENT_LENGTH && (
          <p className="text-xs text-gray-400 mt-1">
            Minimum {REVIEW_MIN_COMMENT_LENGTH} characters
          </p>
        )}
      </div>

      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700 font-medium">{apiError}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.985] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting
            ? isEditing
              ? "Updating…"
              : "Submitting…"
            : isEditing
            ? "Update Review"
            : "Submit Review"}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-6 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
});

ReviewForm.displayName = "ReviewForm";
