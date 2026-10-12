/**
 * Shipping/delivery address snapshot attached to an order by the backend.
 * Mirrors the `shippingAddress` sub-document on the Order schema, so the field
 * name must stay in sync with the order API response.
 */
export interface ShippingAddress {
  name?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

const clean = (value?: string): string => (value || "").trim();

/**
 * True when the snapshot carries at least one address component worth showing.
 * Used to decide between the address block and its empty state, so legacy
 * orders without a snapshot never render an empty card.
 */
export function hasShippingAddress(address?: ShippingAddress | null): boolean {
  if (!address) return false;
  return Boolean(
    clean(address.addressLine1) ||
      clean(address.addressLine2) ||
      clean(address.city) ||
      clean(address.state) ||
      clean(address.pincode)
  );
}

/**
 * Street line: address line 1 with the landmark/line 2 appended when present.
 * Empty parts are dropped so a missing line 2 never leaves a trailing comma.
 */
export function formatStreetLine(address?: ShippingAddress | null): string {
  return [address?.addressLine1, address?.addressLine2].map(clean).filter(Boolean).join(", ");
}

/**
 * Locality line: "city, state, pincode". Missing parts are skipped so a partial
 * snapshot never renders dangling separators.
 */
export function formatLocalityLine(address?: ShippingAddress | null): string {
  return [address?.city, address?.state, address?.pincode].map(clean).filter(Boolean).join(", ");
}

/**
 * Renders the order's shipping address snapshot as a single readable line
 * ("line 1, line 2, city, state, pincode, country"). Missing parts are skipped.
 */
export function formatShippingAddress(address?: ShippingAddress | null): string {
  if (!address) return "";
  return [formatStreetLine(address), formatLocalityLine(address), clean(address.country)]
    .map(clean)
    .filter(Boolean)
    .join(", ");
}

export interface ShippingAddressLineOptions {
  /** Include the recipient name as the first line (default true). */
  includeName?: boolean;
  /** Include the phone number as the last line (default true). */
  includePhone?: boolean;
}

/**
 * Ordered, non-empty address lines for stacked rendering:
 * name, street, city/state/pincode, country, phone.
 * Blank/missing values are omitted entirely so the UI never prints "null",
 * "undefined" or empty lines.
 */
export function formatShippingAddressLines(
  address?: ShippingAddress | null,
  options: ShippingAddressLineOptions = {}
): string[] {
  if (!address) return [];
  const { includeName = true, includePhone = true } = options;
  return [
    includeName ? clean(address.name) : "",
    formatStreetLine(address),
    formatLocalityLine(address),
    clean(address.country),
    includePhone ? clean(address.phone) : "",
  ].filter(Boolean);
}
