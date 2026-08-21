import { isRequired, minLength, maxLength } from "@/shared/validations";
import {
  REVIEW_MIN_COMMENT_LENGTH,
  REVIEW_MAX_COMMENT_LENGTH,
  REVIEW_MAX_IMAGES,
  REVIEW_MAX_IMAGE_SIZE_MB,
  REVIEW_ALLOWED_IMAGE_TYPES,
  REVIEW_IMAGE_TYPE_ERROR,
  REVIEW_IMAGE_SIZE_ERROR,
  REVIEW_IMAGE_COUNT_ERROR,
} from "@/features/review/constants";

export const validateReview = (rating: number, comment: string): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (rating < 1) errors.rating = "Please select a rating";
  if (!isRequired(comment)) errors.comment = "Please write your review";
  else if (!minLength(comment, REVIEW_MIN_COMMENT_LENGTH)) errors.comment = `Review must be at least ${REVIEW_MIN_COMMENT_LENGTH} characters`;
  else if (!maxLength(comment, REVIEW_MAX_COMMENT_LENGTH)) errors.comment = `Review must be under ${REVIEW_MAX_COMMENT_LENGTH} characters`;
  return errors;
};

export const validateReviewImageFile = (file: File): string | null => {
  if (!REVIEW_ALLOWED_IMAGE_TYPES.includes(file.type as (typeof REVIEW_ALLOWED_IMAGE_TYPES)[number])) {
    return REVIEW_IMAGE_TYPE_ERROR;
  }
  if (file.size > REVIEW_MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return REVIEW_IMAGE_SIZE_ERROR;
  }
  return null;
};

export const validateReviewImageCount = (
  currentCount: number,
  incomingCount: number
): string | null => {
  if (currentCount + incomingCount > REVIEW_MAX_IMAGES) {
    return REVIEW_IMAGE_COUNT_ERROR;
  }
  return null;
};
