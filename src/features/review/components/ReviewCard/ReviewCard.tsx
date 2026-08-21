import { memo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { getImageUrl } from "@/shared/utils/image";
import { StarRating } from "@/features/review/components/StarRating/StarRating";
import { VERIFIED_PURCHASE_BADGE_LABEL } from "@/features/review/constants";
import type { ReviewItem } from "@/features/review/types";

interface ReviewCardProps {
  review: ReviewItem;
  onEdit?: (review: ReviewItem) => void;
  onDelete?: (reviewId: string) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`;
}

export const ReviewCard = memo(function ReviewCard({
  review,
  onEdit,
  onDelete,
}: ReviewCardProps): JSX.Element {
  const { user } = useAuth();
  const currentUserId = user?.id || (user as { _id?: string })?._id;
  const isOwner =
    Boolean(currentUserId) &&
    (review.user?._id === currentUserId || review.user?.id === currentUserId);

  const reviewerName = review.user?.name?.trim() || "Anonymous User";
  const avatarInitial = reviewerName.charAt(0).toUpperCase() || "?";

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-md hover:border-gray-300">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm shrink-0">
          {avatarInitial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">
                {reviewerName}
              </p>
              {review.verifiedPurchase && (
                <span className="inline-flex items-center gap-1 shrink-0 bg-green-50 text-green-700 border border-green-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {VERIFIED_PURCHASE_BADGE_LABEL}
                </span>
              )}
            </div>
            {isOwner && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit?.(review)}
                  title="Edit review"
                  aria-label="Edit review"
                  className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 transition-all rounded-lg"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(review._id)}
                  title="Delete review"
                  aria-label="Delete review"
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 transition-all rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating value={review.rating} readOnly size="sm" />
            <span className="text-xs text-gray-400">
              {formatDate(review.createdAt)}
            </span>
            {review.isEdited && (
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                Edited
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
        {review.comment}
      </p>

      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {review.images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={getImageUrl(image)}
              alt={`Photo ${index + 1} from ${reviewerName}`}
              loading="lazy"
              className="w-20 h-20 rounded-lg object-cover border border-gray-200"
            />
          ))}
        </div>
      )}
    </div>
  );
});

ReviewCard.displayName = "ReviewCard";
