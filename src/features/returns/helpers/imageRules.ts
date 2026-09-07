import {
  RETURN_IMAGE_ACCEPTED_TYPES,
  RETURN_IMAGE_MAX_SIZE_BYTES,
} from "@/features/returns/constants";

/** Extension set consistent with the accepted MIME types. */
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

/** Minimum decodable payload size a real image must exceed. */
const MIN_DECODABLE_BYTES = 1024;

function getExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx === -1 ? "" : name.slice(idx + 1).toLowerCase();
}

/**
 * Confirm the file actually decodes as an image by loading it through the
 * browser's image decoder (HTMLImageElement). Rejects empty and truncated /
 * otherwise corrupted image containers that would otherwise render as blank
 * boxes in the admin.
 */
function isDecodableImage(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    const done = (result: boolean) => {
      URL.revokeObjectURL(url);
      img.onload = null;
      img.onerror = null;
      resolve(result);
    };
    img.onload = () => done(true);
    img.onerror = () => done(false);
    img.src = url;
  });
}

export const RETURN_ACCEPTED_TYPES = RETURN_IMAGE_ACCEPTED_TYPES;

/**
 * Validate an uploaded return image. Resolves to an error message, or "" if
 * valid. Rejects missing files, disallowed MIME/extension types, oversized
 * files, empty files, and files that fail the browser's image decode (corrupt
 * or truncated). Async because it runs a decode check.
 */
export async function validateReturnImage(file: File | null | undefined): Promise<string> {
  if (!file) return "Please upload an image.";
  const isMimeAllowed = RETURN_IMAGE_ACCEPTED_TYPES.includes(file.type);
  const isExtAllowed = ALLOWED_EXTENSIONS.includes(getExtension(file.name));
  if (!isMimeAllowed && !isExtAllowed) {
    return "Unsupported file type. Please upload a JPG, PNG, WEBP or GIF image.";
  }
  if (file.size > RETURN_IMAGE_MAX_SIZE_BYTES) {
    return "Image is too large. Maximum size is 5 MB.";
  }
  if (file.size < MIN_DECODABLE_BYTES) {
    return "Image is empty or too small to be valid. Please upload the full photo.";
  }
  if (!(await isDecodableImage(file))) {
    return "Image could not be read. It may be corrupted — please upload the photo again.";
  }
  return "";
}
