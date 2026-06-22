import { isRequired, minLength, maxLength } from "@/shared/validations";

export const validateReview = (rating: number, comment: string): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (rating < 1) errors.rating = "Rating is required";
  if (!isRequired(comment)) errors.comment = "Comment is required";
  else if (!minLength(comment, 10)) errors.comment = "Comment must be at least 10 characters";
  else if (!maxLength(comment, 1000)) errors.comment = "Comment must be under 1000 characters";
  return errors;
};
