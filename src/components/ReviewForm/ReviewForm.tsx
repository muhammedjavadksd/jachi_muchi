import { memo, useState, useCallback } from "react";
import { RatingStars } from "../RatingStars/RatingStars";

interface ReviewFormProps {
  onSubmit: (data: { rating: number; message: string }) => Promise<void>;
  initialValues?: { rating: number; message: string };
  isEditing?: boolean;
  onCancel?: () => void;
}

const MAX_MESSAGE_LENGTH = 1000;

export const ReviewForm = memo(function ReviewForm({
  onSubmit,
  initialValues,
  isEditing = false,
  onCancel,
}: ReviewFormProps): JSX.Element {
  const [rating, setRating] = useState(initialValues?.rating || 0);
  const [message, setMessage] = useState(initialValues?.message || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const charCount = message.length;
  const isValid = rating > 0 && message.trim().length >= 10;

  const handleRatingChange = useCallback((value: number) => {
    setRating(value);
    if (error) setError("");
  }, [error]);

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      if (val.length <= MAX_MESSAGE_LENGTH) {
        setMessage(val);
        if (error) setError("");
      }
    },
    [error]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid || submitting) return;

      if (message.trim().length < 10) {
        setError("Review must be at least 10 characters");
        return;
      }

      try {
        setSubmitting(true);
        setError("");
        await onSubmit({ rating, message: message.trim() });
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [isValid, submitting, rating, message, onSubmit]
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
        <RatingStars
          rating={rating}
          size="lg"
          interactive
          onChange={handleRatingChange}
        />
        {rating === 0 && error && (
          <p className="text-xs text-red-500 mt-1">Please select a rating</p>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="review-message"
            className="text-sm text-gray-600"
          >
            Your Review
          </label>
          <span
            className={`text-xs ${
              charCount > MAX_MESSAGE_LENGTH * 0.9
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            {charCount}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
        <textarea
          id="review-message"
          value={message}
          onChange={handleMessageChange}
          placeholder="Share your experience with this product..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
        />
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.985] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {submitting
            ? "Submitting..."
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
