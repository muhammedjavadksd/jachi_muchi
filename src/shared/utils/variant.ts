/**
 * Variant snapshot a product line was purchased in. Mirrors the `variant`
 * sub-document the backend now persists on order items and returns on cart
 * items, so the field name must stay in sync with both APIs.
 */
export interface OrderItemVariant {
  variantId?: string | null;
  name?: string;
  color?: string;
  size?: string;
  sku?: string;
  price?: number | null;
  image?: string;
}

const clean = (value?: string): string => (value || "").trim();

/**
 * True when the line carries a real variant worth showing. Products sold with
 * no variants (or legacy orders without a snapshot) return false so callers can
 * hide the label entirely instead of rendering an empty row.
 */
export function hasVariant(variant?: OrderItemVariant | null): boolean {
  if (!variant) return false;
  return Boolean(clean(variant.color) || clean(variant.size) || clean(variant.name));
}

/**
 * Renders the selected variant as a human label, e.g. "Size: M, Color: Black".
 * Only the attributes the catalog actually stored are included; a variant that
 * has no colour/size falls back to its snapshot name, and an empty result means
 * there is nothing to render.
 */
export function formatVariantLabel(variant?: OrderItemVariant | null): string {
  if (!variant) return "";
  const parts: string[] = [];
  if (clean(variant.size)) parts.push(`Size: ${clean(variant.size)}`);
  if (clean(variant.color)) parts.push(`Color: ${clean(variant.color)}`);
  if (parts.length === 0 && clean(variant.name)) return clean(variant.name);
  return parts.join(", ");
}
