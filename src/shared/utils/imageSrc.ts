/**
 * Fallback shown whenever a product image is missing, empty, or fails to
 * load. Must stay in sync with the backend's DEFAULT_PRODUCT_IMAGE so a
 * placeholder is rendered consistently on both sides of the API.
 */
export const IMAGE_PLACEHOLDER = "https://placehold.co/400x300?text=Eyewear";

/**
 * Picks the primary image source for a product. The backend exposes a
 * resolved `image` field; older payloads only expose an `images` array, so
 * the first entry is used as the primary image for those.
 */
export function pickPrimaryImage(
  product?: { image?: string | null; images?: Array<string | null | undefined> | null } | null
): string | undefined {
  if (!product) return undefined;

  if (typeof product.image === "string" && product.image.trim() !== "") {
    return product.image;
  }

  if (Array.isArray(product.images)) {
    const first = product.images.find(
      (img): img is string => typeof img === "string" && img.trim() !== ""
    );
    if (first) return first;
  }

  return undefined;
}

/**
 * Resolves a stored image reference into a browser-loadable URL.
 *
 * Absolute URLs pass through, site-relative upload paths are prefixed with
 * the API origin, and null/empty values fall back to the placeholder. A
 * non-empty but unrecognized value is returned as-is so the image element's
 * onError handler can swap it for the placeholder.
 */
export function resolveImageSrc(
  path?: string | null,
  baseUrl = "",
  fallback: string = IMAGE_PLACEHOLDER
): string {
  if (typeof path !== "string") return fallback;

  const trimmed = path.trim();
  if (trimmed === "") return fallback;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/uploads/")) return `${baseUrl}${trimmed}`;
  return trimmed;
}

/**
 * Computes the source to use after an image fails to load. Returns the
 * placeholder, but never replaces an already-fallback source so a failing
 * placeholder cannot trigger an endless onError loop.
 */
export function nextImageSrcOnError(
  currentSrc: string,
  fallback: string = IMAGE_PLACEHOLDER
): string {
  return currentSrc === fallback ? currentSrc : fallback;
}
