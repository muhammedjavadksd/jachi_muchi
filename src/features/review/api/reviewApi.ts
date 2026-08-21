import { api } from "@/shared/lib/axios";
import { REVIEWS_PAGE_SIZE } from "@/features/review/constants";
import type {
  ReviewListResponse,
  ReviewListApiResponse,
  ReviewActionResponse,
  CreateReviewPayload,
  UpdateReviewPayload,
  ReviewItem,
  ReviewUser,
  ReviewSortOption,
} from "@/features/review/types";

interface GetProductReviewsParams {
  page?: number;
  limit?: number;
  sort?: ReviewSortOption;
  verifiedOnly?: boolean;
}

const SORT_API_VALUES: Record<ReviewSortOption, string> = {
  mostRecent: "recent",
  mostHelpful: "helpful",
  highestRated: "highest",
  lowestRated: "lowest",
};

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  return message || fallback;
};

const ANONYMOUS_USER_NAME = "Anonymous User";

const mapReviewUser = (raw: any): ReviewUser => {
  if (!raw || typeof raw === "string") {
    return { _id: typeof raw === "string" ? raw : "", name: ANONYMOUS_USER_NAME };
  }
  const fullName = [raw.firstName, raw.lastName]
    .filter((part: unknown) => typeof part === "string" && part.trim().length > 0)
    .map((part: string) => part.trim())
    .join(" ");
  return {
    _id: raw._id ?? "",
    name: raw.name?.trim() || fullName || ANONYMOUS_USER_NAME,
    email: raw.email,
  };
};

const mapReviewItem = (raw: any): ReviewItem => ({
  _id: raw._id,
  product: raw.product,
  user: mapReviewUser(raw.user),
  rating: Number(raw.rating),
  comment: raw.comment ?? raw.message ?? "",
  images: Array.isArray(raw.images) ? raw.images.filter((image: unknown) => typeof image === "string") : [],
  verifiedPurchase: Boolean(raw.verifiedPurchase),
  helpfulCount: raw.helpfulCount ?? raw.helpfulVotes,
  isEdited: Boolean(raw.isEdited),
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

const mapOptionalReview = (raw: any): ReviewItem | undefined =>
  raw && raw._id ? mapReviewItem(raw) : undefined;

export const getProductReviews = async (
  productId: string,
  {
    page = 1,
    limit = REVIEWS_PAGE_SIZE,
    sort,
    verifiedOnly,
  }: GetProductReviewsParams = {}
): Promise<ReviewListResponse> => {
  let res;
  try {
    res = await api.get<ReviewListApiResponse>(
      `/products/${productId}/reviews`,
      {
        params: {
          page,
          limit,
          ...(sort ? { sort: SORT_API_VALUES[sort] } : {}),
          ...(verifiedOnly ? { verifiedOnly: true } : {}),
        },
      }
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to load reviews"));
  }

  const payload = res.data?.data ?? {};
  const rawReviews = Array.isArray(payload.reviews) ? payload.reviews : [];
  const stats = payload.stats;

  return {
    success: Boolean(res.data?.success),
    data: rawReviews.map(mapReviewItem),
    pagination: {
      page: typeof payload.page === "number" ? payload.page : page,
      limit,
      total: typeof payload.total === "number" ? payload.total : rawReviews.length,
      totalPages: typeof payload.pages === "number" ? payload.pages : 0,
    },
    summary: stats
      ? {
          averageRating: stats.averageRating ?? 0,
          totalReviews: stats.totalReviews ?? payload.total ?? 0,
          distribution: (stats.breakdown || []).map((entry) => ({
            star: Number(entry._id),
            count: Number(entry.count ?? 0),
            percentage:
              payload.total && payload.total > 0
                ? Math.round((Number(entry.count ?? 0) / payload.total) * 100)
                : 0,
          })),
        }
      : undefined,
  };
};

export const createReview = async (
  productId: string,
  payload: CreateReviewPayload
): Promise<ReviewActionResponse> => {
  try {
    const res = await api.post<ReviewActionResponse>(
      `/products/${productId}/reviews`,
      payload
    );
    return { ...res.data, data: mapOptionalReview(res.data.data) };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to submit review"));
  }
};

export const updateReview = async (
  reviewId: string,
  payload: UpdateReviewPayload
): Promise<ReviewActionResponse> => {
  try {
    const res = await api.put<ReviewActionResponse>(
      `/reviews/${reviewId}`,
      payload
    );
    return { ...res.data, data: mapOptionalReview(res.data.data) };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to update review"));
  }
};

export const deleteReview = async (
  reviewId: string
): Promise<ReviewActionResponse> => {
  try {
    const res = await api.delete<ReviewActionResponse>(`/reviews/${reviewId}`);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to delete review"));
  }
};

interface ReviewImagesApiResponse {
  success?: boolean;
  message?: string;
  data?: { images?: unknown[] };
}

export const uploadReviewImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  let data: ReviewImagesApiResponse | undefined;
  try {
    const res = await api.post<ReviewImagesApiResponse>("/reviews/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    data = res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to upload images"));
  }

  if (!data?.success || !Array.isArray(data?.data?.images)) {
    throw new Error(data?.message || "Failed to upload images");
  }
  return data.data.images.filter(
    (image): image is string => typeof image === "string" && image.length > 0
  );
};

export const getUserReview = async (
  productId: string
): Promise<ReviewActionResponse> => {
  try {
    const res = await api.get<ReviewActionResponse>(
      `/reviews/product/${productId}/user`
    );
    return { ...res.data, data: mapOptionalReview(res.data.data) };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to load your review"));
  }
};
