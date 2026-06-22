import { memo } from "react";
import { ReviewCard } from "@/features/review/components/ReviewCard/ReviewCard";
import type { ReviewItem } from "@/features/review/types";

interface ReviewListProps {
  reviews: ReviewItem[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  loadingMore: boolean;
  currentUserId?: string;
  onEdit: (review: ReviewItem) => void;
  onDelete: (reviewId: string) => void;
  deletingId: string | null;
  deleteConfirmId: string | null;
  onConfirmDelete: (reviewId: string) => void;
  onCancelDelete: () => void;
}

function ReviewSkeleton() {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <svg
        className="w-16 h-16 mx-auto text-gray-200 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
      <p className="text-gray-500 text-sm font-medium">No reviews yet</p>
      <p className="text-gray-400 text-xs mt-1">
        Be the first to review this product
      </p>
    </div>
  );
}

export const ReviewList = memo(function ReviewList({
  reviews,
  loading,
  hasMore,
  onLoadMore,
  loadingMore,
  currentUserId,
  onEdit,
  onDelete,
  deletingId,
  deleteConfirmId,
  onConfirmDelete,
  onCancelDelete,
}: ReviewListProps): JSX.Element {
  if (loading) {
    return (
      <div className="space-y-4">
        <ReviewSkeleton />
        <ReviewSkeleton />
        <ReviewSkeleton />
      </div>
    );
  }

  if (!reviews.length) {
    return <EmptyState />;
  }

  return (
    <div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            currentUserId={currentUserId}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={deletingId === review._id}
            showDeleteConfirm={deleteConfirmId === review._id}
            onConfirmDelete={() => onConfirmDelete(review._id)}
            onCancelDelete={onCancelDelete}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="px-8 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? "Loading..." : "Load More Reviews"}
          </button>
        </div>
      )}
    </div>
  );
});

ReviewList.displayName = "ReviewList";
