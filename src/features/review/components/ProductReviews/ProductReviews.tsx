import { memo, useState, useCallback, useEffect, useMemo } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
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
import { ReviewErrorBoundary } from "@/features/review/components/ReviewErrorBoundary/ReviewErrorBoundary";
import { ReviewModal } from "@/features/review/components/ReviewModal/ReviewModal";
import { DeleteReviewDialog } from "@/features/review/components/DeleteReviewDialog/DeleteReviewDialog";
import { ReviewToast } from "@/features/review/components/ReviewToast/ReviewToast";
import { useReviewToast } from "@/features/review/hooks/useReviewToast";
import {
  ALREADY_REVIEWED_MESSAGE,
  REVIEW_SORT_OPTIONS,
  EMPTY_REVIEWS_TITLE,
  EMPTY_REVIEWS_SUBTITLE,
  EMPTY_VERIFIED_REVIEWS_TITLE,
  EMPTY_VERIFIED_REVIEWS_SUBTITLE,
  REVIEW_DELETED_MESSAGE,
} from "@/features/review/constants";
import type {
  ReviewItem,
  ReviewSortOption,
  ReviewPagination,
  RatingDistributionItem,
} from "@/features/review/types";

interface ProductReviewsProps {
  productId?: string;
  ratingAverage?: number;
  ratingCount?: number;
}

