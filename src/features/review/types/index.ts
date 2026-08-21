export interface ReviewUser {
  _id: string;
  id?: string;
  name: string;
  email?: string;
}

export interface ReviewItem {
  _id: string;
  product: string;
  user: ReviewUser;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount?: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ReviewSortOption =
  | "mostRecent"
  | "mostHelpful"
  | "highestRated"
  | "lowestRated";

export interface RatingDistributionItem {
  star: number;
  count: number;
  percentage: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution?: RatingDistributionItem[];
}

export interface CreateReviewPayload {
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating: number;
  comment: string;
}

export interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReviewListResponse {
  success: boolean;
  data: ReviewItem[];
  pagination: ReviewPagination;
  summary?: ReviewSummary;
}

export interface ReviewStats {
  averageRating?: number;
  totalReviews?: number;
  breakdown?: { _id?: number | string; count?: number }[];
  [key: string]: unknown;
}

export interface ReviewListApiPayload {
  reviews?: any[];
  total?: number;
  page?: number;
  pages?: number;
  stats?: ReviewStats;
}

export interface ReviewListApiResponse {
  success?: boolean;
  data?: ReviewListApiPayload;
  message?: string;
}

export interface ReviewActionResponse {
  success: boolean;
  data?: ReviewItem;
  message?: string;
}
