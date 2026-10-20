import { isRequired, isPhone } from "@/shared/validations";
import {
  PRESCRIPTION_ALLOWED_TYPES,
  PRESCRIPTION_MAX_SIZE_MB,
  PRESCRIPTION_SIZE_ERROR,
  PRESCRIPTION_TYPE_ERROR,
} from "@/features/checkout/constants";

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

/**
 * Validate a prescription file chosen on Step 3 "Upload Prescription".
 * Returns an error message, or "" when the file is acceptable.
 */
export const validatePrescriptionFile = (file: File | null | undefined): string => {
  if (!file) return "Please choose a file to upload.";
  const types = PRESCRIPTION_ALLOWED_TYPES as readonly string[];
  if (!types.includes(file.type)) return PRESCRIPTION_TYPE_ERROR;
  if (file.size > PRESCRIPTION_MAX_SIZE_MB * 1024 * 1024) return PRESCRIPTION_SIZE_ERROR;
  return "";
};
