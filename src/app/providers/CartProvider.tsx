import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchCart,
  addToCartApi,
  removeCartItemApi,
  clearCartApi,
  mapBackendItem,
  notifyCartUpdated,
} from "@/features/cart/api/cartApi";
import { useAuth } from "@/features/auth/hooks/useAuth";

export interface CartItem {
  cartItemId?: string;
  bogoGroupId?: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  mrp?: number;
  quantity?: number;
  color: { name: string; id: string } | null;
  lens: { id?: string; name: string; price: number } | null;
  lensPrice?: number;
  totalPrice: number;
  powerType?: string;
  powerDetails?: object | null;
  isFree?: boolean;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  itemCount: number;
  clearCart: () => Promise<void>;
  loading: boolean;
  reload: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadCart = useCallback(async () => {
    try {
      const cart = await fetchCart();
      setItems(cart.items.map(mapBackendItem));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
    window.addEventListener("cart-updated", loadCart);
    return () => window.removeEventListener("cart-updated", loadCart);
  }, [loadCart]);

  const addItem = useCallback(async (item: CartItem) => {
    if (!isAuthenticated) {
      window.dispatchEvent(new Event("auth:require-login"));
      return;
    }
    await addToCartApi({
      productId: item.productId,
      quantity: item.quantity ?? 1,
      color: item.color,
      lens: item.lens as any,
      powerType: item.powerType ?? null,
      powerDetails: item.powerDetails ?? null,
      bogoGroupId: item.bogoGroupId ?? null,
      isFree: item.isFree ?? false,
    });
    await loadCart();
    notifyCartUpdated();
  }, [isAuthenticated, loadCart]);

  const removeItem = useCallback(async (cartItemId: string) => {
    if (!isAuthenticated) {
      window.dispatchEvent(new Event("auth:require-login"));
      return;
    }
    await removeCartItemApi(cartItemId);
    await loadCart();
    notifyCartUpdated();
  }, [isAuthenticated, loadCart]);

  const clearCart = useCallback(async () => {
    await clearCartApi();
    setItems([]);
    notifyCartUpdated();
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, itemCount, clearCart, loading, reload: loadCart }),
    [items, addItem, removeItem, itemCount, clearCart, loading, loadCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };
