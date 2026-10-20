import { uploadReviewImages } from "@/features/review/api/reviewApi";
import {
  PRESCRIPTION_UPLOAD_ERROR,
} from "@/features/checkout/constants";
import { validatePrescriptionFile } from "@/features/checkout/validations";

/**
 * Upload the Step 3 "Upload Prescription" document and return its hosted URL.
 *
 * Reuses the storefront's existing multipart upload endpoint
 * (POST /reviews/uploads, field `images`) — the only file-upload service the
 * codebase exposes — so no new backend route is needed. Type/size rules
 * (JPG, PNG, PDF ≤ 5MB) are enforced here first so an invalid file never
 * reaches the server; a server-side rejection is surfaced as-is.
 */
export async function uploadPrescription(file: File): Promise<string> {
  const fileError = validatePrescriptionFile(file);
  if (fileError) throw new Error(fileError);

  try {
    const urls = await uploadReviewImages([file]);
    const url = urls[0];
    if (!url) throw new Error(PRESCRIPTION_UPLOAD_ERROR);
    return url;
  } catch (error) {
    if (error instanceof Error && error.message) throw error;
    throw new Error(PRESCRIPTION_UPLOAD_ERROR);
  }
}
