import { isRequired, isEmail } from "@/shared/validations";

export const validateProfile = (data: Record<string, string>): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!isRequired(data.name)) errors.name = "Name is required";
  if (!isRequired(data.email)) errors.email = "Email is required";
  else if (!isEmail(data.email)) errors.email = "Invalid email format";
  return errors;
};
