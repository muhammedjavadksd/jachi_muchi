import { isRequired, isPhone } from "@/shared/validations";

export const validateAddress = (data: Record<string, string>): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!isRequired(data.fullName)) errors.fullName = "Name is required";
  if (!isRequired(data.phone)) errors.phone = "Phone is required";
  else if (!isPhone(data.phone)) errors.phone = "Invalid phone number";
  if (!isRequired(data.address)) errors.address = "Address is required";
  if (!isRequired(data.city)) errors.city = "City is required";
  if (!isRequired(data.pincode)) errors.pincode = "Pincode is required";
  return errors;
};
