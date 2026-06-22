import { api } from "@/shared/lib/axios";
import type {
  ReviewListResponse,
  ReviewActionResponse,
  CreateReviewPayload,
  UpdateReviewPayload,
} from "@/features/review/types";

export const getProductReviews = async (
  productId: string,
  page = 1,
  limit = 10
): Promise<ReviewListResponse> => {
  const res = await api.get<ReviewListResponse>(
    `/reviews/product/${productId}`,
    { params: { page, limit } }
  );
  return res.data;
};

export const createReview = async (
  payload: CreateReviewPayload
): Promise<ReviewActionResponse> => {
  const res = await api.post<ReviewActionResponse>("/reviews", payload);
  return res.data;
};

export const updateReview = async (
  reviewId: string,
  payload: UpdateReviewPayload
): Promise<ReviewActionResponse> => {
  const res = await api.patch<ReviewActionResponse>(
    `/reviews/${reviewId}`,
    payload
  );
  return res.data;
};

export const deleteReview = async (
  reviewId: string
): Promise<ReviewActionResponse> => {
  const res = await api.delete<ReviewActionResponse>(`/reviews/${reviewId}`);
  return res.data;
};

export const getUserReview = async (
  productId: string
): Promise<ReviewActionResponse> => {
  const res = await api.get<ReviewActionResponse>(
    `/reviews/product/${productId}/user`
  );
  return res.data;
};
