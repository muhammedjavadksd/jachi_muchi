import { isRequired, minLength, maxLength } from "@/shared/validations";
import {
  REVIEW_MIN_COMMENT_LENGTH,
  REVIEW_MAX_COMMENT_LENGTH,
} from "@/features/review/constants";

export const validateReview = (rating: number, comment: string): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (rating < 1) errors.rating = "Please select a rating";
  if (!isRequired(comment)) errors.comment = "Please write your review";
  else if (!minLength(comment, REVIEW_MIN_COMMENT_LENGTH)) errors.comment = `Review must be at least ${REVIEW_MIN_COMMENT_LENGTH} characters`;
  else if (!maxLength(comment, REVIEW_MAX_COMMENT_LENGTH)) errors.comment = `Review must be under ${REVIEW_MAX_COMMENT_LENGTH} characters`;
  return errors;
};
