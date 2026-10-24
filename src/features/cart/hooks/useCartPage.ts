import { useState, useCallback, useEffect, useMemo } from "react";
import {
  getOffers,
  getBestOfferBadge,
  getComboStatusForCart,
  getComboCartSavings,
  getComboSavingsForOffer,
  calculateOfferDiscount,
} from "@/shared/services/offerEngine";
import type { Offer, OfferBadge } from "@/features/offer/types";
import { useCart } from "@/features/cart/hooks/useCart";

interface NormalizedBill {
  totalItemPrice: number;
  totalDiscount: number;
  offerSavings: number;
  fittingFee: number;
  totalPayable: number;
}

const n = (v: unknown, fallback = 0): number => {
  const num = Number(v);
  return Number.isFinite(num) ? num : fallback;
};

function normalizeBill(raw: Record<string, any> | null | undefined, fallbackTotal: number): NormalizedBill {
  if (!raw) {
    return {
      totalItemPrice: n(fallbackTotal),
      totalDiscount: 0,
      offerSavings: 0,
      fittingFee: 0,
      totalPayable: n(fallbackTotal),
    };
  }
  return {
    totalItemPrice:
      n(raw.totalItemPrice ?? raw.subtotal ?? raw.itemTotal ?? fallbackTotal),
    totalDiscount:
      n(raw.totalDiscount ?? raw.discount),
    offerSavings:
      n(raw.offerSavings ?? raw.offer_discount),
    fittingFee:
      n(raw.fittingFee ?? raw.fitting_fee),
    totalPayable:
      n(raw.totalPayable ?? raw.total ?? fallbackTotal),
  };
}

