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

function getApplicableProductIds(offer: Offer): string[] {
  if (!offer.applicableProducts) return [];
  return offer.applicableProducts.map((p) =>
    typeof p === "string" ? p : p._id
  );
}

export function getProductOffers(productId: string, offers: Offer[]): Offer[] {
  return offers.filter((o) => {
    const ids = getApplicableProductIds(o);
    return ids.includes(productId);
  });
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
    label = `\u20B9${best.discountValue} OFF`;
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

export interface ComboInfo {
  offer: Offer;
  discount: number;
  missingProducts: string[];
  qualifies: boolean;
}

function getComboProductsTotal(
  cartItems: { productId: string; productPrice: number; quantity?: number; lens?: { price: number } | null }[],
  offer: Offer
): number {
  const comboIds = getApplicableProductIds(offer);
  const comboItems = cartItems.filter((ci) => comboIds.includes(ci.productId));
  let total = 0;
  for (const ci of comboItems) {
    total += ci.productPrice * (ci.quantity || 1) + (ci.lens?.price || 0);
  }
  return total;
}

export function calcComboSavings(
  offer: Offer,
  sellingTotal: number
): number {
  if (offer.comboPrice !== undefined && offer.comboPrice !== null) {
    return Math.max(0, sellingTotal - Number(offer.comboPrice));
  }
  if (offer.discountType === "percentage") {
    const val = Number(offer.discountValue) || 0;
    return (sellingTotal * val) / 100;
  }
  if (offer.discountType === "fixed") {
    return Number(offer.discountValue) || 0;
  }
  if (offer.discountValue !== undefined && offer.discountValue !== null) {
    const val = Number(offer.discountValue);
    return Math.max(0, sellingTotal - val);
  }
  return Math.round(sellingTotal * 0.1);
}

export function getComboStatusForCart(
  cartProductIds: string[],
  offers: Offer[]
): ComboInfo[] {
  const results: ComboInfo[] = [];
  for (const offer of offers) {
    if (offer.offerType !== "combo") continue;
    const comboIds = getApplicableProductIds(offer);
    if (!comboIds.length) continue;

    const missing = comboIds.filter((id) => !cartProductIds.includes(id));
    const qualifies = missing.length === 0;
    const staticTotal = offer.comboPrice ?? 0;
    const discount = qualifies
      ? calcComboSavings(offer, staticTotal)
      : 0;
    results.push({ offer, discount, missingProducts: missing, qualifies });
  }
  return results;
}

export function getComboSavingsForOffer(
  cartItems: { productId: string; productPrice: number; quantity?: number; lens?: { price: number } | null }[],
  offer: Offer
): number {
  const sellingTotal = getComboProductsTotal(cartItems, offer);
  return calcComboSavings(offer, sellingTotal);
}

export function getComboCartSavings(
  cartItems: { productId: string; productPrice: number; mrp?: number; quantity?: number; lens?: { price: number } | null }[],
  offers: Offer[]
): number {
  const cartIds = cartItems.map((i) => i.productId);
  const combos = getComboStatusForCart(cartIds, offers);
  let total = 0;
  for (const c of combos) {
    if (!c.qualifies) continue;
    total += getComboSavingsForOffer(cartItems, c.offer);
  }
  return total;
}
