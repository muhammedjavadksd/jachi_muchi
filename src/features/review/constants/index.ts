import type { ReviewSortOption } from "@/features/review/types";

export const REVIEWS_PAGE_SIZE = 10;

export const REVIEW_SORT_OPTIONS: { value: ReviewSortOption; label: string }[] = [
  { value: "mostRecent", label: "Most Recent" },
  { value: "mostHelpful", label: "Most Helpful" },
  { value: "highestRated", label: "Highest Rated" },
  { value: "lowestRated", label: "Lowest Rated" },
];

export const REVIEW_MIN_COMMENT_LENGTH = 10;
export const REVIEW_MAX_COMMENT_LENGTH = 1000;

export const REVIEW_MAX_IMAGES = 5;
export const REVIEW_MAX_IMAGE_SIZE_MB = 5;
export const REVIEW_ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const ADD_PHOTOS_LABEL = "Add Photos (optional)";
export const UPLOADING_IMAGES_MESSAGE = "Uploading images…";
export const REVIEW_IMAGE_TYPE_ERROR =
  "Only JPG, PNG, or WebP images are allowed";
export const REVIEW_IMAGE_SIZE_ERROR = "Image must be smaller than 5MB";
export const REVIEW_IMAGE_COUNT_ERROR = `You can add up to ${REVIEW_MAX_IMAGES} photos`;
export const REVIEW_IMAGE_UPLOAD_ERROR =
  "Some images failed to upload. Please try again.";

export const ALREADY_REVIEWED_MESSAGE = "You've already reviewed this product";
export const VERIFIED_PURCHASE_BADGE_LABEL = "✅ Verified Purchase";

/** Orders with these statuses never count as a verified purchase */
export const VERIFIED_PURCHASE_EXCLUDED_ORDER_STATUSES = [
  "cancelled",
  "refunded",
];
/** Orders whose payment failed never count as a verified purchase */
export const VERIFIED_PURCHASE_EXCLUDED_PAYMENT_STATUSES = ["failed"];

export const EMPTY_REVIEWS_TITLE = "No reviews yet";
export const EMPTY_REVIEWS_SUBTITLE = "Be the first to review this product";
export const EMPTY_VERIFIED_REVIEWS_TITLE = "No verified reviews yet";
export const EMPTY_VERIFIED_REVIEWS_SUBTITLE =
  "No verified reviews match this filter";

export const SPARSE_REVIEWS_THRESHOLD = 3;
export const SPARSE_REVIEWS_HINT =
  "Know this product? Share your experience to help other shoppers.";

export const REVIEW_TOAST_AUTO_DISMISS_MS = 2500;
export const REVIEW_DELETED_MESSAGE = "Review deleted successfully";

export const DELETE_CONFIRM_TITLE = "Delete review?";
export const DELETE_CONFIRM_DESCRIPTION =
  "This will permanently remove your review. This action cannot be undone.";
export const DELETE_CONFIRM_CANCEL_LABEL = "Cancel";
export const DELETE_CONFIRM_ACTION_LABEL = "Delete";

export const ORDER_REVIEW_WRITE_LABEL = "Rate & Review";
export const ORDER_REVIEW_EDIT_LABEL = "Edit Review";
