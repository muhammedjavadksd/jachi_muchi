export { OfferCard } from "./components/OfferCard/OfferCard";
export { getActiveOffers } from "./services/offerService";
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
} from "./services/offerEngine";
export type { OfferBadge, ComboInfo } from "./services/offerEngine";
