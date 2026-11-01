import type { LensItem } from "@/features/lens/types";

export interface LensPricing {
  currentPrice: number;
  originalPrice?: number;
  discountPercent?: number;
}

/** "12.5", "10", "0.4": the exact percentage without trailing zeros or float noise. */
export function formatDiscountPercent(percent: number): string {
  return String(Number(percent.toFixed(2)));
}

/**
 * The lens API returns the list price in `price` and the percentage discount
 * separately. Cards and the detail page must derive the payable price the same
 * way so both surfaces always show the same amount.
 */
export function getLensPricing(
  lens: Pick<LensItem, "price" | "discount" | "originalPrice">
): LensPricing {
  const listPrice = Number.isFinite(lens.price) ? Math.max(0, lens.price) : 0;
  const rawDiscount =
    typeof lens.discount === "number" && Number.isFinite(lens.discount)
      ? lens.discount
      : 0;
  const discountPercent = Math.min(100, Math.max(0, rawDiscount));

  if (discountPercent > 0) {
    return {
      currentPrice: Math.round((listPrice * (100 - discountPercent)) / 100),
      originalPrice: Math.max(listPrice, lens.originalPrice ?? 0),
      discountPercent,
    };
  }

  const originalPrice =
    typeof lens.originalPrice === "number" && lens.originalPrice > listPrice
      ? lens.originalPrice
      : undefined;

  return { currentPrice: listPrice, originalPrice };
}
