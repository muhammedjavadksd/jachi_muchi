import { memo, useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth, useLoginModal } from "@/features/auth/hooks";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReview,
} from "@/features/review/api/reviewApi";
import { RatingBreakdown } from "@/features/review/components/RatingBreakdown/RatingBreakdown";
import { ReviewList } from "@/features/review/components/ReviewList/ReviewList";
import { ReviewModal } from "@/features/review/components/ReviewModal/ReviewModal";
import type { ReviewItem, ReviewSummary, ReviewActionResponse, RatingDistributionItem } from "@/features/review/types";

interface ProductReviewsProps {
  productId?: string;
}

const PAGE_SIZE = 10;

function computeSummary(reviews: ReviewItem[]): ReviewSummary {
  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

  const distributionMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    distributionMap[r.rating] = (distributionMap[r.rating] || 0) + 1;
  });

  const distribution: RatingDistributionItem[] = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: distributionMap[star] || 0,
    percentage: totalReviews > 0 ? Math.round(((distributionMap[star] || 0) / totalReviews) * 100) : 0,
  }));

  return { averageRating, totalReviews, distribution };
}

export const ProductReviews = memo(function ProductReviews({
  productId,
}: ProductReviewsProps): JSX.Element {
  const { user, isAuthenticated } = useAuth();
  const { open: openLoginModal } = useLoginModal();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [userReview, setUserReview] = useState<ReviewItem | null>(null);
  const [canReview, setCanReview] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [_submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  const currentUserId = user?.id || (user as any)?._id;

  const fetchReviewsPage = useCallback(
    async (pageNum: number, append: boolean) => {
      if (!productId) return;
      const res = await getProductReviews(productId, pageNum, PAGE_SIZE);
      if (res.success) {
        if (append) {
          setReviews((prev) => {
            const merged = [...prev, ...res.data];
            return merged;
          });
        } else {
          setReviews(res.data);
        }
        if (res.summary) setSummary(res.summary);
        setHasMore(res.pagination?.hasMore || false);
        setPage(pageNum);
      }
    },
    [productId]
  );

  const fetchUserStatus = useCallback(async () => {
    if (!productId || !isAuthenticated) {
      return;
    }
    try {
      const res: ReviewActionResponse = await getUserReview(productId);
      if (res.success && res.data && !("canReview" in res.data)) {
        const reviewData = res.data as ReviewItem;
        setUserReview(reviewData);
        setCanReview(false);
      } else {
        setUserReview(null);
        const data = res.data as { canReview?: boolean } | undefined;
        setCanReview(data?.canReview ?? false);
      }
    } catch {
      setUserReview(null);
      setCanReview(false);
    }
  }, [productId, isAuthenticated]);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setReviews([]);
    setSummary(null);
    setPage(1);
    setHasMore(false);
    setUserReview(null);
    setCanReview(false);
    setDeleteConfirmId(null);
    setShowModal(false);

    Promise.all([
      fetchReviewsPage(1, false),
      fetchUserStatus(),
    ]).finally(() => setLoading(false));
  }, [productId, fetchReviewsPage, fetchUserStatus]);

  const handleOpenCreateModal = useCallback(() => {
    setModalMode("create");
    setShowModal(true);
  }, []);

  const handleOpenEditModal = useCallback((review: ReviewItem) => {
    setModalMode("edit");
    setEditingReview(review);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingReview(null);
  }, []);

  const handleSubmitReview = useCallback(
    async (data: { rating: number; message: string }) => {
      if (!productId) return;
      setSubmitting(true);
      try {
        if (modalMode === "edit" && editingReview) {
          const res = await updateReview(editingReview._id, {
            rating: data.rating,
            review: data.message,
          });
          if (res.success && res.data && !("canReview" in res.data)) {
            const updated = res.data as ReviewItem;
            setReviews((prev) => {
              const next = prev.map((r) => (r._id === updated._id ? updated : r));
              setSummary(computeSummary(next));
              return next;
            });
            setUserReview(updated);
            setShowModal(false);
            setEditingReview(null);
            toast.success("Review updated successfully");
          } else {
            toast.error(res.message || "Failed to update review");
          }
        } else {
          const res = await createReview({
            productId,
            rating: data.rating,
            review: data.message,
          });
          if (res.success && res.data && !("canReview" in res.data)) {
            const newReview = res.data as ReviewItem;
            setReviews((prev) => {
              const next = [newReview, ...prev];
              setSummary(computeSummary(next));
              return next;
            });
            setUserReview(newReview);
            setCanReview(false);
            setShowModal(false);
            toast.success("Review submitted successfully");
          } else {
            toast.error(res.message || "Failed to submit review");
          }
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [productId, modalMode, editingReview]
  );

  const handleDeleteReview = useCallback((reviewId: string) => {
    setDeleteConfirmId(reviewId);
  }, []);

  const handleConfirmDelete = useCallback(
    async (reviewId: string) => {
      setDeletingId(reviewId);
      try {
        const res = await deleteReview(reviewId);
        if (res.success) {
          setReviews((prev) => {
            const next = prev.filter((r) => r._id !== reviewId);
            setSummary(computeSummary(next));
            return next;
          });
          setUserReview(null);
          setCanReview(true);
          setDeleteConfirmId(null);
          toast.success("Review deleted successfully");
        } else {
          toast.error(res.message || "Failed to delete review");
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setDeletingId(null);
      }
    },
    []
  );

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmId(null);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!productId || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      await fetchReviewsPage(page + 1, true);
    } finally {
      setLoadingMore(false);
    }
  }, [productId, loadingMore, hasMore, page, fetchReviewsPage]);

  if (!productId) {
    return (
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Customer Reviews
        </h2>
        <p className="text-sm text-gray-500">Product ID is required</p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">
          Customer Reviews
          {summary && (
            <span className="text-gray-400 font-normal text-base ml-2">
              ({summary.totalReviews})
            </span>
          )}
        </h2>
      </div>

      {summary && <RatingBreakdown summary={summary} />}

      {/* Action buttons bar */}
      {!loading && (
        <div className="mb-6">
          {!isAuthenticated ? (
            <button
              onClick={openLoginModal}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.985]"
            >
              Login to Write a Review
            </button>
          ) : userReview ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenEditModal(userReview)}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.985]"
              >
                Edit Your Review
              </button>
              <button
                onClick={() => handleDeleteReview(userReview._id)}
                className="px-6 py-2.5 bg-white border border-red-300 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-50 transition-all active:scale-[0.985]"
              >
                Delete Review
              </button>
            </div>
          ) : canReview ? (
            <button
              onClick={handleOpenCreateModal}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.985]"
            >
              Write a Review
            </button>
          ) : null}
        </div>
      )}

      <ReviewModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
        isEditing={modalMode === "edit"}
        initialValues={
          modalMode === "edit" && editingReview
            ? { rating: editingReview.rating, message: editingReview.message }
            : undefined
        }
      />

      <ReviewList
        reviews={reviews}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadingMore={loadingMore}
        currentUserId={currentUserId}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteReview}
        deletingId={deletingId}
        deleteConfirmId={deleteConfirmId}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={handleCancelDelete}
      />
    </section>
  );
});

ProductReviews.displayName = "ProductReviews";
