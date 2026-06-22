import { isRequired, minLength, maxLength } from "@/shared/validations";

export const validateSearch = (query: string): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!isRequired(query)) errors.query = "Search query is required";
  else if (!minLength(query, 2)) errors.query = "Search must be at least 2 characters";
  else if (!maxLength(query, 100)) errors.query = "Search must be under 100 characters";
  return errors;
};
