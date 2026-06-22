export {
  getOffers,
  clearOfferCache,
  getProductOffers,
  getBestOfferBadge,
  calculateOfferDiscount,
  calcComboSavings,
  getComboStatusForCart,
  getComboSavingsForOffer,
  getComboCartSavings,
} from "@/features/offer/services/offerEngine";

export type { OfferBadge, ComboInfo } from "@/features/offer/services/offerEngine";