export const ProductReviews = memo(function ProductReviews({
  productId,
  ratingAverage = 0,
  ratingCount = 0,
}: ProductReviewsProps): JSX.Element {
  const { user, isAuthenticated } = useAuth();
  const { open: openLoginModal } = useLoginModal();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [pagination, setPagination] = useState<ReviewPagination | null>(null);
  const [distribution, setDistribution] = useState<
    RatingDistributionItem[] | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<ReviewSortOption>("mostRecent");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [userReview, setUserReview] = useState<ReviewItem | null>(null);
  const [statusChecked, setStatusChecked] = useState(!isAuthenticated);

  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast: reviewToast, showToast } = useReviewToast();

  const currentUserId = user?.id || (user as { _id?: string })?._id;

  const fetchReviews = useCallback(
    async (targetPage: number) => {
      if (!productId) return;
      setLoading(true);
      setLoadError("");
      try {
        const res = await getProductReviews(productId, {
          page: targetPage,
          sort,
          verifiedOnly,
        });
        setReviews(res.data);
        setPagination(res.pagination ?? null);
        setDistribution(res.summary?.distribution);
        setPage(res.pagination?.page ?? targetPage);
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Failed to load reviews"
        );
      } finally {
        setLoading(false);
      }
    },
    [productId, sort, verifiedOnly]
  );

  const refreshUserStatus = useCallback(async () => {
    if (!productId || !isAuthenticated) {
      setUserReview(null);
      setStatusChecked(true);
      return;
    }
    setStatusChecked(false);
    try {
      const res = await getUserReview(productId);
      setUserReview(res.success && res.data ? res.data : null);
    } catch {
      setUserReview(null);
    } finally {
      setStatusChecked(true);
    }
  }, [productId, isAuthenticated]);

  useEffect(() => {
    if (!productId) return;
    fetchReviews(page);
  }, [productId, page, sort, verifiedOnly, fetchReviews]);

  useEffect(() => {
    refreshUserStatus();
  }, [refreshUserStatus]);

  const listHasUserReview = useMemo(
    () =>
      Boolean(currentUserId) &&
      reviews.some((review) => review.user?._id === currentUserId),
    [reviews, currentUserId]
  );

  const alreadyReviewed = Boolean(userReview) || listHasUserReview;

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSort(e.target.value as ReviewSortOption);
      setPage(1);
    },
    []
  );

  const handleVerifiedToggle = useCallback(() => {
    setVerifiedOnly((prev) => !prev);
    setPage(1);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setEditingReview(null);
    setShowModal(true);
  }, []);

  const handleOpenEditModal = useCallback((review: ReviewItem) => {
    setEditingReview(review);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingReview(null);
  }, []);

  const handleSubmitReview = useCallback(
    async (data: { rating: number; comment: string }) => {
      if (!productId) return;
      if (editingReview) {
        await updateReview(editingReview._id, data);
      } else {
        await createReview(productId, data);
      }
      setShowModal(false);
      setEditingReview(null);
      await Promise.all([fetchReviews(1), refreshUserStatus()]);
    },
    [productId, editingReview, fetchReviews, refreshUserStatus, showToast]
  );

  const handleDeleteRequest = useCallback((reviewId: string) => {
    setPendingDeleteId(reviewId);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (!isDeleting) {
      setPendingDeleteId(null);
    }
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteId || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await deleteReview(pendingDeleteId);
      if (!res.success) {
        throw new Error(res.message || "Failed to delete review");
      }
      setPendingDeleteId(null);
      showToast(REVIEW_DELETED_MESSAGE, "success");
      await Promise.all([fetchReviews(1), refreshUserStatus()]);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  }, [pendingDeleteId, isDeleting, fetchReviews, refreshUserStatus, showToast]);

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
          {ratingCount > 0 && (
            <span className="text-gray-400 font-normal text-base ml-2">
              ({ratingCount.toLocaleString()})
            </span>
          )}
        </h2>
      </div>

      {ratingCount > 0 && (
        <RatingBreakdown
          averageRating={ratingAverage}
          totalReviews={ratingCount}
          distribution={distribution}
        />
      )}

      {!loading && (
        <div className="mb-6">
          {!isAuthenticated ? (
            <button
              onClick={openLoginModal}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.985]"
            >
              Login to Write a Review
            </button>
          ) : alreadyReviewed ? (
            <div className="inline-flex items-center gap-2 text-sm text-teal-800">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="font-medium">{ALREADY_REVIEWED_MESSAGE}</span>
            </div>
          ) : (
            statusChecked && (
              <button
                onClick={handleOpenCreateModal}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.985]"
              >
                Write a Review
              </button>
            )
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-gray-100">
        <button
          type="button"
          role="switch"
          aria-checked={verifiedOnly}
          onClick={handleVerifiedToggle}
          className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all select-none ${
            verifiedOnly
              ? "bg-teal-700 border-teal-700 text-white shadow-sm"
              : "bg-white border-gray-200 text-gray-600 hover:border-teal-600 hover:text-teal-700"
          }`}
        >
          <span
            className={`relative inline-flex h-3.5 w-6 items-center rounded-full transition-colors ${
              verifiedOnly ? "bg-white/30" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full shadow transition-transform ${
                verifiedOnly ? "translate-x-3 bg-white" : "translate-x-[3px] bg-white"
              }`}
            />
          </span>
          Verified purchases only
        </button>
        <div className="relative">
          <select
            value={sort}
            onChange={handleSortChange}
            aria-label="Sort reviews"
            className="appearance-none pl-4 pr-9 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          >
            {REVIEW_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <ReviewModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
        isEditing={Boolean(editingReview)}
        initialValues={
          editingReview
            ? { rating: editingReview.rating, comment: editingReview.comment }
            : undefined
        }
      />

      <ReviewErrorBoundary>
        {loadError ? (
          <div className="border border-red-200 bg-red-50 rounded-2xl p-8 text-center">
            <p className="text-sm font-medium text-red-700 mb-1">{loadError}</p>
            <p className="text-xs text-gray-500 mb-4">
              The review list could not be loaded. The rest of this page is
              unaffected.
            </p>
            <button
              type="button"
              onClick={() => fetchReviews(page)}
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <ReviewList
            reviews={reviews}
            loading={loading}
            page={page}
            totalPages={pagination?.totalPages ?? 0}
            total={pagination?.total ?? 0}
            onPageChange={setPage}
            emptyTitle={verifiedOnly ? EMPTY_VERIFIED_REVIEWS_TITLE : EMPTY_REVIEWS_TITLE}
            emptySubtitle={
              verifiedOnly ? EMPTY_VERIFIED_REVIEWS_SUBTITLE : EMPTY_REVIEWS_SUBTITLE
            }
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteRequest}
          />
        )}
      </ReviewErrorBoundary>

      <DeleteReviewDialog
        isOpen={Boolean(pendingDeleteId)}
        isDeleting={isDeleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      <ReviewToast toast={reviewToast} />
    </section>
  );
});

ProductReviews.displayName = "ProductReviews";
