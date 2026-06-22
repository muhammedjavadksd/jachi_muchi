export interface ReviewUser {
  _id: string;
  name: string;
  email?: string;
}

export interface ReviewItem {
  _id: string;
  product: string;
  user: ReviewUser;
  rating: number;
  message: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RatingDistributionItem {
  star: number;
  count: number;
  percentage: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistributionItem[];
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  review: string;
}

export interface UpdateReviewPayload {
  rating: number;
  review: string;
}

export interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ReviewListResponse {
  success: boolean;
  data: ReviewItem[];
  summary?: ReviewSummary;
  pagination?: ReviewPagination;
}

export interface ReviewActionResponse {
  success: boolean;
  data?: ReviewItem | { canReview?: boolean };
  message?: string;
}
