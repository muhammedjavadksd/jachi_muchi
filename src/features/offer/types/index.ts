export type OfferType = "bogo" | "combo" | "percentage" | "flat" | "category-offer" | "seasonal";

export interface OfferBadge {
  label: string;
  color: string;
}

export interface OfferProduct {
  _id: string;
  name: string;
  price: number;
  brand?: string;
  images: string[];
}

export interface Offer {
  _id: string;
  offerName: string;
  offerType: OfferType;
  buyQuantity?: number;
  getQuantity?: number;
  discountValue?: number;
  discountType?: "percentage" | "fixed";
  comboPrice?: number;
  applicableProducts?: (OfferProduct | string)[];
  freeProduct?: OfferProduct;
  couponCode?: string;
  image?: string;
  link?: string;
  buttonText?: string;
  startDate?: string;
  endDate?: string;
}

export interface OffersApiResponse {
  success: boolean;
  data: Offer[];
}
