import { getActiveOffers } from "../services/offer.service";
import type { Offer } from "../types/offers.types";

let cachedOffers: Offer[] | null = null;

export async function getOffers(): Promise<Offer[]> {
  if (cachedOffers) return cachedOffers;
  const offers = await getActiveOffers();
  cachedOffers = offers;
  return offers;
}

export function clearOfferCache(): void {
  cachedOffers = null;
}

export interface OfferBadge {
  label: string;
  color: string;
  offerName: string;
  offerType: string;
  couponCode?: string;
}

const BADGE_COLORS: Record<string, string> = {
  bogo: "#8b5cf6",
  combo: "#f59e0b",
  percentage: "#f26b3a",
  flat: "#0d5c5c",
  "category-offer": "#3b82f6",
};

export function getProductOffers(productId: string, offers: Offer[]): Offer[] {
  return offers.filter((o) =>
    o.applicableProducts?.some((p) => p._id === productId)
  );
}

export function getBestOfferBadge(
  productId: string,
  price: number,
  offers: Offer[]
): OfferBadge | null {
  const applicable = getProductOffers(productId, offers);
  if (applicable.length === 0) return null;

  let best: Offer | null = null;
  let bestValue = 0;

  for (const offer of applicable) {
    let value = 0;
    if (offer.offerType === "percentage" && offer.discountValue) {
      value = (price * offer.discountValue) / 100;
    } else if (offer.offerType === "flat" && offer.discountValue) {
      value = offer.discountValue;
    } else if (offer.offerType === "bogo") {
      value = price;
    }
    if (value > bestValue) {
      bestValue = value;
      best = offer;
    }
  }

  if (!best) {
    const fallback = applicable[0];
    return {
      label: "Offer",
      color: BADGE_COLORS[fallback.offerType] || "#f26b3a",
      offerName: fallback.offerName,
      offerType: fallback.offerType,
      couponCode: fallback.couponCode,
    };
  }

  let label = "";
  if (best.offerType === "bogo") {
    label = `Buy ${best.buyQuantity || 1} Get ${best.getQuantity || 1}`;
  } else if (best.offerType === "combo") {
    label = "Combo Offer";
  } else if (best.offerType === "percentage") {
    label = `${best.discountValue}% OFF`;
  } else if (best.offerType === "flat") {
    label = `₹${best.discountValue} OFF`;
  } else {
    label = "Special Offer";
  }

  return {
    label,
    color: BADGE_COLORS[best.offerType] || "#f26b3a",
    offerName: best.offerName,
    offerType: best.offerType,
    couponCode: best.couponCode,
  };
}

export function calculateOfferDiscount(
  productId: string,
  price: number,
  offers: Offer[]
): number {
  const applicable = getProductOffers(productId, offers);
  let maxDiscount = 0;
  for (const offer of applicable) {
    if (offer.offerType === "percentage" && offer.discountValue) {
      const d = (price * offer.discountValue) / 100;
      if (d > maxDiscount) maxDiscount = d;
    } else if (offer.offerType === "flat" && offer.discountValue) {
      if (offer.discountValue > maxDiscount) maxDiscount = offer.discountValue;
    } else if (offer.offerType === "bogo") {
      if (price > maxDiscount) maxDiscount = price;
    }
  }
  return maxDiscount;
}
