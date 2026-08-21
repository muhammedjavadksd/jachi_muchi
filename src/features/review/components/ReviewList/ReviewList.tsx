import { memo, useMemo } from "react";
import { Pencil } from "lucide-react";
import { ReviewCard } from "@/features/review/components/ReviewCard/ReviewCard";
import {
  SPARSE_REVIEWS_HINT,
  SPARSE_REVIEWS_THRESHOLD,
} from "@/features/review/constants";
import type { ReviewItem } from "@/features/review/types";

interface ReviewListProps {
  reviews: ReviewItem[];
  loading: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
  onEdit?: (review: ReviewItem) => void;
  onDelete?: (reviewId: string) => void;
}

const MAX_PAGE_BUTTONS = 5;

function getPageWindow(current: number, totalPages: number): number[] {
  if (totalPages <= 0) return [];
  const start = Math.max(
    1,
    Math.min(current - Math.floor(MAX_PAGE_BUTTONS / 2), totalPages - MAX_PAGE_BUTTONS + 1)
  );
  const end = Math.min(totalPages, start + MAX_PAGE_BUTTONS - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function ReviewSkeleton() {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
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

function EmptyState({
  title = "No reviews yet",
  subtitle = "Be the first to review this product",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center py-14 px-6 border border-dashed border-gray-300 rounded-2xl bg-gray-50/60">
      <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7 text-amber-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </div>
      <p className="text-gray-900 text-base font-semibold">{title}</p>
      <p className="text-gray-500 text-sm mt-1.5 max-w-xs mx-auto">{subtitle}</p>
    </div>
  );
}

export const ReviewList = memo(function ReviewList({
  reviews,
  loading,
  page,
  totalPages,
  total,
  onPageChange,
  emptyTitle,
  emptySubtitle,
  onEdit,
  onDelete,
}: ReviewListProps): JSX.Element {
  const pageNumbers = useMemo(
    () => getPageWindow(page, totalPages),
    [page, totalPages]
  );

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
    return (
      <EmptyState
        title={emptyTitle}
        subtitle={emptySubtitle}
      />
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {total > 0 && total < SPARSE_REVIEWS_THRESHOLD && (
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Pencil className="w-3.5 h-3.5 shrink-0" />
          <span>{SPARSE_REVIEWS_HINT}</span>
        </div>
      )}

      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-1 mt-8"
          aria-label="Review pagination"
        >
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === page ? "page" : undefined}
              className={`min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-semibold transition-colors ${
                pageNumber === page
                  ? "bg-teal-700 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      )}

      {total > 0 && totalPages > 1 && (
        <p className="text-center text-xs text-gray-400 mt-3">
          Page {page} of {totalPages} · {total} review{total !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
});

ReviewList.displayName = "ReviewList";