export function useCartPage() {
  // BUG-012: this hook used to hold its own cart copy, fetched independently of
  // CartProvider and never subscribed to cart changes, so the page and the
  // header badge were two sources of truth that could disagree (the page summed
  // setCount, the badge summed quantity) and the page could show a stale cart
  // until it was remounted. It now reads the provider's state and delegates every
  // write to it, which applies the server's own response.
  const { items: cartItems, bill, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});
  const [stockErrors, setStockErrors] = useState<Record<string, string>>({});

  const normalizedBill = useMemo(
    () => normalizeBill(bill, total),
    [bill, total]
  );

  useEffect(() => {
    getOffers().then(setOffers).catch(() => {});
  }, []);

  const handleRemoveItem = useCallback(
    async (cartItemId: string) => {
      try {
        await removeItem(cartItemId);
        setStockErrors((prev) => ({ ...prev, [cartItemId]: "" }));
      } catch (error: any) {
        const msg = error.response?.data?.message || error.message || "Failed to remove item";
        setStockErrors((prev) => ({ ...prev, [cartItemId]: msg }));
      }
    },
    [removeItem]
  );

  const handleUpdateQuantity = useCallback(
    async (cartItemId: string, action: "increment" | "decrement") => {
      setUpdatingItems((prev) => ({ ...prev, [cartItemId]: true }));
      setStockErrors((prev) => ({ ...prev, [cartItemId]: "" }));
      try {
        await updateQuantity(cartItemId, action);
      } catch (error: any) {
        const msg =
          error.response?.data?.message || error.message || "Failed to update quantity";
        setStockErrors((prev) => ({ ...prev, [cartItemId]: msg }));
      } finally {
        setUpdatingItems((prev) => ({ ...prev, [cartItemId]: false }));
      }
    },
    [updateQuantity]
  );

  const handleClearCart = useCallback(async () => {
    await clearCart();
  }, [clearCart]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const paidCount = (item.setCount || 1) - (item.freeCount || 0);
        return (
          sum +
          ((item.mrp || item.productPrice) * paidCount) +
          (item.lens?.price || 0) +
          (item.transitionPrice || 0)
        );
      }, 0),
    [cartItems]
  );

  const totalSellingPrice = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const paidCount = (item.setCount || 1) - (item.freeCount || 0);
        return (
          sum +
          item.productPrice * paidCount +
          (item.lens?.price || 0) +
          (item.transitionPrice || 0)
        );
      }, 0),
    [cartItems]
  );

  const lensTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + (item.lens?.price || 0), 0),
    [cartItems]
  );

  const transitionTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.transitionPrice || 0),
        0
      ),
    [cartItems]
  );

  const lensLabel = useMemo(() => {
    const lensNames = [
      ...new Set(
        cartItems
          .map((item) => item.lens?.name)
          .filter((name): name is string => Boolean(name))
      ),
    ];
    return lensNames.length === 1 ? `Lens (${lensNames[0]})` : "Lens";
  }, [cartItems]);

  const transitionLabel = useMemo(() => {
    const transitions = new Map<
      string,
      { name: string; color: string }
    >();
    cartItems.forEach((item) => {
      if (!item.transition) return;
      transitions.set(
        `${item.transition.transitionId}-${item.transition.color}`,
        item.transition
      );
    });
    const selected = [...transitions.values()];
    return selected.length === 1
      ? `Transition - ${selected[0].name} (${selected[0].color})`
      : "Transition";
  }, [cartItems]);

  const totalDiscount = useMemo(() => subtotal - totalSellingPrice, [subtotal, totalSellingPrice]);

  // Same number the header badge shows. This used to sum `setCount` while the
  // badge summed `quantity`, so a BOGO/set cart rendered "Cart (2 items)" next
  // to a badge reading 3.
  const totalQuantity = itemCount;

  // Server bill owns this figure (0 for frame-only carts); no client fallback.
  const fittingFee = normalizedBill.fittingFee;

  const totalOfferSavings = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const freeCount = item.freeCount || 0;
        if (freeCount > 0 && item.freeUnitPrice) {
          return sum + item.freeUnitPrice * freeCount;
        }
        if (offers.length === 0) return sum;
        return (
          sum +
          calculateOfferDiscount(
            item.productId,
            item.productPrice + (item.lens?.price || 0),
            offers
          )
        );
      }, 0),
    [cartItems, offers]
  );

  const cartProductIds = useMemo(() => cartItems.map((i) => i.productId), [cartItems]);
  const comboOffers = useMemo(
    () => getComboStatusForCart(cartProductIds, offers),
    [cartProductIds, offers]
  );
  const totalComboSavings = useMemo(
    () => getComboCartSavings(cartItems, offers),
    [cartItems, offers]
  );

  const activeCombos = useMemo(() => comboOffers.filter((c) => c.qualifies), [comboOffers]);
  const incompleteCombos = useMemo(
    () => comboOffers.filter((c) => !c.qualifies && c.missingProducts.length > 0),
    [comboOffers]
  );

  const totalPayable = useMemo(
    () => totalSellingPrice + fittingFee - Math.round(totalComboSavings) - totalOfferSavings,
    [totalSellingPrice, fittingFee, totalComboSavings, totalOfferSavings]
  );

  const displayBill = useMemo(() => {
    if (!normalizedBill) return null;
    return {
      ...normalizedBill,
      offerSavings: normalizedBill.offerSavings + Math.round(totalComboSavings),
      totalPayable: normalizedBill.totalPayable - Math.round(totalComboSavings),
    };
  }, [normalizedBill, totalComboSavings]);

  const getOfferBadge = useCallback(
    (productId: string, price: number): OfferBadge | null =>
      getBestOfferBadge(productId, price, offers),
    [offers]
  );

  const getComboSavingsForOfferCallback = useCallback(
    (offer: Offer): number => getComboSavingsForOffer(cartItems, offer),
    [cartItems]
  );

  return {
    offers,
    cartItems,
    displayBill,
    subtotal,
    totalSellingPrice,
    lensTotal,
    lensLabel,
    transitionTotal,
    transitionLabel,
    totalDiscount,
    totalQuantity,
    totalOfferSavings,
    totalComboSavings,
    totalPayable,
    fittingFee,
    comboOffers,
    activeCombos,
    incompleteCombos,
    updatingItems,
    stockErrors,
    getOfferBadge,
    getComboSavingsForOffer: getComboSavingsForOfferCallback,
    handleRemoveItem,
    handleUpdateQuantity,
    handleClearCart,
  };
}
