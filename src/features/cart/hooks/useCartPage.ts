import { useState, useCallback, useEffect, useMemo } from "react";
import { getOffers, getBestOfferBadge, getComboStatusForCart, getComboCartSavings, getComboSavingsForOffer, calculateOfferDiscount } from "@/shared/services/offerEngine";
import type { Offer, OfferBadge } from "@/features/offer/types";
import { updateCartItemQuantity, assertValidCartItemId } from "@/features/cart/api/cartApi";

interface CartItem {
  cartItemId?: string;
  bogoGroupId?: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  mrp?: number;
  quantity?: number;
  color: { name: string; id: string } | null;
  lens: {
    id?: string;
    name: string;
    price: number;
  } | null;
  lensPrice?: number;
  totalPrice: number;
  powerType?: string;
}

export function useCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});
  const [stockErrors, setStockErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(stored);
    getOffers().then(setOffers).catch(() => {});
  }, []);

  const handleRemoveItem = useCallback((cartItemIdToRemove: string) => {
    setCartItems(prev => {
      const target = prev.find(item => item.cartItemId === cartItemIdToRemove);
      const bogoGroupId = target?.bogoGroupId;
      const updated = prev.filter(item =>
        item.cartItemId !== cartItemIdToRemove &&
        !(bogoGroupId && item.bogoGroupId === bogoGroupId)
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleUpdateQuantity = useCallback(async (cartItemId: string, action: "increment" | "decrement") => {
    setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));
    setStockErrors(prev => ({ ...prev, [cartItemId]: "" }));

    const doLocalUpdate = (prev: CartItem[]) => {
      const updated = prev.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + (action === "increment" ? 1 : -1)) }
          : item
      ).filter(item => !(item.cartItemId === cartItemId && (item.quantity || 1) < 1));
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    };

    if (!assertValidCartItemId(cartItemId, "handleUpdateQuantity")) {
      setCartItems(prev => doLocalUpdate(prev));
      setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
      return;
    }

    try {
      const response = await updateCartItemQuantity(cartItemId, action);
      if (response.success && response.data) {
        setCartItems(prev => {
          if (response.data.removed) {
            const updated = prev.filter(item => item.cartItemId !== cartItemId);
            localStorage.setItem("cart", JSON.stringify(updated));
            return updated;
          }
          const updated = prev.map(item =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: response.data.quantity, productPrice: response.data.productPrice ?? item.productPrice, mrp: response.data.mrp ?? item.mrp }
              : item
          );
          localStorage.setItem("cart", JSON.stringify(updated));
          return updated;
        });
      } else {
        setStockErrors(prev => ({ ...prev, [cartItemId]: response.message || "Failed to update quantity" }));
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Failed to update quantity";
      if (msg.toLowerCase().includes("out of stock") || msg.toLowerCase().includes("only")) {
        setStockErrors(prev => ({ ...prev, [cartItemId]: msg }));
      } else {
        setStockErrors(prev => ({ ...prev, [cartItemId]: msg }));
      }
    } finally {
      setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
    }
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("cart");
  }, []);

  const subtotal = useMemo(() =>
    cartItems.reduce((sum, item) => sum + ((item.mrp || item.productPrice) * (item.quantity || 1)) + (item.lens?.price || 0), 0),
    [cartItems]);

  const totalSellingPrice = useMemo(() =>
    cartItems.reduce((sum, item) => sum + (item.productPrice * (item.quantity || 1)) + (item.lens?.price || 0), 0),
    [cartItems]);

  const totalDiscount = useMemo(() => subtotal - totalSellingPrice, [subtotal, totalSellingPrice]);

  const totalQuantity = useMemo(() =>
    cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cartItems]);

  const fittingFee = 199;

  const totalOfferSavings = useMemo(() =>
    cartItems.reduce((sum, item) => {
      if (offers.length === 0) return sum;
      return sum + calculateOfferDiscount(item.productId, item.productPrice + (item.lens?.price || 0), offers);
    }, 0),
  [cartItems, offers]);

  const cartProductIds = useMemo(() => cartItems.map(i => i.productId), [cartItems]);
  const comboOffers = useMemo(() => getComboStatusForCart(cartProductIds, offers), [cartProductIds, offers]);
  const totalComboSavings = useMemo(() => getComboCartSavings(cartItems, offers), [cartItems, offers]);

  const activeCombos = useMemo(() => comboOffers.filter(c => c.qualifies), [comboOffers]);
  const incompleteCombos = useMemo(() => comboOffers.filter(c => !c.qualifies && c.missingProducts.length > 0), [comboOffers]);

  const totalPayable = useMemo(() =>
    totalSellingPrice + fittingFee - Math.round(totalComboSavings), [totalSellingPrice, totalComboSavings]);

  const getOfferBadge = useCallback((productId: string, price: number): OfferBadge | null => {
    return getBestOfferBadge(productId, price, offers);
  }, [offers]);

  const getComboSavingsForOfferCallback = useCallback((offer: Offer): number => {
    return getComboSavingsForOffer(cartItems, offer);
  }, [cartItems]);

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
