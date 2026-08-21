import { memo, useCallback, useEffect, useState } from "react";
import { CheckCircle2, Pencil } from "lucide-react";
import { useAuth, useLoginModal } from "@/features/auth/hooks";
import {
  createReview,
  updateReview,
  getUserReview,
} from "@/features/review/api/reviewApi";
import { ReviewModal } from "@/features/review/components/ReviewModal/ReviewModal";
import {
  ORDER_REVIEW_WRITE_LABEL,
  ORDER_REVIEW_EDIT_LABEL,
} from "@/features/review/constants";
import type { ReviewItem } from "@/features/review/types";

interface OrderItemReviewActionProps {
  productId?: string;
  productName?: string;
}

const reviewStatusCache = new Map<string, ReviewItem | null>();

export const OrderItemReviewAction = memo(function OrderItemReviewAction({
  productId,
  productName,
}: OrderItemReviewActionProps): JSX.Element | null {
  const { isAuthenticated } = useAuth();
  const { open: openLoginModal } = useLoginModal();

  const [userReview, setUserReview] = useState<ReviewItem | null>(null);
  const [statusChecked, setStatusChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!productId || !isAuthenticated) {
      setStatusChecked(true);
      return;
    }
    let cancelled = false;
    const cached = reviewStatusCache.get(productId);
    if (cached !== undefined) {
      setUserReview(cached);
      setStatusChecked(true);
      return;
    }
    getUserReview(productId)
      .then((res) => {
        if (cancelled) return;
        const review = res.success && res.data ? res.data : null;
        reviewStatusCache.set(productId, review);
        setUserReview(review);
        setStatusChecked(true);
      })
      .catch(() => {
        if (cancelled) return;
        setStatusChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [productId, isAuthenticated]);

  const handleOpenModal = useCallback(() => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    setShowModal(true);
  }, [isAuthenticated, openLoginModal]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleSubmit = useCallback(
    async (data: { rating: number; comment: string }) => {
      if (!productId) return;
      if (userReview) {
        const res = await updateReview(userReview._id, data);
        if (!res.success) {
          throw new Error(res.message || "Failed to update review");
        }
        const updated = res.data ?? { ...userReview, ...data };
        reviewStatusCache.set(productId, updated);
        setUserReview(updated);
      } else {
        const res = await createReview(productId, data);
        if (!res.success) {
          throw new Error(res.message || "Failed to submit review");
        }
        const created = res.data ?? null;
        reviewStatusCache.set(productId, created);
        setUserReview(created);
      }
      setShowModal(false);
    },
    [productId, userReview]
  );

  if (!productId || !isAuthenticated || !statusChecked) return null;

  return (
    <>
      {userReview ? (
        <button
          type="button"
          onClick={handleOpenModal}
          title={`Edit your review${productName ? ` of ${productName}` : ""}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-teal-600 text-teal-700 hover:bg-teal-50 transition-colors active:scale-[0.985]"
        >
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          {ORDER_REVIEW_EDIT_LABEL}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpenModal}
          title={`Write a review${productName ? ` of ${productName}` : ""}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white transition-all active:scale-[0.985]"
        >
          <Pencil className="w-3 h-3 shrink-0" />
          {ORDER_REVIEW_WRITE_LABEL}
        </button>
      )}

      <ReviewModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isEditing={Boolean(userReview)}
        initialValues={
          userReview
            ? { rating: userReview.rating, comment: userReview.comment }
            : undefined
        }
      />
    </>
  );
});

OrderItemReviewAction.displayName = "OrderItemReviewAction";
