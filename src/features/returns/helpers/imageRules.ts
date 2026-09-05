import {
  RETURN_IMAGE_ACCEPTED_TYPES,
  RETURN_IMAGE_MAX_SIZE_BYTES,
} from "@/features/returns/constants";

/** Extension set consistent with the accepted MIME types. */
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

function getExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx === -1 ? "" : name.slice(idx + 1).toLowerCase();
}

export const RETURN_ACCEPTED_TYPES = RETURN_IMAGE_ACCEPTED_TYPES;

/**
 * Validate an uploaded return image. Returns an error message, or "" if valid.
 * Rejects missing files, disallowed MIME/extension types, and oversized files.
 */
export function validateReturnImage(file: File | null | undefined): string {
  if (!file) return "Please upload an image.";
  const isMimeAllowed = RETURN_IMAGE_ACCEPTED_TYPES.includes(file.type);
  const isExtAllowed = ALLOWED_EXTENSIONS.includes(getExtension(file.name));
  if (!isMimeAllowed && !isExtAllowed) {
    return "Unsupported file type. Please upload a JPG, PNG, WEBP or GIF image.";
  }
  if (file.size > RETURN_IMAGE_MAX_SIZE_BYTES) {
    return "Image is too large. Maximum size is 5 MB.";
  }
  return "";
}
