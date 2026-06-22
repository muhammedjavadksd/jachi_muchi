import { isRequired, isEmail, minLength } from "@/shared/validations";

export const validateLogin = (email: string, password: string): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!isRequired(email)) errors.email = "Email is required";
  else if (!isEmail(email)) errors.email = "Invalid email format";
  if (!isRequired(password)) errors.password = "Password is required";
  else if (!minLength(password, 6)) errors.password = "Password must be at least 6 characters";
  return errors;
};

export const validateSignup = (name: string, email: string, phone: string, password: string): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!isRequired(name)) errors.name = "Name is required";
  if (!isRequired(email)) errors.email = "Email is required";
  else if (!isEmail(email)) errors.email = "Invalid email format";
  if (!isRequired(phone)) errors.phone = "Phone is required";
  if (!isRequired(password)) errors.password = "Password is required";
  else if (!minLength(password, 6)) errors.password = "Password must be at least 6 characters";
  return errors;
};
