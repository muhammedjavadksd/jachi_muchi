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
import {
  fetchCart,
  updateCartItemQuantity,
  removeCartItemApi,
  notifyCartUpdated,
  mapBackendItem,
} from "@/features/cart/api/cartApi";
import type { CartItem } from "@/app/providers/CartProvider";

export function useCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});
  const [stockErrors, setStockErrors] = useState<Record<string, string>>({});

  const loadCart = useCallback(async () => {
    try {
      const cart = await fetchCart();
      setCartItems(cart.items.map(mapBackendItem));
    } catch {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    loadCart();
    getOffers().then(setOffers).catch(() => {});
  }, [loadCart]);

  const handleRemoveItem = useCallback(async (cartItemId: string) => {
    setCartItems((prev) => {
      const target = prev.find((i) => i.cartItemId === cartItemId);
      const bogoGroupId = target?.bogoGroupId;
      return prev.filter(
        (i) =>
          i.cartItemId !== cartItemId &&
          !(bogoGroupId && i.bogoGroupId === bogoGroupId)
      );
    });
    try {
      await removeCartItemApi(cartItemId);
      notifyCartUpdated();
      await loadCart();
    } catch {
      await loadCart();
    }
  }, [loadCart]);

  const handleUpdateQuantity = useCallback(
    async (cartItemId: string, action: "increment" | "decrement") => {
      setUpdatingItems((prev) => ({ ...prev, [cartItemId]: true }));
      setStockErrors((prev) => ({ ...prev, [cartItemId]: "" }));
      try {
        const updated = await updateCartItemQuantity(cartItemId, action);
        setCartItems(updated.items.map(mapBackendItem));
        notifyCartUpdated();
      } catch (error: any) {
        const msg =
          error.response?.data?.message || error.message || "Failed to update quantity";
        setStockErrors((prev) => ({ ...prev, [cartItemId]: msg }));
      } finally {
        setUpdatingItems((prev) => ({ ...prev, [cartItemId]: false }));
      }
    },
    []
  );

  const handleClearCart = useCallback(async () => {
    const { clearCartApi } = await import("@/features/cart/api/cartApi");
    await clearCartApi();
    setCartItems([]);
    notifyCartUpdated();
  }, []);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum +
          ((item.mrp || item.productPrice) * (item.quantity || 1)) +
          (item.lens?.price || 0),
        0
      ),
    [cartItems]
  );

  const totalSellingPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + item.productPrice * (item.quantity || 1) + (item.lens?.price || 0),
        0
      ),
    [cartItems]
  );

  const totalDiscount = useMemo(() => subtotal - totalSellingPrice, [subtotal, totalSellingPrice]);

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cartItems]
  );

  const fittingFee = useMemo(() => (cartItems.length > 0 ? 199 : 0), [cartItems.length]);

  const totalOfferSavings = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
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
    () => totalSellingPrice + fittingFee - Math.round(totalComboSavings),
    [totalSellingPrice, fittingFee, totalComboSavings]
  );

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
    subtotal,
    totalSellingPrice,
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
