export const PAYMENT_SESSION_REF_KEY = "paymentSessionRef";
export const SKIPCASH_POLL_INTERVAL_MS = 2500;
export const SKIPCASH_POLL_TIMEOUT_MS = 18000;

/**
 * Step 3 "Add Power" — prescription upload rules.
 */
export const PRESCRIPTION_MAX_SIZE_MB = 5;
export const PRESCRIPTION_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
] as const;
export const PRESCRIPTION_TYPE_ERROR = "Only JPG, PNG or PDF files are allowed.";
export const PRESCRIPTION_SIZE_ERROR = "File must be smaller than 5MB.";
export const PRESCRIPTION_UPLOAD_ERROR =
  "Could not upload your prescription. Please try again.";
export const PRESCRIPTION_UPLOADING_MESSAGE = "Uploading your prescription…";
export const PRESCRIPTION_UPLOAD_HINT = "JPG, PNG or PDF · up to 5MB";

/**
 * Transition step copy.
 */
export const TRANSITION_STEP_TITLE = "Choose Transition";
export const TRANSITION_CONTINUE_LABEL = "Continue";
export const TRANSITION_SKIP_LABEL = "Skip / No Transition";
export const TRANSITION_SELECT_COLOR_HINT = "Choose a colour to continue.";
