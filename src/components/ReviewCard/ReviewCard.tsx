import { memo, useState, useCallback } from "react";
import { RatingStars } from "../RatingStars/RatingStars";
import type { ReviewItem } from "@/types";

interface ReviewCardProps {
  review: ReviewItem;
  currentUserId?: string;
  onEdit: (review: ReviewItem) => void;
  onDelete: (reviewId: string) => void;
  isDeleting?: boolean;
  showDeleteConfirm?: boolean;
  onConfirmDelete?: () => void;
  onCancelDelete?: () => void;
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
  currentUserId,
  onEdit,
  onDelete,
  isDeleting,
  showDeleteConfirm,
  onConfirmDelete,
  onCancelDelete,
}: ReviewCardProps): JSX.Element {
  const isOwner = currentUserId === review.user._id;

  return (
    <div className="border border-gray-200 rounded-2xl p-5 transition-all hover:shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm shrink-0">
          {review.user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-gray-900 text-sm truncate">
              {review.user.name}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              {isOwner && !showDeleteConfirm && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(review)}
                    className="p-1.5 text-gray-400 hover:text-teal-600 transition-colors rounded-lg hover:bg-gray-100"
                    title="Edit review"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(review._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100"
                    title="Delete review"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <RatingStars rating={review.rating} size="sm" />
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

      {showDeleteConfirm && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700 font-medium mb-2">
            Delete this review?
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onConfirmDelete}
              disabled={isDeleting}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={onCancelDelete}
              disabled={isDeleting}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
        {review.message}
      </p>
    </div>
  );
});

ReviewCard.displayName = "ReviewCard";
